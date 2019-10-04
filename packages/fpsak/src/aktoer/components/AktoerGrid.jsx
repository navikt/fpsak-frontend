import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Lenkepanel from 'nav-frontend-lenkepanel';

import { PersonInfo } from '@fpsak-frontend/person-info';
import { injectKodeverk, pathToFagsak } from '@fpsak-frontend/fp-felles';
import { ElementWrapper } from '@fpsak-frontend/shared-components';

import { getAlleKodeverk } from 'kodeverk/duck';

import styles from './aktoerGrid.less';

export const AktoerGrid = ({ data, getKodeverknavn }) => (
  <ElementWrapper>
    <div className={styles.aktoerContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.column}>
          <PersonInfo person={data.person} medPanel />
        </div>
        <div className={styles.column}>
          {data.fagsaker.length ? data.fagsaker.map((fagsak) => (
            <Lenkepanel
              linkCreator={(props) => (<Link to={pathToFagsak(fagsak.saksnummer)} {...props} />)}
              key={fagsak.saksnummer}
            >
              {getKodeverknavn(fagsak.sakstype)}
              {` (${fagsak.saksnummer}) `}
              {getKodeverknavn(fagsak.status)}
            </Lenkepanel>
          )) : 'Har ingen fagsaker i fpsak'}
        </div>
      </div>
    </div>
  </ElementWrapper>
);

AktoerGrid.propTypes = {
  data: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(AktoerGrid);
