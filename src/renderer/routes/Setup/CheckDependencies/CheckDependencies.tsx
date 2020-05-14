import React, { useEffect, useState } from 'react';
import { sendMessageToMain } from '../../../../ipc'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { ipcRenderer } from 'electron';
import { CheckDependenciesResponse } from '../../../../main/types';
import { css } from '@emotion/core';
import { Card, Button, List, Spin, Input, Collapse } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, QuestionCircleFilled } from '@ant-design/icons';

const { Panel } = Collapse;

const cssOuterContainer = css`
    display: flex;
    padding: 24px;
`;

const cssActionsContainer = css`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    > * {
        margin-right: 12px;
    }
`;

const iconPass = (
    <CheckCircleFilled
        css={css`
            color: #24d024;
            font-size: 30px;
        `}
    />
)

const iconFail = (
    <CloseCircleFilled
        css={css`
            color: #f32b2b;
            font-size: 30px;
        `}
    />
)

const iconUnknown = (
    <QuestionCircleFilled
        css={css`
            color: #e6e60f;
            font-size: 30px;
        `}
    />
)

interface CheckDependenciesProps {
    onNext: () => any;
    onBack: () => any;
}

const CheckDependencies: React.FC<CheckDependenciesProps> = ({ onNext, onBack }) => {

    const [ dependencies, setDependencies ] = useState<CheckDependenciesResponse>({});
    const [ checkError, setCheckError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ pythonPath, setPythonPath ] = useState<string>('');
    
    const path = useSelector(
        (state: RootState) => state.path
    )

    useEffect(() => {
        ipcRenderer.on('response-check-dependencies', (event, checkResults: CheckDependenciesResponse, checkCompleted: boolean) => {
            if (checkCompleted) {
                setCheckError(false);
                setDependencies(checkResults);
            } else {
                setCheckError(true);
                setDependencies({})
            }
            setLoading(false);
        });
    }, [])

    const getListItemAvatar = (testValue: boolean | undefined): React.ReactNode => {
        if (loading) return <Spin size='small' />;
        if (checkError) return iconUnknown;
        if (testValue === true) {
            return iconPass;
        }
        if (testValue === false) {
            return iconFail;
        }
        return null
    }

    const runChecks = () => {
        setLoading(true);
        sendMessageToMain({
            channel: 'check-dependencies',
            path: path,
            pythonPath: pythonPath === '' ? 'python' : pythonPath
        });
    }

    const listData = [
        {
            title: 'Python version 3.7 or higher',
            test: dependencies.python ? dependencies.python >= 3.7 ? true : false : undefined,
            description: 'This process relies on Python\'s asyncio library which requires Python 3.7 or higher.'
        },
        {
            title: 'AIOHTTP installed',
            test: dependencies.aiohttp,
            description: 'The AIOHTTP Python library utilized to manage and make concurrent requests.'
        },
        {
            title: 'TabPy installed',
            test: dependencies.tabpy,
            description: 'TabPy is used as the integration point for Tableau Prep.'
        }
    ]

    return (
        <div css={cssOuterContainer}>
            <Card
                title='Dependency Check (Optional)'
                actions={[
                    <div css={cssActionsContainer}>
                        <Button 
                            type='primary'
                            css={css`
                                max-width: max-content;
                            `}
                            onClick={onNext}
                        >
                            Next
                        </Button>
                        <Button
                            type='default'
                            css={css`
                                max-width: max-content;
                            `}
                            onClick={onBack}
                        >
                            Back
                        </Button>
                    </div>
                ]}
                css={css`
                    width: 100%;
                `}
            >
                <div>
                    You may, optionally, run a set of dependency checks below before you get started. <strong>These 
                    checks are not required</strong> but can be helpful if you are planning to run or test your 
                    setup locally. If you are using a remote TabPy instance, these checks likely will not provide
                    much value. If you want to skip this step, just click the Next button.
                </div>
                <List
                    header='Dependencies'
                    itemLayout='horizontal'
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={getListItemAvatar(item.test)}
                                title={item.title}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                    css={css`
                        margin: 0px 12px;
                    `}
                />
                <Collapse>
                    <Panel 
                        header={<em>I want to run dependency checks</em>}
                        key='1'
                    >
                        <div>
                            <div
                                css={css`
                                    margin-bottom: 12px;
                                `}
                            >
                                Entering the direct path to your Python executable below will yield the most reliable
                                results. <strong>However</strong>, please keep in mind that this set of tests is
                                cursory at best and should not be viewed as a guarantee of success or failure.
                            </div>
                            <div
                                css={css`
                                    width: 100%;
                                    display: flex;
                                    flex-direction: row;
                                `}
                            >
                                <div
                                    css={css`
                                        flex: 1;
                                        margin-right: 12px;
                                    `}
                                >
                                    <Input
                                        placeholder={`Enter path to your Python executable or leave blank to try 'python'`}
                                        value={pythonPath}
                                        onChange={({ target: { value }}) => setPythonPath(value)}
                                    />
                                </div>
                                <div>
                                    <Button
                                        type='dashed'
                                        onClick={runChecks}
                                    >
                                        Run Checks
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </Card>
        </div>
    )

}

// const CheckDependenciesOLD: React.FC<CheckDependenciesProps> = ({ onNext, onBack }) => {

//     const [ checkResponseReceived, setCheckResponseReceived ] = useState<boolean>(false);
//     const [ dependencies, setDependencies ] = useState<CheckDependenciesResponse>({});
//     const [ pythonPath, setPythonPath ] = useState<string>('');

//     const path = useSelector(
//         (state: RootState) => state.path
//     )

//     useEffect(() => {
//         ipcRenderer.on('response-check-dependencies', (event, checkResults: CheckDependenciesResponse, checkCompleted: boolean) => {
//             setCheckResponseReceived(true);
//             if (checkCompleted) {
//                 setDependencies(checkResults);
//             } else {
//                 setDependencies({})
//             }
//         });

//         sendMessageToMain({
//             channel: 'check-dependencies',
//             path: path,
//             pythonPath: pythonPath === '' ? 'python' : pythonPath
//         });
//     }, [])

//     const rerunChecks = () => {
//         setCheckResponseReceived(false);
//         sendMessageToMain({
//             channel: 'check-dependencies',
//             path: path,
//             pythonPath: pythonPath === '' ? 'python' : pythonPath
//         });
//     }

//     const listData = [
//         {
//             title: 'Python Version',
//             test: dependencies.python ? dependencies.python >= 3.7 ? true : false : undefined,
//             description: 'Python 3.7 or higher is required.'
//         },
//         {
//             title: 'AIOHTTP Installed',
//             test: dependencies.aiohttp,
//             description: 'AIOHTTP Python library is required.'
//         },
//         {
//             title: 'TabPy Installed',
//             test: dependencies.tabpy,
//             description: 'TabPy must be installed.'
//         }
//     ]

//     const getListItemAvatar = (testValue: boolean | undefined): React.ReactNode => {
//         if (!checkResponseReceived) return <Spin size='small' />;
//         if (testValue === true) {
//             return iconPass;
//         }
//         if (testValue === false) {
//             return iconFail;
//         }
//         return iconUnknown;
//     }

//     let rerunPrompt: React.ReactNode = null;
//     const depFails = listData.map((item): number => item.test ? 0 : 1).reduce((acc, val) => acc + val);
//     if (checkResponseReceived && depFails > 0) {
//         rerunPrompt = (
//             <div>
//                 <div
//                     css={css`
//                         margin-bottom: 12px;
//                     `}
//                 >
//                     It looks like one or more checks failed. You can, optionally, provide a path to your python
//                     executable below and re-run the checks. This can be helpful, in particular, if you are
//                     using Python virtual environments.
//                 </div>
//                 <div
//                     css={css`
//                         width: 100%;
//                         display: flex;
//                         flex-direction: row;
//                     `}
//                 >
//                     <div
//                         css={css`
//                             flex: 1;
//                             margin-right: 12px;
//                         `}
//                     >
//                         <Input
//                             placeholder='Enter path to your Python executable and re-run checks...'
//                             value={pythonPath}
//                             onChange={({ target: { value }}) => setPythonPath(value)}
//                         />
//                     </div>
//                     <div>
//                         <Button
//                             type='dashed'
//                             onClick={rerunChecks}
//                         >
//                             Re-run
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div css={cssOuterContainer}>
//             <Card
//                 title='Dependency Check'
//                 actions={[
//                     <div css={cssActionsContainer}>
//                         <Button 
//                             type='primary'
//                             css={css`
//                                 max-width: max-content;
//                             `}
//                             onClick={onNext}
//                         >
//                             Next
//                         </Button>
//                         <Button
//                             type='default'
//                             css={css`
//                                 max-width: max-content;
//                             `}
//                             onClick={onBack}
//                         >
//                             Back
//                         </Button>
//                     </div>
//                 ]}
//                 css={css`
//                     width: 100%;
//                 `}
//             >
//                 <div
//                     css={css`
//                         margin-bottom: 12px;
//                     `}
//                 >
//                     Failing one or more of these dependency checks will not prevent you from progressing through the setup
//                     process. This is meant to indicate only the chance that an error will occur when attempting to run the
//                     TabPy process after setup is complete. If you are using a remote TabPy deployment to run this process,
//                     you can likely ignore any failures below. If you are running the process locally, a failed check below
//                     will very likely mean you will encounter errors.
//                 </div>
//                 <List
//                     itemLayout='horizontal'
//                     dataSource={listData}
//                     renderItem={item => (
//                         <List.Item>
//                             <List.Item.Meta
//                                 avatar={getListItemAvatar(item.test)}
//                                 title={item.title}
//                                 description={item.description}
//                             />
//                         </List.Item>
//                     )}
//                 />
//                 {rerunPrompt}
//             </Card>
//         </div>
//     )

// }

export default CheckDependencies;