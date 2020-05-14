import React, { useState } from 'react';
import { css } from '@emotion/core';
import { ConfigCard, CardActionButton } from '../../../../components';
import { Input, Table, message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import type { TpeServer } from '../../../../store/types';
import { ColumnProps } from 'antd/es/table';

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

interface ServerSetupProps {
    onBack: () => any;
    onNext: (serverConfig: TpeServer) => any;
}

interface TpeServerVals {
    rowsChunkSize: string;
    threads: string;
}

const SetupServer: React.FC<ServerSetupProps> = ({ onBack, onNext }) => {

    const tpe = useSelector(
        (state: RootState) => state.tpe
    )
    const [ serverConfig, setServerConfig ] = useState<TpeServerVals>({
        rowsChunkSize: tpe.server.rowsChunkSize.toString(),
        threads: tpe.server.threads.toString()
    });

    const handleNext = () => {
        if (isNaN(parseInt(serverConfig.rowsChunkSize)) || isNaN(parseInt(serverConfig.threads))) {
            message.error('Values must be integers. Please try again.')
        } else {
            onNext({
                rowsChunkSize: parseInt(serverConfig.rowsChunkSize),
                threads: parseInt(serverConfig.threads)
            })
        }
    }

    const tableData = [
        {
            key: 'rowsChunkSize',
            description: 'When sending your data to Einstein, the rows will be sent in batches. How many rows, per batch, would you like ' +
                         'to send? Depending on the speed of your internet connection, a higher number of rows could result in faster' +
                         'processing of the dataset.',
            render: (
                <Input 
                    type='number' 
                    value={serverConfig.rowsChunkSize}
                    onChange={({ target: { value } }) => setServerConfig({
                        ...serverConfig,
                        rowsChunkSize: value
                    })}
                />
            )
        },
        {
            key: 'threads',
            description: 'When sending data to Einstein, multiple requests can be sent simultaneously. Setting this value too high risks ' +
                         'some data loss if a request failed. However, a higher number of simultaneous requests will result in faster ' +
                         'processing of the dataset.',
            render: (
                <Input 
                    type='number' 
                    value={serverConfig.threads}
                    onChange={({ target: { value } }) => setServerConfig({
                        ...serverConfig,
                        threads: value
                    })}
                    
                />
            )
        }
    ]

    const tableCols: ColumnProps<typeof tableData[0]>[] = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Value',
            dataIndex: 'render',
            key: 'value',
            width: '200px'
        }
    ]

    return (
        <div css={cssOuterContainer}>
            <ConfigCard
                title='Custom Server Configuration'
                actions={[
                    <div css={cssActionsContainer}>
                        <CardActionButton
                            type='primary'
                            onClick={handleNext}
                        >
                            Next
                        </CardActionButton>
                        <CardActionButton
                            type='default'
                            onClick={() => onBack()}
                        >
                            Back
                        </CardActionButton>
                    </div>
                ]}
            >
                <Table
                    dataSource={tableData}
                    columns={tableCols}
                    pagination={false}
                />
            </ConfigCard>
        </div>
    )

}

export default SetupServer;