import { TabpyOptions, TabpyLogger, TabpyHandler, TabpyFormatter, TabpyProperties, TpeProperties, PathProperties, SetupProperties } from './types';

export const initOptions: TabpyOptions = {
    TABPY_EVALUATE_TIMEOUT: 1200,
    TABPY_PORT: 9004
}

export const initLoggers: TabpyLogger[] = [
    {
        name: 'root',
        level: 'WARNING',
        handlers: 'consoleHandler'
    },
    {
        name: 'fileLogger',
        level: 'DEBUG',
        handlers: 'fileHandler',
        propgate: 1,
        qualname: 'consoleLogger'
    }
]

export const initFormatters: TabpyFormatter[] = [
    {
        format: '%(asctime)s: %(message)s',
        datefmt: '%H:%M:%S',
        name: 'consoleFormatter'
    },
    {
        format: '%(asctime)s [%(levelname)s] (%(filename)s:%(module)s:%(lineno)d): %(message)s',
        datefmt: '%Y-%m-%d,%H:%M:%S',
        name: 'fileFormatter'
    }
]

export const initHandlers: TabpyHandler[] = [
    {
        class: 'StreamHandler',
        level: 'WARNING',
        formatter: 'consoleFormatter',
        args: '(sys.stdout,)',
        name: 'consoleHandler'
    },
    {
        class: 'handlers.RotatingFileHandler',
        level: 'DEBUG',
        formatter: 'fileFormatter',
        args: "('tabpy_log.log', 'a', 1000000, 5)",
        name: 'fileHandler'
    }
]

export const initTabpy: TabpyProperties = {
    options: initOptions,
    loggers: initLoggers,
    handlers: initHandlers,
    formatters: initFormatters
}

export const initTpe: TpeProperties = {
    auth: {
        consumerKey: '',
        consumerSecret: '',
        loginUrl: 'https://login.salesforce.com/services/oauth2/token',
        instanceUrl: '',
        username: '',
        password: '',
        tokenType: 'Bearer'
    },
    server: {
        rowsChunkSize: 2000,
        threads: 1,
    },
    predictionModels: [],
    hasExistingConfig: false,
}

export const initPath: PathProperties = {
    useDir: '',
    pathTpeConf: '',
    pathTabpyConf: ''
}

export const initSetup: SetupProperties = {
    accessToken: '',
    tabpyConfigured: false,
    tpeConfigured: false
}