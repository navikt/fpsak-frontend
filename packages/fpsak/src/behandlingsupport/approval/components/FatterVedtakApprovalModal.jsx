import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Modal from 'sharedComponents/Modal';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import Image from 'sharedComponents/Image';
import behandlingStatus from 'kodeverk/behandlingStatus';
import { getSelectedBehandlingId } from 'behandling/duck';
import {
  getBehandlingIsKlage,
  getBehandlingResultatstruktur,
  getBehandlingsresultat,
  getBehandlingStatus,
  getBehandlingType,
} from 'behandling/behandlingSelectors';
import {
  getBehandlingsresultatFraOriginalBehandling,
  getResultatstrukturFraOriginalBehandling,
} from 'behandling/selectors/originalBehandlingSelectors';
import behandlingResultatType from 'kodeverk/behandlingResultatType';
import behandlingType from 'kodeverk/behandlingType';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import requireProps from 'app/data/requireProps';

import konsekvensForYtelsen from 'kodeverk/konsekvensForYtelsen';
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
  intl: intlShape.isRequired,
  showModal: PropTypes.bool,
};

FatterVedtakApprovalModal.defaultProps = {
  showModal: undefined,
};

const isBehandlingsresultatOpphor = createSelector(
  [getBehandlingsresultat], behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.OPPHOR,
);

const getModalDescriptionTextCode = createSelector([isBehandlingsresultatOpphor, getFagsakYtelseType, getBehandlingIsKlage],
  (isOpphor, ytelseType, isKlage) => {
    if (isKlage) {
      return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
    }
    if (isOpphor) {
      return 'FatterVedtakApprovalModal.ModalDescriptionOpphort';
    }
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'FatterVedtakApprovalModal.ModalDescriptionESApproval' : 'FatterVedtakApprovalModal.ModalDescriptionFPApproval';
  });

const getAltImgTextCode = createSelector(
  [getFagsakYtelseType], ytelseType => (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
    ? 'FatterVedtakApprovalModal.InnvilgetES' : 'FatterVedtakApprovalModal.InnvilgetFP'),
);

const skalVurdereKonsekvensForYtelsen = behandlingsresultat => behandlingsresultat
  && behandlingsresultat.konsekvenserForYtelsen;

const isSameResultAsOriginalBehandling = (
  behandlingTypeKode, behandlingsresultat, beregningResultat, orginaltBehandlingsresultat,
  originaltBeregningResultat,
) => {
  if (behandlingTypeKode !== behandlingType.REVURDERING) {
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
    if (behandlingIsKlage) {
      return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
    } if (isSameResultAsOriginalBehandling(
      behandlingtype.kode, behandlingsresultat, beregningResultat, orginaltBehandlingsresultat,
      originaltBeregningResultat,
    )) {
      return 'FatterVedtakApprovalModal.UendretUtfall';
    } if (behandlingsresultat.type.kode === behandlingResultatType.AVSLATT) {
      return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD ? 'FatterVedtakApprovalModal.IkkeInnvilgetES' : 'FatterVedtakApprovalModal.IkkeInnvilgetFP';
    }
    if (isOpphor) {
      return 'FatterVedtakApprovalModal.OpphortForeldrepenger';
    }
    return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
      ? 'FatterVedtakApprovalModal.InnvilgetEngangsstonad' : 'FatterVedtakApprovalModal.InnvilgetForeldrepenger';
  },
);

const isStatusFatterVedtak = createSelector([getBehandlingStatus], behandlingstatus => behandlingstatus.kode === behandlingStatus.FATTER_VEDTAK);

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.allAksjonspunktApproved) {
    return {
      infoTextCode: 'FatterVedtakApprovalModal.VedtakReturneresTilSaksbehandler',
      altImgTextCode: isStatusFatterVedtak(state) ? getAltImgTextCode(state) : '',
      modalDescriptionTextCode: isStatusFatterVedtak(state) ? getModalDescriptionTextCode(state) : 'FatterVedtakApprovalModal.ModalDescription',
      selectedBehandlingId: getSelectedBehandlingId(state),
      isBehandlingStatusFatterVedtak: getBehandlingStatus(state).kode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
      resolveProsessAksjonspunkterSuccess: state.default.behandlingsprosessContext.resolveProsessAksjonspunkterSuccess,
    };
  }
  return {
    infoTextCode: isStatusFatterVedtak(state) ? getInfoTextCode(state) : '',
    altImgTextCode: isStatusFatterVedtak(state) ? getAltImgTextCode(state) : '',
    modalDescriptionTextCode: isStatusFatterVedtak(state) ? getModalDescriptionTextCode(state) : 'FatterVedtakApprovalModal.ModalDescription',
    selectedBehandlingId: getSelectedBehandlingId(state),
    isBehandlingStatusFatterVedtak: getBehandlingStatus(state).kode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
    resolveProsessAksjonspunkterSuccess: state.default.behandlingsprosessContext.resolveProsessAksjonspunkterSuccess,
  };
};

const reqProp = requireProps(['allAksjonspunktApproved', 'selectedBehandlingId', 'isBehandlingStatusFatterVedtak'])(FatterVedtakApprovalModal);
export default connect(mapStateToProps)(injectIntl(reqProp));
