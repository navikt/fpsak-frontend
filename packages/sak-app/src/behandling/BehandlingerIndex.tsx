import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { Fagsak } from '@fpsak-frontend/types';

import { behandlingPath } from '../app/paths';
import NoSelectedBehandling from './components/NoSelectedBehandling';
import BehandlingIndex from './BehandlingIndex';
import { getNumBehandlinger } from './selectors/behandlingerSelectors';

interface OwnProps {
  fagsak: Fagsak;
  numBehandlinger: number;
}

export const BehandlingerIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  numBehandlinger,
}) => (
  <Switch>
    <Route strict path={behandlingPath} render={(props) => <BehandlingIndex {...props} fagsak={fagsak} />} />
    <Route>
      <NoSelectedBehandling numBehandlinger={numBehandlinger} />
    </Route>
  </Switch>
);

const mapStateToProps = (state) => ({
  numBehandlinger: getNumBehandlinger(state),
});

export default connect(mapStateToProps)(BehandlingerIndex);
