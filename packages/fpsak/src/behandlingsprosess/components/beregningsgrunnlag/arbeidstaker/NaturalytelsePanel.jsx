import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import moment from 'moment';
import { createSelector } from 'reselect';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import periodeAarsak from 'kodeverk/periodeAarsak';
import { getBeregningsgrunnlagPerioder } from 'behandling/behandlingSelectors';

import styles from './naturalytelsePanel.less';

const createArbeidsforholdKey = andel => `${andel.arbeidsgiverNavn}${andel.arbeidsforholdId}`;

const findArbeidsforholdMedFrafaltYtelse = periode => periode.beregningsgrunnlagPrStatusOgAndel.filter(andel => andel.bortfaltNaturalytelse !== undefined
    && andel.bortfaltNaturalytelse !== null
    && andel.bortfaltNaturalytelse !== 0);

const createHeaderData = perioder => perioder.map(periode => periode.beregningsgrunnlagPeriodeFom);

const createOrEditMapValue = (andel, mapValue, antallPerioderMedFrafaltYtelse) => {
  let newMapValue = [];
  if (mapValue === undefined) {
    newMapValue = [andel.arbeidsforhold.arbeidsgiverNavn];
    for (let i = 0; i < antallPerioderMedFrafaltYtelse; i += 1) {
      newMapValue.push(' ');
    }
  } else {
    newMapValue = mapValue.slice();
  }
  newMapValue.push(formatCurrencyNoKr(andel.bortfaltNaturalytelse));
  return newMapValue;
};

const fillMapWithMissingPeriodes = (arbeidsforholdMap, antallPerioderMedFrafaltYtelse) => {
  const copyOfMap = Object.assign({}, arbeidsforholdMap);
  Object.keys(copyOfMap).forEach((val) => {
    const listeMedKolonneInnhold = copyOfMap[val];
    // Fordi det første elementet i lista inneholder en liste length - 1 perioder
    const antallPerioderForArbeidsgiver = listeMedKolonneInnhold.length - 1;
    for (let i = antallPerioderForArbeidsgiver; i < antallPerioderMedFrafaltYtelse; i += 1) {
      listeMedKolonneInnhold.push(' ');
    }
    copyOfMap[val] = listeMedKolonneInnhold;
  });
  return copyOfMap;
};

// Denne metoden lager data til naturalytelsetabellen. Returnerer et map der key er arbeidsgiver + orgNr
// og value er summen av den frafalte ytelsen i de forskjellige periodene i kronologisk rekkefølge
// Eksempel på hvordan et map returnert av denne metoden kan se ut:
// arbeidsgivermap = {
//  arbeidsgivernavn123: ['arbeidsgiver 1', 66 100, 24 000]
//  arbeidsgivernavnTo651: ['arbeidsgiver 2', ' ', 21 000]
// }

const findAllePerioderMedBortfaltNaturalytelse = allePerioder => allePerioder
  .filter(periode => periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.NATURALYTELSE_BORTFALT));

export const createNaturalytelseTableData = createSelector([getBeregningsgrunnlagPerioder], (allePerioder = {}) => {
  const relevantePerioder = findAllePerioderMedBortfaltNaturalytelse(allePerioder);
  if (relevantePerioder.length === 0 || !relevantePerioder) {
    return undefined;
  }

  const headers = createHeaderData(relevantePerioder);
  const tempMap = {};
  let antallPerioderMedFrafaltYtelse = 0;
  relevantePerioder.forEach((periode) => {
    const andelerMedFrafaltYtelse = findArbeidsforholdMedFrafaltYtelse(periode);
    andelerMedFrafaltYtelse.forEach((andel) => {
      const mapKey = createArbeidsforholdKey(andel.arbeidsforhold);
      const mapValue = tempMap[mapKey];
      tempMap[mapKey] = createOrEditMapValue(andel, mapValue, antallPerioderMedFrafaltYtelse);
    });
    antallPerioderMedFrafaltYtelse += 1;
  });
  const arbeidsforholdPeriodeMap = fillMapWithMissingPeriodes(tempMap, antallPerioderMedFrafaltYtelse);
  return {
    arbeidsforholdPeriodeMap,
    headers,
  };
});

const createNaturalYtelseRows = (arbeidsMap) => {
  const rows = [];
  Object.keys(arbeidsMap).forEach((val) => {
    const list = arbeidsMap[val];
    let valueKey = 0;
    rows.push(
      <TableRow key={val}>
        {list.map((element) => {
          valueKey += 1;
          return (
            <TableColumn key={`naturalytelse_val_${valueKey}`}>
              <Normaltekst>{element}</Normaltekst>
            </TableColumn>
          );
        })}
      </TableRow>,
    );
  });
  return rows;
};

const createHeaders = (listOfYears) => {
  const headers = [<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Naturalytelse" />];
  const headerString = 'Beregningsgrunnlag.AarsinntektPanel.OpphortYtelse';
  listOfYears.forEach((aar) => {
    headers.push(
      <FormattedMessage
        id={headerString}
        key={aar.toString()}
        values={{ dato: moment(aar, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) }}
      />,
    );
  });
  return headers;
};
/**
 * NaturalytelsePanel
 *
 * Presentasjonskomponent. Viser en tabell med oversikt over hvilke arbeidsgivere som har hatt bortfall
 * av naturalytelse og for hvilke perioder det gjelder.
 */
const NaturalytelsePanel = ({
  tableData,
}) => {
  if (!tableData) {
    return null;
  }
  return (
    <Table headerTextCodes={createHeaders(tableData.headers)} noHover allowFormattedHeader classNameTable={styles.ytelseTable}>
      {createNaturalYtelseRows(tableData.arbeidsforholdPeriodeMap)}
    </Table>
  );
};
NaturalytelsePanel.propTypes = {
  tableData: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  tableData: createNaturalytelseTableData(state),
});

export default connect(mapStateToProps)(NaturalytelsePanel);
