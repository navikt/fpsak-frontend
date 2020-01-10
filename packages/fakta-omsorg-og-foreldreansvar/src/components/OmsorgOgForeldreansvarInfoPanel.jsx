import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import {
  getKodeverknavnFn, FaktaBegrunnelseTextField, FaktaSubmitButton, behandlingForm,
} from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import OmsorgOgForeldreansvarFaktaForm from './OmsorgOgForeldreansvarFaktaForm';

/**
 * OmsorgOgForeldreansvarInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Omsorgsvilkåret.
 */
export const OmsorgOgForeldreansvarInfoPanelImpl = ({
  behandlingId,
  behandlingVersjon,
  erAksjonspunktForeldreansvar,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  vilkarTypes,
  initialValues,
  relatertYtelseTypes,
  alleMerknaderFraBeslutter,
  soknad,
  gjeldendeFamiliehendelse,
  personopplysninger,
  ...formProps
}) => (
  <>
    <form onSubmit={formProps.handleSubmit}>
      <OmsorgOgForeldreansvarFaktaForm
        erAksjonspunktForeldreansvar={erAksjonspunktForeldreansvar}
        readOnly={readOnly}
        vilkarTypes={vilkarTypes}
        relatertYtelseTypes={relatertYtelseTypes}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        soknad={soknad}
        gjeldendeFamiliehendelse={gjeldendeFamiliehendelse}
        personopplysninger={personopplysninger}
      />
      <VerticalSpacer twentyPx />
      <FaktaBegrunnelseTextField
        isDirty={formProps.dirty}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasBegrunnelse={!!initialValues.begrunnelse}
        labelCode={erAksjonspunktForeldreansvar
          ? 'OmsorgOgForeldreansvarInfoPanel.BegrunnelseTitleFp'
          : 'OmsorgOgForeldreansvarInfoPanel.BegrunnelseTitleEs'}
      />
      <VerticalSpacer twentyPx />
      <FaktaSubmitButton
        formName={formProps.form}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      />
    </form>
  </>
);

OmsorgOgForeldreansvarInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  erAksjonspunktForeldreansvar: PropTypes.bool.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  vilkarTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  ...formPropTypes,
};

const buildInitialValues = createSelector(
  [(ownProps) => ownProps.soknad,
    (ownProps) => ownProps.gjeldendeFamiliehendelse,
    (ownProps) => ownProps.personopplysninger,
    (ownProps) => ownProps.innvilgetRelatertTilgrensendeYtelserForAnnenForelder,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.alleKodeverk],
  (soknad, familiehendelse, personopplysning, innvilgetRelatertTilgrensendeYtelserForAnnenForelder, aksjonspunkter, alleKodeverk) => {
    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.OMSORGSOVERTAKELSE
      || ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR);
    return {
      ...OmsorgOgForeldreansvarFaktaForm.buildInitialValues(soknad, familiehendelse, personopplysning,
        innvilgetRelatertTilgrensendeYtelserForAnnenForelder, getKodeverknavnFn(alleKodeverk, kodeverkTyper)),
      ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkt),
    };
  },
);

const transformValues = (values, aksjonspunkt) => ({
  ...OmsorgOgForeldreansvarFaktaForm.transformValues(values, aksjonspunkt),
  ...{ begrunnelse: values.begrunnelse },
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { submitCallback, aksjonspunkter, alleKodeverk } = initialOwnProps;
  const onSubmit = (values) => submitCallback([transformValues(values, aksjonspunkter[0])]);
  const erAksjonspunktForeldreansvar = aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR;
  const vilkarTypes = alleKodeverk[kodeverkTyper.OMSORGSOVERTAKELSE_VILKAR_TYPE];
  const relatertYtelseTypes = alleKodeverk[kodeverkTyper.RELATERT_YTELSE_TYPE];

  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    vilkarTypes,
    relatertYtelseTypes,
    erAksjonspunktForeldreansvar,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'OmsorgOgForeldreansvarInfoPanel',
  validate: OmsorgOgForeldreansvarFaktaForm.validate,
})(injectIntl(OmsorgOgForeldreansvarInfoPanelImpl)));
