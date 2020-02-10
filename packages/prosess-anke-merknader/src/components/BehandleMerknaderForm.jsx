import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { AksjonspunktHelpTextTemp, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import {
  BehandlingspunktSubmitButton, behandlingForm, behandlingFormValueSelector, hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting,
} from '@fpsak-frontend/fp-felles';

import PreviewAnkeLink from './PreviewAnkeLink';

const AnkeMerknader = ({
  readOnly,
  handleSubmit,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunktCode,
  formValues,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel><FormattedMessage id="Ankebehandling.Merknad.Title" /></Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.Merknad.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="7">
          <FormattedMessage id="Ankebehandling.Merknad.Merknader" />
          <RadioGroupField
            name="erMerknaderMottatt"
            validate={[required]}
            direction="horisontal"
            readOnly={readOnly}
          >
            <RadioOption value="ja" label={{ id: 'Ankebehandling.Merknad.Merknader.Ja' }} />
            <RadioOption value="nei" label={{ id: 'Ankebehandling.Merknad.Merknader.Nei' }} />
          </RadioGroupField>
        </Column>
      </Row>

      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="7">
          <TextAreaField readOnly={readOnly} readOnlyHideEmpty={false} label={{ id: 'Ankebehandling.Merknad.Merknader.Kommentarer' }} name="merknadKommentar" />
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="8">
          <BehandlingspunktSubmitButton
            formName={formProps.form}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            isReadOnly={readOnly}
            isSubmittable={!readOnly}
            hasEmptyRequiredFields={false}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
          />
          <PreviewAnkeLink
            previewCallback={previewCallback}
            fritekstTilBrev={formValues.fritekstTilBrev}
            ankeVurdering={formValues.ankeVurdering}
            aksjonspunktCode={aksjonspunktCode}
          />
        </Column>
      </Row>
    </FadingPanel>
  </form>
);

AnkeMerknader.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveAnke: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

AnkeMerknader.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

const ankeMerknaderFormName = 'ankeMerknaderForm';

const transformValues = (values, aksjonspunktCode) => ({
  erMerknaderMottatt: values.erMerknaderMottatt === 'ja',
  merknadKommentar: values.merknadKommentar,
  kode: aksjonspunktCode,
});

const buildInitialValues = createSelector([(ownProps) => ownProps.ankeVurderingResultat], (resultat) => ({
  ankeVurdering: resultat ? resultat.ankeVurdering : null,
  begrunnelse: resultat ? resultat.begrunnelse : null,
  fritekstTilBrev: resultat ? resultat.fritekstTilBrev : null,
}));

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const aksjonspunktCode = initialOwnProps.aksjonspunkter[0].definisjon.kode;
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return (state, ownProps) => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(ankeMerknaderFormName, ownProps.behandlingId, ownProps.behandlingVersjon)(state,
      'ankeVurdering', 'fritekstTilBrev'),
    onSubmit,
  });
};

const BehandleMerknaderForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: ankeMerknaderFormName,
})(AnkeMerknader));

export default BehandleMerknaderForm;
