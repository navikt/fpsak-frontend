import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  behandlingForm, behandlingFormValueSelector, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingKlage/src/anke/behandlingForm';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import { getBehandlinger } from 'behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingspunktAksjonspunkter } from '../BehandlingsprosessAnkeSelectors';
import { buildInitialValues, transformValues } from './BehandleAnkeForm';
import PreviewAnkeLink from './PreviewAnkeLink';

const canPreview = formValues => (true);
const canSubmit = formValues => (true);

const AnkeResultatForm = ({
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
      <Undertittel><FormattedMessage id="Ankebehandling.Resultat.Title" /></Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Ankebehandling.Resultat.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>

      <VerticalSpacer sixteenPx />
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

AnkeResultatForm.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  behandlinger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

AnkeResultatForm.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};


const formName = 'ankeMerknaderForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return state => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    formValues: behandlingFormValueSelector(formName)(state,
      'kommentar',
      'merknader'),
    behandlinger: getBehandlinger(state),
    onSubmit,
  });
};

const BehandleResultatForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(AnkeResultatForm));

export default BehandleResultatForm;
