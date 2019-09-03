import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { NavLink } from 'react-router-dom';
import { Column, Row } from 'nav-frontend-grid';

import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { behandlingIListePropType } from '@fpsak-frontend/prop-types';

import BehandlingMenuIndex from 'behandlingmenu/BehandlingMenuIndex';
import { getAlleKodeverk } from 'kodeverk/duck';
import BehandlingPicker from './BehandlingPicker';

import styles from './fagsakProfile.less';

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
const hasLink = (link) => link && link.saksnr && link.saksnr.verdi && link.behandlingId;
const createLink = (link) => `/fagsak/${link.saksnr.verdi}/behandling/${link.behandlingId}/?punkt=uttak`;

export const FagsakProfile = ({
  saksnummer,
  sakstype,
  fagsakStatus,
  behandlinger,
  selectedBehandlingId,
  showAll,
  toggleShowAll,
  noExistingBehandlinger,
  annenPartLink,
  getKodeverknavn,
}) => (
  <div>
    <Row>
      <Column xs="6">
        <div className={styles.bottomMargin}>
          <Systemtittel>
            {getKodeverknavn(sakstype)}
          </Systemtittel>
        </div>
        <Normaltekst>
          {`${saksnummer} - ${getKodeverknavn(fagsakStatus)}`}
        </Normaltekst>
      </Column>
      <Column xs="6">
        <div className={styles.floatRight}>
          <BehandlingMenuIndex />
          {hasLink(annenPartLink)
            && (
            <div className={styles.topMargin}>
              <Element>
                <NavLink to={createLink(annenPartLink)} target="_blank" onClick={toggleShowAll}>
                  <FormattedMessage id="FagsakProfile.AnnenPartSak" />
                </NavLink>
              </Element>
            </div>
            )}
        </div>
      </Column>
    </Row>
    <BehandlingPicker
      behandlinger={behandlinger}
      saksnummer={saksnummer}
      noExistingBehandlinger={noExistingBehandlinger}
      behandlingId={selectedBehandlingId}
      showAll={showAll}
      toggleShowAll={toggleShowAll}
    />
  </div>
);

FagsakProfile.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  behandlinger: PropTypes.arrayOf(behandlingIListePropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  selectedBehandlingId: PropTypes.number,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
  getKodeverknavn: PropTypes.func.isRequired,
};

FagsakProfile.defaultProps = {
  selectedBehandlingId: null,
  annenPartLink: null,
};

export default injectKodeverk(getAlleKodeverk)(FagsakProfile);
