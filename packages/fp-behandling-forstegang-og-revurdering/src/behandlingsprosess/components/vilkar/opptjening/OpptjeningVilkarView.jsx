import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';

import { getSelectedBehandlingspunktStatus } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import VilkarResultPanel from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPanel';
import {
  getBehandlingFastsattOpptjeningFomDate, getBehandlingFastsattOpptjeningTomDate, getBehandlingFastsattOpptjeningActivities,
  getBehandlingFastsattOpptjeningperiodeMnder, getBehandlingFastsattOpptjeningperiodeDager,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer, FadingPanel, PeriodLabel } from '@fpsak-frontend/shared-components';
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
  isAksjonspunktOpen,
  status,
  ...formProps
}) => (
  <FadingPanel withoutTopMargin>
    <form onSubmit={formProps.handleSubmit}>
      {isAksjonspunktOpen
        && <VilkarResultPanel status={status} />
      }
      <VerticalSpacer fourPx />
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
      )
      }
    </form>
  </FadingPanel>
);

OpptjeningVilkarViewImpl.propTypes = {
  fastsattOpptjeningActivities: PropTypes.arrayOf(PropTypes.shape()),
  monthsAndDays: PropTypes.shape().isRequired,
  opptjeningFomDate: PropTypes.string.isRequired,
  opptjeningTomDate: PropTypes.string.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
};

OpptjeningVilkarViewImpl.defaultProps = {
  fastsattOpptjeningActivities: [],
};

const monthsAndDays = createSelector(
  [getBehandlingFastsattOpptjeningperiodeMnder, getBehandlingFastsattOpptjeningperiodeDager],
  (opptjeningperiodeMnder, opptjeningperiodeDager) => ({ months: opptjeningperiodeMnder, days: opptjeningperiodeDager }),
);

const mapStateToProps = state => ({
  status: getSelectedBehandlingspunktStatus(state),
  monthsAndDays: monthsAndDays(state),
  fastsattOpptjeningActivities: getBehandlingFastsattOpptjeningActivities(state),
  opptjeningFomDate: getBehandlingFastsattOpptjeningFomDate(state),
  opptjeningTomDate: getBehandlingFastsattOpptjeningTomDate(state),
});

const OpptjeningVilkarView = connect(mapStateToProps)(behandlingForm({
  form: 'OpptjeningVilkarForm',
})(OpptjeningVilkarViewImpl));

OpptjeningVilkarView.supports = behandlingspunkt => behandlingspunkt === behandlingspunktCodes.OPPTJENING;

export default OpptjeningVilkarView;
