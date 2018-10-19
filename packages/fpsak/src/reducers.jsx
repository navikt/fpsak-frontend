import { combineReducers } from 'redux';

import { errorHandlingReducer as errorHandlingContext } from 'app/duck';
import { fagsakReducer as fagsakContext } from 'fagsak/duck';
import { fagsakProfileReducer as fagsakProfileContext } from 'fagsakprofile/duck';
import { behandlingReducer as behandlingContext } from 'behandling/duck';
import { behandlingMenuReducer as behandlingMenuContext } from 'behandlingmenu/duck';
import { behandlingsprosessReducer as behandlingsprosessContext } from 'behandlingsprosess/duck';
import { behandlingSupportReducer as behandlingSupportContext } from 'behandlingsupport/duck';
import { faktaReducer as faktaContext } from 'fakta/duck';
import { papirsoknadReducer as papirsoknadContext } from 'papirsoknad/duck';
import { dataReducer as dataContext } from 'data/duck';

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
