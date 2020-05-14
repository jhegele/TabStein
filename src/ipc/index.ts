import { ipcRenderer, BrowserWindow } from 'electron';
import { MainMessageType, RendererMessageType } from './types';

export const sendMessageToMain = (payload: MainMessageType) => {

    switch (payload.channel) {
        case 'select-folder':
            ipcRenderer.send(payload.channel);
            break;
        case 'login-to-sfdc':
            ipcRenderer.send(payload.channel, payload.payload);
            break;
        case 'get-ea-prediction-definitions':
            ipcRenderer.send(payload.channel, payload.instanceUrl, payload.accessToken, payload.tokenType);
            break;
        case 'get-ea-model-definitions':
            ipcRenderer.send(payload.channel, payload.instanceUrl, payload.modelsUrl, payload.accessToken, payload.tokenType);
            break;
        case 'write-config-files':
            ipcRenderer.send(payload.channel, payload.config);
            break;
        case 'check-dependencies':
            ipcRenderer.send(payload.channel, payload.path, payload.pythonPath ? payload.pythonPath : 'python');
            break;
    }

}

export const sendMessageToRenderer = (win: BrowserWindow, payload: RendererMessageType) => {

    switch (payload.channel) {
        case 'folder-selected':
            win.webContents.send(payload.channel, payload.dialogResponse, payload.config);
            break;
        case 'sfdc-login-response':
            win.webContents.send(payload.channel, payload.response, payload.loginPayload);
            break;
        case 'sfdc-login-error':
            win.webContents.send(payload.channel);
            break;
        case 'response-ea-prediction-definitions':
            win.webContents.send(payload.channel, payload.predictionDefs);
            break;
        case 'response-get-ea-model-definitions':
            win.webContents.send(payload.channel, payload.modelDefs);
            break;
        case 'response-check-dependencies':
            win.webContents.send(payload.channel, payload.checkResults, payload.checkCompleted);
            break;
    }

}