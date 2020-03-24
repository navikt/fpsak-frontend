import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { behandlingPath } from '../app/paths';
import NoSelectedBehandling from './components/NoSelectedBehandling';
import BehandlingIndex from './BehandlingIndex';
import { getNumBehandlinger } from './selectors/behandlingerSelectors';

interface OwnProps {
  numBehandlinger: number;
}

export const BehandlingerIndex: FunctionComponent<OwnProps> = ({
  numBehandlinger,
}) => (
  <Switch>
    <Route strict path={behandlingPath} component={BehandlingIndex} />
    <Route>
      <NoSelectedBehandling numBehandlinger={numBehandlinger} />
    </Route>
  </Switch>
);

const mapStateToProps = (state) => ({
  numBehandlinger: getNumBehandlinger(state),
});

export default connect(mapStateToProps)(BehandlingerIndex);
