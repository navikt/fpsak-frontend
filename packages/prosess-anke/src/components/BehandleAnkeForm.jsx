import React from 'react';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import {
  CheckboxField, RadioGroupField, RadioOption, SelectField, TextAreaField,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import {
  BehandlingspunktSubmitButton, behandlingForm, behandlingFormValueSelector, hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/fp-felles';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import {
  AksjonspunktHelpTextTemp, ArrowBox, FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import ankeVurderingOmgjoer from '@fpsak-frontend/kodeverk/src/ankeVurderingOmgjoer';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import ankeOmgjorArsak from '../kodeverk/ankeOmgjorArsak';
import PreviewAnkeLink from './PreviewAnkeLink';
import FritekstBrevTextField from './FritekstAnkeBrevTextField';
import TempsaveAnkeButton from './TempsaveAnkeButton';

import styles from './behandleAnkeForm.less';

const omgjorArsakValues = [
  { kode: ankeOmgjorArsak.PROSESSUELL_FEIL, navn: 'Ankebehandling.OmgjoeringArsak.ProsessuellFeil' },
  { kode: ankeOmgjorArsak.ULIK_VURDERING, navn: 'Ankebehandling.OmgjoeringArsak.UlikVurdering' },
  { kode: ankeOmgjorArsak.ULIK_REGELVERKSTOLKNING, navn: 'Ankebehandling.OmgjoeringArsak.UlikRegelverkstolkning' },
  { kode: ankeOmgjorArsak.NYE_OPPLYSNINGER, navn: 'Ankebehandling.OmgjoeringArsak.NyeOpplysninger' },
];

const canSubmit = (formValues) => {
  if (ankeVurdering.ANKE_AVVIS === formValues.ankeVurdering && !formValues.erSubsidiartRealitetsbehandles) {
    return false;
  }
  if (ankeVurdering.ANKE_OMGJOER === formValues.ankeVurdering && (!formValues.ankeOmgjoerArsak || !formValues.ankeVurderingOmgjoer)) {
    return false;
  }
  return formValues.ankeVurdering != null && formValues.vedtak != null;
};

// TODO (TOR) Dette skal ikkje hardkodast!!! Hent fra kodeverk
const formatBehandlingType = (kode) => {
  switch (kode) {
    case behandlingType.FORSTEGANGSSOKNAD: return 'Førstegangssøknad';
    case behandlingType.KLAGE: return 'Klage';
    case behandlingType.ANKE: return 'Anke';
    case behandlingType.REVURDERING: return 'Revurdering';
    case behandlingType.SOKNAD: return 'Søknad';
    case behandlingType.DOKUMENTINNSYN: return 'Dokumentinnsyn';
    case behandlingType.TILBAKEKREVING: return 'Tilbakekreving';
    default: return null;
  }
};

// TODO (TOR) Dette skal ikkje hardkodast!!! Hent fra kodeverk
const formatBehandlingStatus = (status) => {
  switch (status) {
    case behandlingStatus.OPPRETTET: return 'Opprettet';
    case behandlingStatus.BEHANDLING_UTREDES: return 'Behandling utredes';
    case behandlingStatus.AVSLUTTET: return 'Avsluttet';
    case behandlingStatus.IVERKSETTER_VEDTAK: return 'Iverksetter vedtak';
    case behandlingStatus.FATTER_VEDTAK: return 'Fatter vedtak';
    default: return null;
  }
};

const IKKE_PAA_ANKET_BEHANDLING_ID = '0';

const canPreview = (begrunnelse, fritekstTilBrev) => (begrunnelse && begrunnelse.length > 0) && (fritekstTilBrev && fritekstTilBrev.length > 0);
const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');
const formatBehandling = (b) => `${formatDate(b.opprettet)} - ${formatBehandlingType(b.type.kode)} - ${formatBehandlingStatus(b.status.kode)}`;
const formatId = (b) => {
  if (b === null) {
    return IKKE_PAA_ANKET_BEHANDLING_ID;
  }
  return `${b}`;
};

const leggTilUkjent = (behandlinger = []) => {
  const arr = [].concat(behandlinger);
  arr.unshift({
    id: IKKE_PAA_ANKET_BEHANDLING_ID,
    opprettet: null,
    type: {
    },
    status: {
    },
  });
  return arr;
};

const buildOption = (b, intl) => {
  if (b.id === IKKE_PAA_ANKET_BEHANDLING_ID) {
    return (<option key={formatId(b.id)} value={formatId(b.id)}>{intl.formatMessage({ id: 'Ankebehandling.Resultat.IkkePaaAnketVedtak' })}</option>);
  }
  return (<option key={formatId(b.id)} value={formatId(b.id)}>{formatBehandling(b)}</option>);
};

const SKAL_REALITETSBEHANDLES = {
  JA: true,
  NEI: false,
};

const filtrerKlage = (behandlinger = []) => behandlinger.filter((b) => b.type.kode === behandlingType.KLAGE);

/**
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling.
 */
const BehandleAnkeFormImpl = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  saveAnke,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunktCode,
  sprakkode,
  formValues,
  behandlinger,
  intl,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel><FormattedMessage id="Ankebehandling.Title" /></Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="7">
          <SelectField
            readOnly={readOnly}
            name="vedtak"
            selectValues={leggTilUkjent(filtrerKlage(behandlinger)).map((b) => buildOption(b, intl))}
            className={readOnly ? styles.selectReadOnly : null}
            label={intl.formatMessage({ id: 'Ankebehandling.Resultat.Vedtak' })}
            validate={[required]}
            bredde="xl"
          />
        </Column>
      </Row>
      <Normaltekst><FormattedMessage id="Ankebehandling.Resultat" /></Normaltekst>
      <Row>
        <Column xs="4">
          <RadioGroupField
            name="ankeVurdering"
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
          >
            <RadioOption value={ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK} label={{ id: 'Ankebehandling.Resultat.Stadfest' }} />
            <RadioOption value={ankeVurdering.ANKE_OMGJOER} label={{ id: 'Ankebehandling.Resultat.Omgjør' }} />
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <RadioGroupField
            name="ankeVurdering"
            validate={[required]}
            readOnly={readOnly}
            className={readOnly ? styles.selectReadOnly : null}
            direction="vertical"
          >
            <RadioOption value={ankeVurdering.ANKE_OPPHEVE_OG_HJEMSENDE} label={{ id: 'Ankebehandling.Resultat.OpphevHjemsend' }} />
            <RadioOption value={ankeVurdering.ANKE_AVVIS} label={{ id: 'Ankebehandling.Resultat.Avvis' }} />
          </RadioGroupField>
        </Column>
      </Row>
      {ankeVurdering.ANKE_AVVIS === formValues.ankeVurdering
      && (
        <Row>
          <Column xs="7">
            <ArrowBox>
              <Normaltekst><FormattedMessage id="Ankebehandling.Avvisning" /></Normaltekst>
              <CheckboxField name="erAnkerIkkePart" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkePart" />} />
              <CheckboxField name="erIkkeKonkret" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeKonkret" />} />
              <CheckboxField name="erFristIkkeOverholdt" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeFrist" />} />
              <CheckboxField name="erIkkeSignert" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeSignert" />} />
              <Normaltekst><FormattedMessage id="Ankebehandling.Realitetsbehandles" /></Normaltekst>
              <RadioGroupField
                name="erSubsidiartRealitetsbehandles"
                validate={[required]}
                readOnly={readOnly}
                className={readOnly ? styles.selectReadOnly : null}
                direction="horisontal"
              >
                <RadioOption value={SKAL_REALITETSBEHANDLES.JA} label={{ id: 'Ankebehandling.Realitetsbehandles.Ja' }} />
                <RadioOption value={SKAL_REALITETSBEHANDLES.NEI} label={{ id: 'Ankebehandling.Realitetsbehandles.Nei' }} />
              </RadioGroupField>
            </ArrowBox>
          </Column>
        </Row>
      )}
      {ankeVurdering.ANKE_OMGJOER === formValues.ankeVurdering
      && (
        <Row>
          <Column xs="7">
            <ArrowBox>
              <RadioGroupField
                name="ankeVurderingOmgjoer"
                validate={[required]}
                readOnly={readOnly}
                className={readOnly ? styles.selectReadOnly : null}
                direction="horisontal"
              >
                <RadioOption name="a1" value={ankeVurderingOmgjoer.ANKE_TIL_GUNST} label={{ id: 'Ankebehandling.VurderingOmgjoer.Gunst' }} />
                <RadioOption name="a2" value={ankeVurderingOmgjoer.ANKE_TIL_UGUNST} label={{ id: 'Ankebehandling.VurderingOmgjoer.Ugunst' }} />
                <RadioOption name="a3" value={ankeVurderingOmgjoer.ANKE_DELVIS_OMGJOERING_TIL_GUNST} label={{ id: 'Ankebehandling.VurderingOmgjoer.Delvis' }} />
              </RadioGroupField>
              <SelectField
                readOnly={readOnly}
                name="ankeOmgjoerArsak"
                selectValues={omgjorArsakValues.map((arsak) => <option key={arsak.kode} value={arsak.kode}>{intl.formatMessage({ id: arsak.navn })}</option>)}
                className={readOnly ? styles.selectReadOnly : null}
                label={intl.formatMessage({ id: 'Ankebehandling.OmgjoeringArsak' })}
                validate={[required]}
                bredde="xl"
              />
            </ArrowBox>
          </Column>
        </Row>
      )}

      <Row>
        <Column xs="7">
          <TextAreaField label="Begrunnelse" name="begrunnelse" readOnly={readOnly} />
        </Column>
      </Row>

      <div className={styles.confirmVilkarForm}>
        <VerticalSpacer sixteenPx />
        <FritekstBrevTextField
          sprakkode={sprakkode}
          readOnly={readOnly}
          intl={intl}
        />
        <Row>
          <Column xs="8">
            <BehandlingspunktSubmitButton
              formName={formProps.form}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              isReadOnly={readOnly}
              isSubmittable={!readOnly && canSubmit(formValues)}
              hasEmptyRequiredFields={false}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
            <PreviewAnkeLink
              readOnly={!canPreview(formValues.begrunnelse, formValues.fritekstTilBrev)}
              previewCallback={previewCallback}
              fritekstTilBrev={formValues.fritekstTilBrev}
              ankeVurdering={formValues.ankeVurdering}
              aksjonspunktCode={aksjonspunktCode}
            />
          </Column>
          <Column xs="2">
            <TempsaveAnkeButton
              formValues={formValues}
              saveAnke={saveAnke}
              readOnly={readOnly}
              aksjonspunktCode={aksjonspunktCode}
            />
          </Column>
        </Row>
      </div>
    </FadingPanel>
  </form>
);

BehandleAnkeFormImpl.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  previewCallback: PropTypes.func.isRequired,
  saveAnke: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  behandlinger: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    opprettet: PropTypes.string,
    type: PropTypes.shape({
      kode: PropTypes.string,
    }),
    status: PropTypes.shape({
      kode: PropTypes.string,
    }),
  })).isRequired,
  ...formPropTypes,
};

BehandleAnkeFormImpl.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

// TODO (TOR) Her ligg det masse som ikkje er felt i forma! Rydd
export const buildInitialValues = createSelector([(ownProps) => ownProps.ankeVurderingResultat], (resultat) => ({
  vedtak: resultat ? formatId(resultat.paAnketBehandlingId) : null,
  ankeVurdering: resultat ? resultat.ankeVurdering : null,
  begrunnelse: resultat ? resultat.begrunnelse : null,
  fritekstTilBrev: resultat ? resultat.fritekstTilBrev : null,
  vedtaksdatoAnketBehandling: resultat ? resultat.vedtaksdatoAnketBehandling : null,
  erGodkjentAvMedunderskriver: resultat ? resultat.erGodkjentAvMedunderskriver : false,
  erAnkerIkkePart: resultat ? resultat.erAnkerIkkePart : false,
  erIkkeKonkret: resultat ? resultat.erIkkeKonkret : false,
  erFristIkkeOverholdt: resultat ? resultat.erFristIkkeOverholdt : false,
  erIkkeSignert: resultat ? resultat.erIkkeSignert : false,
  erSubsidiartRealitetsbehandles: resultat ? resultat.erSubsidiartRealitetsbehandles : null,
  ankeAvvistArsak: resultat ? resultat.ankeAvvistArsak : null,
  ankeOmgjoerArsak: resultat ? resultat.ankeOmgjoerArsak : null,
  ankeVurderingOmgjoer: resultat ? resultat.ankeVurderingOmgjoer : null,
  gjelderVedtak: resultat ? resultat.gjelderVedtak : null,
}));

// TODO (TOR) Rydd i dette! Treng neppe senda med alt dette til backend
export const transformValues = (values, aksjonspunktCode) => ({
  vedtak: values.vedtak === '0' ? null : values.vedtak,
  ankeVurdering: values.ankeVurdering,
  begrunnelse: values.begrunnelse,
  erMerknaderMottatt: values.erMerknaderMottatt,
  merknadKommentar: values.merknadKommentar,
  fritekstTilBrev: values.fritekstTilBrev,
  vedtaksdatoAnketBehandling: values.vedtaksdatoAnketBehandling,
  erGodkjentAvMedunderskriver: values.erGodkjentAvMedunderskriver,
  erAnkerIkkePart: values.erAnkerIkkePart,
  erIkkeKonkret: values.erIkkeKonkret,
  erFristIkkeOverholdt: values.erFristIkkeOverholdt,
  erIkkeSignert: values.erIkkeSignert,
  erSubsidiartRealitetsbehandles: values.erSubsidiartRealitetsbehandles,
  ankeAvvistArsak: values.ankeAvvistArsak,
  ankeOmgjoerArsak: values.ankeOmgjoerArsak,
  ankeVurderingOmgjoer: values.ankeVurderingOmgjoer,
  gjelderVedtak: values.vedtak !== '0',
  kode: aksjonspunktCode,
});

const formName = 'BehandleAnkeForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const aksjonspunktCode = initialOwnProps.aksjonspunkter[0].definisjon.kode;
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return (state, ownProps) => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state,
      'vedtak',
      'ankeVurdering',
      'begrunnelse',
      'fritekstTilBrev',
      'erSubsidiartRealitetsbehandles',
      'ankeOmgjoerArsak',
      'ankeVurderingOmgjoer'),
    onSubmit,
  });
};

const BehandleAnkeForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BehandleAnkeFormImpl));

BehandleAnkeForm.supports = (apCodes) => apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE);


export default injectIntl(BehandleAnkeForm);
