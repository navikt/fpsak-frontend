import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import { NotFoundPage } from '@fpsak-frontend/sak-feilsider';

import { aktoerPath, fagsakPath } from '../paths';
import FagsakIndex from '../../fagsak/FagsakIndex';
import AktoerIndex from '../../aktoer/AktoerIndex';
import DashboardResolver from './DashboardResolver';

import styles from './home.less';

interface OwnProps {
  headerHeight: number;
}

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home: FunctionComponent<OwnProps> = ({
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

export default Home;
