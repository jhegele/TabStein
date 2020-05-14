import React, { useState } from 'react';
import Layout from './Layout';
import { Menu } from 'antd';
import Tabpy from './Tabpy';

type MenuOptions = 
    | { main: 'tabpy', side: 'options' | 'loggers' }
    | { main: 'einstein', side: 'authentication' | 'models' } 

const defaultTabpyMenu: MenuOptions = { main: 'tabpy', side: 'options' };
const defaultEinsteinMenu: MenuOptions = { main: 'einstein', side: 'authentication'}

const Config: React.FC = () => {

    const [ menuSelections, setMenuSelections ] = useState<MenuOptions>(defaultTabpyMenu);

    let mainMenuItems: React.ReactElement[] = [
        <Menu.Item key='tabpy' onClick={() => setMenuSelections(defaultTabpyMenu)}>TabPy</Menu.Item>,
        <Menu.Item key='einstein' onClick={() => setMenuSelections(defaultEinsteinMenu)}>Einstein</Menu.Item>
    ]

    let sideMenuItems: React.ReactElement[] = [null];
    let content: React.ReactElement = null;
    let sideMenuDefaultSelectedKey: string;
    switch (menuSelections.main) {
        case 'tabpy':
            sideMenuItems = [
                <Menu.Item key='tabpy__options'>Options</Menu.Item>,
                <Menu.Item key='tabpy__loggers'>Loggers</Menu.Item>
            ];
            sideMenuDefaultSelectedKey = 'tabpy__options';
            content = <Tabpy />;
            
            break;
        case 'einstein':
            sideMenuItems = [
                <Menu.Item key='einstein__authentication'>Authentication</Menu.Item>,
                <Menu.Item key='einstein__models'>Models</Menu.Item>
            ];
            sideMenuDefaultSelectedKey = 'einstein__authentication';
            content = <div>Einstein</div>;
            break;
    }

    return (
        <Layout
            mainMenuItems={mainMenuItems}
            mainMenuDefaultSelectedKey='tabpy'
            sideMenuItems={sideMenuItems}
            sideMenuDefaultSelectedKey={sideMenuDefaultSelectedKey}
        >
            {content}
        </Layout>
    )

}

export default Config;