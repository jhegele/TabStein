import React from 'react';
import { css } from '@emotion/core';
import { ConfigCard, CardActionButton } from '../../../../components';
import { useHistory } from 'react-router-dom';

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

interface ConfirmProps {
    onYes: () => any;
    onNo: () => any;
}

const Confirm: React.FC<ConfirmProps> = ({ onYes, onNo }) => {

    const history = useHistory();

    return (
        <div css={cssOuterContainer}>
            <ConfigCard
                title='Confirm Einstein Setup'
                actions={[
                    <div css={cssActionsContainer}>
                        <CardActionButton
                            type='primary'
                            onClick={onYes}
                        >
                            Yes
                        </CardActionButton>
                        <CardActionButton
                            type='default'
                            onClick={onNo}
                        >
                            No
                        </CardActionButton>
                    </div>
                ]}
            >
                Do you want to add Einstein Discovery's predictive capabilities to your Tableau Prep flow?
            </ConfigCard>
        </div>
    )

}

export default Confirm;