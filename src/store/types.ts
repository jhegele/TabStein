export type TabpyOptions = {
    TABPY_PORT: number;
    TABPY_QUERY_OBJECT_PATH?: string;
    TABPY_STATE_PATH?: string;
    TABPY_STATIC_PATH?: string;
    TABPY_PWD_FILE?: string;
    TABPY_TRANSFER_PROTOCOL?: 'HTTP' | 'HTTPS';
    TABPY_CERTIFICATE_FILE?: string;
    TABPY_KEY_FILE?: string;
    TABPY_LOG_DETAILS?: boolean;
    TABPY_MAX_REQUEST_SIZE_MB?: number;
    TABPY_EVALUATE_TIMEOUT: number;
}

export type TabpyLogLevels =
    | 'DEBUG'
    | 'INFO'
    | 'WARNING'
    | 'ERROR'
    | 'CRITICAL'
    | 'NOTSET'

export type TabpyLogger = {
    name?: string;
    level: TabpyLogLevels;
    handlers: string;
    propgate?: number;
    qualname?: string;
}

export type TabpyHandler = {
    name?: string;
    class: string;
    level: TabpyLogLevels;
    formatter: string;
    args: string;
}

export type TabpyFormatter = {
    name?: string;
    format: string;
    datefmt: string;
}

export type TabpyConfigFile = {
    TabPy?: { [key in keyof TabpyOptions]: string };
    loggers: { keys: string };
    formatters: { keys: string };
    handlers: { keys: string };
} & {
    [key: string]: TabpyLogger | TabpyHandler | TabpyFormatter;
}

export type TpeColumnMapping = {
    tableau: string;
    einstein: string;
}

export type TpePredictionModel = {
    predictionDefinition: string;
    modelName: string;
    resultsColumn: string;
    columnMapping: TpeColumnMapping[];
}

export type TpeConfigFile = {
    consumerKey: string;
    consumerSecret: string;
    loginUrl: string;
    instanceUrl: string;
    username: string;
    password: string;
    rowsChunkSize: number;
    threads: number;
    predictionModels: TpePredictionModel[];
}

export type TabpyProperties = {
    options: TabpyOptions;
    loggers: TabpyLogger[];
    formatters: TabpyFormatter[];
    handlers: TabpyHandler[];
    hasExistingConfig?: boolean;
}

export type TpeAuth = {
    consumerKey: string;
    consumerSecret: string;
    loginUrl: string;
    instanceUrl: string;
    username: string;
    password: string;
    tokenType: 'Bearer';
}

export type TpeServer = {
    rowsChunkSize: number;
    threads: number;
}

export type TpeProperties = {
    auth: TpeAuth;
    server: TpeServer;
    predictionModels: TpePredictionModel[];
    hasExistingConfig?: boolean;
}

export type PathProperties = {
    useDir: string;
    pathTpeConf: string;
    pathTabpyConf: string;
}

export type ConfigProperties = {
    path: PathProperties;
    tabpyConfig: TabpyProperties;
    tpeConfig: TpeProperties;
}

export type SetupProperties = {
    accessToken: string;
    tabpyConfigured: boolean;
    tpeConfigured: boolean;
}
