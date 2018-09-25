import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Column, Row } from 'nav-frontend-grid';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import Modal from '@fpsak-frontend/shared-components/Modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import behandlingStatus from '@fpsak-frontend/kodeverk/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/behandlingType';
import Image from '@fpsak-frontend/shared-components/Image';
import {
  getBehandlingResultatstruktur,
  getBehandlingsresultat,
  getBehandlingStatus,
  getBehandlingType,
} from 'behandling/behandlingSelectors';
import {
  getBehandlingsresultatFraOriginalBehandling,
  getResultatstrukturFraOriginalBehandling,
} from 'behandling/selectors/originalBehandlingSelectors';

import innvilgetImageUrl from 'images/innvilget_valgt.svg';

import styles from './iverksetterVedtakStatusModal.less';


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
      intl, closeEvent, modalTextId, behandlingsresultat, behandlingStatusKode,
      resolveProsessAksjonspunkterSuccess, resolveFaktaAksjonspunkterSuccess,
    } = this.props;
    const rejected = behandlingsresultat
      && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;

    if (!this.showModal && behandlingStatusKode === behandlingStatus.IVERKSETTER_VEDTAK) {
      this.showModal = resolveProsessAksjonspunkterSuccess || resolveFaktaAksjonspunkterSuccess;
    }

    return (
      <Modal
        className={styles.modal}
        isOpen={this.showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({ id: 'IverksetterVedtakStatusModal.ModalDescription' })}
        onRequestClose={closeEvent}
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
  intl: intlShape.isRequired,
  closeEvent: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  resolveFaktaAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape(),
  modalTextId: PropTypes.string.isRequired,
};

IverksetterVedtakStatusModal.defaultProps = {
  behandlingsresultat: undefined,
};


const getIsSameResultAsOriginalBehandling = createSelector(
  [getBehandlingType, getBehandlingsresultat, getBehandlingResultatstruktur,
    getBehandlingsresultatFraOriginalBehandling, getResultatstrukturFraOriginalBehandling],
  (type, behandlingsresultat, resultatstruktur, originalBehandlingsresultat, originaltBeregningResultat) => {
    let sameResult = false;
    if (type.kode === behandlingType.REVURDERING) {
      sameResult = behandlingsresultat && behandlingsresultat.type.kode === originalBehandlingsresultat.type.kode;
      if (sameResult && resultatstruktur && resultatstruktur.antallBarn && behandlingsresultat.type.kode === behandlingResultatType.INNVILGET) {
        sameResult = resultatstruktur && resultatstruktur.antallBarn === originaltBeregningResultat.antallBarn;
      }
    }
    return sameResult;
  },
);


const getModalTextId = createSelector(
  [getFagsakYtelseType, getBehandlingsresultat, getIsSameResultAsOriginalBehandling],
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

const mapStateToProps = state => ({
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingStatusKode: getBehandlingStatus(state).kode,
  resolveProsessAksjonspunkterSuccess: state.default.behandlingsprosessContext.resolveProsessAksjonspunkterSuccess,
  resolveFaktaAksjonspunkterSuccess: state.default.faktaContext.resolveFaktaAksjonspunkterSuccess,
  modalTextId: getModalTextId(state),

});

export default connect(mapStateToProps)(injectIntl(IverksetterVedtakStatusModal));
