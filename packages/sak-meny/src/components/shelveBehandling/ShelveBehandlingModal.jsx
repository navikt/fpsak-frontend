import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formValueSelector, reduxForm } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { Fieldset } from 'nav-frontend-skjema';
import { injectIntl } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';

import styles from './shelveBehandlingModal.less';

const maxLength1500 = maxLength(1500);

// TODO (TOR) Skal bruka navn fra kodeverk i staden for oppslag klientside for "henleggArsaker"

const previewHenleggBehandlingDoc = (behandlingTypeKode, previewHenleggBehandling, behandlingUuid, ytelseType) => (e) => {
  // TODO Hardkoda verdiar. Er dette eit kodeverk?
  const data = {
    behandlingUuid,
    ytelseType,
    dokumentMal: 'HENLEG',
    fritekst: ' ',
    mottaker: 'Søker',
  };
  previewHenleggBehandling(behandlingType.TILBAKEKREVING === behandlingTypeKode
    || behandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode, data);
  e.preventDefault();
};

/**
 * ShelveBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Henlegg behandling og avslutt'.
 * Ved å angi årsak og begrunnelse og trykke på 'Henlegg behandling' blir behandlingen henlagt og avsluttet.
 */
export const ShelveBehandlingModalImpl = ({
  showModal,
  handleSubmit,
  cancelEvent,
  previewHenleggBehandling,
  behandlingUuid,
  ytelseType,
  henleggArsaker,
  intl,
  årsakKode,
  begrunnelse,
  showLink,
  behandlingTypeKode,
}) => (
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
                selectValues={henleggArsaker.map((arsak) => <option value={arsak.kode} key={arsak.kode}>{intl.formatMessage({ id: arsak.kode })}</option>)}
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
              {showLink && (
                <div className={styles.forhandsvis}>
                  <Undertekst>{intl.formatMessage({ id: 'ShelveBehandlingModal.SokerInformeres' })}</Undertekst>
                  <a
                    href=""
                    onClick={previewHenleggBehandlingDoc(behandlingTypeKode, previewHenleggBehandling, behandlingUuid, ytelseType)}
                    onKeyDown={previewHenleggBehandlingDoc(behandlingTypeKode, previewHenleggBehandling, behandlingUuid, ytelseType)}
                    className="lenke lenke--frittstaende"
                  >
                    {intl.formatMessage({ id: 'ShelveBehandlingModal.ForhandsvisBrev' })}
                  </a>
                </div>
              )}
            </Column>
          </Row>
        </Fieldset>
      </div>
    </form>
  </Modal>
);

ShelveBehandlingModalImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  previewHenleggBehandling: PropTypes.func.isRequired,
  behandlingUuid: PropTypes.string,
  ytelseType: kodeverkObjektPropType.isRequired,
  showLink: PropTypes.bool.isRequired,
  henleggArsaker: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
  /**
   * Valgt behandlingsresultat-type
   */
  årsakKode: PropTypes.string,
  begrunnelse: PropTypes.string,
  behandlingTypeKode: PropTypes.string.isRequired,
};

ShelveBehandlingModalImpl.defaultProps = {
  årsakKode: null,
  begrunnelse: null,
  behandlingUuid: undefined,
};

const henleggArsakerPerBehandlingType = {
  [behandlingType.KLAGE]: [behandlingResultatType.HENLAGT_KLAGE_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [behandlingType.DOKUMENTINNSYN]: [behandlingResultatType.HENLAGT_INNSYN_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [behandlingType.TILBAKEKREVING]: [behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [behandlingType.TILBAKEKREVING_REVURDERING]: [behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [behandlingType.REVURDERING]: [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET,
    behandlingResultatType.HENLAGT_SOKNAD_MANGLER],
  OTHER: [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET,
    behandlingResultatType.HENLAGT_SOKNAD_MANGLER, behandlingResultatType.MANGLER_BEREGNINGSREGLER],
};

export const getHenleggArsaker = createSelector([
  (ownProps) => ownProps.menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.BEHANDLING_RESULTAT_TYPE),
  (ownProps) => ownProps.behandlingType],
(behandlingResultatTyper, bType) => {
  const typerForBehandlingType = henleggArsakerPerBehandlingType[bType.kode];
  const typer = typerForBehandlingType || henleggArsakerPerBehandlingType.OTHER;
  return typer.map((type) => behandlingResultatTyper.find((brt) => brt.kode === type));
});

const getShowLink = createSelector([
  (state) => formValueSelector('ShelveBehandlingModal')(state, 'årsakKode'),
  (state, ownProps) => ownProps.behandlingType],
(arsakKode, type) => {
  if (type.kode === behandlingType.TILBAKEKREVING || type.kode === behandlingType.TILBAKEKREVING_REVURDERING) {
    return behandlingResultatType.HENLAGT_FEILOPPRETTET === arsakKode;
  }
  return [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
    behandlingResultatType.HENLAGT_INNSYN_TRUKKET].includes(arsakKode);
});


const mapStateToProps = (state, ownProps) => ({
  årsakKode: formValueSelector('ShelveBehandlingModal')(state, 'årsakKode'),
  begrunnelse: formValueSelector('ShelveBehandlingModal')(state, 'begrunnelse'),
  henleggArsaker: getHenleggArsaker(ownProps),
  showLink: getShowLink(state, ownProps),
  behandlingTypeKode: ownProps.behandlingType.kode,
});

const ShelveBehandlingModal = reduxForm({
  form: 'ShelveBehandlingModal',
})(ShelveBehandlingModalImpl);

export default connect(mapStateToProps)(injectIntl(ShelveBehandlingModal));
