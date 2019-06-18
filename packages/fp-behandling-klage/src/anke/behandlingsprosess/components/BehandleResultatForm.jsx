import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
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

const isVedtakUtenToTrinn = apCodes => apCodes.includes(aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL); // 5018
const isMedUnderskriver = apCodes => apCodes.includes(aksjonspunktCodes.FORESLA_VEDTAK); // 5015
const isFatterVedtak = apCodes => apCodes.includes(aksjonspunktCodes.FATTER_VEDTAK); // 5016

const getInnstilling = (formValues) => {
  console.log('getInnstilling: ', formValues);
  if (formValues === 'a') {
    return 'Ankebehandling.Resultat.Innstilling.Stadfest';
  }
  if (formValues === 'b') {
    return 'Ankebehandling.Resultat.Innstilling.Omgjores';
  }
  if (formValues === 'c') {
    return 'Ankebehandling.Resultat.Innstilling.Oppheves';
  }
  if (formValues === 'd') {
    return 'Ankebehandling.Resultat.Innstilling.Avvises';
  }
  return 'Ankebehandling.Resultat.Innstilling.Udefinert';
};

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
      <Row>
        <Column xs="12">
          <Undertekst><FormattedMessage id="Ankebehandling.Resultat.Innstilling" /></Undertekst>
          <Undertekst><FormattedMessage id={getInnstilling(formValues)} /></Undertekst>
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="12">
          <BehandlingspunktSubmitButton
            formName={formProps.form}
            isReadOnly={false}
            isSubmittable={canSubmit(formValues) && isMedUnderskriver(aksjonspunktCode) && !isFatterVedtak(aksjonspunktCode)}
            hasEmptyRequiredFields={false}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            textCode="Ankebehandling.Resultat.SendTilMedunderskriver"
          />
          <span>&nbsp;</span>
          <BehandlingspunktSubmitButton
            formName={formProps.form}
            isReadOnly={false}
            isSubmittable={canSubmit(formValues) && isVedtakUtenToTrinn(aksjonspunktCode) && !isFatterVedtak(aksjonspunktCode)}
            hasEmptyRequiredFields={false}
            isBehandlingFormSubmitting={isBehandlingFormSubmitting}
            isBehandlingFormDirty={isBehandlingFormDirty}
            hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            textCode="Ankebehandling.Resultat.FerdigstillAnke"
          />
          <span>&nbsp;</span>
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
