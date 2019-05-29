import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
 VerticalSpacer, AksjonspunktHelpText, FadingPanel, ArrowBox,
} from '@fpsak-frontend/shared-components';

// import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessKlageSelectors';
import { getBehandlingKlageVurderingResultatNK, getBehandlingSprak } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import {
  behandlingForm, behandlingFormValueSelector, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingKlage/src/behandlingForm';
import {
  CheckboxField,
  RadioGroupField, RadioOption, SelectField, TextAreaField,
} from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import klageVurderingOmgjoerType from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import PreviewKlageLink from '../../klage/Klagevurdering/SharedUtills/PreviewKlageLink';
import FritekstBrevTextField from '../../klage/Klagevurdering/SharedUtills/FritekstKlageBrevTextField';
import styles from '../../klage/Klagevurdering/SharedUtills/behandleKlageForm.less';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (KA).
 */
const BehandleAnkeFormImpl = ({
  readOnly,
  handleSubmit,
  // saveKlage,
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
            name="klageMedholdArsak"
            selectValues={[]}
            className={readOnly ? styles.selectReadOnly : null}
            label={intl.formatMessage({ id: 'Vedtaket som er anket' })}
            validate={[required]}
            bredde="xl"
          />
        </Column>
      </Row>

      <Row>
        <Column xs="4">
          <Normaltekst><FormattedMessage id="Ankebehandling.Resultat" /></Normaltekst>
          <RadioGroupField
            name="ankeResultat"
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
          >
            <RadioOption value={ankeVurdering.STADFESTE_YTELSESVEDTAK} label={{ id: 'Ankebehandling.Resultat.Stadfest' }} />
            <RadioOption value={ankeVurdering.AVVIS_ANKE} label={{ id: 'Ankebehandling.Resultat.Avvis' }} />
          </RadioGroupField>
        </Column>
        <Column xs="4">
          <RadioGroupField
            name="ankeResultat"
            validate={[required]}
            readOnly={readOnly}
            className={readOnly ? styles.selectReadOnly : null}
            direction="vertical"
          >
            <RadioOption value={ankeVurdering.OMGJOER_VEDTAK} label={{ id: 'Ankebehandling.Resultat.Omgjør' }} />
            <RadioOption value={ankeVurdering.OPPHEV_OG_HJEMSEND} label={{ id: 'Ankebehandling.Resultat.OpphevHjemsend' }} />
          </RadioGroupField>
        </Column>
      </Row>

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
              name="realitetsbehandles"
              validate={[required]}
              readOnly={readOnly}
              className={readOnly ? styles.selectReadOnly : null}
              direction="horisontal"
            >
              <RadioOption value={klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE} label={{ id: 'Ankebehandling.Realitetsbehandles.Ja' }} />
              <RadioOption value={klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE} label={{ id: 'Ankebehandling.Realitetsbehandles.Nei' }} />
            </RadioGroupField>
          </ArrowBox>
        </Column>
      </Row>

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
              isSubmittable={!readOnlySubmitButton}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
            {!readOnly && formValues.klageVurdering && formValues.fritekstTilBrev && (formValues.fritekstTilBrev.length > 2)
            && (
              <PreviewKlageLink
                previewCallback={previewCallback}
                fritekstTilBrev={formValues.fritekstTilBrev}
                klageVurdering={formValues.klageVurdering}
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
  klageMedholdArsak: klageVurderingResultat ? klageVurderingResultat.klageMedholdArsak : null,
  klageVurderingOmgjoer: klageVurderingResultat ? klageVurderingResultat.klageVurderingOmgjoer : null,
  klageVurdering: klageVurderingResultat ? klageVurderingResultat.klageVurdering : null,
  begrunnelse: klageVurderingResultat ? klageVurderingResultat.begrunnelse : null,
  fritekstTilBrev: klageVurderingResultat ? klageVurderingResultat.fritekstTilBrev : null,
}));


export const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak: (values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
    || values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK) ? values.klageMedholdArsak : null,
  klageVurderingOmgjoer: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const formName = 'BehandleAnkeForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  // const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const aksjonspunktCode = '7003';
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return state => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    formValues: behandlingFormValueSelector(formName)(state, 'begrunnelse', 'fritekstTilBrev', 'klageVurdering', 'klageVurderingOmgjoer', 'klageMedholdArsak'),
    sprakkode: getBehandlingSprak(state),
    onSubmit,
  });
};

const BehandleKlageForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BehandleAnkeFormImpl));

BehandleKlageForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK);


export default injectIntl(BehandleKlageForm);
