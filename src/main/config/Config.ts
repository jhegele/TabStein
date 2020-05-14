import path from 'path';
import glob from 'glob';
import { TabpyConf } from './TabpyConf';
import { TpeConf } from './TpeConf';
import { ConfigProperties, PathProperties } from '../../store/types';

const NAME_TPE_CONF: string = 'tpe.conf';
const NAME_TABPY_CONF: string = 'tabpy.conf';

class Config implements ConfigProperties {

    public path: PathProperties = {
        useDir: '',
        pathTpeConf: '',
        pathTabpyConf: ''
    }
    public tabpyConfig: TabpyConf = new TabpyConf();
    public tpeConfig: TpeConf = new TpeConf();

    constructor(useDir: string) {
        this.path.useDir = useDir;
        this.path.pathTabpyConf = `${useDir}/${NAME_TABPY_CONF}`;
        this.path.pathTpeConf = `${useDir}/${NAME_TPE_CONF}`;
        
        const matchedFiles = glob.sync(`${useDir}/*.conf`)
        if (matchedFiles.length > 0) {
            matchedFiles.forEach(filename => {
                if (path.basename(filename) === NAME_TPE_CONF) {
                    this.tpeConfig.loadFromFile(filename);
                }
                if (path.basename(filename) === NAME_TABPY_CONF) {
                    this.tabpyConfig.loadFromFile(filename);
                }
            });
        }
    }

    toObject = (): ConfigProperties => {
        return {
            path: this.path,
            tabpyConfig: {
                options: this.tabpyConfig.options,
                loggers: this.tabpyConfig.loggers,
                handlers: this.tabpyConfig.handlers,
                formatters: this.tabpyConfig.formatters,
                hasExistingConfig: this.tabpyConfig.hasExistingConfig
            },
            tpeConfig: {
                auth: this.tpeConfig.auth,
                server: this.tpeConfig.server,
                predictionModels: this.tpeConfig.predictionModels,
                hasExistingConfig: this.tpeConfig.hasExistingConfig
            }
        }
    }

}

export default Config;