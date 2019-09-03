import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';

import behandlingspunktAnkeSelectors from 'behandlingAnke/src/behandlingsprosess/selectors/behandlingsprosessAnkeSelectors';
import {
  behandlingFormAnke,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from 'behandlingAnke/src/behandlingFormAnke';
import PreviewAnkeLink from '../felles/PreviewAnkeLink';
import behandlingSelectors from '../../../selectors/ankeBehandlingSelectors';

const AnkeMerknader = ({
  readOnly,
  handleSubmit,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunktCode,
  formValues,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel><FormattedMessage id="Ankebehandling.Merknad.Title" /></Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.Merknad.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
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
      <Row>
        <Column xs="8">
          <BehandlingspunktSubmitButton
            formName={formProps.form}
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

const buildInitialValues = createSelector([behandlingSelectors.getBehandlingAnkeVurderingResultat], (resultat) => ({
  ankeVurdering: resultat ? resultat.ankeVurdering : null,
  begrunnelse: resultat ? resultat.begrunnelse : null,
  fritekstTilBrev: resultat ? resultat.fritekstTilBrev : null,
}));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunktCode = behandlingspunktAnkeSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return (state) => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    formValues: behandlingFormValueSelector(ankeMerknaderFormName)(state, 'ankeVurdering', 'fritekstTilBrev'),
    onSubmit,
  });
};

const BehandleMerknaderForm = connect(mapStateToPropsFactory)(behandlingFormAnke({
  form: ankeMerknaderFormName,
})(AnkeMerknader));

export default BehandleMerknaderForm;
