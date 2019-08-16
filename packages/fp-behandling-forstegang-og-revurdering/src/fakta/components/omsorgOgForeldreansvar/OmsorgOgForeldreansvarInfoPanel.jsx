import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import {
  FaktaBegrunnelseTextField,
  FaktaEkspandertpanel,
  withDefaultToggling,
} from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import {
  getFamiliehendelseGjeldende, getPersonopplysning, getInnvilgetRelatertTilgrensendeYtelserForAnnenForelder,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { getKodeverk, getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import OmsorgOgForeldreansvarFaktaForm from './OmsorgOgForeldreansvarFaktaForm';

/**
 * OmsorgOgForeldreansvarInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Omsorgsvilkåret.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const OmsorgOgForeldreansvarInfoPanelImpl = ({
  intl,
  erAksjonspunktForeldreansvar,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  vilkarTypes,
  initialValues,
  relatertYtelseTypes,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'OmsorgOgForeldreansvarInfoPanel.Omsorg' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.OMSORGSVILKARET)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.OMSORGSVILKARET}
    readOnly={readOnly}
  >
    <form onSubmit={formProps.handleSubmit}>
      <OmsorgOgForeldreansvarFaktaForm
        erAksjonspunktForeldreansvar={erAksjonspunktForeldreansvar}
        readOnly={readOnly}
        vilkarTypes={vilkarTypes}
        relatertYtelseTypes={relatertYtelseTypes}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
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
      <FaktaSubmitButton formName={formProps.form} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
    </form>
  </FaktaEkspandertpanel>
);

OmsorgOgForeldreansvarInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
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
  ...formPropTypes,
};

const buildInitialValues = createSelector(
  [behandlingSelectors.getSoknad, getFamiliehendelseGjeldende, getPersonopplysning, getInnvilgetRelatertTilgrensendeYtelserForAnnenForelder,
    behandlingSelectors.getAksjonspunkter, getAlleKodeverk],
  (soknad, familiehendelse, personopplysning, innvilgetRelatertTilgrensendeYtelserForAnnenForelder, aksjonspunkter, alleKodeverk) => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OMSORGSOVERTAKELSE
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback([transformValues(values, ownProps.aksjonspunkter[0])]);
  const erAksjonspunktForeldreansvar = ownProps.aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR;
  const vilkarTypes = getKodeverk(kodeverkTyper.OMSORGSOVERTAKELSE_VILKAR_TYPE)(initialState);
  const relatertYtelseTypes = getKodeverk(kodeverkTyper.RELATERT_YTELSE_TYPE)(initialState);

  return state => ({
    initialValues: buildInitialValues(state),
    vilkarTypes,
    relatertYtelseTypes,
    erAksjonspunktForeldreansvar,
    onSubmit,
  });
};

const omsorgOgForeldreansvarAksjonspunkter = [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR];

const ConnectedComponent = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: 'OmsorgOgForeldreansvarInfoPanel',
  validate: OmsorgOgForeldreansvarFaktaForm.validate,
})(injectIntl(OmsorgOgForeldreansvarInfoPanelImpl)));
const OmsorgOgForeldreansvarInfoPanel = withDefaultToggling(faktaPanelCodes.OMSORGSVILKARET, omsorgOgForeldreansvarAksjonspunkter)(ConnectedComponent);

OmsorgOgForeldreansvarInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => omsorgOgForeldreansvarAksjonspunkter.includes(ap.definisjon.kode));

export default OmsorgOgForeldreansvarInfoPanel;
