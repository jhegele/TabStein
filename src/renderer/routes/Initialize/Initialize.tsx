import React, { useEffect } from 'react';
import { css } from '@emotion/core';
import { sendMessageToMain } from '../../../ipc';
import { Button } from 'antd';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ConfigProperties } from '../../../store/types';
import { tabpyUpdateOptions } from '../../../store/slices/tabpy';
import { tpeUpdateAll } from '../../../store/slices/tpe';
import { pathUpdate } from '../../../store/slices/path';

import logo from '../../../static/img/logo.png';

const cssOuterContainer = css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const cssContentContainer = css`
    width: 50%;
    padding: 1rem;
    border: 1px solid #000;
    border-radius: 0.1rem;
`;

const cssLogoContainer = css`
    width: 50%;
    padding: 0.25rem;
    display: flex;
    flex-direction: row;
    font-size: 2.25rem;
    font-weight: bold;
    letter-spacing: 0.2rem;
`;

const cssVersionInfo = css`
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.75rem;
    color: #cecece;
    margin-left: 12px;
`;

const Initialize: React.FC = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        ipcRenderer.on('folder-selected', (event: Event, selection: OpenDialogReturnValue, config: ConfigProperties) => {
            if (!selection.canceled) {
                if (config.tabpyConfig.hasExistingConfig) {
                    dispatch(tabpyUpdateOptions(config.tabpyConfig.options));
                }
                if (config.tpeConfig.hasExistingConfig) {
                    dispatch(tpeUpdateAll(config.tpeConfig));
                }
                dispatch(pathUpdate(config.path));
                if (config.tabpyConfig.hasExistingConfig) {
                    let prompt: string = 'It looks like you have an existing configuration in this folder. If ' +
                                         'you continue, you will overwrite any existing files. Do you want to ' +
                                         'proceed?';
                    if (confirm(prompt)) {
                        history.push('/setup');
                    }
                }
                else history.push('/setup');
            }
        });
    }, [])

    const handleSendMessage = () => {
        sendMessageToMain({
            channel: 'select-folder'
        })
    }

    return (
        <div css={cssOuterContainer}>
            <div css={cssLogoContainer}>
                <div
                    css={css`
                        max-height: 65px;
                    `}
                >
                    <img 
                        css={css`
                            height: 65px;
                        `}
                        src={logo} 
                    />
                </div>
                <div
                    css={css`
                        display: flex;
                        flex: 1;
                        align-items: center;
                        margin-left: 12px;
                    `}
                >
                    TabStein
                </div>
            </div>
            <div css={cssContentContainer}>
                Choose the directory where you'd like to deploy your TabPy process or
                choose a directory with an existing deployment to make updates or
                changes.
                <div
                    css={css`
                        display: flex;
                        justify-content: center;
                        margin-top: 12px;
                    `}
                >
                    <Button 
                        type='primary'
                        onClick={handleSendMessage}
                    >
                        Select Directory
                    </Button>
                </div>
            </div>
            <div css={cssVersionInfo}>
                Version {env_APP_VERSION} (alpha)
            </div>
        </div>
    )

}

export default Initialize;