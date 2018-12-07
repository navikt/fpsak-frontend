import { combineReducers } from 'redux';

import { errorHandlingReducer as errorHandlingContext } from 'app/duck';
import { fagsakReducer as fagsakContext } from 'fagsak/duck';
import { fagsakProfileReducer as fagsakProfileContext } from 'fagsakprofile/duck';
import { behandlingMenuReducer as behandlingMenuContext } from 'behandlingmenu/duck';
import { behandlingSupportReducer as behandlingSupportContext } from 'behandlingsupport/duck';

// TODO (TOR) dynamisk init og rydding av reducers
import { behandlingReducer as behandlingContext } from 'behandlingFpsak/duck';
import { behandlingsprosessReducer as behandlingsprosessContext } from 'behandlingFpsak/behandlingsprosess/duck';
import { faktaReducer as faktaContext } from 'behandlingFpsak/fakta/duck';
import { tilbakekrevingBehandlingReducer as tilbakekrevingBehandlingContext } from 'behandlingTilbakekreving/duck';
import {
  tilbakekrevingBehandlingsprosessReducer as tilbakekrevingBehandlingsprosessContext,
} from 'behandlingTilbakekreving/behandlingsprosess/duck';
import { tilbakekrevingFaktaReducer as tilbakekrevingFaktaContext } from 'behandlingTilbakekreving/fakta/duck';
import { papirsoknadReducer as papirsoknadContext } from 'papirsoknad/duck';
import fpsakApi from 'data/fpsakApi';
import fpsakBehandlingApi from 'behandlingFpsak/data/fpsakBehandlingApi';
import tilbakekrevingBehandlingApi from 'behandlingTilbakekreving/tilbakekrevingBehandlingApi';

export default combineReducers({
  errorHandlingContext,
  fagsakContext,
  fagsakProfileContext,
  behandlingContext,
  tilbakekrevingBehandlingContext,
  tilbakekrevingBehandlingsprosessContext,
  tilbakekrevingFaktaContext,
  behandlingMenuContext,
  behandlingsprosessContext,
  behandlingSupportContext,
  faktaContext,
  papirsoknadContext,
  dataContext: fpsakApi.getDataReducer(),
  dataFpsakBehandlingContext: fpsakBehandlingApi.getDataReducer(),
  dataTilbakekrevingBehandlingContext: tilbakekrevingBehandlingApi.getDataReducer(),
});
