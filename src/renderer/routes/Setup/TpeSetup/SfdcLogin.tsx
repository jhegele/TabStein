import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { ConfigCard, CardActionButton } from '../../../../components';
import { Form, Input, Button, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { sendMessageToMain } from '../../../../ipc';
import type { LoginToSalesforcePayload } from '../../../../ipc/types'
import { ipcRenderer } from 'electron';
import { SfdcLoginResponse } from '../../../../main/types';
import { useDispatch, useSelector } from 'react-redux';
import { setupUpdate } from '../../../../store/slices/setup';
import { TpeAuth } from '../../../../store/types';
import { RootState } from '../../../../store';

const cssOuterContainer = css`
    display: flex;
    padding: 24px;
    flex-direction: column;
`;

type SfdcAuth = {
    consumerKey: string;
    consumerSecret: string;
    username: string;
    password: string;
}

interface SfdcLoginProps {
    onAuthenticated: (auth: TpeAuth) => any;
    onBack: () => any;
}

const SfdcLogin: React.FC<SfdcLoginProps> = ({ onAuthenticated, onBack }) => {

    const [ sfdcAuth, setSfdcAuth ] = useState<SfdcAuth>({
        consumerKey: (typeof env_SFDC_CONSUMER_KEY === 'undefined') ? '' : env_SFDC_CONSUMER_KEY,
        consumerSecret: (typeof env_SFDC_CONSUMER_SECRET === 'undefined') ? '' : env_SFDC_CONSUMER_SECRET,
        username: (typeof env_SFDC_USERNAME === 'undefined') ? '' : env_SFDC_USERNAME,
        password: (typeof env_SFDC_PASSWORD === 'undefined') ? '' : env_SFDC_PASSWORD
    });
    const [ loading, setLoading ] = useState<boolean>(false);
    const setup = useSelector(
        (state: RootState) => state.setup
    )
    const dispatch = useDispatch();

    useEffect(() => {
        ipcRenderer.on('sfdc-login-response', (event, response: SfdcLoginResponse, loginPayload: LoginToSalesforcePayload) => {
            setLoading(false);
            dispatch(setupUpdate({
                ...setup,
                accessToken: response.access_token
            }));
            onAuthenticated({
                loginUrl: 'https://login.salesforce.com/services/oauth2/token',
                consumerKey: loginPayload.consumerKey,
                consumerSecret: loginPayload.consumerSecret,
                instanceUrl: response.instance_url,
                username: loginPayload.username,
                password: loginPayload.password,
                tokenType: response.token_type
            });
        });

        ipcRenderer.on('sfdc-login-error', () => {
            notification.error({
                message: 'Login Failure',
                description: 'The attempt to login to Salesforce failed. Please double check the information you\'ve provided and try again'
            });
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        console.log('auth changed: ', sfdcAuth)
    }, [sfdcAuth])

    const handleSubmit = () => {
        setLoading(true);
        sendMessageToMain({
            channel: 'login-to-sfdc',
            payload: sfdcAuth
        })
    }

    return (
        <div css={cssOuterContainer}>
            <ConfigCard
                title='Salesforce Login'
            >
                You'll need to provide some information from Salesforce along with your credentials in order to login. The consumer key
                and secret were provided when you created your Connected App in Salesforce. The username and password are the
                credentials that you use to login to Salesforce.
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                >
                    <Form.Item
                        label='Consumer Key'
                        name='consumerKey'
                        rules={[{required: true, message: 'Enter your Consumer Key from Salesforce.'}]}
                    >
                        <Input 
                            onChange={({ target: { value }}) => setSfdcAuth({
                                ...sfdcAuth,
                                consumerKey: value
                            })}
                            value={sfdcAuth.consumerKey}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Consumer Secret'
                        name='consumerSecret'
                        rules={[{required: true, message: 'Enter your Consumer Secret from Salesforce.'}]}
                    >
                        <Input.Password 
                            onChange={({ target: { value }}) => setSfdcAuth({
                                ...sfdcAuth,
                                consumerSecret: value
                            })}
                            value={sfdcAuth.consumerSecret}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Username'
                        name='username'
                        rules={[{required: true, message: 'Enter your Salesforce username.'}]}
                    >
                        <Input 
                            onChange={({ target: { value }}) => setSfdcAuth({
                                ...sfdcAuth,
                                username: value
                            })}
                            value={sfdcAuth.username}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name='password'
                        rules={[{required: true, message: 'Enter your Salesforce password.'}]}
                    >
                        <Input.Password 
                            onChange={({ target: { value }}) => setSfdcAuth({
                                ...sfdcAuth,
                                password: value
                            })}
                            value={sfdcAuth.password}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{offset: 8, span: 16}}
                    >
                        <Button 
                            type='primary'
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={sfdcAuth.consumerKey === '' || sfdcAuth.consumerSecret === '' || sfdcAuth.username === '' || sfdcAuth.password === ''}
                        >
                            Login
                        </Button>
                        <Button
                            type='default'
                            onClick={onBack}
                            css={css`
                                margin-left: 12px;
                            `}
                        >
                            Back
                        </Button>
                    </Form.Item>
                </Form>
            </ConfigCard>
        </div>
    )

}

export default SfdcLogin;