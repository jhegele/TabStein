import fs from 'fs';
import { TpeProperties, TpePredictionModel, TpeConfigFile, TpeAuth, TpeServer} from '../../../store/types';

class TpeConf implements TpeProperties {

    public auth: TpeAuth = {
        consumerKey: '',
        consumerSecret: '',
        loginUrl: 'https://login.salesforce.com/services/oauth2/token',
        instanceUrl: '',
        username: '',
        password: '',
        tokenType: 'Bearer'
    }
    public server: TpeServer = {
        rowsChunkSize: 2000,
        threads: 1
    }
    
    public predictionModels: TpePredictionModel[] = [];
    public hasExistingConfig: boolean = false;

    public loadFromFile = (pathToTpeConf: string): void => {
        const conf = JSON.parse(fs.readFileSync(pathToTpeConf, 'utf-8')) as TpeConfigFile;
        this.auth.consumerKey = conf.consumerKey;
        this.auth.consumerSecret = conf.consumerSecret;
        this.auth.loginUrl = conf.loginUrl;
        this.auth.instanceUrl = conf.instanceUrl;
        this.auth.username = conf.username;
        this.auth.password = conf.password;
        this.server.rowsChunkSize = conf.rowsChunkSize;
        this.server.threads = conf.threads;
        this.predictionModels = conf.predictionModels;
        this.hasExistingConfig = true;
    }

    public write = (pathToWrite: string): void => {
        const toWrite: string = JSON.stringify({
            consumerKey: this.auth.consumerKey,
            consumerSecret: this.auth.consumerSecret,
            loginUrl: this.auth.loginUrl,
            instanceUrl: this.auth.instanceUrl,
            username: this.auth.username,
            password: this.auth.password,
            rowsChunkSize: this.server.rowsChunkSize,
            threads: this.server.threads,
            predictionModels: this.predictionModels
        } as TpeConfigFile, null, 4)
        fs.writeFileSync(pathToWrite, toWrite);
    }

    public writeToPythonFile = (python: string): string => {
        python = python.replace(/#<CONSUMER_KEY>#/gm, `'${this.auth.consumerKey}'`);
        python = python.replace(/#<CONSUMER_SECRET>#/gm, `'${this.auth.consumerSecret}'`);
        python = python.replace(/#<LOGIN_URL>#/gm, `'${this.auth.loginUrl}'`);
        python = python.replace(/#<INSTANCE_URL>#/gm, `'${this.auth.instanceUrl}'`);
        python = python.replace(/#<USERNAME>#/gm, `'${this.auth.username}'`);
        python = python.replace(/#<PASSWORD>#/gm, `'${this.auth.password}'`);
        python = python.replace(/#<CHUNK_SIZE>#/gm, `${this.server.rowsChunkSize.toString()}`);
        python = python.replace(/#<THREADS>#/gm, `${this.server.threads.toString()}`);
        python = python.replace(/#<PREDICTION_MODELS>#/gm, `${JSON.stringify(this.predictionModels)}`)
        return python;
    }

}

export default TpeConf;