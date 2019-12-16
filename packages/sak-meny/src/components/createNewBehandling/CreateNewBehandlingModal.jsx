import React, { useEffect } from 'react';
import { formValueSelector, reduxForm } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import styles from './createNewBehandlingModal.less';

const createOptions = (bt, enabledBehandlingstyper, intl) => {
  // TODO Burde retta opp navn for behandlingstype i DB
  const navn = bt.kode === bType.REVURDERING
    ? intl.formatMessage({ id: 'CreateNewBehandlingModal.OpprettRevurdering' })
    : bt.navn;

  const isEnabled = enabledBehandlingstyper.some((b) => b.kode === bt.kode);
  return (<option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>);
};
/**
 * CreateNewBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på ok skal ny behandling(1.gangsbehandling) av sak opprettes.
 */
export const CreateNewBehandlingModal = ({
  showModal,
  handleSubmit,
  cancelEvent,
  intl,
  behandlingTyper,
  behandlingType,
  behandlingArsakTyper,
  enabledBehandlingstyper,
  behandlingId,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  uuid,
  saksnummer,
  erTilbakekrevingAktivert,
}) => {
  useEffect(() => {
    if (erTilbakekrevingAktivert) {
      if (uuid !== undefined) {
        sjekkOmTilbakekrevingKanOpprettes({ saksnummer, uuid });
      }
      if (behandlingId !== undefined) {
        sjekkOmTilbakekrevingRevurderingKanOpprettes({ behandlingId });
      }
    }
  }, []);
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'CreateNewBehandlingModal.ModalDescription' })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Column xs="1">
            <Image className={styles.image} altCode="CreateNewBehandlingModal.OpprettNyForstegangsbehandling" src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="11">
            <div className={styles.label}>
              <Element>
                <FormattedMessage id="CreateNewBehandlingModal.OpprettNyForstegangsbehandling" />
              </Element>
            </div>
            <VerticalSpacer sixteenPx />
            <VerticalSpacer sixteenPx />
            <SelectField
              name="behandlingType"
              label=""
              placeholder={intl.formatMessage({ id: 'CreateNewBehandlingModal.SelectBehandlingTypePlaceholder' })}
              validate={[required]}
              selectValues={behandlingTyper.map((bt) => createOptions(bt, enabledBehandlingstyper, intl))}
              bredde="l"
            />
            <VerticalSpacer eightPx />
            { behandlingType === bType.FORSTEGANGSSOKNAD && (
              <CheckboxField
                name="nyBehandlingEtterKlage"
                label={intl.formatMessage({ id: 'CreateNewBehandlingModal.NyBehandlingEtterKlage' })}
              />
            )}
            { behandlingArsakTyper.length > 0 && (
              <SelectField
                name="behandlingArsakType"
                label=""
                placeholder={intl.formatMessage({ id: 'CreateNewBehandlingModal.SelectBehandlingArsakTypePlaceholder' })}
                validate={[required]}
                selectValues={behandlingArsakTyper.map((b) => <option key={b.kode} value={b.kode}>{b.navn}</option>)}
              />
            )}
            <div className={styles.right}>
              <Hovedknapp
                mini
                className={styles.button}
              >
                <FormattedMessage id="CreateNewBehandlingModal.Ok" />
              </Hovedknapp>
              <Knapp
                htmlType="button"
                mini
                onClick={cancelEvent}
                className={styles.cancelButton}
              >
                <FormattedMessage id="CreateNewBehandlingModal.Avbryt" />
              </Knapp>
            </div>
          </Column>
        </Row>
      </form>
    </Modal>
  );
};

CreateNewBehandlingModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  behandlingId: PropTypes.number,
  sjekkOmTilbakekrevingKanOpprettes: PropTypes.func.isRequired,
  sjekkOmTilbakekrevingRevurderingKanOpprettes: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  behandlingTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingType: PropTypes.string,
  uuid: PropTypes.string,
  erTilbakekrevingAktivert: PropTypes.bool.isRequired,
  saksnummer: PropTypes.number.isRequired,
  behandlingArsakTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  enabledBehandlingstyper: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
};

CreateNewBehandlingModal.defaultProps = {
  behandlingType: undefined,
  behandlingId: undefined,
};

const formName = 'CreateNewBehandlingModal';

// TODO Denne inndelinga burde vel flyttast til DB (KODELISTE.EKSTRA_DATA)?
const manuelleRevurderingsArsakerES = [
  behandlingArsakType.ANNET,
  behandlingArsakType.FEIL_I_LOVANDVENDELSE,
  behandlingArsakType.FEIL_ELLER_ENDRET_FAKTA,
  behandlingArsakType.FEIL_REGELVERKSFORSTAELSE,
  behandlingArsakType.FEIL_PROSESSUELL,
];

const manuelleRevurderingsArsakerFP = [
  behandlingArsakType.BEREEGNINGSGRUNNLAG,
  behandlingArsakType.MEDLEMSKAP,
  behandlingArsakType.OPPTJENING,
  behandlingArsakType.FORDELING,
  behandlingArsakType.INNTEKT,
  behandlingArsakType.DØD,
  behandlingArsakType.SØKERS_RELASJON,
  behandlingArsakType.SØKNADSFRIST,
  behandlingArsakType.KLAGE_U_INNTK,
  behandlingArsakType.KLAGE_M_INNTK,
];

const manuelleRevurderingsArsakerSVP = [
  behandlingArsakType.KLAGE_U_INNTK,
  behandlingArsakType.KLAGE_M_INNTK,
  behandlingArsakType.RE_ENDRET_INNTEKTSMELDING,
  behandlingArsakType.RE_ENDRING_FRA_BRUKER,
  behandlingArsakType.FØDSEL,
  behandlingArsakType.DØD,
  behandlingArsakType.ANNET,
  behandlingArsakType.INNTEKT,
];

export const getBehandlingAarsaker = createSelector([
  (state, ownProps) => ownProps.ytelseType,
  (state, ownProps) => ownProps.menyKodeverk,
  (state) => formValueSelector(formName)(state, 'behandlingType')],
(ytelseType, menyKodeverk, valgtBehandlingType) => {
  if (valgtBehandlingType === bType.TILBAKEKREVING_REVURDERING) {
    return menyKodeverk.getKodeverkForBehandlingstype(bType.TILBAKEKREVING_REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)
      .filter((ba) => ba.kode !== behandlingArsakType.RE_KLAGE_KA && ba.kode !== behandlingArsakType.RE_KLAGE_NFP)
      .sort((ba1, ba2) => ba2.navn.localeCompare(ba1.navn.length));
  }

  if (valgtBehandlingType === bType.REVURDERING) {
    const isForeldrepenger = ytelseType.kode === fagsakYtelseType.FORELDREPENGER;
    const isSvangerskap = ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER;
    let manuelleRevurderingsArsaker = isForeldrepenger ? manuelleRevurderingsArsakerFP : manuelleRevurderingsArsakerES;
    if (isSvangerskap) {
      manuelleRevurderingsArsaker = manuelleRevurderingsArsakerSVP;
    }
    return menyKodeverk.getKodeverkForBehandlingstype(bType.REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)
      .filter((bat) => manuelleRevurderingsArsaker.indexOf(bat.kode) > -1)
      .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
  }

  return [];
});

const BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES = [
  bType.FORSTEGANGSSOKNAD,
  bType.KLAGE,
  bType.REVURDERING,
  bType.DOKUMENTINNSYN,
  bType.ANKE,
  bType.TILBAKEKREVING,
  bType.TILBAKEKREVING_REVURDERING,
];

export const getBehandlingTyper = createSelector([(ownProps) => ownProps.menyKodeverk], (menyKodeverk) => menyKodeverk
  .getKodeverkForBehandlingstyper(BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES, kodeverkTyper.BEHANDLING_TYPE)
  .sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn)));

export const getEnabledBehandlingstyper = createSelector([
  getBehandlingTyper,
  (ownProps) => ownProps.hasEnabledCreateNewBehandling,
  (ownProps) => ownProps.hasEnabledCreateRevurdering,
  (ownProps) => ownProps.kanTilbakekrevingOpprettes],
(behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, kanTilbakekrevingOpprettes = {}) => behandlingstyper
  .filter((b) => (b.kode === bType.TILBAKEKREVING ? kanTilbakekrevingOpprettes.kanBehandlingOpprettes : true))
  .filter((b) => (b.kode === bType.TILBAKEKREVING_REVURDERING ? kanTilbakekrevingOpprettes.kanRevurderingOpprettes : true))
  .filter((b) => (b.kode === bType.FORSTEGANGSSOKNAD ? hasEnabledCreateNewBehandling : true))
  .filter((b) => (b.kode === bType.REVURDERING ? hasEnabledCreateRevurdering : true)));

const isTilbakekrevingEllerTilbakekrevingRevurdering = createSelector([(ownProps) => ownProps.behandlingType],
  (behandlingType) => behandlingType && (behandlingType.kode === bType.TILBAKEKREVING || behandlingType.kode === bType.TILBAKEKREVING_REVURDERING));

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback({
    ...values,
    eksternUuid: initialOwnProps.uuidForSistLukkede,
    fagsakYtelseType: initialOwnProps.ytelseType,
  });
  return (state, ownProps) => ({
    onSubmit,
    behandlingTyper: getBehandlingTyper(ownProps),
    enabledBehandlingstyper: getEnabledBehandlingstyper(ownProps),
    uuid: ownProps.uuidForSistLukkede,
    behandlingId: isTilbakekrevingEllerTilbakekrevingRevurdering(ownProps) ? ownProps.behandlingId : undefined,
    behandlingArsakTyper: getBehandlingAarsaker(state, ownProps),
    behandlingType: formValueSelector(formName)(state, 'behandlingType'),
  });
};

export default connect(mapStateToPropsFactory)(reduxForm({
  form: formName,
})(injectIntl(CreateNewBehandlingModal)));
