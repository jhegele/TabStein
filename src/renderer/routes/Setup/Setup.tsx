import React, { useState } from 'react';
import { Layout, Steps } from 'antd';
import { css } from '@emotion/core';
import TabpySetup from './TabpySetup/TabpySetup';
import TpeSetup from './TpeSetup/TpeSetup';
import Confirm from './Confirm/Confirm';
import Done from './Done/Done';
import CheckDependencies from './CheckDependencies/CheckDependencies';
import { Switch, Route, useHistory } from 'react-router-dom';
import { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { setupUpdate } from '../../../store/slices/setup';
import type { SetupConfig } from '../../../main/types';
import { sendMessageToMain } from '../../../ipc';

const { Step } = Steps;

const { Header, Content, Footer } = Layout;

const cssHeader = css`
    color: white;
    font-weight: bold;
    font-size: 18px;
`;

const cssFooter = css`
    background-color: #fff;
`;

const Setup: React.FC = () => {

    const [ currentStep, setCurrentStep ] = useState<number>(0);
    const setup = useSelector(
        (state: RootState) => state.setup
    )
    const dispatch = useDispatch();
    const history = useHistory();

    const moveStep = (amount: number) => {
        setCurrentStep(curr => curr + amount);
    }

    const handleCheckDependenciesNext = () => {
        history.push('/setup/tabpy');
    }

    const handleCheckDependenciesBack = () => {
        history.push('/');
    }

    const handleTabpySetup = (selection: 'next' | 'prev') => {
        switch (selection) {
            case 'next':
                moveStep(1);
                dispatch(setupUpdate({...setup, tabpyConfigured: true}));
                history.push('/setup/tpe');
                break;
            case 'prev':
                moveStep(-1);
                dispatch(setupUpdate({...setup, tabpyConfigured: false}));
                break;
        }
    }

    const handleTpeComplete = (selection: 'done' | 'abort') => {
        dispatch(setupUpdate({...setup, tpeConfigured: selection === 'done' ? true : false}));
        history.push('/setup/confirm');
    }

    const handleConfirmBack = () => {
        history.push('/setup/tpe/server');
    }

    const handleConfirmDone = (config: SetupConfig) => {
        sendMessageToMain({
            channel: 'write-config-files',
            config: config
        });
        history.push('/setup/done');
    }

    return (
        <Layout>
            <Header css={cssHeader}>
                Setup Tabpy
            </Header>
            
            <Content
                css={css`
                    overflow-y: auto;
                `}
            >
                <Switch>
                    <Route path='/setup/' exact>
                        <CheckDependencies onNext={handleCheckDependenciesNext} onBack={handleCheckDependenciesBack} />
                    </Route>
                    <Route path='/setup/tabpy'>
                        <TabpySetup onNext={() => handleTabpySetup('next')} onPrev={() => handleTabpySetup('prev')} />
                    </Route>
                    <Route path='/setup/tpe'>
                        <TpeSetup onDone={() => handleTpeComplete('done')} onAbort={() => handleTpeComplete('abort')} />
                    </Route>
                    <Route path='/setup/confirm'>
                        <Confirm onDone={handleConfirmDone} onBack={handleConfirmBack} />
                    </Route>
                    <Route path='/setup/done'>
                        <Done />
                    </Route>
                </Switch>
            </Content>
            <Footer css={cssFooter}>
                <Steps current={currentStep}>
                    <Step title='Overview' />
                    <Step title='Tabpy' />
                    <Step title='Einstein' />
                </Steps>
            </Footer>
        </Layout>
    )

}

export default Setup;