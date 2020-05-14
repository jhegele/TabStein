import React from 'react';
import { Table, InputNumber, Checkbox, Input, Collapse } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { css } from '@emotion/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { tabpyUpdateOptions } from '../../../store/slices/tabpy';
import { TabpyOptions } from '../../../store/types';

const { Panel } = Collapse;

type OptionDetail = {
    name: string;
    flag: keyof TabpyOptions;
    description: string;
    default: string;
}

const Tabpy: React.FC = () => {

    const { options } = useSelector((state: RootState) => state.tabpy);
    const dispatch = useDispatch();

    const tableDataBasic: OptionDetail[] = [
        {
            name: 'Port',
            flag: 'TABPY_PORT',
            description: 'Port for TabPy to listen on.',
            default: '9004'
        },
        {
            name: 'Evaluate Timeout',
            flag: 'TABPY_EVALUATE_TIMEOUT',
            description: 'How long, in seconds, your script will run before the server times out.',
            default: '30'
        },
        {
            name: 'Log Details',
            flag: 'TABPY_LOG_DETAILS',
            description: 'When set to True, additional call information (caller IP, URL, client info, etc.) is logged.',
            default: 'False'
        },
        {
            name: 'Max Request Size (MB)',
            flag: 'TABPY_MAX_REQUEST_SIZE_MB',
            description: 'Maximum request size supported by TabPy server in Megabytes. Any request exceeding this size will be rejected.',
            default: '100'
        }
    ]

    const tableDataAdvanced: OptionDetail[] = [
        {
            name: 'Query Object Path',
            flag: 'TABPY_QUERY_OBJECT_PATH',
            description: 'Query objects location (used with models, see TabPy Tools documentation).',
            default: '/tmp/query_objects'
        },
        {
            name: 'State Path',
            flag: 'TABPY_STATE_PATH',
            description: 'Absolute path to state folder for Tornado web server.',
            default: 'tabpy/tabpy_server'
        },
        {
            name: 'Static Path',
            flag: 'TABPY_STATIC_PATH',
            description: 'Absolute path to static files (index.html, e.g.) for TabPy instance.',
            default: 'tabpy/tabpy_server/static'
        },
        {
            name: 'Password File',
            flag: 'TABPY_PWD_FILE',
            description: 'Absolute path to password file. Setting up this parameter makes TabPy require credentials with HTTP(S) requests.',
            default: ''
        },
        {
            name: 'Transfer Protocol',
            flag: 'TABPY_TRANSFER_PROTOCOL',
            description: 'Whether TabPy should use HTTP or HTTPS to handle requests. HTTPS requires setting Certificate File and Key File parameters.',
            default: 'HTTP'
        },
        {
            name: 'Certificate File',
            flag: 'TABPY_CERTIFICATE_FILE',
            description: 'Absolute path to the certificate file to run TabPy with. Only used with Transfer Protocol set to HTTPS.',
            default: ''
        },
        {
            name: 'Key File',
            flag: 'TABPY_KEY_FILE',
            description: 'Absolute path to private key file to run TabPy with. Only used with Transfer Protocol set to HTTPS.',
            default: ''
        }
    ]
    
    const tableCols: ColumnProps<OptionDetail>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '200px'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: '500px',
            render: (text, record) => {
                if (record.flag === 'TABPY_PORT' || record.flag === 'TABPY_MAX_REQUEST_SIZE_MB' || record.flag === 'TABPY_EVALUATE_TIMEOUT') {
                    return (
                        <InputNumber 
                            value={options[record.flag] || undefined}
                            placeholder={record.default}
                            onChange={val => dispatch(tabpyUpdateOptions({...options, [record.flag]: val}))}
                        />
                    )
                } else if (record.flag === 'TABPY_LOG_DETAILS') {
                    return (
                        <Checkbox 
                            checked={options[record.flag] || false}
                            onChange={({ target: { checked }}) => dispatch(tabpyUpdateOptions({...options, [record.flag]: checked}))}
                        />
                    )
                } else {
                    return (
                        <Input
                            placeholder={record.default}
                            value={options[record.flag] || ''}
                            onChange={({ target: { value } }) => dispatch(tabpyUpdateOptions({...options, [record.flag]: value}))}
                        />
                    )
                }
            }
        }
    ]

    return (
        <Collapse defaultActiveKey={['basic']}>
            <Panel header='Basic Options' key='basic'>
                <Table<OptionDetail> 
                    columns={tableCols} 
                    dataSource={tableDataBasic} 
                    pagination={false}
                    size='small'
                    rowKey={(record) => record.flag}
                    css={css`
                        margin-bottom: 24px;
                    `}
                />
            </Panel>
            <Panel header='Advanced Options' key='advanced'>
                <Table<OptionDetail> 
                    columns={tableCols} 
                    dataSource={tableDataAdvanced} 
                    pagination={false}
                    size='small'
                    rowKey={(record) => record.flag}
                    css={css`
                        margin-bottom: 24px;
                    `}
                />
            </Panel>
        </Collapse>
    )

}

export default Tabpy;