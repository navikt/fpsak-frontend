import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Image } from '@fpsak-frontend/shared-components';

import { getFagsakYtelseType } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { getResolveProsessAksjonspunkterSuccess } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/duckBpForstegangOgRev';
import { getResolveFaktaAksjonspunkterSuccess } from 'behandlingForstegangOgRevurdering/src/fakta/duckFaktaForstegangOgRev';
import { getBehandlingResultatstruktur } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  getBehandlingsresultatFraOriginalBehandling,
  getResultatstrukturFraOriginalBehandling,
} from 'behandlingForstegangOgRevurdering/src/selectors/originalBehandlingSelectors';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import styles from './iverksetterVedtakStatusModal.less';

// TODO (TOR) Bør denne slåast i saman med komponent med same navn i fp-behandling-felles?

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
class IverksetterVedtakStatusModal extends Component {
  constructor() {
    super();
    this.showModal = false;
  }

  render() {
    const {
      intl, closeEvent, modalTextId, behandlingsresultat, isVedtakSubmission,
    } = this.props;
    const rejected = behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;

    if (!this.showModal && isVedtakSubmission) {
      this.showModal = isVedtakSubmission;
    }

    return (
      <Modal
        className={styles.modal}
        isOpen={this.showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({ id: 'IverksetterVedtakStatusModal.ModalDescription' })}
        onRequestClose={closeEvent}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 3000 } }}
      >
        <Row>
          <Column xs="1">
            <Image
              className={styles.image}
              altCode={rejected ? 'IverksetterVedtakStatusModal.Avslatt' : 'IverksetterVedtakStatusModal.Innvilget'}
              src={innvilgetImageUrl}
            />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id={modalTextId} />
            </Normaltekst>
            <Normaltekst>
              <FormattedMessage id="IverksetterVedtakStatusModal.GoToSearchPage" />
            </Normaltekst>
          </Column>
          <Column xs="2">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={closeEvent}
              autoFocus
            >
              {intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Ok' })}
            </Hovedknapp>
          </Column>

        </Row>
      </Modal>
    );
  }
}

IverksetterVedtakStatusModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  closeEvent: PropTypes.func.isRequired,
  behandlingsresultat: PropTypes.shape(),
  modalTextId: PropTypes.string.isRequired,
  isVedtakSubmission: PropTypes.bool,
};

IverksetterVedtakStatusModal.defaultProps = {
  behandlingsresultat: undefined,
  isVedtakSubmission: false,
};

const erSammeResultatPåEngangsstønad = (behandlingsresultat,
  originalBehandlingsresultat,
  originaltBeregningResultat,
  resultatstruktur) => {
  const sameResult = behandlingsresultat && behandlingsresultat.type.kode === originalBehandlingsresultat.type.kode;
  if (sameResult && resultatstruktur && resultatstruktur.antallBarn && behandlingsresultat.type.kode === behandlingResultatType.INNVILGET) {
    return resultatstruktur.antallBarn === originaltBeregningResultat.antallBarn;
  }
  return false;
};

const erSammeResultatForForeldrepenger = (behandlingsresultat) => {
  if (!behandlingsresultat || !behandlingsresultat.konsekvensForYtelsen) {
    return false;
  }
  return behandlingsresultat.konsekvensForYtelsen.map(({ kode }) => kode).includes(konsekvensForYtelsen.INGEN_ENDRING);
};

const getIsSameResultAsOriginalBehandling = createSelector(
  [behandlingSelectors.getBehandlingType, behandlingSelectors.getBehandlingsresultat, getBehandlingResultatstruktur,
    getBehandlingsresultatFraOriginalBehandling, getResultatstrukturFraOriginalBehandling, getFagsakYtelseType],
  (type, behandlingsresultat, resultatstruktur, originalBehandlingsresultat, originaltBeregningResultat, ytelseType) => {
    if (type !== behandlingType.REVURDERING) {
      return false;
    }
    if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
      return erSammeResultatPåEngangsstønad(behandlingsresultat, originalBehandlingsresultat, originaltBeregningResultat, resultatstruktur);
    }
    if (ytelseType === fagsakYtelseType.FORELDREPENGER) {
      return erSammeResultatForForeldrepenger(behandlingsresultat);
    }
    return false;
  },
);


const getModalTextId = createSelector(
  [getFagsakYtelseType, behandlingSelectors.getBehandlingsresultat, getIsSameResultAsOriginalBehandling],
  (ytelseType, behandlingsresultat, isSameResultAsOriginalBehandling) => {
    if (isSameResultAsOriginalBehandling) {
      return 'IverksetterVedtakStatusModal.UendretUtfall';
    }
    if (!(behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT)) {
      return 'IverksetterVedtakStatusModal.InnvilgetOgIverksatt';
    }
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'IverksetterVedtakStatusModal.AvslattOgIverksattES' : 'IverksetterVedtakStatusModal.AvslattOgIverksattFP';
  },
);

const mapStateToProps = (state) => ({
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  resolveFaktaAksjonspunkterSuccess: getResolveFaktaAksjonspunkterSuccess(state),
  modalTextId: getModalTextId(state),
});

export default connect(mapStateToProps)(injectIntl(IverksetterVedtakStatusModal));
