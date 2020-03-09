import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { formatCurrencyWithKr, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import {
  PeriodLabel, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector } from '@fpsak-frontend/form';

const headerTextCodes = [
  'InntektOgYtelserFaktaPanel.Person',
  'InntektOgYtelserFaktaPanel.Employer',
  'InntektOgYtelserFaktaPanel.Period',
  'InntektOgYtelserFaktaPanel.Amount',
];

/**
 * InntektOgYtelserFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 * Viser inntektene relevante for søker. ReadOnly.
 */
const InntektOgYtelserFaktaPanelImpl = ({ inntekter, intl }) => {
  if (!inntekter || inntekter.length === 0) {
    return (
      <Ekspanderbartpanel
        tittel={intl.formatMessage({ id: 'InntektOgYtelserFaktaPanel.ApplicationInformation' })}
        tittelProps="element"
        border
      >
        <Normaltekst>
          <FormattedMessage id="InntektOgYtelserFaktaPanel.NoInformation" />
        </Normaltekst>
      </Ekspanderbartpanel>
    );
  }

  return (
    <Ekspanderbartpanel
      tittel={intl.formatMessage({ id: 'InntektOgYtelserFaktaPanel.ApplicationInformation' })}
      tittelProps="element"
      border
    >
      <Table headerTextCodes={headerTextCodes}>
        {inntekter.map((inntekt) => {
          const key = inntekt.person + inntekt.employer + inntekt.fom + inntekt.tom + inntekt.amount;
          return (
            <TableRow key={key} id={key}>
              <TableColumn>
                {inntekt.person}
              </TableColumn>
              <TableColumn>
                {inntekt.employer}
              </TableColumn>
              <TableColumn>
                <PeriodLabel showTodayString dateStringFom={inntekt.fom} dateStringTom={inntekt.tom} />
              </TableColumn>
              <TableColumn>
                {formatCurrencyWithKr(inntekt.amount)}
              </TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </Ekspanderbartpanel>
  );
};

InntektOgYtelserFaktaPanelImpl.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
};

InntektOgYtelserFaktaPanelImpl.defaultProps = {
  inntekter: [],
};

const mapStateToProps = (state, ownProps) => ({
  inntekter: behandlingFormValueSelector(`OppholdInntektOgPeriodeForm-${ownProps.id}`, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'inntekter'),
});

const InntektOgYtelserFaktaPanel = connect(mapStateToProps)(injectIntl(InntektOgYtelserFaktaPanelImpl));

const sortInntekter = (inntekt1, inntekt2) => {
  const nameDiff = inntekt1.person.localeCompare(inntekt2.person);
  return nameDiff === 0 ? moment(inntekt2.fom, ISO_DATE_FORMAT).diff(moment(inntekt1.fom, ISO_DATE_FORMAT)) : nameDiff;
};

InntektOgYtelserFaktaPanel.buildInitialValues = (person, inntekt) => {
  if (inntekt === null) {
    return [];
  }
  const inntekter = inntekt
    .map((i) => ({
      person: i.navn,
      employer: i.utbetaler,
      fom: i.fom,
      tom: i.tom,
      amount: i.belop,
    }));
  const inntekterSoker = inntekter.filter((i) => i.person === person.navn).sort(sortInntekter);
  const inntekterOther = inntekter.filter((i) => i.person !== person.navn).sort(sortInntekter);

  return {
    inntekter: inntekterSoker.concat(inntekterOther),
  };
};

export default InntektOgYtelserFaktaPanel;
