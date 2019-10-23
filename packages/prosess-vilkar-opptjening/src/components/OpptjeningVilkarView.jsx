import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';

import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';


/**
 * OpptjeningVilkarView
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */
export const OpptjeningVilkarViewImpl = ({
  months,
  days,
  fastsattOpptjeningActivities,
  opptjeningFomDate,
  opptjeningTomDate,
}) => (
  <>
    <FormattedMessage
      id="OpptjeningVilkarView.MonthsAndDays"
      values={{ months, days }}
    />
    <Normaltekst>
      <PeriodLabel dateStringFom={opptjeningFomDate} dateStringTom={opptjeningTomDate} />
    </Normaltekst>
    <VerticalSpacer fourPx />
    {fastsattOpptjeningActivities.length > 0 && (
      <OpptjeningTimeLineLight
        opptjeningPeriods={fastsattOpptjeningActivities}
        opptjeningFomDate={opptjeningFomDate}
        opptjeningTomDate={opptjeningTomDate}
      />
    )}
  </>
);

OpptjeningVilkarViewImpl.propTypes = {
  months: PropTypes.number.isRequired,
  days: PropTypes.number.isRequired,
  fastsattOpptjeningActivities: PropTypes.arrayOf(PropTypes.shape()),
  opptjeningFomDate: PropTypes.string.isRequired,
  opptjeningTomDate: PropTypes.string.isRequired,
};

OpptjeningVilkarViewImpl.defaultProps = {
  fastsattOpptjeningActivities: [],
};

export default OpptjeningVilkarViewImpl;
