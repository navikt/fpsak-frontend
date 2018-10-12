import { combineReducers } from 'redux';
import { fagsakReducer as fagsakContext } from 'fagsak/duck';
import { fagsakProfileReducer as fagsakProfileContext } from 'fagsakprofile/duck';
import { behandlingReducer as behandlingContext } from 'behandling/duck';
import { behandlingMenuReducer as behandlingMenuContext } from 'behandlingmenu/duck';
import { behandlingsprosessReducer as behandlingsprosessContext } from 'behandlingsprosess/duck';
import { behandlingSupportReducer as behandlingSupportContext } from 'behandlingsupport/duck';
import { faktaReducer as faktaContext } from 'fakta/duck';
import { papirsoknadReducer as papirsoknadContext } from '@fpsak-frontend/papirsoknad/duck';
import { dataReducer as dataContext } from '@fpsak-frontend/data/duck';
import { errorHandlingReducer as errorHandlingContext } from '@fpsak-frontend/data/error/duck';

export default combineReducers({
  errorHandlingContext,
  fagsakContext,
  fagsakProfileContext,
  behandlingContext,
  behandlingMenuContext,
  behandlingsprosessContext,
  behandlingSupportContext,
  faktaContext,
  papirsoknadContext,
  dataContext,
});
