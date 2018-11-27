import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import {
  getSoknad, getFamiliehendelse, getPersonopplysning, getInnvilgetRelatertTilgrensendeYtelserForAnnenForelder,
  getAksjonspunkter,
} from 'behandling/behandlingSelectors';
import { behandlingForm } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import withDefaultToggling from 'fakta/withDefaultToggling';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
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
  [getSoknad, getFamiliehendelse, getPersonopplysning, getInnvilgetRelatertTilgrensendeYtelserForAnnenForelder, getAksjonspunkter],
  (soknad, familiehendelse, personopplysning, innvilgetRelatertTilgrensendeYtelserForAnnenForelder, aksjonspunkter) => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OMSORGSOVERTAKELSE
      || ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR);
    return {
      ...OmsorgOgForeldreansvarFaktaForm.buildInitialValues(soknad, familiehendelse, personopplysning, innvilgetRelatertTilgrensendeYtelserForAnnenForelder),
      ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkt),
    };
  },
);

const transformValues = (values, aksjonspunkt) => ({
  ...OmsorgOgForeldreansvarFaktaForm.transformValues(values, aksjonspunkt),
  ...{ begrunnelse: values.begrunnelse },
});

const mapStateToProps = (state, initialProps) => ({
  erAksjonspunktForeldreansvar: initialProps.aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR,
  initialValues: buildInitialValues(state),
  onSubmit: values => initialProps.submitCallback([transformValues(values, initialProps.aksjonspunkter[0])]),
  vilkarTypes: getKodeverk(kodeverkTyper.OMSORGSOVERTAKELSE_VILKAR_TYPE)(state),
  relatertYtelseTypes: getKodeverk(kodeverkTyper.RELATERT_YTELSE_TYPE)(state),
});

const omsorgOgForeldreansvarAksjonspunkter = [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR];

const ConnectedComponent = connect(mapStateToProps)(behandlingForm({
  form: 'OmsorgOgForeldreansvarInfoPanel',
  validate: OmsorgOgForeldreansvarFaktaForm.validate,
})(injectIntl(OmsorgOgForeldreansvarInfoPanelImpl)));
const OmsorgOgForeldreansvarInfoPanel = withDefaultToggling(faktaPanelCodes.OMSORGSVILKARET, omsorgOgForeldreansvarAksjonspunkter)(ConnectedComponent);

OmsorgOgForeldreansvarInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => omsorgOgForeldreansvarAksjonspunkter.includes(ap.definisjon.kode));

export default OmsorgOgForeldreansvarInfoPanel;
