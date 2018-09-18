import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';

import styles from './grunnlagForAarsinntektPanelSN.less';

const createYearHeaders = (relevantAndel) => {
  const fomY = moment(relevantAndel.beregningsgrunnlagFom).get('year');
  const tomY = moment(relevantAndel.beregningsgrunnlagTom).get('year');
  const headers = [<FormattedMessage
    id="Beregningsgrunnlag.AarsinntektPanel.TomString"
    key="TomStringITabellTittel"
  />,
    <FormattedMessage
      id="Beregningsgrunnlag.AarsinntektPanel.Aar"
      values={{ aar: tomY.toString() }}
      key={`InntektSistseTreÅr_${tomY.toString()}`}
    />];
  const diff = tomY - fomY;
  if (diff > 0) {
    let currYear = tomY - 1;
    while (currYear > fomY) {
      headers.push(<FormattedMessage
        id="Beregningsgrunnlag.AarsinntektPanel.Aar"
        values={{ aar: currYear.toString() }}
        key={`InntektSistseTreÅr_${currYear.toString()}`}
      />);
      currYear -= 1;
    }
    headers.push(<FormattedMessage
      id="Beregningsgrunnlag.AarsinntektPanel.Aar"
      values={{ aar: fomY.toString() }}
      key={`InntektSistseTreÅr_${currYear.toString()}`}
    />);
  }
  if (relevantAndel.pgiSnitt !== undefined && !relevantAndel.erNyIArbeidslivet) {
    headers.push(<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.BeregnetAarsinntekt" />);
  }
  return headers;
};
const createPgiListe = (relevantAndel) => {
  const list = [];
  list.push({
    pgiVerdi: relevantAndel.pgi1,
    key: 'Pgi1',
  });
  list.push({
    pgiVerdi: relevantAndel.pgi2,
    key: 'Pgi2',
  });
  list.push({
    pgiVerdi: relevantAndel.pgi3,
    key: 'Pgi3',
  });
  return list;
};

/**
 * GrunnlagForAarsinntektPanelSN
 *
 * Presentasjonskomponent. Viser beregningsgrunnlagstabellen for selvstendig næringsdrivende.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer selvstendig næringsdrivende.
 */
export const GrunnlagForAarsinntektPanelSN = ({
  alleAndeler,
}) => {
  const relevantAndel = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)[0];
  const pgiVerdier = createPgiListe(relevantAndel);
  const headers = createYearHeaders(relevantAndel);
  return (
    <Table headerTextCodes={headers} allowFormattedHeader classNameTable={styles.inntektTable} noHover>
      <TableRow>
        <TableColumn>
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivende" />
          </Normaltekst>
        </TableColumn>
        {pgiVerdier.map(element => (
          <TableColumn key={element.key}>
            <Normaltekst>
              {element.pgiVerdi === undefined ? formatCurrencyNoKr(0) : formatCurrencyNoKr(element.pgiVerdi)}
            </Normaltekst>
          </TableColumn>
        ))}
        {relevantAndel.pgiSnitt !== undefined && !relevantAndel.erNyIArbeidslivet
        && <TableColumn><Element>{formatCurrencyNoKr(relevantAndel.pgiSnitt)}</Element></TableColumn>
        }
      </TableRow>
    </Table>
  );
};

GrunnlagForAarsinntektPanelSN.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default GrunnlagForAarsinntektPanelSN;
