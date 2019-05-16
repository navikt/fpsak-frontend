import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { requireProps } from '@fpsak-frontend/fp-felles';

import styles from './fatterVedtakStatusModal.less';

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
      intl, showModal, closeEvent, infoTextCode, altImgTextCode, isVedtakSubmission, modalDescriptionTextCode,
    } = this.props;
    if (showModal !== undefined) {
      this.showModal = showModal;
    } else if (!this.showModal) {
      this.showModal = isVedtakSubmission;
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
  infoTextCode: PropTypes.string.isRequired,
  altImgTextCode: PropTypes.string.isRequired,
  modalDescriptionTextCode: PropTypes.string.isRequired,
  isVedtakSubmission: PropTypes.bool,
  intl: intlShape.isRequired,
  showModal: PropTypes.bool,
};

FatterVedtakStatusModal.defaultProps = {
  showModal: undefined,
  isVedtakSubmission: false,
};

const hasOpenAksjonspunktForVedtakUtenTotrinnskontroll = (aksjonspunkter = []) => aksjonspunkter
  .some(ap => ap.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL);

const isBehandlingsresultatOpphor = behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.OPPHOR;

const getModalDescriptionTextCode = (behandlingsresultat, aksjonspunkter, ytelseType, behType) => {
  if (isBehandlingsresultatOpphor(behandlingsresultat)) {
    return 'FatterVedtakStatusModal.ModalDescriptionFPOpphort';
  }
  if (hasOpenAksjonspunktForVedtakUtenTotrinnskontroll(aksjonspunkter)) {
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'FatterVedtakStatusModal.ModalDescriptionES'
      : 'FatterVedtakStatusModal.ModalDescriptionFP';
  }
  return behType === behandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.Sendt';
};

const getAltImgTextCode = (aksjonspunkter, ytelseType, behType) => {
  if (hasOpenAksjonspunktForVedtakUtenTotrinnskontroll(aksjonspunkter)) {
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'FatterVedtakStatusModal.IkkeInnvilgetES'
      : 'FatterVedtakStatusModal.IkkeInnvilgetFP';
  }
  return behType === behandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.Sendt';
};

const getInfoTextCode = bType => (bType.kode === behandlingType.KLAGE
  ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.SendtBeslutter');

const isStatusFatterVedtak = behandlingstatus => behandlingstatus.kode === behandlingStatus.FATTER_VEDTAK;

// TODO (TOR) Hentar ingenting fra state - fjern connect
const mapStateToPropsFactory = (initialState, ownProps) => {
  const isFatterVedtak = isStatusFatterVedtak(ownProps.behandlingStatus);
  const isBehandlingStatusFatterVedtak = ownProps.behandlingStatus.kode === behandlingStatus.FATTER_VEDTAK ? true : undefined;
  const infoTextCode = isFatterVedtak ? getInfoTextCode(ownProps.behandlingType) : '';
  const altImgTextCode = isFatterVedtak ? getAltImgTextCode(ownProps.aksjonspunkter, ownProps.fagsakYtelseType, ownProps.behandlingType) : '';
  const modalDescriptionTextCode = isFatterVedtak
      ? getModalDescriptionTextCode(ownProps.behandlingsresultat, ownProps.aksjonspunkter, ownProps.fagsakYtelseType, ownProps.behandlingType)
      : 'FatterVedtakStatusModal.ModalDescription';
  return () => ({
    isBehandlingStatusFatterVedtak,
    infoTextCode,
    altImgTextCode,
    modalDescriptionTextCode,
  });
};


export default connect(mapStateToPropsFactory)(injectIntl(requireProps(['selectedBehandlingId', 'isBehandlingStatusFatterVedtak'])(FatterVedtakStatusModal)));
