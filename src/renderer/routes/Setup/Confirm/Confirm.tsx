import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Typography, List, Card, Button } from 'antd';
import { css } from '@emotion/core';
import { TabpyOptions, PathProperties, SetupProperties, TabpyProperties, TpeProperties } from '../../../../store/types';
import Table, { ColumnProps } from 'antd/lib/table';
import type { SetupConfig } from '../../../../main/types';

const cssOuterContainer = css`
    display: flex;
    padding: 24px;
    flex-direction: column;
`;

const cssControlsContainer = css`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    > * {
        margin-left: 12px;
    }
`;

const { Text } = Typography;

type ConfirmTableData = {
    key: string;
    value: string | number | boolean;
}

interface ConfirmProps {
    onDone: (config: SetupConfig) => any;
    onBack: () => any;
}

const Confirm: React.FC<ConfirmProps> = ({ onDone, onBack }) => {

    const { tabpy, tpe, setup, path } = useSelector(
        (state: RootState) => state
    )

    console.log('tabpy: ', tabpy);
    console.log('tpe: ', tpe);
    console.log('setup: ', setup);
    console.log('path: ', path);

    const dataGeneral: ConfirmTableData[] = [
        {
            key: 'Directory',
            value: path.useDir
        }
    ]

    const dataTabpy: ConfirmTableData[] = Object.keys(tabpy.options).map((key: keyof TabpyOptions) => ({
        key: key,
        value: tabpy.options[key]
    }))

    const dataTpe: ConfirmTableData[] = [
        {
            key: 'Salesforce Instance',
            value: tpe.auth.instanceUrl
        },
        {
            key: 'Username',
            value: tpe.auth.username
        },
        {
            key: 'Num Selected Models',
            value: tpe.predictionModels.length
        }
    ]

    const tableCols: ColumnProps<ConfirmTableData>[] = [
        {
            title: 'Property',
            dataIndex: 'key',
            width: 350
        },
        {
            title: 'Value',
            dataIndex: 'value'
        }
    ]

    return (
        <div css={cssOuterContainer}>
            <div 
                css={css`
                    margin-bottom: 12px;
                `}
            >
                <Text type='secondary'>
                    Confirm your setup details.
                </Text>
            </div>
            <Table
                columns={tableCols}
                dataSource={dataGeneral}
                bordered
                title={() => 'General Setup Summary'}
                pagination={false}
                css={css`
                    margin-bottom: 24px;
                `}
            />
            <Table
                columns={tableCols}
                dataSource={dataTabpy}
                bordered
                title={() => 'TabPy Setup Summary'}
                pagination={false}
                css={css`
                    margin-bottom: 24px;
                `}
            />
            <Table
                columns={tableCols}
                dataSource={dataTpe}
                bordered
                title={() => 'Einstein Setup Summary'}
                pagination={false}
                css={css`
                    margin-bottom: 24px;
                `}
            />
            <div css={cssControlsContainer}>
                <Button 
                    type='primary'
                    onClick={() => onDone({
                        path: path,
                        setup: setup,
                        tabpy: tabpy,
                        tpe: tpe
                    })}
                >
                    Done
                </Button>
                <Button
                    type='default'
                    onClick={onBack}
                >
                    Back
                </Button>
            </div>
        </div>
    )

}

export default Confirm;