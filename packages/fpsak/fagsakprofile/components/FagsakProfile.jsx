import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Systemtittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { NavLink } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';

import { Panel } from 'nav-frontend-paneler';

import behandlingPropType from 'behandling/proptypes/behandlingPropType';
import BehandlingMenuIndex from 'behandlingmenu/BehandlingMenuIndex';

import BehandlingPicker from './BehandlingPicker';

import styles from './fagsakProfile.less';

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
const hasLink = link => link && link.saksnr && link.saksnr.verdi && link.behandlingId;
const createLink = link => `/fagsak/${link.saksnr.verdi}/behandling/${link.behandlingId}/?punkt=uttak`;

const FagsakProfile = ({
  saksnummer,
  sakstype,
  fagsakStatus,
  behandlinger,
  selectedBehandlingId,
  showAll,
  toggleShowAll,
  noExistingBehandlinger,
  annenPartLink,
}) => (
  <Panel className={styles.panelPadding}>
    <Row>
      <Column xs="6">
        <div className={styles.bottomMargin}>
          <Systemtittel>
            {sakstype.navn}
          </Systemtittel>
        </div>
        <Normaltekst>
          {`${saksnummer} - ${fagsakStatus.navn}`}
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
            )
          }
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
  </Panel>
);

FagsakProfile.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  behandlinger: PropTypes.arrayOf(behandlingPropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  selectedBehandlingId: PropTypes.number,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
};

FagsakProfile.defaultProps = {
  selectedBehandlingId: null,
  annenPartLink: null,
};

export default FagsakProfile;
