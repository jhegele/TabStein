import asyncio
import aiohttp
import requests
import pandas as pd
import numpy as np
import json

class TPEConfig:
    '''TPE configuration properties and loading method.'''

    consumer_key = #<CONSUMER_KEY>#
    consumer_secret = #<CONSUMER_SECRET>#
    login_url = #<LOGIN_URL>#
    instance_url = #<INSTANCE_URL>#
    username = #<USERNAME>#
    password = #<PASSWORD>#
    chunk_size = #<CHUNK_SIZE>#
    prediction_models = #<PREDICTION_MODELS>#
    threads = #<THREADS>#

    @classmethod
    def load_from_file(cls, file_path, encryption_key = None):
        c = cls()
        with open(file_path, 'r') as in_file:
            file_contents = in_file.read()
            if encryption_key is not None:
                file_contents = c._decrypt(file_contents, encryption_key)
            conf = json.loads(file_contents)
            c.consumer_key = conf['consumerKey']
            c.consumer_secret = conf['consumerSecret']
            c.login_url = conf['loginUrl']
            c.instance_url = conf['instanceUrl']
            c.username = conf['username']
            c.password = conf['password']
            c.chunk_size = conf['rowsChunkSize']
            c.prediction_models = conf['predictionModels']
            c.threads = conf['threads']
        return c

class SFDC:
    '''Salesforce handler for authentication.'''

    def __init__(self, login_url, consumer_key, consumer_secret, username, password):
        self.login_url = login_url
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.username = username
        self.password = password
        login = self._login()
        self.access_token = login['access_token']
        self.instance_url = login['instance_url']
        self.token_type = login['token_type']
        self.header_auth = {
            'Authorization': '{} {}'.format(self.token_type, self.access_token)
        }

    def _login(self):
        payload = {
            'grant_type': 'password',
            'client_id': self.consumer_key,
            'client_secret': self.consumer_secret,
            'username': self.username,
            'password': self.password
        }
        r = requests.post(self.login_url, data=payload)
        resp = r.json()
        return resp

async def predict(sfdc, models, chunk, session):
    '''async wrapper to handle sending predictions to Einstein Discovery'''

    url = '{}/services/data/v46.0/smartdatadiscovery/predict'.format(sfdc.instance_url)
    predictions = []
    for model in models:
        model_id = model['predictionDefinition']
        col_names_tableau = [col['tableau'] for col in model['columnMapping']]
        col_names_einstein = [col['einstein'] for col in model['columnMapping']]
        payload = {
            'predictionDefinition': model_id,
            'type': 'RawData',
            'columnNames': col_names_einstein,
            'rows': [
                [str(row[c]) for c in col_names_tableau]
                for _, row in chunk.iterrows()
            ]
        }
        async with session.request('POST', url=url, headers=sfdc.header_auth, json=payload) as resp:
            einstein_response = await resp.json()
            # we need to reassemble all of these results later, so return a tuple the col name and response
            prediction = model['resultsColumn'], einstein_response
            predictions.append(prediction)
    return predictions

async def make_predictions(df):
    conf = TPEConfig()
    sfdc = SFDC(conf.login_url, conf.consumer_key, conf.consumer_secret, conf.username, conf.password)
    # limit max concurrent connections based on specified thread value
    conn = aiohttp.TCPConnector(limit=conf.threads)
    # split our data frame into chunks based on specified chunk size
    df_chunks = [c for _, c in df.groupby(np.arange(len(df)) // conf.chunk_size)]
    print(
        '\n'
        'Starting Einstein Request Service\n'
        '---------------------------------\n'
        'Salesforce Instance: {}\n'
        'Rows Per Request: {}\n'
        'Max Concurrent Requests: {}\n'.format(conf.instance_url, conf.chunk_size, conf.threads)
    )
    async with aiohttp.ClientSession(connector=conn) as session:
        tasks = []
        # setup async tasks to process each chunk
        for chunk in df_chunks:
            tasks.append(
                predict(sfdc, conf.prediction_models, chunk.copy(), session)
            )
        # wait for all async tasks to complete
        results = await asyncio.gather(*tasks)

    # gather all prediction results into an object with col names as keys
    new_cols = {}
    for idx, predictions in enumerate(results):
        for model_results in predictions:
            results_col, einstein_response = model_results
            # If einstein gets a row with all nulls, it throws an obscure
            # error. Just use null as the result to avoid issues with
            # processing.
            totals = [None if 'prediction' not in p else p['prediction']['total'] for p in einstein_response['predictions']]
            if results_col not in new_cols:
                new_cols[results_col] = pd.Series(totals)
            else:
                new_cols[results_col] = pd.concat([new_cols[results_col], pd.Series(totals)], ignore_index=True)
    
    return new_cols

def einstein(df):
    # make predictions for the provided data frame
    results = asyncio.run(make_predictions(df))
    # apply prediction results to the appropriate cols
    for col_name, series in results.items():
        df[col_name] = series
    return df
