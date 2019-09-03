import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import {
  getBehandlingFastsattOpptjeningActivities,
  getBehandlingFastsattOpptjeningFomDate,
  getBehandlingFastsattOpptjeningperiodeDager,
  getBehandlingFastsattOpptjeningperiodeMnder,
  getBehandlingFastsattOpptjeningTomDate,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';


/**
 * OpptjeningVilkarView
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */
export const OpptjeningVilkarViewImpl = ({
  fastsattOpptjeningActivities,
  monthsAndDays,
  opptjeningFomDate,
  opptjeningTomDate,
}) => (
  <>
    <FormattedMessage
      id="OpptjeningVilkarView.MonthsAndDays"
      values={{ months: monthsAndDays.months, days: monthsAndDays.days }}
    />
    <Normaltekst>
      <PeriodLabel dateStringFom={opptjeningFomDate} dateStringTom={opptjeningTomDate} />
    </Normaltekst>
    <VerticalSpacer fourPx />
    { fastsattOpptjeningActivities.length > 0
      && (
      <OpptjeningTimeLineLight
        opptjeningPeriods={fastsattOpptjeningActivities}
        opptjeningFomDate={opptjeningFomDate}
        opptjeningTomDate={opptjeningTomDate}
      />
      )}
  </>
);

OpptjeningVilkarViewImpl.propTypes = {
  fastsattOpptjeningActivities: PropTypes.arrayOf(PropTypes.shape()),
  monthsAndDays: PropTypes.shape().isRequired,
  opptjeningFomDate: PropTypes.string.isRequired,
  opptjeningTomDate: PropTypes.string.isRequired,
};

OpptjeningVilkarViewImpl.defaultProps = {
  fastsattOpptjeningActivities: [],
};

const monthsAndDays = createSelector(
  [getBehandlingFastsattOpptjeningperiodeMnder, getBehandlingFastsattOpptjeningperiodeDager],
  (opptjeningperiodeMnder, opptjeningperiodeDager) => ({ months: opptjeningperiodeMnder, days: opptjeningperiodeDager }),
);

const mapStateToProps = (state) => ({
  monthsAndDays: monthsAndDays(state),
  fastsattOpptjeningActivities: getBehandlingFastsattOpptjeningActivities(state),
  opptjeningFomDate: getBehandlingFastsattOpptjeningFomDate(state),
  opptjeningTomDate: getBehandlingFastsattOpptjeningTomDate(state),
});

const OpptjeningVilkarView = connect(mapStateToProps)(OpptjeningVilkarViewImpl);

export default OpptjeningVilkarView;
