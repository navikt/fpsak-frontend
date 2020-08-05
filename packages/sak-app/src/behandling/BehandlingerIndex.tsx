import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Fagsak } from '@fpsak-frontend/types';

import BehandlingAppKontekst from './behandlingAppKontekstTsType';
import { behandlingPath } from '../app/paths';
import NoSelectedBehandling from './components/NoSelectedBehandling';
import BehandlingIndex from './BehandlingIndex';

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
}

export const BehandlingerIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
}) => (
  <Switch>
    <Route strict path={behandlingPath} render={(props) => <BehandlingIndex {...props} fagsak={fagsak} alleBehandlinger={alleBehandlinger} />} />
    <Route>
      <NoSelectedBehandling numBehandlinger={alleBehandlinger.length} />
    </Route>
  </Switch>
);

export default BehandlingerIndex;
