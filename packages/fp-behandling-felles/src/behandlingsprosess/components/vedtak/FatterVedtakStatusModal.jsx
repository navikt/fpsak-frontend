import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { Image } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { requireProps } from '@fpsak-frontend/fp-felles';

import styles from './fatterVedtakStatusModal.less';


const hasOpenAksjonspunktForVedtakUtenTotrinnskontroll = (aksjonspunkter = []) => aksjonspunkter
  .some((ap) => ap.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL);

const isBehandlingsresultatOpphor = (behandlingsresultat) => behandlingsresultat.type.kode === behandlingResultatType.OPPHOR;

const getModalDescriptionTextCode = (behandlingsresultat, aksjonspunkter, ytelseType, behType, isKlageWithKA) => {
  if (isBehandlingsresultatOpphor(behandlingsresultat)) {
    return 'FatterVedtakStatusModal.ModalDescriptionFPOpphort';
  }
  if (hasOpenAksjonspunktForVedtakUtenTotrinnskontroll(aksjonspunkter)) {
    if (ytelseType.kode === FagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakStatusModal.ModalDescriptionES';
    }
    if (ytelseType.kode === FagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakStatusModal.ModalDescriptionSVP';
    }
    return 'FatterVedtakStatusModal.ModalDescriptionFP';
  }
  if (isKlageWithKA) {
    return 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver';
  }
  return behType === BehandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.Sendt';
};

const getAltImgTextCode = (aksjonspunkter, ytelseType, behType, isKlageWithKA) => {
  if (hasOpenAksjonspunktForVedtakUtenTotrinnskontroll(aksjonspunkter)) {
    if (ytelseType.kode === FagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakStatusModal.IkkeInnvilgetES';
    }
    if (ytelseType.kode === FagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakStatusModal.IkkeInnvilgetSVP';
    }
    return 'FatterVedtakStatusModal.IkkeInnvilgetFP';
  }
  if (isKlageWithKA) {
    return 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver';
  }
  return behType === BehandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.Sendt';
};

const getInfoTextCode = (bType, isKlageWithKA) => {
  if (isKlageWithKA) {
    return 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver';
  }
  return bType.kode === BehandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.SendtBeslutter';
};

const isStatusFatterVedtak = (behandlingstatus) => behandlingstatus.kode === BehandlingStatus.FATTER_VEDTAK;
/**
 * FatterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
export class FatterVedtakStatusModal extends Component {
  constructor() {
    super();

    this.showModal = false;
  }

  render() {
    const {
      intl, showModal, closeEvent, isVedtakSubmission, behandlingStatus, behandlingType, isKlageWithKA, aksjonspunkter, fagsakYtelseType,
      behandlingsresultat,
    } = this.props;
    if (showModal !== undefined) {
      this.showModal = showModal;
    } else if (!this.showModal) {
      this.showModal = isVedtakSubmission;
    }

    const isFatterVedtak = isStatusFatterVedtak(behandlingStatus);
    const infoTextCode = isFatterVedtak ? getInfoTextCode(behandlingType, isKlageWithKA) : '';
    const altImgTextCode = isFatterVedtak ? getAltImgTextCode(aksjonspunkter, fagsakYtelseType, behandlingType, isKlageWithKA) : '';
    const modalDescriptionTextCode = isFatterVedtak
      ? getModalDescriptionTextCode(behandlingsresultat, aksjonspunkter, fagsakYtelseType, behandlingType, isKlageWithKA)
      : 'FatterVedtakStatusModal.ModalDescription';

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
            <Image className={styles.image} altCode={altImgTextCode} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id={infoTextCode} />
            </Normaltekst>
            <Normaltekst><FormattedMessage id="FatterVedtakStatusModal.GoToSearchPage" /></Normaltekst>
          </Column>
          <Column xs="2">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={closeEvent}
              autoFocus
            >
              {intl.formatMessage({ id: 'FatterVedtakStatusModal.Ok' })}
            </Hovedknapp>
          </Column>
        </Row>
      </Modal>
    );
  }
}

FatterVedtakStatusModal.propTypes = {
  closeEvent: PropTypes.func.isRequired,
  isVedtakSubmission: PropTypes.bool,
  intl: intlShape.isRequired,
  showModal: PropTypes.bool,
  isKlageWithKA: PropTypes.bool,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
};

FatterVedtakStatusModal.defaultProps = {
  showModal: undefined,
  isVedtakSubmission: false,
  isKlageWithKA: false,
  behandlingsresultat: undefined,
};

export default injectIntl(requireProps(['selectedBehandlingId'])(FatterVedtakStatusModal));
