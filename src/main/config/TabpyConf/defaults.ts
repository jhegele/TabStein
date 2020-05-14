import type  { TabpyOptions, TabpyLogger, TabpyFormatter, TabpyHandler } from '../../../store/types';

export const defaultOptions: TabpyOptions = {
    TABPY_EVALUATE_TIMEOUT: 1200,
    TABPY_PORT: 9004
}

export const defaultLoggers: TabpyLogger[] = [
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

export const defaultFormatters: TabpyFormatter[] = [
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

export const defaultHandlers: TabpyHandler[] = [
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