import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { behandlingForm } from '@fpsak-frontend/fp-felles';
import { addDaysToDate, omit } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import OpptjeningFaktaForm from './OpptjeningFaktaForm';

export const formName = 'OpptjeningInfoPanel';

/**
 * OpptjeningInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Opptjeningsvilkåret.
 */
export const OpptjeningInfoPanel = ({
  hasOpenAksjonspunkter,
  readOnly,
  aksjonspunkt,
  behandlingId,
  behandlingVersjon,
  fastsattOpptjening,
  dokStatus,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <OpptjeningFaktaForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      opptjeningFomDato={fastsattOpptjening.opptjeningFom}
      opptjeningTomDato={fastsattOpptjening.opptjeningTom}
      dokStatus={dokStatus}
      readOnly={readOnly}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      hasAksjonspunkt={aksjonspunkt !== undefined}
      formName={formName}
      submitting={formProps.submitting}
      isDirty={formProps.dirty}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
    />
  </form>
);

OpptjeningInfoPanel.propTypes = {
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: aksjonspunktPropType,
  fastsattOpptjening: PropTypes.shape(),
  dokStatus: PropTypes.string,
  ...formPropTypes,
};

OpptjeningInfoPanel.defaultProps = {
  aksjonspunkt: undefined,
  fastsattOpptjening: {},
  dokStatus: undefined,
};

const addDay = (date) => addDaysToDate(date, 1);
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
  [(ownProps) => ownProps.opptjeningAktiviteter,
    (ownProps) => ownProps.fastsattOpptjening,
    (ownProps) => ownProps.aksjonspunkter],
  (opptjeningActivities, fastsattOpptjening, aksjonspunkter) => fastsattOpptjening
    && ({
      opptjeningActivities: opptjeningActivities
        .filter((oa) => moment(fastsattOpptjening.opptjeningFom).isBefore(addDay(oa.opptjeningTom)))
        .filter((oa) => moment(oa.opptjeningFom).isBefore(addDay(fastsattOpptjening.opptjeningTom)))
        .map((oa, index) => ({
          ...oa,
          ...buildPeriod(oa, fastsattOpptjening.opptjeningFom, fastsattOpptjening.opptjeningTom),
          id: index + 1,
        })),
      aksjonspunkt: aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) || null,
      fastsattOpptjening,
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

const transformValues = (values) => ({
  opptjeningAktivitetList: values.opptjeningActivities
    .map((oa) => transformPeriod(oa, addDay(values.fastsattOpptjening.opptjeningFom), addDay(values.fastsattOpptjening.opptjeningTom)))
    .map((oa) => omit(oa, 'id')),
  kode: values.aksjonspunkt[0].definisjon.kode,
});

const mapStateToPropsFactory = (initialState, { submitCallback }) => {
  const onSubmit = (values) => submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    aksjonspunkt: ownProps.aksjonspunkter[0],
    initialValues: buildInitialValues(ownProps),
    dirty: !ownProps.notSubmittable && ownProps.dirty,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(OpptjeningInfoPanel));
