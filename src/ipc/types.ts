import { OpenDialogReturnValue } from "electron"
import type { ConfigProperties, PathProperties } from '../store/types';
import type { SfdcLoginResponse, SfdcPredictionDefinitionsResponse, SfdcModelDefinitionsResponse, SetupConfig, CheckDependenciesResponse } from '../main/types';

export type LoginToSalesforcePayload = {
    consumerKey: string;
    consumerSecret: string;
    username: string;
    password: string;
}

export type MainMessageType = 
    | { channel: 'select-folder' }
    | { channel: 'login-to-sfdc', payload: LoginToSalesforcePayload }
    | { channel: 'get-ea-prediction-definitions', instanceUrl: string, accessToken: string, tokenType: string }
    | { channel: 'get-ea-model-definitions', instanceUrl: string, modelsUrl: string, accessToken: string, tokenType: string }
    | { channel: 'write-config-files', config: SetupConfig }
    | { channel: 'check-dependencies', path: PathProperties, pythonPath?: string }

export type RendererMessageType = 
    | { channel: 'folder-selected', dialogResponse: OpenDialogReturnValue, config: ConfigProperties }
    | { channel: 'sfdc-login-response', response: SfdcLoginResponse, loginPayload: LoginToSalesforcePayload }
    | { channel: 'sfdc-login-error'}
    | { channel: 'response-ea-prediction-definitions', predictionDefs: SfdcPredictionDefinitionsResponse }
    | { channel: 'response-get-ea-model-definitions', modelDefs: SfdcModelDefinitionsResponse }
    | { channel: 'response-check-dependencies', checkResults: CheckDependenciesResponse, checkCompleted: boolean }