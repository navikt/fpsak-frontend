import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { behandlingPath, PersonIndex } from '@fpsak-frontend/fp-felles';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { getFagsakPerson } from 'fagsak/fagsakSelectors';
import NoSelectedBehandling from './components/NoSelectedBehandling';
import BehandlingIndex from './BehandlingIndex';
import { getNumBehandlinger } from './selectors/behandlingerSelectors';

export const BehandlingerIndex = ({
  numBehandlinger,
  person,
}) => (
  <Switch>
    <Route strict path={behandlingPath} component={BehandlingIndex} />
    <Route>
      <ElementWrapper>
        <PersonIndex medPanel person={person} />
        <NoSelectedBehandling numBehandlinger={numBehandlinger} />
      </ElementWrapper>
    </Route>
  </Switch>
);

BehandlingerIndex.propTypes = {
  numBehandlinger: PropTypes.number.isRequired,
  person: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  numBehandlinger: getNumBehandlinger(state),
  person: getFagsakPerson(state),
});

export default connect(mapStateToProps)(BehandlingerIndex);
