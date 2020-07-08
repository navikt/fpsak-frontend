import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';
import { Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';

import styles from './henleggBehandlingModal.less';

const maxLength1500 = maxLength(1500);

// TODO (TOR) Skal bruka navn fra kodeverk i staden for oppslag klientside for "henleggArsaker"

const previewHenleggBehandlingDoc = (behandlingTypeKode, previewHenleggBehandling, behandlingUuid, ytelseType, behandlingId) => (e) => {
  // TODO Hardkoda verdiar. Er dette eit kodeverk?
  const data = {
    behandlingUuid,
    ytelseType,
    dokumentMal: 'HENLEG',
    fritekst: ' ',
    mottaker: 'Søker',
    behandlingId,
  };
  previewHenleggBehandling(behandlingType.TILBAKEKREVING === behandlingTypeKode
    || behandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode, true, data);
  e.preventDefault();
};

interface OwnProps {
  cancelEvent: () => void;
  previewHenleggBehandling: () => void;
  behandlingUuid?: string;
  ytelseType: Kodeverk;
  behandlingId?: number;
}

interface StateProps {
  årsakKode?: string;
  begrunnelse?: string;
  henleggArsaker: Kodeverk[];
  showLink: boolean;
  behandlingTypeKode: string;
}

/**
 * HenleggBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Henlegg behandling og avslutt'.
 * Ved å angi årsak og begrunnelse og trykke på 'Henlegg behandling' blir behandlingen henlagt og avsluttet.
 */
export const HenleggBehandlingModalImpl: FunctionComponent<OwnProps & StateProps & WrappedComponentProps & InjectedFormProps> = ({
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
  behandlingId,
}) => (
  <Modal
    className={styles.modal}
    isOpen
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'HenleggBehandlingModal.ModalDescription' })}
    onRequestClose={cancelEvent}
    shouldCloseOnOverlayClick={false}
  >
    <form onSubmit={handleSubmit}>
      <div>
        <SkjemaGruppe legend={intl.formatMessage({ id: 'HenleggBehandlingModal.HenleggBehandling' })}>
          <Row>
            <Column xs="5">
              <SelectField
                name="årsakKode"
                label={intl.formatMessage({ id: 'HenleggBehandlingModal.ArsakField' })}
                validate={[required]}
                placeholder={intl.formatMessage({ id: 'HenleggBehandlingModal.ArsakFieldDefaultValue' })}
                selectValues={henleggArsaker.map((arsak) => <option value={arsak.kode} key={arsak.kode}>{intl.formatMessage({ id: arsak.kode })}</option>)}
              />
            </Column>
          </Row>
          <Row>
            <Column xs="8">
              <TextAreaField
                name="begrunnelse"
                label={intl.formatMessage({ id: 'HenleggBehandlingModal.BegrunnelseField' })}
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
                  {intl.formatMessage({ id: 'HenleggBehandlingModal.HenleggBehandlingSubmit' })}
                </Hovedknapp>
                <Knapp
                  htmlType="button"
                  mini
                  onClick={cancelEvent}
                >
                  {intl.formatMessage({ id: 'HenleggBehandlingModal.Avbryt' })}
                </Knapp>
              </div>
            </Column>
            <Column xs="4">
              {showLink && (
                <div className={styles.forhandsvis}>
                  <Undertekst>{intl.formatMessage({ id: 'HenleggBehandlingModal.SokerInformeres' })}</Undertekst>
                  <a
                    href=""
                    onClick={previewHenleggBehandlingDoc(behandlingTypeKode, previewHenleggBehandling, behandlingUuid, ytelseType, behandlingId)}
                    onKeyDown={previewHenleggBehandlingDoc(behandlingTypeKode, previewHenleggBehandling, behandlingUuid, ytelseType, behandlingId)}
                    className="lenke lenke--frittstaende"
                  >
                    {intl.formatMessage({ id: 'HenleggBehandlingModal.ForhandsvisBrev' })}
                  </a>
                </div>
              )}
            </Column>
          </Row>
        </SkjemaGruppe>
      </div>
    </form>
  </Modal>
);

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

interface Props {
  behandlingResultatTyper: KodeverkMedNavn[];
  behandlingType: Kodeverk;
}

export const getHenleggArsaker = createSelector([
  (ownProps: Props) => ownProps.behandlingResultatTyper,
  (ownProps: Props) => ownProps.behandlingType],
(behandlingResultatTyper, bType) => {
  const typerForBehandlingType = henleggArsakerPerBehandlingType[bType.kode];
  const typer = typerForBehandlingType || henleggArsakerPerBehandlingType.OTHER;
  return typer.map((type) => behandlingResultatTyper.find((brt) => brt.kode === type));
});

const getShowLink = createSelector([
  (state) => formValueSelector('HenleggBehandlingModal')(state, 'årsakKode'),
  (state, ownProps) => ownProps.behandlingType],
(arsakKode, type) => {
  if (type.kode === behandlingType.TILBAKEKREVING || type.kode === behandlingType.TILBAKEKREVING_REVURDERING) {
    return behandlingResultatType.HENLAGT_FEILOPPRETTET === arsakKode;
  }
  return [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
    behandlingResultatType.HENLAGT_INNSYN_TRUKKET].includes(arsakKode);
});

const mapStateToProps = (state, ownProps): StateProps => ({
  årsakKode: formValueSelector('HenleggBehandlingModal')(state, 'årsakKode'),
  begrunnelse: formValueSelector('HenleggBehandlingModal')(state, 'begrunnelse'),
  henleggArsaker: getHenleggArsaker(ownProps),
  showLink: getShowLink(state, ownProps),
  behandlingTypeKode: ownProps.behandlingType.kode,
});

const HenleggBehandlingModal = reduxForm({
  form: 'HenleggBehandlingModal',
})(HenleggBehandlingModalImpl);

// @ts-ignore Fiks denne
export default connect(mapStateToProps)(injectIntl(HenleggBehandlingModal));
