import React from 'react';
import type { ButtonProps } from 'antd/lib/button';
import { Button } from 'antd';
import { css } from '@emotion/core';

export const CardActionButton: React.FC<ButtonProps> = ({ children, ...rest }) => {

    return (
        <Button
            css={css`
                max-width: max-content;
            `}
            {...rest}
        >
            {children}
        </Button>
    )

}