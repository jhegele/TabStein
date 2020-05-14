import React from 'react';
import { css } from '@emotion/core';
import { Card, Button } from 'antd';

const cssOuterContainer = css`
    display: flex;
    padding: 24px;
`;

const cssActionsContainer = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0 12px;
`;

interface OverviewProps {
    onNext: () => any;
}

const Overview: React.FC<OverviewProps> = ({ onNext }) => {

    return (
        <div css={cssOuterContainer}>
            <Card 
                title='Introduction'
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
                    </div>
                ]}
            >
                This process will walk you through setting up a new instance of TabPy and, optionally, connecting it
                to Salesforce's Einstein Discovery in order to incorporate predictions in your Tableau Prep Flow.
                Click the Next button to get started!
            </Card>
        </div>
    )

}

export default Overview;