import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import moment from 'moment';

import { ISO_DATE_FORMAT } from 'utils/formats';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import { formatCurrencyWithKr } from 'utils/currencyUtils';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import PeriodLabel from 'sharedComponents/PeriodLabel';

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
const InntektOgYtelserFaktaPanelImpl = ({
  inntekter,
}) => {
  if (!inntekter || inntekter.length === 0) {
    return (
      <FaktaGruppe titleCode="InntektOgYtelserFaktaPanel.ApplicationInformation">
        <Normaltekst>
          <FormattedMessage id="InntektOgYtelserFaktaPanel.NoInformation" />
        </Normaltekst>
      </FaktaGruppe>
    );
  }

  return (
    <FaktaGruppe titleCode="InntektOgYtelserFaktaPanel.ApplicationInformation">
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
        })
        }
      </Table>
    </FaktaGruppe>
  );
};

InntektOgYtelserFaktaPanelImpl.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape()),
};

InntektOgYtelserFaktaPanelImpl.defaultProps = {
  inntekter: [],
};

const InntektOgYtelserFaktaPanel = connect(state => ({
  inntekter: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'inntekter'),
}))(InntektOgYtelserFaktaPanelImpl);

const sortInntekter = (inntekt1, inntekt2) => {
  const nameDiff = inntekt1.person.localeCompare(inntekt2.person);
  return nameDiff === 0 ? moment(inntekt2.fom, ISO_DATE_FORMAT).diff(moment(inntekt1.fom, ISO_DATE_FORMAT)) : nameDiff;
};

InntektOgYtelserFaktaPanel.buildInitialValues = (person, medlem) => {
  if (medlem === null || medlem.inntekt === null) {
    return [];
  }
  const inntekter = medlem.inntekt
    .map(i => ({
      person: i.navn,
      employer: i.utbetaler,
      fom: i.fom,
      tom: i.tom,
      amount: i.belop,
    }));
  const inntekterSoker = inntekter.filter(i => i.person === person.navn).sort(sortInntekter);
  const inntekterOther = inntekter.filter(i => i.person !== person.navn).sort(sortInntekter);

  return {
    inntekter: inntekterSoker.concat(inntekterOther),
  };
};

export default InntektOgYtelserFaktaPanel;
