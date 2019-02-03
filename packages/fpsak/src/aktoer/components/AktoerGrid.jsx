import React from 'react';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import PropTypes from 'prop-types';
import { PersonInfo } from '@fpsak-frontend/person-info';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { pathToFagsak } from '@fpsak-frontend/fp-felles';
import { Link } from 'react-router-dom';
import styles from './aktoerGrid.less';

export const AktoerGrid = ({ data }) => (
  <ElementWrapper>
    <div className={styles.aktoerContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.column}>
          <PersonInfo person={data.person} medPanel />
        </div>
        <div className={styles.column}>
          {data.fagsaker.length ? data.fagsaker.map(fagsak => (
            <Lenkepanel
              linkCreator={props => (<Link to={pathToFagsak(fagsak.saksnummer)} {...props} />)}
              key={fagsak.saksnummer}
            >
              {fagsak.sakstype.navn}
              {' ('}
              {fagsak.saksnummer}
              {') '}
              {fagsak.status.navn}
            </Lenkepanel>
          )) : 'Har ingen fagsaker i fpsak'}
        </div>
      </div>
    </div>
  </ElementWrapper>
);

AktoerGrid.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default AktoerGrid;
