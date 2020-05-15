import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store';
import { Switch, Route, useHistory } from 'react-router-dom';
import Confirm from './Confirm';
import SfdcLogin from './SfdcLogin';
import SetupModels from './SetupModels';
import SetupServer from './SetupServer';
import { TpePredictionModel, TpeAuth, TpeServer } from '../../../../store/types';
import { tpeUpdateAuth, tpeUpdateAll, tpeUpdateServer } from '../../../../store/slices/tpe';

interface TpeSetupProps {
    onDone: () => any;
    onAbort: () => any;
}

const TpeSetup: React.FC<TpeSetupProps> = ({ onDone, onAbort }) => {

    const tpeConfig = useSelector(
        (state: RootState) => state.tpe
    )
    const dispatch = useDispatch();
    const history = useHistory();

    const handleConfirmYes = () => {
        history.push('/setup/tpe/sfdc-login')
    }

    const handleConfirmNo = () => {
        onAbort();
    }

    const handleSfdcLoginBack = () => {
        history.push('/setup/tpe');
    }

    const handleSfdcLoginAuthenticated = (auth: TpeAuth) => {
        dispatch(tpeUpdateAuth(auth));
        history.push('/setup/tpe/setup-models');
    }

    const handleSetupModelsBack = () => {
        history.push('/setup/tpe/sfdc-login');
    }

    const handleSetupModelsNext = (selectedModels: TpePredictionModel[]) => {
        dispatch(tpeUpdateAll({
            ...tpeConfig,
            predictionModels: selectedModels
        }));
        history.push('/setup/tpe/server');
    }

    const handleSetupServerBack = () => {
        history.push('/setup/tpe/setup-models');
    }

    const handleSetupServerNext = (serverConfig: TpeServer) => {
        dispatch(tpeUpdateServer(serverConfig));
        // history.push('/setup/tpe/confirm');
        onDone();
    }

    return (
        <Switch>
            <Route exact path='/setup/tpe/'>
                <SfdcLogin 
                    onBack={handleSfdcLoginBack}
                    onAuthenticated={handleSfdcLoginAuthenticated}
                />
                {/* <Confirm 
                    onYes={handleConfirmYes}
                    onNo={handleConfirmNo}
                /> */}
            </Route>
            <Route path='/setup/tpe/sfdc-login'>
                <SfdcLogin 
                    onBack={handleSfdcLoginBack}
                    onAuthenticated={handleSfdcLoginAuthenticated}
                />
            </Route>
            <Route path='/setup/tpe/setup-models'>
                <SetupModels 
                    onBack={handleSetupModelsBack}
                    onNext={handleSetupModelsNext}
                />
            </Route>
            <Route path='/setup/tpe/server'>
                <SetupServer 
                    onBack={handleSetupServerBack}
                    onNext={handleSetupServerNext}
                />
            </Route>
            {/* <Route path='/setup/tpe/done'>
                <div>DONE!</div>
            </Route> */}
        </Switch>
    )

}

export default TpeSetup;