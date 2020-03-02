import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import { aktoerPath, fagsakPath } from '@fpsak-frontend/fp-felles';
import { NotFoundPage } from '@fpsak-frontend/sak-feilsider';

import FagsakIndex from '../../fagsak/FagsakIndex';
import AktoerIndex from '../../aktoer/AktoerIndex';
import DashboardResolver from './DashboardResolver';

import styles from './home.less';

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({
  headerHeight,
}) => (
  <div className={styles.content} style={{ margin: `${headerHeight}px auto 0` }}>
    <Switch>
      <Route exact path="/" component={DashboardResolver} />
      <Route strict path={fagsakPath} component={FagsakIndex} />
      <Route strict path={aktoerPath} component={AktoerIndex} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

Home.propTypes = {
  headerHeight: PropTypes.number.isRequired,
};

export default Home;
