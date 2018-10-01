import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';

import { behandlingPath } from 'app/paths';
import PersonIndex from '@fpsak-frontend/person/PersonIndex';

import NoSelectedBehandling from './components/NoSelectedBehandling';
import BehandlingIndex from './BehandlingIndex';
import { getNumBehandlinger } from './selectors/behandlingerSelectors';

export const BehandlingerIndex = ({ numBehandlinger }) => (
  <Switch>
    <Route strict path={behandlingPath} component={BehandlingIndex} />
    <Route>
      <ElementWrapper>
        <PersonIndex medPanel />
        <NoSelectedBehandling numBehandlinger={numBehandlinger} />
      </ElementWrapper>
    </Route>
  </Switch>
);

BehandlingerIndex.propTypes = {
  numBehandlinger: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({ numBehandlinger: getNumBehandlinger(state) });

export default connect(mapStateToProps)(BehandlingerIndex);
