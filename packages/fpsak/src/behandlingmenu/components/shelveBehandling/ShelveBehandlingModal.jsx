import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formValueSelector, reduxForm } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { Fieldset } from 'nav-frontend-skjema';
import { injectIntl, intlShape } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';

import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';

import { getBehandlingType } from 'behandling/duck';

import styles from './shelveBehandlingModal.less';

/**
 * ShelveBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Henlegg behandling og avslutt'.
 * Ved å angi årsak og begrunnelse og trykke på 'Henlegg behandling' blir behandlingen henlagt og avsluttet.
 */
const maxLength1500 = maxLength(1500);

export const ShelveBehandlingModalImpl = ({
  showModal,
  handleSubmit,
  cancelEvent,
  previewHenleggBehandling,
  behandlingId,
  henleggArsaker,
  behandlingsType,
  intl,
  årsakKode,
  begrunnelse,
}) => {
  const previewHenleggBehandlingDoc = (e) => {
    // TODO Denne verdien burde ikkje vera hardkoda. Er dette eit kodeverk?
    previewHenleggBehandling(behandlingId, 'HENLEG');
    e.preventDefault();
  };

  const selectOptions = (type) => {
    if (type.kode === behandlingType.REVURDERING) {
      return henleggArsaker
        .filter(valg => valg.kode !== behandlingResultatType.HENLAGT_BRUKER_DOD
          && valg.kode !== behandlingResultatType.MANGLER_BEREGNINGSREGLER)
        .map((valg, cIndex) => (
          <option value={valg.kode} key={`valg${cIndex + 1}`}>{intl.formatMessage({ id: valg.kode })}</option>
        ));
    }
    return henleggArsaker
      .filter(valg => valg.kode !== behandlingResultatType.HENLAGT_BRUKER_DOD)
      .map((valg, cIndex) => (
        <option value={valg.kode} key={`valg${cIndex + 1}`}>{intl.formatMessage({ id: valg.kode })}</option>
      ));
  };

  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'ShelveBehandlingModal.ModalDescription' })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <Fieldset legend={intl.formatMessage({ id: 'ShelveBehandlingModal.HenleggBehandling' })}>
            <Row>
              <Column xs="5">
                <SelectField
                  name="årsakKode"
                  label={intl.formatMessage({ id: 'ShelveBehandlingModal.ArsakField' })}
                  validate={[required]}
                  placeholder={intl.formatMessage({ id: 'ShelveBehandlingModal.ArsakFieldDefaultValue' })}
                  selectValues={selectOptions(behandlingsType)}
                />
              </Column>
            </Row>
            <Row>
              <Column xs="8">
                <TextAreaField
                  name="begrunnelse"
                  label={intl.formatMessage({ id: 'ShelveBehandlingModal.BegrunnelseField' })}
                  validate={[required, maxLength1500, hasValidText]}
                  maxLength={1500}
                />
              </Column>
            </Row>
            <Row>
              <Column xs="6">
                <div>
                  <Hovedknapp
                    mini
                    className={styles.button}
                    disabled={!(årsakKode && begrunnelse)}
                  >
                    {intl.formatMessage({ id: 'ShelveBehandlingModal.HenleggBehandlingSubmit' })}
                  </Hovedknapp>
                  <Knapp
                    htmlType="button"
                    mini
                    onClick={cancelEvent}
                  >
                    {intl.formatMessage({ id: 'ShelveBehandlingModal.Avbryt' })}
                  </Knapp>
                </div>
              </Column>
              <Column xs="4">
                { [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
                  behandlingResultatType.HENLAGT_INNSYN_TRUKKET].includes(årsakKode)
                && (
                  <div className={styles.forhandsvis}>
                    <Undertekst>{intl.formatMessage({ id: 'ShelveBehandlingModal.SokerInformeres' })}</Undertekst>
                    <a
                      href=""
                      onClick={previewHenleggBehandlingDoc}
                      onKeyDown={previewHenleggBehandlingDoc}
                      className="lenke lenke--frittstaende"
                    >
                      {intl.formatMessage({ id: 'ShelveBehandlingModal.ForhandsvisBrev' })}
                    </a>
                  </div>
                )
              }
              </Column>
            </Row>
          </Fieldset>
        </div>
      </form>
    </Modal>
  );
};

ShelveBehandlingModalImpl.propTypes = {
  intl: intlShape.isRequired,
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  previewHenleggBehandling: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingsType: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  }).isRequired,
  henleggArsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })).isRequired,
  /**
   * Valgt behandlingsresultat-type
   */
  årsakKode: PropTypes.string,
  begrunnelse: PropTypes.string,
};

ShelveBehandlingModalImpl.defaultProps = {
  årsakKode: null,
  begrunnelse: null,
};

const henleggArsakerPerBehandlingType = {
  [behandlingType.KLAGE]: [behandlingResultatType.HENLAGT_KLAGE_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [behandlingType.DOKUMENTINNSYN]: [behandlingResultatType.HENLAGT_INNSYN_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET],
  OTHER: [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET, behandlingResultatType.HENLAGT_BRUKER_DOD,
    behandlingResultatType.HENLAGT_SOKNAD_MANGLER, behandlingResultatType.MANGLER_BEREGNINGSREGLER],
};

const getHenleggArsaker = createSelector([getKodeverk(kodeverkTyper.BEHANDLING_RESULTAT_TYPE), getBehandlingType],
  (behandlingResultatTyper, bType) => {
    const typerForBehandlingType = henleggArsakerPerBehandlingType[bType.kode];
    const typer = typerForBehandlingType || henleggArsakerPerBehandlingType.OTHER;
    return typer.map(type => behandlingResultatTyper.find(brt => brt.kode === type));
  });

const ShelveBehandlingModal = reduxForm({
  form: 'ShelveBehandlingModal',
})(ShelveBehandlingModalImpl);

const mapStateToProps = state => ({
  årsakKode: formValueSelector('ShelveBehandlingModal')(state, 'årsakKode'),
  begrunnelse: formValueSelector('ShelveBehandlingModal')(state, 'begrunnelse'),
  behandlingsType: getBehandlingType(state),
  henleggArsaker: getHenleggArsaker(state),
});

export default connect(mapStateToProps)(injectIntl(ShelveBehandlingModal));
