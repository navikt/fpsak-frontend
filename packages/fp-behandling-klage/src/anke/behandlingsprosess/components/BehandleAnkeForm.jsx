import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
VerticalSpacer, AksjonspunktHelpText, FadingPanel, ArrowBox,
} from '@fpsak-frontend/shared-components';
import { getBehandlingKlageVurderingResultatNK, getBehandlingSprak } from 'behandlingKlage/src/anke/selectors/ankeBehandlingSelectors';
import {
  behandlingForm, behandlingFormValueSelector, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingKlage/src/anke/behandlingForm';
import {
 CheckboxField, RadioGroupField, RadioOption, SelectField, TextAreaField,
} from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';

import ankeVurderingOmgjoer from '@fpsak-frontend/kodeverk/src/ankeVurderingOmgjoer';
import ankeOmgjorArsak from '@fpsak-frontend/kodeverk/src/ankeOmgjorArsak';
import PreviewKlageLink from '../../../behandlingsprosess/components/klage/Klagevurdering/SharedUtills/PreviewKlageLink';
import FritekstBrevTextField from '../../../behandlingsprosess/components/klage/Klagevurdering/SharedUtills/FritekstKlageBrevTextField';
import styles from './behandleAnkeForm.less';
import { getSelectedBehandlingspunktAksjonspunkter } from '../BehandlingsprosessAnkeSelectors';
import TempsaveKlageButton from '../../../behandlingsprosess/components/klage/Klagevurdering/SharedUtills/TempsaveKlageButton';


const mapSelectValues = () => {
  const liste = [
    {
      navn: 'BehandlingA', kode: '999953',
    },
    {
      navn: 'BehandlingB', kode: '999952',
    },
  ];
  return liste.map(mo => <option key={mo.kode} value={mo.kode}>{mo.navn}</option>);
};

const omgjorArsakValues = [
  { kode: ankeOmgjorArsak.PROSESSUELL_FEIL, navn: 'Ankebehandling.OmgjoeringArsak.ProsessuellFeil' },
  { kode: ankeOmgjorArsak.ULIK_VURDERING, navn: 'Ankebehandling.OmgjoeringArsak.UlikVurdering' },
  { kode: ankeOmgjorArsak.ULIK_REGELVERKSTOLKNING, navn: 'Ankebehandling.OmgjoeringArsak.UlikRegelverkstolkning' },
  { kode: ankeOmgjorArsak.NYE_OPPLYSNINGER, navn: 'Ankebehandling.OmgjoeringArsak.NyeOpplysninger' },
];

const canSubmit = (formValues) => {
  if (ankeVurdering.AVVIS_ANKE === formValues.ankeVurdering && !formValues.erSubsidiartRealitetsbehandles) {
    return false;
  }
  if (ankeVurdering.OMGJOER_VEDTAK === formValues.ankeVurdering && (!formValues.ankeOmgjoerArsak || !formValues.ankeVurderingOmgjoer)) {
    return false;
  }
  return formValues.ankeVurdering != null && formValues.vedtak != null;
};

const canPreview = formValues => formValues.ankeVurdering != null && formValues.fritekstTilBrev && (formValues.fritekstTilBrev.length > 2);

/**
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling.
 */
const BehandleAnkeFormImpl = ({
  readOnly,
  handleSubmit,
  saveKlage,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunktCode,
  sprakkode,
  formValues,
  intl,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'Ankebehandling.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="7">
          <SelectField
            readOnly={readOnly}
            name="vedtak"
            selectValues={mapSelectValues()}
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
            <RadioOption value={ankeVurdering.STADFESTE_YTELSESVEDTAK} label={{ id: 'Ankebehandling.Resultat.Stadfest' }} />
            <RadioOption value={ankeVurdering.OMGJOER_VEDTAK} label={{ id: 'Ankebehandling.Resultat.Omgjør' }} />
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
            <RadioOption value={ankeVurdering.OPPHEV_OG_HJEMSEND} label={{ id: 'Ankebehandling.Resultat.OpphevHjemsend' }} />
            <RadioOption value={ankeVurdering.AVVIS_ANKE} label={{ id: 'Ankebehandling.Resultat.Avvis' }} />
          </RadioGroupField>
        </Column>
      </Row>
      {ankeVurdering.AVVIS_ANKE === formValues.ankeVurdering
      && (
        <Row>
          <Column xs="7">
            <ArrowBox>
              <Normaltekst><FormattedMessage id="Ankebehandling.Avvisning" /></Normaltekst>
              <CheckboxField name="ikkePart" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkePart" />} />
              <CheckboxField name="ikkeKonkret" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeKonkret" />} />
              <CheckboxField name="ikkeFrist" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeFrist" />} />
              <CheckboxField name="ikkeSignert" label={<FormattedMessage id="Ankebehandling.Avvisning.IkkeSignert" />} />
              <Normaltekst><FormattedMessage id="Ankebehandling.Realitetsbehandles" /></Normaltekst>
              <RadioGroupField
                name="erSubsidiartRealitetsbehandles"
                validate={[required]}
                readOnly={readOnly}
                className={readOnly ? styles.selectReadOnly : null}
                direction="horisontal"
              >
                <RadioOption value="ja" label={{ id: 'Ankebehandling.Realitetsbehandles.Ja' }} />
                <RadioOption value="nei" label={{ id: 'Ankebehandling.Realitetsbehandles.Nei' }} />
              </RadioGroupField>
            </ArrowBox>
          </Column>
        </Row>
      )}
      {ankeVurdering.OMGJOER_VEDTAK === formValues.ankeVurdering
      && (
        <Row>
          <Column xs="7">
            <ArrowBox>
              <SelectField
                readOnly={readOnly}
                name="ankeOmgjoerArsak"
                selectValues={omgjorArsakValues.map(arsak => <option key={arsak.kode} value={arsak.kode}>{intl.formatMessage({ id: arsak.navn })}</option>)}
                className={readOnly ? styles.selectReadOnly : null}
                label={intl.formatMessage({ id: 'Ankebehandling.OmgjoeringArsak' })}
                validate={[required]}
                bredde="xl"
              />
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
            </ArrowBox>
          </Column>
        </Row>
      )}

      <Row>
        <Column xs="7">
          <TextAreaField label="Begrunnelse" name="begrunnelse" />
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
              isReadOnly={readOnly}
              isSubmittable={canSubmit(formValues)}
              hasEmptyRequiredFields={false}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
            {canPreview(formValues)
            && (
              <PreviewKlageLink
                previewCallback={previewCallback}
                fritekstTilBrev={formValues.fritekstTilBrev}
                klageVurdering={formValues.ankeVurdering}
                aksjonspunktCode={aksjonspunktCode}
              />
            )
            }
          </Column>
          <Column xs="2">
            {/* <TempsaveKlageButton */}
            {/*  formValues={formValues} */}
            {/*  saveKlage={saveKlage} */}
            {/*  readOnly={readOnly} */}
            {/* /> */}
          </Column>
        </Row>
      </div>
    </FadingPanel>
  </form>
);

BehandleAnkeFormImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

BehandleAnkeFormImpl.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

export const buildInitialValues = createSelector([getBehandlingKlageVurderingResultatNK], klageVurderingResultat => ({
  vedtak: klageVurderingResultat ? klageVurderingResultat.vedtak : null,
  ankeVurdering: klageVurderingResultat ? klageVurderingResultat.ankeVurdering : null,
  begrunnelse: klageVurderingResultat ? klageVurderingResultat.begrunnelse : null,
  fritekstTilBrev: klageVurderingResultat ? klageVurderingResultat.fritekstTilBrev : null,
  vedtaksdatoAnketBehandling: klageVurderingResultat ? klageVurderingResultat.vedtaksdatoAnketBehandling : null,
  erGodkjentAvMedunderskriver: klageVurderingResultat ? klageVurderingResultat.erGodkjentAvMedunderskriver : false,
  ikkePart: klageVurderingResultat ? klageVurderingResultat.ikkePart : false,
  ikkeKonkret: klageVurderingResultat ? klageVurderingResultat.ikkeKonkret : false,
  ikkeFrist: klageVurderingResultat ? klageVurderingResultat.ikkeFrist : false,
  ikkeSignert: klageVurderingResultat ? klageVurderingResultat.ikkeSignert : false,
  erSubsidiartRealitetsbehandles: klageVurderingResultat ? klageVurderingResultat.erSubsidiartRealitetsbehandles : false,
  ankeAvvistArsak: klageVurderingResultat ? klageVurderingResultat.ankeAvvistArsak : null,
  ankeOmgjoerArsak: klageVurderingResultat ? klageVurderingResultat.ankeOmgjoerArsak : null,
  ankeVurderingOmgjoer: klageVurderingResultat ? klageVurderingResultat.ankeVurderingOmgjoer : null,
}));


export const transformValues = (values, aksjonspunktCode) => ({
  vedtak: values.vedtak,
  ankeVurdering: values.ankeVurdering,
  begrunnelse: values.begrunnelse,
  fritekstTilBrev: values.fritekstTilBrev,
  vedtaksdatoAnketBehandling: values.vedtaksdatoAnketBehandling,
  erGodkjentAvMedunderskriver: values.erGodkjentAvMedunderskriver,
  ikkePart: values.ikkePart,
  ikkeKonkret: values.ikkeKonkret,
  ikkeFrist: values.ikkeFrist,
  ikkeSignert: values.ikkeSignert,
  erSubsidiartRealitetsbehandles: values.erSubsidiartRealitetsbehandles,
  ankeAvvistArsak: values.ankeAvvistArsak,
  ankeOmgjoerArsak: values.ankeOmgjoerArsak,
  ankeVurderingOmgjoer: values.ankeVurderingOmgjoer,
  kode: aksjonspunktCode,
});

const formName = 'BehandleAnkeForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return state => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    formValues: behandlingFormValueSelector(formName)(state,
      'vedtak', 'ankeVurdering',
      'begrunnelse', 'fritekstTilBrev',
      'vedtaksdatoAnketBehandling',
      'erGodkjentAvMedunderskriver',
      'ikkePart', 'ikkeKonkret', 'ikkeFrist', 'ikkeSignert', 'erSubsidiartRealitetsbehandles',
      'ankeAvvistArsak',
      'ankeOmgjoerArsak',
      'ankeVurderingOmgjoer'),
    sprakkode: getBehandlingSprak(state),
    onSubmit,
  });
};

const BehandleAnkeForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BehandleAnkeFormImpl));

BehandleAnkeForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE);


export default injectIntl(BehandleAnkeForm);
