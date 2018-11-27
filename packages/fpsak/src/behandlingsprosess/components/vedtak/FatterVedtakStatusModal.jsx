import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Modal from 'sharedComponents/Modal';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import Image from 'sharedComponents/Image';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import behandlingStatus from 'kodeverk/behandlingStatus';
import { getSelectedBehandlingId } from 'behandling/duck';
import { getBehandlingStatus, getBehandlingsresultat, getAksjonspunkter } from 'behandling/behandlingSelectors';
import behandlingResultatType from 'kodeverk/behandlingResultatType';
import innvilgetImageUrl from 'images/innvilget_valgt.svg';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import requireProps from 'app/data/requireProps';

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
      intl, showModal, closeEvent, infoTextCode, altImgTextCode, resolveProsessAksjonspunkterSuccess, modalDescriptionTextCode,
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
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  showModal: PropTypes.bool,
};

FatterVedtakStatusModal.defaultProps = {
  showModal: undefined,
};

const hasOpenAksjonspunktForVedtakUtenTotrinnskontroll = createSelector(
  [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL),
);

const isBehandlingsresultatOpphor = createSelector(
  [getBehandlingsresultat], behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.OPPHOR,
);

const getModalDescriptionTextCode = createSelector(
  [isBehandlingsresultatOpphor, hasOpenAksjonspunktForVedtakUtenTotrinnskontroll, getFagsakYtelseType],
  (isOpphor, hasOpenAksjonspunkter, ytelseType) => {
    if (isOpphor) {
      return 'FatterVedtakStatusModal.ModalDescriptionFPOpphort';
    } if (hasOpenAksjonspunkter) {
      return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
        ? 'FatterVedtakStatusModal.ModalDescriptionES'
        : 'FatterVedtakStatusModal.ModalDescriptionFP';
    }
    return 'FatterVedtakStatusModal.ModalDescription';
  },
);


const getAltImgTextCode = createSelector(
  [hasOpenAksjonspunktForVedtakUtenTotrinnskontroll, getFagsakYtelseType],
  (hasOpenAksjonspunkter, ytelseType) => {
    if (hasOpenAksjonspunkter) {
      return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
        ? 'FatterVedtakStatusModal.IkkeInnvilgetES'
        : 'FatterVedtakStatusModal.IkkeInnvilgetFP';
    }
    return 'FatterVedtakStatusModal.Sendt';
  },
);


const isStatusFatterVedtak = createSelector([getBehandlingStatus], behandlingstatus => behandlingstatus.kode === behandlingStatus.FATTER_VEDTAK);

const mapStateToProps = state => ({
  selectedBehandlingId: getSelectedBehandlingId(state),
  isBehandlingStatusFatterVedtak: getBehandlingStatus(state).kode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
  infoTextCode: isStatusFatterVedtak(state) ? 'FatterVedtakStatusModal.SendtBeslutter' : '',
  altImgTextCode: isStatusFatterVedtak(state) ? getAltImgTextCode(state) : '',
  modalDescriptionTextCode: isStatusFatterVedtak(state) ? getModalDescriptionTextCode(state) : 'FatterVedtakStatusModal.ModalDescription',
  resolveProsessAksjonspunkterSuccess: state.default.behandlingsprosessContext.resolveProsessAksjonspunkterSuccess,
});

export default connect(mapStateToProps)(injectIntl(requireProps(['selectedBehandlingId', 'isBehandlingStatusFatterVedtak'])(FatterVedtakStatusModal)));
