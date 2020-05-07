import React, { useEffect, FunctionComponent } from 'react';
import { formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { KodeverkMedNavn, Kodeverk } from '@fpsak-frontend/types';

import styles from './nyBehandlingModal.less';

const createOptions = (bt, enabledBehandlingstyper, intl) => {
  // TODO Burde retta opp navn for behandlingstype i DB
  const navn = bt.kode === bType.REVURDERING
    ? intl.formatMessage({ id: 'MenyNyBehandlingIndex.OpprettRevurdering' })
    : bt.navn;

  const isEnabled = enabledBehandlingstyper.some((b) => b.kode === bt.kode);
  return (<option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>);
};

interface OwnProps {
  cancelEvent: () => void;
  behandlingTyper: KodeverkMedNavn[];
  behandlingType?: string;
  behandlingArsakTyper: KodeverkMedNavn[];
  enabledBehandlingstyper: KodeverkMedNavn[];
  behandlingId?: number;
  sjekkOmTilbakekrevingKanOpprettes: (params: {
    saksnummer: number;
    uuid: string;
  }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: {
    behandlingId: number;
  }) => void;
  uuid?: string;
  saksnummer: number;
  erTilbakekrevingAktivert: boolean;
}

/**
 * NyBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på ok skal ny behandling(1.gangsbehandling) av sak opprettes.
 */
export const NyBehandlingModal: FunctionComponent<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
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
      isOpen
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'MenyNyBehandlingIndex.ModalDescription' })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Column xs="1">
            <Image className={styles.image} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="11">
            <div className={styles.label}>
              <Element>
                <FormattedMessage id="MenyNyBehandlingIndex.OpprettNyForstegangsbehandling" />
              </Element>
            </div>
            <VerticalSpacer sixteenPx />
            <VerticalSpacer sixteenPx />
            <SelectField
              name="behandlingType"
              label=""
              placeholder={intl.formatMessage({ id: 'MenyNyBehandlingIndex.SelectBehandlingTypePlaceholder' })}
              validate={[required]}
              selectValues={behandlingTyper.map((bt) => createOptions(bt, enabledBehandlingstyper, intl))}
              bredde="l"
            />
            <VerticalSpacer eightPx />
            { behandlingType === bType.FORSTEGANGSSOKNAD && (
              <CheckboxField
                name="nyBehandlingEtterKlage"
                label={intl.formatMessage({ id: 'MenyNyBehandlingIndex.NyBehandlingEtterKlage' })}
              />
            )}
            { behandlingArsakTyper.length > 0 && (
              <SelectField
                name="behandlingArsakType"
                label=""
                placeholder={intl.formatMessage({ id: 'MenyNyBehandlingIndex.SelectBehandlingArsakTypePlaceholder' })}
                validate={[required]}
                selectValues={behandlingArsakTyper.map((b) => <option key={b.kode} value={b.kode}>{b.navn}</option>)}
              />
            )}
            <div className={styles.right}>
              <Hovedknapp
                mini
                className={styles.button}
              >
                <FormattedMessage id="MenyNyBehandlingIndex.Ok" />
              </Hovedknapp>
              <Knapp
                htmlType="button"
                mini
                onClick={cancelEvent}
                className={styles.cancelButton}
              >
                <FormattedMessage id="MenyNyBehandlingIndex.Avbryt" />
              </Knapp>
            </div>
          </Column>
        </Row>
      </form>
    </Modal>
  );
};

const formName = 'NyBehandlingModal';

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

const tilbakekrevingRevurderingArsaker = [
  behandlingArsakType.RE_KLAGE_KA,
  behandlingArsakType.RE_KLAGE_NFP,
  behandlingArsakType.RE_VILKÅR,
  behandlingArsakType.RE_FORELDELSE,
];

export const getBehandlingAarsaker = createSelector([
  (_state, ownProps) => ownProps.ytelseType,
  (_state, ownProps) => ownProps.revurderingArsaker,
  (_state, ownProps) => ownProps.tilbakekrevingRevurderingArsaker,
  (state) => formValueSelector(formName)(state, 'behandlingType')],
(ytelseType, alleRevurderingArsaker, alleTilbakekrevingRevurderingArsaker, valgtBehandlingType) => {
  if (valgtBehandlingType === bType.TILBAKEKREVING_REVURDERING) {
    return alleTilbakekrevingRevurderingArsaker
      .filter((ba) => tilbakekrevingRevurderingArsaker.includes(ba.kode))
      .sort((ba1, ba2) => ba1.navn.localeCompare(ba2.navn));
  }

  if (valgtBehandlingType === bType.REVURDERING) {
    const isForeldrepenger = ytelseType.kode === fagsakYtelseType.FORELDREPENGER;
    const isSvangerskap = ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER;
    let manuelleRevurderingsArsaker = isForeldrepenger ? manuelleRevurderingsArsakerFP : manuelleRevurderingsArsakerES;
    if (isSvangerskap) {
      manuelleRevurderingsArsaker = manuelleRevurderingsArsakerSVP;
    }
    return alleRevurderingArsaker
      .filter((bat) => manuelleRevurderingsArsaker.indexOf(bat.kode) > -1)
      .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
  }

  return [];
});


interface Props {
  behandlingstyper: KodeverkMedNavn[];
  hasEnabledCreateNewBehandling: boolean;
  hasEnabledCreateRevurdering: boolean;
  kanTilbakekrevingOpprettes?: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  behandlingType: Kodeverk;
}

export const getBehandlingTyper = createSelector([(ownProps: Props) => ownProps.behandlingstyper],
  (behandlingstyper) => behandlingstyper.sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn)));

export const getEnabledBehandlingstyper = createSelector([
  getBehandlingTyper,
  (ownProps) => ownProps.hasEnabledCreateNewBehandling,
  (ownProps) => ownProps.hasEnabledCreateRevurdering,
  (ownProps) => ownProps.kanTilbakekrevingOpprettes],
(behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, kanTilbakekrevingOpprettes = {
  kanBehandlingOpprettes: false,
  kanRevurderingOpprettes: false,
}) => behandlingstyper
  .filter((b) => (b.kode === bType.TILBAKEKREVING ? kanTilbakekrevingOpprettes.kanBehandlingOpprettes : true))
  .filter((b) => (b.kode === bType.TILBAKEKREVING_REVURDERING ? kanTilbakekrevingOpprettes.kanRevurderingOpprettes : true))
  .filter((b) => (b.kode === bType.FORSTEGANGSSOKNAD ? hasEnabledCreateNewBehandling : true))
  .filter((b) => (b.kode === bType.REVURDERING ? hasEnabledCreateRevurdering : true)));

const isTilbakekrevingEllerTilbakekrevingRevurdering = createSelector([(ownProps: Props) => ownProps.behandlingType],
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
})(injectIntl(NyBehandlingModal)));
