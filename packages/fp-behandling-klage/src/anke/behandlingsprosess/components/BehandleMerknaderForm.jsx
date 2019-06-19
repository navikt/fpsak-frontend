import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import {
 RadioGroupField, RadioOption, TextAreaField,
} from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';

import {
  behandlingForm, behandlingFormValueSelector, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingKlage/src/anke/behandlingForm';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import { getSelectedBehandlingspunktAksjonspunkter } from '../BehandlingsprosessAnkeSelectors';
import { buildInitialValues } from './BehandleAnkeForm';
import PreviewAnkeLink from './PreviewAnkeLink';

const canPreview = formValues => (true);
const canSubmit = formValues => (true);

const AnkeMerknader = ({
  readOnly,
  handleSubmit,
  saveKlage,
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
      <Undertittel>{intl.formatMessage({ id: 'Ankebehandling.Merknad.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.Merknad.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="7">
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
          <TextAreaField label="Kommentar til merknader" name="kommentar" />
        </Column>
      </Row>
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
            <PreviewAnkeLink
              previewCallback={previewCallback}
              fritekstTilBrev={formValues.fritekstTilBrev}
              klageVurdering={formValues.ankeVurdering}
              aksjonspunktCode={aksjonspunktCode}
            />
          )
          }
        </Column>
      </Row>
    </FadingPanel>
  </form>
);

AnkeMerknader.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  behandlinger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

AnkeMerknader.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};


const ankeMerknaderFormName = 'ankeMerknaderForm';

const transformValues = values => ({
  erMerknaderMottatt: values.erMerknaderMottatt,
  merknadKommentar: values.merknadKommentar,
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const onSubmit = values => ownProps.submitCallback([transformValues(values)]);
  return state => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    formValues: behandlingFormValueSelector(ankeMerknaderFormName)(state,
      'erMerknaderMottatt',
      'merknadKommentar'),
    onSubmit,
  });
};

const BehandleMerknaderForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: ankeMerknaderFormName,
})(AnkeMerknader));

export default BehandleMerknaderForm;
