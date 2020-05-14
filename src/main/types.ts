import { TabpyProperties, TpeProperties, PathProperties, SetupProperties } from '../store/types';

export type OpenDialogProperty =
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
    | 'promptToCreate'
    | 'noResolveAliases'
    | 'treatPackageAsDirectory'
    | 'dontAddToRecent'

export type OpenDialogProperties = OpenDialogProperty[];

export type SfdcGrantType = 
    | 'password'

export type SfdcLoginPostBody = {
    'grant_type': SfdcGrantType,
    'client_id': string,
    'client_secret': string,
    'username': string,
    'password': string
}

export type SfdcLoginResponse = {
    access_token: string,
    instance_url: string,
    token_type: 'Bearer',
    issued_at: string,
    signature: string
}

export type SfdcPredictionDefinition = {
    countOfModels: number;
    createdBy: {
        id: string;
        name: string;
        profilePhotoUrl: string;
    },
    createdDate: string,
    id: string;
    label: string;
    lastModifiedBy: {
        id: string;
        name: string;
        profilePhotoUrl: string;
    };
    modelsUrl: string;
    name: string;
    outcome: {
        goal: 'Maximize' | 'Minimize',
        label: string;
        name: string;
    };
    status: string;
    subscribedEntity: string;
    url: string;
}

export type SfdcModelDefinition = {
    actionableFields: string[];
    analysis: {
        id: string;
    };
    createdBy: {
        id: string;
        name: string;
        profilePhotoUrl: string;
    };
    createdDate: string;
    fieldMap: {
        [key: string]: string
    };
    filters: any[];
    id: string;
    label: string;
    lastModifiedBy: {
        id: string;
        name: string;
        profilePhotoUrl: string;
    };
    lastModifiedDate: string;
    name: string;
    predictionDefinitionUrl: string;
    sortOrder: number;
    status: string;
    url: string;
}

export type SfdcPredictionDefinitionsResponse = {
    predictionDefinitions: SfdcPredictionDefinition[];
    totalSize: number;
    url: string;
}

export type SfdcModelDefinitionsResponse = {
    models: SfdcModelDefinition[];
    totalSize: number;
    url: string;
}

export type SetupConfig = {
    path: PathProperties,
    setup: SetupProperties,
    tabpy: TabpyProperties,
    tpe: TpeProperties
}

export type CheckDependenciesResponse = {
    python?: number,
    aiohttp?: boolean,
    tabpy?: boolean
}