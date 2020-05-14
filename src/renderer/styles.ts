import { css } from '@emotion/core';

export const resets = css`
    
    html, body {
        padding: 0;
        margin: 0;
        min-height: 100%;
        height: 100%;
    }

    #root {
        min-height: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* -- BOOTSTRAP RESETS / THEMING -- */
    /* .btn-primary {
        background-color: purple;
        border-color: purple;
    }

    .btn-primary:hover {
        background-color: red;
        border-color: red;
    } */

    .list-group-item {
        border-left: 0;
        border-right: 0;
    }

    .list-group-item:first-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top: 0;
    }

    .list-group-item:last-child {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

`;