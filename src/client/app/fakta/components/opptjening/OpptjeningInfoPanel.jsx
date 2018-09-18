import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';

import { addDaysToDate } from 'utils/dateUtils';
import vilkarType from 'kodeverk/vilkarType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { omit } from 'utils/objectUtils';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import { getBehandlingFastsattOpptjening, getBehandlingOpptjeningActivities } from 'behandling/behandlingSelectors';
import { behandlingForm } from 'behandling/behandlingForm';
import withDefaultToggling from 'fakta/withDefaultToggling';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import OpptjeningFaktaForm from './OpptjeningFaktaForm';

export const formName = 'OpptjeningInfoPanel';

/**
 * OpptjeningInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Opptjeningsvilkåret.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const OpptjeningInfoPanelImpl = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  readOnly,
  aksjonspunkt,
  hasFastsattOpptjening,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'OpptjeningInfoPanel.KontrollerFaktaForOpptjening' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.OPPTJENINGSVILKARET)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.OPPTJENINGSVILKARET}
    readOnly={readOnly}
    disabled={!hasFastsattOpptjening}
    disabledTextCode="OpptjeningInfoPanel.KontrollerFaktaForOpptjening"
  >
    <form onSubmit={formProps.handleSubmit}>
      <OpptjeningFaktaForm
        readOnly={readOnly}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        hasAksjonspunkt={aksjonspunkt !== undefined}
        formName={formName}
        submitting={formProps.submitting}
        isDirty={formProps.dirty}
      />
    </form>
  </FaktaEkspandertpanel>
);

OpptjeningInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: aksjonspunktPropType,
  ...formPropTypes,
};

OpptjeningInfoPanelImpl.defaultProps = {
  aksjonspunkt: undefined,
};

const addDay = date => addDaysToDate(date, 1);
const getOpptjeningsperiodeIfEqual = (
  activityDate, opptjeningsperiodeDate,
) => (moment(addDay(activityDate)).isSame(opptjeningsperiodeDate) ? opptjeningsperiodeDate : activityDate);

const buildPeriod = (activity, opptjeningsperiodeFom, opptjeningsperiodeTom) => {
  const fomDate = moment(activity.opptjeningFom).isBefore(opptjeningsperiodeFom)
    ? opptjeningsperiodeFom
    : getOpptjeningsperiodeIfEqual(activity.opptjeningFom, opptjeningsperiodeTom);
  const tomDate = moment(activity.opptjeningTom).isAfter(opptjeningsperiodeTom)
    ? opptjeningsperiodeTom
    : getOpptjeningsperiodeIfEqual(activity.opptjeningTom, opptjeningsperiodeFom);
  return {
    originalFom: activity.opptjeningFom,
    originalTom: activity.opptjeningTom,
    opptjeningFom: fomDate,
    opptjeningTom: tomDate,
  };
};

export const buildInitialValues = createSelector(
  [getBehandlingOpptjeningActivities, getBehandlingFastsattOpptjening],
  (opptjeningActivities, fastsattOpptjening) => fastsattOpptjening
    && ({
      opptjeningActivities: opptjeningActivities
        .filter(oa => moment(fastsattOpptjening.opptjeningFom).isBefore(addDay(oa.opptjeningTom)))
        .filter(oa => moment(oa.opptjeningFom).isBefore(addDay(fastsattOpptjening.opptjeningTom)))
        .map((oa, index) => ({
          ...oa,
          ...buildPeriod(oa, fastsattOpptjening.opptjeningFom, fastsattOpptjening.opptjeningTom),
          id: index + 1,
        })),
    }),
);

const transformPeriod = (activity, opptjeningsperiodeFom, opptjeningsperiodeTom) => {
  let fomDate = activity.opptjeningFom;
  if (activity.originalFom && moment(activity.originalFom).isBefore(opptjeningsperiodeFom)) {
    fomDate = fomDate === opptjeningsperiodeFom ? activity.originalFom : fomDate;
  }
  let tomDate = activity.opptjeningTom;
  if (activity.originalTom && moment(activity.originalTom).isAfter(opptjeningsperiodeTom)) {
    tomDate = tomDate === opptjeningsperiodeTom ? activity.originalTom : tomDate;
  }

  return {
    ...activity,
    opptjeningFom: fomDate,
    opptjeningTom: tomDate,
  };
};

const transformValues = (values, fastsattOpptjening, aksjonspunkt) => ({
  opptjeningAktivitetList: values.opptjeningActivities
    .map(oa => transformPeriod(oa, addDay(fastsattOpptjening.opptjeningFom), addDay(fastsattOpptjening.opptjeningTom)))
    .map(oa => omit(oa, 'id')),
  kode: aksjonspunkt.definisjon.kode,
});

const mapStateToProps = (state, initialProps) => {
  const fastsattOpptjening = getBehandlingFastsattOpptjening(state);

  return {
    aksjonspunkt: initialProps.aksjonspunkter[0],
    hasFastsattOpptjening: !!fastsattOpptjening,
    initialValues: buildInitialValues(state),
    onSubmit: values => initialProps.submitCallback([transformValues(values, fastsattOpptjening, initialProps.aksjonspunkter[0])]),
    dirty: !initialProps.notSubmittable && initialProps.dirty,
  };
};

const opptjeningAksjonspunkter = [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING];

const OpptjeningInfoPanel = withDefaultToggling(faktaPanelCodes.OPPTJENINGSVILKARET, opptjeningAksjonspunkter)(connect(mapStateToProps)(behandlingForm({
  form: formName,
})(injectIntl(OpptjeningInfoPanelImpl))));

OpptjeningInfoPanel.supports = vilkarCodes => vilkarCodes.some(code => code === vilkarType.OPPTJENINGSVILKARET);

export default OpptjeningInfoPanel;
