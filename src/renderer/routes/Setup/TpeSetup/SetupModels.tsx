import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { sendMessageToMain } from '../../../../ipc';
import { ipcRenderer } from 'electron';
import { SfdcPredictionDefinitionsResponse } from '../../../../main/types';
import { css, SerializedStyles } from '@emotion/core';
import { Spin, Button, List } from 'antd';
import { ConfigCard, CardActionButton } from '../../../../components';
import { TpePredictionModel, TpeColumnMapping } from '../../../../store/types';
import MapFields from './MapFields';
import { Switch, Route, useHistory } from 'react-router-dom';

const cssLoadingContainer = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const cssOuterContainer = css`
    display: flex;
    padding: 24px;
    flex-direction: column;
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

interface SetupModelsProps {
    onNext: (selectedModels: TpePredictionModel[]) => any;
    onBack: () => any;
}

const SetupModels: React.FC<SetupModelsProps> = ({ onNext, onBack }) => {

    const [ pageLoading, setPageLoading ] = useState<boolean>(true);
    const [ sfdcPredictionDefs, setSfdcPredictionDefs ] = useState<SfdcPredictionDefinitionsResponse>();
    const [ selectedModels, setSelectedModels ] = useState<TpePredictionModel[]>([]);
    const tpe = useSelector(
        (state: RootState) => state.tpe
    )
    const setup = useSelector(
        (state: RootState) => state.setup
    )
    const history = useHistory();

    useEffect(() => {
        ipcRenderer.on('response-ea-prediction-definitions', (event, predictionDefs: SfdcPredictionDefinitionsResponse) => {
            setSfdcPredictionDefs(predictionDefs);
            console.log(predictionDefs);
            setPageLoading(false);
        });

        sendMessageToMain({
            channel: 'get-ea-prediction-definitions',
            instanceUrl: tpe.auth.instanceUrl,
            accessToken: setup.accessToken,
            tokenType: tpe.auth.tokenType
        });
    }, []);

    if (pageLoading) {
        return (
            <div css={cssLoadingContainer}>
                <Spin size='large' />
            </div>
        )
    }

    const handleAddRemovePrediction = (handle: 'add' | 'remove', predictionDef: string, predictionLabel?: string): void => {
        let currSelected = [...selectedModels]
        switch (handle) {
            case 'add':
                const def = sfdcPredictionDefs.predictionDefinitions.filter(pd => pd.id === predictionDef)[0];
                currSelected.push({
                    predictionDefinition: def.id,
                    modelName: def.label,
                    resultsColumn: `EA Results - ${def.label}`,
                    columnMapping: []
                });
                break;
            case 'remove':
                const idxRemove = currSelected.map(s => s.predictionDefinition).indexOf(predictionDef);
                currSelected.splice(idxRemove, 1);
                break;
        }
        setSelectedModels(currSelected);
        if (handle === 'add') history.push(`/setup/tpe/setup-models/prediction/${predictionDef}/?predictionLabel=${predictionLabel}`);
    }

    const handleMapDone = (predictionDefId: string, resultsColumn: string, columnMapping: TpeColumnMapping[]) => {
        const currSelected = [...selectedModels];
        const idxUpdate = currSelected.map(s => s.predictionDefinition).indexOf(predictionDefId);
        currSelected[idxUpdate].resultsColumn = resultsColumn;
        currSelected[idxUpdate].columnMapping = columnMapping;
        setSelectedModels(currSelected);
        history.goBack();
    }

    const handleMapCancel = (predictionDefId?: string) => {
        if (predictionDefId) {
            const currSelected = [...selectedModels];
            const idxRemove = currSelected.map(s => s.predictionDefinition).indexOf(predictionDefId);
            currSelected.splice(idxRemove, 1);
            setSelectedModels(currSelected);
        }
        history.goBack();
    }

    const getListRowButton = (predictionDefId: string, predictionLabel: string): React.ReactNode => {
        if (selectedModels.map(m => m.predictionDefinition).indexOf(predictionDefId) !== -1) {
            return (
                <Button 
                    danger
                    onClick={() => handleAddRemovePrediction('remove', predictionDefId)}
                >
                    Remove
                </Button>
            )
        }
        return (
            <Button
                type='default'
                onClick={() => handleAddRemovePrediction('add', predictionDefId, predictionLabel)}
            >
                Add
            </Button>
        )
    }

    const getListRowStyle = (predictionDefId: string): SerializedStyles => {
        if (selectedModels.map(m => m.predictionDefinition).indexOf(predictionDefId) !== -1) {
            return css`
                background-color: #e6f7ff;
                padding-left: 6px;
                border: 1px solid #91d5ff !important;
            `;
        }
        return css`
            padding-left: 6px;
        `; 
    }

    const getListRowTitle = (label: string, predictionDefId: string): React.ReactNode => {
        if (selectedModels.map(m => m.predictionDefinition).indexOf(predictionDefId) !== -1) {
            return (
                <Button
                    type='link'
                    onClick={() => history.push(`/setup/tpe/setup-models/prediction/${predictionDefId}`)}
                >
                    {label}
                </Button>
            )
        }
        return label;
    }

    return (
        <div css={cssOuterContainer}>
            <Switch>
                <Route exact path='/setup/tpe/setup-models/'>
                    <ConfigCard
                        title='Configure Predictive Models'
                        actions={[
                            <div css={cssActionsContainer}>
                                <CardActionButton
                                    type='primary'
                                    onClick={() => onNext(selectedModels)}
                                    disabled={selectedModels.length === 0}
                                >
                                    Next
                                </CardActionButton>
                                <CardActionButton
                                    type='default'
                                    onClick={onBack}
                                >
                                    Back
                                </CardActionButton>
                            </div>
                        ]}
                    >
                        <List
                            dataSource={sfdcPredictionDefs.predictionDefinitions}
                            renderItem={pd => (
                                <List.Item 
                                    css={getListRowStyle(pd.id)}
                                    key={pd.id}
                                    actions={[getListRowButton(pd.id, pd.label)]}
                                >
                                    <List.Item.Meta
                                        title={getListRowTitle(pd.label, pd.id)}
                                    />
                                </List.Item>
                            )}
                        />
                    </ConfigCard>
                </Route>
                <Route path='/setup/tpe/setup-models/prediction/:predictionDefId'>
                    <MapFields 
                        addedPredictionModels={selectedModels}
                        onDone={handleMapDone}
                        onCancel={handleMapCancel}
                    />
                </Route>
            </Switch>
        </div>
    )

}

export default SetupModels;