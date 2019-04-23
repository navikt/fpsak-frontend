import { combineReducers } from 'redux';

import { reduxRestApi } from 'data/fpLosApi';
import errorHandler from 'data/error-api-redux';
import { appReducer as appContext } from 'app/duck';
import { formReducer as formContext } from 'form/reduxBinding/formDuck';
import { behandlingskoerReducer as behandlingskoerContext } from 'saksbehandler/behandlingskoer/duck';

export default combineReducers({
  appContext,
  formContext,
  behandlingskoerContext,
  [errorHandler.getErrorReducerName()]: errorHandler.getErrorReducer(),
  dataContext: reduxRestApi.getDataReducer(),
});
