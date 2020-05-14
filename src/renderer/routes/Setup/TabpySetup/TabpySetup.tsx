import React, { useState } from 'react';
import { css } from '@emotion/core';
import { Card, Button } from 'antd';
import Tabpy from '../../Config/Tabpy';

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

interface TabpySetupProps {
    onNext: () => any;
    onPrev: () => any;
}

const TabpySetup: React.FC<TabpySetupProps> = ({ onNext, onPrev }) => {

    return (
        <div css={cssOuterContainer}>
            <div css={css` 
                width: 100%;
                margin-bottom: 12px;
            `}>
                Use the fields below to configure options that control how your TabPy instance is run. If you want to use the default
                for any field, just leave it blank.
            </div>
            <Card 
                css={css`
                    width: 100%;
                    margin-bottom: 12px;
                `}
                title='Tabpy Configuration'
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
                            onClick={onPrev}
                        >
                            Back
                        </Button>
                    </div>
                ]}
            >
                <Tabpy />
            </Card>
        </div>
    )

}

export default TabpySetup;