import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { css } from '@emotion/core';

const { Header, Content, Sider } = AntLayout;

interface ConfigLayoutProps {
    mainMenuItems: React.ReactElement[];
    mainMenuDefaultSelectedKey?: string;
    sideMenuItems: React.ReactElement[];
    sideMenuDefaultSelectedKey?: string;
}

const Layout: React.FC<ConfigLayoutProps> = ({ children, mainMenuItems, mainMenuDefaultSelectedKey, sideMenuItems, sideMenuDefaultSelectedKey }) => {

    return (
        <AntLayout
            css={css`
                flex: 1;
            `}
        >
            <Header>
                <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[mainMenuDefaultSelectedKey]}>
                    {mainMenuItems}
                </Menu>
            </Header>
            <AntLayout>
                <Sider width={200}>
                    <Menu
                        mode='inline'
                        defaultSelectedKeys={[sideMenuDefaultSelectedKey]}
                        css={css`
                            height: 100%;
                            border-right: 0;
                        `}
                    >
                        {sideMenuItems}
                    </Menu>
                </Sider>
                <AntLayout
                    css={css`
                        padding: 24px;
                    `}
                >
                    <Content>
                        {children}
                    </Content>
                </AntLayout>
            </AntLayout>
        </AntLayout>
    )

}

export default Layout;