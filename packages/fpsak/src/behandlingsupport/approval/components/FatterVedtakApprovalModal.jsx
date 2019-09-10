import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Image } from '@fpsak-frontend/shared-components';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';

import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import {
  getBehandlingIsKlage,
  getBehandlingKlageVurderingResultatNK,
  getBehandlingResultatstruktur,
  getBehandlingsresultat,
  getBehandlingsresultatFraOriginalBehandling,
  getBehandlingStatus,
  getBehandlingType,
  getResultatstrukturFraOriginalBehandling,
  getSelectedBehandlingId,
} from 'behandling/duck';
import { requireProps } from '@fpsak-frontend/fp-felles';
import { getApproveFinished } from '../duck';


import styles from './fatterVedtakApprovalModal.less';

/**
 * FatterVedtakApprovalModal
 *
 * Presentasjonskomponent. Denne modalen vises en lightbox etter at en beslutter har godkjent alle aksjonspunkter
 * med totrinnskontroll. Ved å trykke på knapp blir beslutter tatt tilbake til sokesiden.
 */
export class FatterVedtakApprovalModal extends Component {
  constructor() {
    super();

    this.showModal = false;
  }

  render() {
    const {
      showModal, closeEvent, infoTextCode, altImgTextCode, resolveProsessAksjonspunkterSuccess, intl, modalDescriptionTextCode,
    } = this.props;
    if (showModal !== undefined) {
      this.showModal = showModal;
    } else if (!this.showModal) {
      this.showModal = resolveProsessAksjonspunkterSuccess;
    }

    return (
      <Modal
        className={styles.modal}
        isOpen={this.showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({ id: modalDescriptionTextCode })}
        onRequestClose={closeEvent}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        style={{ overlay: { zIndex: 3000 } }}
      >
        <Row>
          <Column xs="1">
            <Image className={styles.image} alt={intl.formatMessage({ id: altImgTextCode })} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id={infoTextCode} />
            </Normaltekst>
            <Normaltekst><FormattedMessage id="FatterVedtakApprovalModal.GoToSearchPage" /></Normaltekst>
          </Column>
          <Column xs="2">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={closeEvent}
              autoFocus
            >
              {intl.formatMessage({ id: 'FatterVedtakApprovalModal.Ok' })}
            </Hovedknapp>
          </Column>
        </Row>
      </Modal>
    );
  }
}

FatterVedtakApprovalModal.propTypes = {
  closeEvent: PropTypes.func.isRequired,
  infoTextCode: PropTypes.string.isRequired,
  altImgTextCode: PropTypes.string.isRequired,
  modalDescriptionTextCode: PropTypes.string.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  showModal: PropTypes.bool,
};

FatterVedtakApprovalModal.defaultProps = {
  showModal: undefined,
};

export const isKlageWithKA = (klageVurderingResultatNK) => {
  const meholdIKlageAvNK = klageVurderingResultatNK;
  return meholdIKlageAvNK;
};

const isBehandlingsresultatOpphor = createSelector(
  [getBehandlingsresultat], (behandlingsresultat) => behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.OPPHOR,
);

const getModalDescriptionTextCode = createSelector([isBehandlingsresultatOpphor, getFagsakYtelseType, getBehandlingIsKlage],
  (isOpphor, ytelseType, isKlage) => {
    if (isKlage) {
      if (isKlageWithKA(getBehandlingKlageVurderingResultatNK)) {
        return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
      }
      return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
    }
    if (isOpphor) {
      return 'FatterVedtakApprovalModal.ModalDescriptionOpphort';
    }
    if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakApprovalModal.ModalDescriptionESApproval';
    }
    if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakApprovalModal.ModalDescriptionSVPApproval';
    }
    return 'FatterVedtakApprovalModal.ModalDescriptionFPApproval';
  });

const getAltImgTextCode = createSelector(
  [getFagsakYtelseType], (ytelseType) => (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
    ? 'FatterVedtakApprovalModal.InnvilgetES' : 'FatterVedtakApprovalModal.InnvilgetFP'),
);

const skalVurdereKonsekvensForYtelsen = (behandlingsresultat) => behandlingsresultat
  && behandlingsresultat.konsekvenserForYtelsen;

const isSameResultAsOriginalBehandling = (
  behandlingTypeKode, behandlingsresultat, beregningResultat, orginaltBehandlingsresultat,
  originaltBeregningResultat,
) => {
  if (behandlingTypeKode !== BehandlingType.REVURDERING) {
    return false;
  }
  if (skalVurdereKonsekvensForYtelsen(behandlingsresultat)) {
    return behandlingsresultat.konsekvenserForYtelsen.map(({ kode }) => kode).includes(konsekvensForYtelsen.INGEN_ENDRING);
  }
  const sameResult = behandlingsresultat && behandlingsresultat.type.kode === orginaltBehandlingsresultat.type.kode;
  if (sameResult && behandlingsresultat.type.kode === behandlingResultatType.INNVILGET) {
    return beregningResultat && beregningResultat.antallBarn === originaltBeregningResultat.antallBarn;
  }
  return sameResult;
};

const getInfoTextCode = createSelector(
  [getBehandlingType, getBehandlingsresultat, getBehandlingResultatstruktur, getBehandlingsresultatFraOriginalBehandling,
    getResultatstrukturFraOriginalBehandling, getBehandlingIsKlage,
    getFagsakYtelseType, isBehandlingsresultatOpphor],
  (
    behandlingtype, behandlingsresultat, beregningResultat, orginaltBehandlingsresultat, originaltBeregningResultat, behandlingIsKlage,
    ytelseType, isOpphor,
  ) => {
    if (behandlingtype.kode === BehandlingType.TILBAKEKREVING) {
      return 'FatterVedtakApprovalModal.Tilbakekreving';
    }
    if (behandlingIsKlage) {
      if (isKlageWithKA(getBehandlingKlageVurderingResultatNK)) {
        return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
      }
      return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
    }
    if (isSameResultAsOriginalBehandling(
      behandlingtype.kode, behandlingsresultat, beregningResultat, orginaltBehandlingsresultat,
      originaltBeregningResultat,
    )) {
      return 'FatterVedtakApprovalModal.UendretUtfall';
    }
    if (behandlingsresultat.type.kode === behandlingResultatType.AVSLATT) {
      if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
        return 'FatterVedtakApprovalModal.IkkeInnvilgetES';
      }
      if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
        return 'FatterVedtakApprovalModal.IkkeInnvilgetSVP';
      }
      return 'FatterVedtakApprovalModal.IkkeInnvilgetFP';
    }
    if (isOpphor) {
      return 'FatterVedtakApprovalModal.OpphortForeldrepenger';
    }
    if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakApprovalModal.InnvilgetEngangsstonad';
    }
    if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakApprovalModal.InnvilgetSvangerskapspenger';
    }
    return 'FatterVedtakApprovalModal.InnvilgetForeldrepenger';
  },
);

const isStatusFatterVedtak = createSelector([getBehandlingStatus], (behandlingstatus) => behandlingstatus.kode === behandlingStatus.FATTER_VEDTAK);

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.allAksjonspunktApproved) {
    return {
      infoTextCode: 'FatterVedtakApprovalModal.VedtakReturneresTilSaksbehandler',
      altImgTextCode: isStatusFatterVedtak(state) ? getAltImgTextCode(state) : '',
      modalDescriptionTextCode: isStatusFatterVedtak(state) ? getModalDescriptionTextCode(state) : 'FatterVedtakApprovalModal.ModalDescription',
      selectedBehandlingId: getSelectedBehandlingId(state),
      isBehandlingStatusFatterVedtak: getBehandlingStatus(state).kode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
      resolveProsessAksjonspunkterSuccess: getApproveFinished(state),
    };
  }
  return {
    infoTextCode: isStatusFatterVedtak(state) ? getInfoTextCode(state) : '',
    altImgTextCode: isStatusFatterVedtak(state) ? getAltImgTextCode(state) : '',
    modalDescriptionTextCode: isStatusFatterVedtak(state) ? getModalDescriptionTextCode(state) : 'FatterVedtakApprovalModal.ModalDescription',
    selectedBehandlingId: getSelectedBehandlingId(state),
    isBehandlingStatusFatterVedtak: getBehandlingStatus(state).kode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
    resolveProsessAksjonspunkterSuccess: getApproveFinished(state),
  };
};

const reqProp = requireProps(['allAksjonspunktApproved', 'selectedBehandlingId', 'isBehandlingStatusFatterVedtak'])(FatterVedtakApprovalModal);
export default connect(mapStateToProps)(injectIntl(reqProp));
