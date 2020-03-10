import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Lenkepanel from 'nav-frontend-lenkepanel';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';

import { getAlleFpSakKodeverk } from '../../kodeverk/duck';
import { pathToFagsak } from '../../app/paths';
import { getBehandlingSprak } from '../../behandling/duck';

import styles from './aktoerGrid.less';

export const AktoerGrid = ({
  data,
  alleKodeverk,
  sprakkode,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      <VisittkortSakIndex
        alleKodeverk={alleKodeverk}
        sprakkode={sprakkode}
        fagsak={{
          person: data.person,
        }}
      />
      <div className={styles.list}>
        {data.fagsaker.length ? data.fagsaker.map((fagsak) => (
          <Lenkepanel
            linkCreator={(props) => (<Link to={pathToFagsak(fagsak.saksnummer)} {...props} />)}
            key={fagsak.saksnummer}
            href="#"
          >
            {getKodeverknavn(fagsak.sakstype)}
            {` (${fagsak.saksnummer}) `}
            {getKodeverknavn(fagsak.status)}
          </Lenkepanel>
        )) : <FormattedMessage id="AktoerGrid.IngenFagsaker" />}
      </div>
    </>
  );
};

AktoerGrid.propTypes = {
  data: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape(),
};

AktoerGrid.defaultProps = {
  sprakkode: undefined,
};

const mapStateToProps = (state) => ({
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(AktoerGrid);
