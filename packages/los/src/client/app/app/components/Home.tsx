import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import MissingPage from './MissingPage';

import 'styles/modigDesign.less';
import '../../../nomodulestyles/global.less';

import styles from './home.less';

type TsProps = Readonly<{
  nrOfErrorMessages: number;
}>

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home = ({
  nrOfErrorMessages,
}: TsProps) => (
  <div className={styles[`content_${nrOfErrorMessages > 5 ? 5 : nrOfErrorMessages}`]}>
    <Switch>
      <Route exact path="/" component={SaksbehandlerIndex} />
      <Route component={MissingPage} />
    </Switch>
  </div>
);

Home.propTypes = {
  nrOfErrorMessages: PropTypes.number.isRequired,
};

export default Home;
