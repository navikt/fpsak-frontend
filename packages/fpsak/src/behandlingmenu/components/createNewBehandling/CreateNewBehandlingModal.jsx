import React, { useEffect } from 'react';
import { formValueSelector, reduxForm } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import { featureToggle } from '@fpsak-frontend/fp-felles';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import {
  getSelectedSaksnummer, isForeldrepengerFagsak, isSvangerskapFagsak, getFagsakYtelseType,
} from 'fagsak/fagsakSelectors';
import { getFeatureToggles } from 'app/duck';

import { getUuidForSisteLukkedeForsteEllerRevurd } from 'behandling/selectors/behandlingerSelectors';
import { sjekkOmTilbakekrevingKanOpprettes } from 'behandlingmenu/duck';
import { getSelectedBehandlingId, getBehandlingType } from 'behandling/duck';
import fpsakApi from 'data/fpsakApi';
import { getFpTilbakeKodeverk, getKodeverk } from 'kodeverk/duck';

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
  kanTilbakekrevingOpprettes,
  uuid,
  saksnummer,
  erTilbakekrevingAktivert,
}) => {
  useEffect(() => {
    if (erTilbakekrevingAktivert && uuid !== undefined) {
      kanTilbakekrevingOpprettes({ saksnummer, uuid, behandlingId });
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
  behandlingId: PropTypes.string,
  kanTilbakekrevingOpprettes: PropTypes.func.isRequired,
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
  isForeldrepengerFagsak,
  isSvangerskapFagsak,
  getKodeverk(kodeverkTyper.BEHANDLING_AARSAK),
  getFpTilbakeKodeverk(kodeverkTyper.BEHANDLING_AARSAK),
  (state) => formValueSelector(formName)(state, 'behandlingType')],
(isForeldrepenger, isSvangerskap, behandlingArsaker, behandlingArsakerFpTilbake, valgtBehandlingType) => {
  if (valgtBehandlingType === bType.TILBAKEKREVING_REVURDERING) {
    return behandlingArsakerFpTilbake
      .filter((ba) => ba.kode !== behandlingArsakType.RE_KLAGE_KA && ba.kode !== behandlingArsakType.RE_KLAGE_NFP)
      .sort((ba1, ba2) => ba2.navn.localeCompare(ba1.navn.length));
  }

  if (valgtBehandlingType === bType.REVURDERING) {
    let manuelleRevurderingsArsaker = isForeldrepenger ? manuelleRevurderingsArsakerFP : manuelleRevurderingsArsakerES;
    if (isSvangerskap) {
      manuelleRevurderingsArsaker = manuelleRevurderingsArsakerSVP;
    }
    return behandlingArsaker
      .filter((bat) => manuelleRevurderingsArsaker.indexOf(bat.kode) > -1)
      .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
  }

  return [];
});

export const getBehandlingTyper = createSelector([
  getKodeverk(kodeverkTyper.BEHANDLING_TYPE),
  getFpTilbakeKodeverk(kodeverkTyper.BEHANDLING_TYPE),
  (state) => getFeatureToggles(state)[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING]],
(behandlingTyper, tilbakekrevingBehandlingTyper = [], isTilbakekrevingAktiv = false) => {
  const fpsakBehandlingTyper = behandlingTyper
    .filter((bt) => bt.kode !== bType.SOKNAD && bt.kode !== bType.TILBAKEKREVING && bt.kode !== bType.TILBAKEKREVING_REVURDERING);
  const alleTyper = isTilbakekrevingAktiv ? fpsakBehandlingTyper.concat(tilbakekrevingBehandlingTyper) : fpsakBehandlingTyper;
  return alleTyper.sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn));
});

export const getEnabledBehandlingstyper = createSelector([
  getBehandlingTyper,
  (state, ownProps) => ownProps.hasEnabledCreateNewBehandling,
  (state, ownProps) => ownProps.hasEnabledCreateRevurdering,
  (state) => fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.getRestApiData()(state)],
(behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, hasEnabledTilbakekreving = {}) => behandlingstyper
  .filter((b) => (b.kode === bType.TILBAKEKREVING ? hasEnabledTilbakekreving.kanBehandlingOpprettes : true))
  .filter((b) => (b.kode === bType.TILBAKEKREVING_REVURDERING ? hasEnabledTilbakekreving.kanRevurderingOpprettes : true))
  .filter((b) => (b.kode === bType.FORSTEGANGSSOKNAD ? hasEnabledCreateNewBehandling : true))
  .filter((b) => (b.kode === bType.REVURDERING ? hasEnabledCreateRevurdering : true)));

const isTilbakekrevingEllerTilbakekrevingRevurdering = createSelector([getBehandlingType],
  (behandlingType) => behandlingType && (behandlingType.kode === bType.TILBAKEKREVING || behandlingType.kode === bType.TILBAKEKREVING_REVURDERING));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const eksternUuid = getUuidForSisteLukkedeForsteEllerRevurd(initialState);
  const onSubmit = (values) => ownProps.submitCallback({
    ...values,
    eksternUuid,
    fagsakYtelseType: getFagsakYtelseType(initialState),
  });
  const behandlingTyper = getBehandlingTyper(initialState);
  return (state) => ({
    onSubmit,
    behandlingTyper,
    enabledBehandlingstyper: getEnabledBehandlingstyper(state, ownProps),
    uuid: eksternUuid,
    behandlingId: isTilbakekrevingEllerTilbakekrevingRevurdering(state) ? getSelectedBehandlingId(state) : undefined,
    saksnummer: getSelectedSaksnummer(state),
    behandlingArsakTyper: getBehandlingAarsaker(state),
    behandlingType: formValueSelector(formName)(state, 'behandlingType'),
    erTilbakekrevingAktivert: getFeatureToggles(state)[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING],
  });
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  kanTilbakekrevingOpprettes: sjekkOmTilbakekrevingKanOpprettes,
}, dispatch);

export default connect(mapStateToPropsFactory, mapDispatchToProps)(reduxForm({
  form: formName,
})(injectIntl(CreateNewBehandlingModal)));
