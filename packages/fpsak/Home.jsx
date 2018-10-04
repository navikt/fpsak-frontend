import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import TestFormIndex from '@fpsak-frontend/form/TestFormIndex';
import MissingPage from '@fpsak-frontend/shared-components/MissingPage';
import FagsakIndex from 'fagsak/FagsakIndex';
import { fagsakPath } from 'app/paths';
import Dashboard from './Dashboard';

import styles from './home.less';

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
      <Route exact path="/" component={Dashboard} />
      <Route strict path={fagsakPath} component={FagsakIndex} />
      {process.env.NODE_ENV === 'development' && [
        <Route key="/testForm" path="/testForm" component={TestFormIndex} />,
      ]
      }
      <Route component={MissingPage} />
    </Switch>
  </div>
);

Home.propTypes = {
  nrOfErrorMessages: PropTypes.number.isRequired,
};

export default Home;
