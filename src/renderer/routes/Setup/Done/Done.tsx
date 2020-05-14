import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { ConfigCard, CardActionButton } from '../../../../components';
import { css } from '@emotion/core';

const cssOuterContainer = css`
    display: flex;
    padding: 24px;
    flex-direction: column;
`;

const cssContentContainer = css`
    margin-bottom: 24px;
`;

const Done: React.FC = () => {

    const setup = useSelector(
        (state: RootState) => state.setup
    )
    const path = useSelector(
        (state: RootState) => state.path
    )

    let wroteFiles: string[] = [
        'tabpy.conf'
    ]
    let confirmMessage: string = 'Successfully setup TabPy. Follow the instructions below to launch your server:';
    let instructions: string[] = [
        `Navigate to ${path.useDir}`,
        `Run the command "tabpy --config=./tabpy.conf"`
    ]
    if (setup.tpeConfigured) {
        wroteFiles.push('tpe.conf');
        wroteFiles.push('prep.py');
        confirmMessage = 'Successfully setup TabPy + Einstein! Follow the instructions below to launch your server:';
    }

    return (
        <div css={cssOuterContainer}>
            <ConfigCard
                title='Setup Complete!'
            >
                <div css={cssContentContainer}>Wrote {wroteFiles.length === 1 ? 'one' : 'two'} files.</div>
                <div css={cssContentContainer}>
                    <div>{confirmMessage}</div>
                    <div>
                        <ul>
                            {instructions.map((i, idx) => (
                                <li key={`setup-done-instructions-${idx}`}>{i}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div css={cssContentContainer}>You can close this application now.</div>
            </ConfigCard>
        </div>
    )

}

export default Done;