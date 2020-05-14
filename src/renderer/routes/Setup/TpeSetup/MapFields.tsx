import React, { useState, useEffect } from 'react';
import { Spin, Input, Form } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { TpeColumnMapping, TpePredictionModel } from '../../../../store/types';
import { sendMessageToMain } from '../../../../ipc';
import { ipcRenderer } from 'electron';
import { SfdcModelDefinitionsResponse } from '../../../../main/types';
import Table, { ColumnProps } from 'antd/lib/table';
import { useParams, useLocation } from 'react-router-dom';
import { ConfigCard, CardActionButton } from '../../../../components';
import { css } from '@emotion/core';

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

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

interface MapFieldsProps {
    addedPredictionModels: TpePredictionModel[];
    onDone: (predictionDefId: string, resultsColumn: string, columnMapping: TpeColumnMapping[]) => any;
    onCancel: (predictionDefId?: string) => any;
}

const MapFields: React.FC<MapFieldsProps> = ({ onDone, onCancel, addedPredictionModels }) => {

    const [ columnMapping, setColumnMapping ] = useState<TpeColumnMapping[]>([]);
    const [ predictColName, setPredictColName ] = useState<string>('');
    const [ isNewModel, setIsNewModel ] = useState<boolean>(true);

    const tpe = useSelector(
        (state: RootState) => state.tpe
    )
    const setup = useSelector(
        (state: RootState) => state.setup
    )
    const { predictionDefId } = useParams();
    const query = useQuery();

    const updateMappedField = (index: number, field: keyof TpeColumnMapping, newValue: string) => {
        const newMapping = [...columnMapping];
        newMapping[index][field] = newValue;
        setColumnMapping(newMapping);
    }

    const tableCols: ColumnProps<TpeColumnMapping>[] = [{
        title: 'Einstein Name',
        dataIndex: 'eaName',
        key: 'eaName',
        render: (text, record, idx) => (
            <span>{record.einstein}</span>
        )
    }, {
        title: 'Tableau Name',
        dataIndex: 'tabName',
        key: 'tabName',
        render: (text, record, idx) => (
            <Input 
                defaultValue={record.tableau} 
                onChange={({ target: { value } }) => updateMappedField(idx, 'tableau', value)}
            />
        )
    }]

    useEffect(() => {
        const useModel = addedPredictionModels.filter(m => m.predictionDefinition === predictionDefId)[0];
        if (useModel.columnMapping.length == 0) {
            ipcRenderer.on('response-get-ea-model-definitions', (event, modelDefs: SfdcModelDefinitionsResponse) => {
                const model = modelDefs.models[0];
                const predictionLabel = query.get('predictionLabel');
                setPredictColName(`EA Results - ${predictionLabel}`);
                setColumnMapping(Object.keys(model.fieldMap).map(eaField => ({
                    einstein: eaField,
                    tableau: eaField.replace(/_/g, ' ')
                })));
            });
            
            sendMessageToMain({
                channel: 'get-ea-model-definitions',
                instanceUrl: tpe.auth.instanceUrl,
                modelsUrl: `/services/data/v46.0/smartdatadiscovery/predictiondefinitions/${predictionDefId}/models`,
                accessToken: setup.accessToken,
                tokenType: tpe.auth.tokenType
            });
        } else {
            setIsNewModel(false);
            setPredictColName(useModel.resultsColumn);
            setColumnMapping(useModel.columnMapping);
        }
    }, [])

    const disableDone = () => {
        if (predictColName === '') return true;
        const tableauFieldNames = columnMapping.map(c => c.tableau);
        const invalidFieldNames = tableauFieldNames.filter(f => f === '');
        if (tableauFieldNames.length === invalidFieldNames.length) return true;
    }

    if (columnMapping.length === 0) return <Spin size='large' />
    else return (
        <div css={cssOuterContainer}>
            <ConfigCard
                title='Map Fields - Einstein <-> Tableau'
                actions={[
                    <div css={cssActionsContainer}>
                        <CardActionButton
                            type='primary'
                            onClick={() => onDone(predictionDefId, predictColName, columnMapping)}
                            disabled={disableDone()}
                        >
                            Done
                        </CardActionButton>
                        <CardActionButton
                            danger
                            onClick={() => isNewModel ? onCancel(predictionDefId) : onCancel()}
                        >
                            Cancel
                        </CardActionButton>
                    </div>
                ]}
            >
                <Form.Item
                    label='Output Column Name'
                >
                    <Input 
                        type='text' 
                        placeholder='Provide a name for the prediction output column in Tableau Prep...' 
                        value={predictColName}
                        onChange={({ target: { value } }) => setPredictColName(value)}
                        css={css`
                            margin-bottom: 12px;
                        `}
                    />
                </Form.Item>
                <Table
                    columns={tableCols}
                    dataSource={columnMapping}
                    pagination={false}
                    rowKey={record => record.einstein}
                />
            </ConfigCard>
            </div>
    )

}

export default MapFields;