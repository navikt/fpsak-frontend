import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import styles from './personYtelserTable.less';

interface OwnProps {
  ytelser: {
    relatertYtelseType: string;
    tilgrensendeYtelserListe?: {
      periodeTilDato: string;
      periodeFraDato: string;
      status: string;
      saksNummer: string;
    }[];
  }[];
  relatertYtelseTyper: KodeverkMedNavn[];
  relatertYtelseStatus: KodeverkMedNavn[];
}

const HEADER_TEXT_CODES = [
  'PersonYtelserTable.Ytelse',
  'PersonYtelserTable.Periode',
  'PersonYtelserTable.Status',
  'PersonYtelserTable.Saksnummer',
];

const formatDateToDDMMYYYY = (date) => {
  const parsedDate = moment(date, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : date;
};

/**
 * PersonYtelserTable
 *
 * Viser tilgrensede ytelser.
 */
export const PersonYtelserTable: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  ytelser,
  relatertYtelseTyper,
  relatertYtelseStatus,
}) => {
  const ytelseRows = ytelser && ytelser.map((ytelse) => {
    const ytelseNavn = relatertYtelseTyper.filter((type) => type.kode === ytelse.relatertYtelseType)[0].navn;
    if (ytelse.tilgrensendeYtelserListe.length === 0) {
      return [{
        navn: ytelseNavn,
        periode: intl.formatMessage({ id: 'PersonYtelserTable.Ingen' }),
        status: '',
        saksnummer: '',
      }];
    }

    return ytelse.tilgrensendeYtelserListe.map((ytelseInfo, innerIndex) => {
      const tilDato = formatDateToDDMMYYYY(ytelseInfo.periodeTilDato) || '';
      const fraDato = formatDateToDDMMYYYY(ytelseInfo.periodeFraDato) || '';

      const statusNavn = relatertYtelseStatus.filter((status) => status.kode === ytelseInfo.status)[0].navn;

      return {
        navn: innerIndex === 0 ? ytelseNavn : '',
        periode: `${fraDato} - ${tilDato}`,
        status: statusNavn,
        saksnummer: ytelseInfo.saksNummer,
      };
    });
  }).reduce((allRows, rows) => allRows.concat(rows), []);

  return (
    <Table headerTextCodes={HEADER_TEXT_CODES} classNameTable={styles.tableStyle} noHover>
      {ytelseRows && ytelseRows.map((ytelse, index) => (
        <TableRow key={`index${index + 1}`}>
          <TableColumn>{ytelse.navn ? <Normaltekst>{ytelse.navn}</Normaltekst> : ''}</TableColumn>
          <TableColumn><Normaltekst>{ytelse.periode}</Normaltekst></TableColumn>
          <TableColumn>{ytelse.status ? <Normaltekst>{ytelse.status}</Normaltekst> : ''}</TableColumn>
          <TableColumn>{ytelse.saksnummer ? <Normaltekst>{ytelse.saksnummer}</Normaltekst> : ''}</TableColumn>
        </TableRow>
      ))}
    </Table>
  );
};

export default injectIntl(PersonYtelserTable);
