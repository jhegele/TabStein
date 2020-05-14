import fs from 'fs';
import ini from 'ini';
import { initOptions, initLoggers, initFormatters, initHandlers } from '../../../store/defaults';
import { TabpyProperties, TabpyOptions, TabpyLogger, TabpyFormatter, TabpyHandler, TabpyConfigFile } from '../../../store/types';
import omit from 'lodash/omit';

class TabpyConf implements TabpyProperties {

    public options: TabpyOptions = initOptions;
    public loggers: TabpyLogger[] = initLoggers;
    public formatters: TabpyFormatter[] = initFormatters;
    public handlers: TabpyHandler[] = initHandlers;
    public hasExistingConfig: boolean = false;

    private clearDefaults = () => {
        this.options = initOptions;
        this.loggers = [];
        this.formatters = [];
        this.handlers = [];
    }

    public loadFromFile = (pathToTabpyConf: string) => {
        this.clearDefaults();
        const confFile = ini.parse(fs.readFileSync(pathToTabpyConf, 'utf-8')) as TabpyConfigFile;
        let confOptions: TabpyOptions = initOptions;
        Object.keys(confFile.TabPy).forEach((key: keyof TabpyOptions) => {
            if (key === 'TABPY_PORT' || key === 'TABPY_EVALUATE_TIMEOUT' || key === 'TABPY_MAX_REQUEST_SIZE_MB') {
                confOptions[key] = parseInt(confFile.TabPy[key]);
            } else if (key === 'TABPY_LOG_DETAILS') {
                confOptions[key] = confFile.TabPy.TABPY_LOG_DETAILS === 'True' ? true : false;
            } else if (key === 'TABPY_TRANSFER_PROTOCOL') {
                confOptions[key] = confFile.TabPy.TABPY_TRANSFER_PROTOCOL === 'HTTPS' ? 'HTTPS' : 'HTTP';
            } else {
                confOptions[key] = confFile.TabPy[key]
            }
        })
        this.options = confOptions;
        const loggerNames = confFile.loggers.keys.split(',');
        const formatterNames = confFile.formatters.keys.split(',');
        const handlerNames = confFile.handlers.keys.split(',');

        loggerNames.forEach(ln => {
            if (!confFile[`logger_${ln}`]) throw 'Invalid tabpy.conf file. Each logger, formatter, or handler key requires a definition.';
            const l = confFile[`logger_${ln}`] as TabpyLogger;
            l.name = ln;
            this.loggers.push(l);
        });

        formatterNames.forEach(fn => {
            if (!confFile[`formatter_${fn}`]) throw 'Invalid tabpy.conf file. Each logger, formatter, or handler key requires a definition.';
            const f = confFile[`formatter_${fn}`] as TabpyFormatter;
            f.name = fn;
            this.formatters.push(f);
        });

        handlerNames.forEach(hn => {
            if (!confFile[`handler_${hn}`]) throw 'Invalid tabpy.conf file. Each logger, formatter, or handler key requires a definition.';
            const h = confFile[`handler_${hn}`] as TabpyHandler;
            h.name = hn;
            this.handlers.push(h);
        });

        this.hasExistingConfig = true;

    }

    public write = (pathToWrite: string) => {
        let newConf: {[key: string]: any} = {
            loggers: { keys: this.loggers.map(l => l.name).join(',') },
            formatters: { keys: this.formatters.map(f => f.name).join(',') },
            handlers: { keys: this.handlers.map(h => h.name).join(',') }
        }
        this.loggers.forEach(logger => {
            newConf[`logger_${logger.name}`] = omit(logger, 'name');
        });
        this.formatters.forEach(formatter => {
            newConf[`formatter_${formatter.name}`] = omit(formatter, 'name');
        });
        this.handlers.forEach(handler => {
            newConf[`handler_${handler.name}`] = omit(handler, 'name');
        });
        if (Object.keys(this.options).length > 0) {
            newConf['TabPy'] = this.options;
        }
        fs.writeFileSync(pathToWrite, ini.stringify(newConf))
        
    }

}

export default TabpyConf;