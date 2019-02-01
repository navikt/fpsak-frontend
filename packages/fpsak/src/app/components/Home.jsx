import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import FagsakIndex from 'fagsak/FagsakIndex';
import { aktoerPath, fagsakPath } from 'app/paths';

import DashboardResolver from './DashboardResolver';
import MissingPage from './MissingPage';

import styles from './home.less';
import AktoerIndex from '../../aktoer/AktoerIndex';


/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({
  nrOfErrorMessages,
}) => (
  <div className={styles[`content_${nrOfErrorMessages > 5 ? 5 : nrOfErrorMessages}`]}>
    <Switch>
      <Route exact path="/" component={DashboardResolver} />
      <Route strict path={fagsakPath} component={FagsakIndex} />
      <Route strict path={aktoerPath} component={AktoerIndex} />
      <Route component={MissingPage} />
    </Switch>
  </div>
);

Home.propTypes = {
  nrOfErrorMessages: PropTypes.number.isRequired,
};

export default Home;
