import { app, BrowserWindow, ipcMain, dialog, OpenDialogReturnValue } from 'electron';
import { OpenDialogProperties, SfdcLoginResponse, SfdcPredictionDefinitionsResponse, SfdcModelDefinitionsResponse, SetupConfig, CheckDependenciesResponse } from './types';
import { Config, TabpyConf, TpeConf } from './config';
import { sendMessageToRenderer } from '../ipc';
import type { LoginToSalesforcePayload, RendererMessageType } from '../ipc/types';
import type { SfdcLoginPostBody } from './types';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import qs from 'qs';
import fs from 'fs';
import path from 'path';
import { PythonShell, Options } from 'python-shell';
import { PathProperties } from '../store/types';

import prepPython from './config/PythonTemplates/prep.py';
import checkDepsPython from './config/PythonTemplates/check_deps.py';

let win: BrowserWindow;
let conf: Config;

const createWindow = () => {

    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.resolve(__dirname, '../app/icon.icns')
    });

    win.loadFile(`./dist/index.html`);

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('select-folder', () => {
    let props: OpenDialogProperties = ['openDirectory'];
    dialog.showOpenDialog({
        properties: props
    })
        .then((selection: OpenDialogReturnValue) => {
            conf = new Config(selection.filePaths[0]);
            sendMessageToRenderer(win, {
                channel: 'folder-selected',
                dialogResponse: selection,
                config: conf.toObject()
            });
        });
});

ipcMain.on('login-to-sfdc', (event, payload: LoginToSalesforcePayload) => {
    const body: SfdcLoginPostBody = {
        grant_type: 'password',
        client_id: payload.consumerKey,
        client_secret: payload.consumerSecret,
        username: payload.username,
        password: payload.password
    }

    axios.post<string, AxiosResponse<SfdcLoginResponse>>('https://login.salesforce.com/services/oauth2/token', qs.stringify(body), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
        .then(res => {
            const messagePayload: RendererMessageType = {
                channel: 'sfdc-login-response',
                response: res.data,
                loginPayload: payload
            }
            sendMessageToRenderer(win, messagePayload);
        })
        .catch(err => {
            console.log(err);
            const messagePayload: RendererMessageType = {
                channel: 'sfdc-login-error'
            }
            sendMessageToRenderer(win, messagePayload);
        });
    
});

ipcMain.on('get-ea-prediction-definitions', (event, instanceUrl: string, accessToken: string, tokenType: string) => {
    const url = `${instanceUrl}/services/data/v46.0/smartdatadiscovery/predictiondefinitions`;
    axios.get<SfdcPredictionDefinitionsResponse>(url, {
        headers: {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
        .then(res => {
            const messagePayload: RendererMessageType = {
                channel: 'response-ea-prediction-definitions',
                predictionDefs: res.data
            }
            sendMessageToRenderer(win, messagePayload);
        })
        .catch(err => console.log('ERROR: ', err));
});

ipcMain.on('get-ea-model-definitions', (event, instanceUrl: string, modelUrl: string, accessToken: string, tokenType: string) => {
    const url = `${instanceUrl}${modelUrl}`;
    axios.get<SfdcModelDefinitionsResponse>(url, {
        headers: {
            Authorization: `${tokenType} ${accessToken}`
        }
    })
        .then(res => {
            const messagePayload: RendererMessageType = {
                channel: 'response-get-ea-model-definitions',
                modelDefs: res.data
            }
            sendMessageToRenderer(win, messagePayload);
        })
})

ipcMain.on('write-config-files', (event, config: SetupConfig) => {
    const { path, setup, tabpy, tpe } = config;
    const tabpyConf = new TabpyConf();
    tabpyConf.options = tabpy.options;
    tabpyConf.loggers = tabpy.loggers;
    tabpyConf.handlers = tabpy.handlers;
    tabpyConf.formatters = tabpy.formatters;
    tabpyConf.write(path.pathTabpyConf);

    const tpeConf = new TpeConf();
    tpeConf.auth = tpe.auth;
    tpeConf.server = tpe.server;
    tpeConf.predictionModels = tpe.predictionModels;

    let python: string = tpeConf.writeToPythonFile(prepPython);

    fs.writeFileSync(`${path.useDir}/prep.py`, python);
});

ipcMain.on('check-dependencies', (event, path: PathProperties, pythonPath: string) => {
    const checkDepsFile: string = `${path.useDir}/check_deps.py`;
    fs.writeFileSync(checkDepsFile, checkDepsPython);

    const pyshellOpts: Options = {
        mode: 'json',
        pythonPath: pythonPath
    }

    try {
        PythonShell.run(checkDepsFile, pyshellOpts, (err: any, results: any[]) => {
            fs.unlinkSync(checkDepsFile);
            if (err) {
                sendMessageToRenderer(win, {
                    channel: 'response-check-dependencies',
                    checkResults: {},
                    checkCompleted: false
                });
            } else {
                const checkResults = results[0] as CheckDependenciesResponse;
                sendMessageToRenderer(win, {
                    channel: 'response-check-dependencies',
                    checkResults: checkResults,
                    checkCompleted: true
                });
            }
        });
    } catch (error) {
        alert(error);
        sendMessageToRenderer(win, {
            channel: 'response-check-dependencies',
            checkResults: {},
            checkCompleted: false
        });
    }
    
});