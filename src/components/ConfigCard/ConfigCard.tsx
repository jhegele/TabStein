import React from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd/lib/card';
import { css } from '@emotion/core';

export const ConfigCard: React.FC<CardProps> = ({ children, ...rest }) => {

    return (
        <Card
            css={css`
                width: 100%;
                margin-bottom: 12px;
            `}
            {...rest}
        >
            {children}
        </Card>
    )

}