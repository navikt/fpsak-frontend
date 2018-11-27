import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';

import styles from './personYtelserTable.less';

const formatDateToDDMMYYYY = (date) => {
  const parsedDate = moment(date, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : date;
};

/**
 * PersonYtelserTable
 *
 * Presentasjonskomponent som viser tilgrensede ytelser for valgt person.
 *
 */
export const PersonYtelserTable = ({
  intl, ytelser, relatertYtelseTypes, relatertYtelseStatus,
}) => {
  const headerTextCodes = [
    'PersonYtelserTable.Ytelse',
    'PersonYtelserTable.Periode',
    'PersonYtelserTable.Status',
    'PersonYtelserTable.Saksnummer',
  ];

  const ytelseRows = ytelser && ytelser.map((ytelse) => {
    const ytelseNavn = relatertYtelseTypes.filter(type => type.kode === ytelse.relatertYtelseType)[0].navn;
    if (ytelse.tilgrensendeYtelserListe.length === 0) {
      return ({
        navn: ytelseNavn,
        periode: intl.formatMessage({ id: 'PersonYtelserTable.Ingen' }),
        status: '',
        saksnummer: '',
      });
    }

    return ytelse.tilgrensendeYtelserListe.map((ytelseInfo, innerIndex) => {
      const tilDato = formatDateToDDMMYYYY(ytelseInfo.periodeTilDato) || '';
      const fraDato = formatDateToDDMMYYYY(ytelseInfo.periodeFraDato) || '';

      const statusNavn = relatertYtelseStatus.filter(status => status.kode === ytelseInfo.status)[0].navn;

      return {
        navn: innerIndex === 0 ? ytelseNavn : '',
        periode: `${fraDato} - ${tilDato}`,
        status: statusNavn,
        saksnummer: ytelseInfo.saksNummer,
      };
    });
  }).reduce((a, b) => a.concat(b), []);

  return (
    <FaktaGruppe titleCode="PersonYtelserTable.Ytelser">
      <Table headerTextCodes={headerTextCodes} classNameTable={styles.tableStyle} noHover>
        {ytelseRows && ytelseRows.map((ytelse, index) => (
          <TableRow key={`index${index + 1}`}>
            <TableColumn><Normaltekst>{ytelse.navn}</Normaltekst></TableColumn>
            <TableColumn><Normaltekst>{ytelse.periode}</Normaltekst></TableColumn>
            <TableColumn><Normaltekst>{ytelse.status}</Normaltekst></TableColumn>
            <TableColumn><Normaltekst>{ytelse.saksnummer}</Normaltekst></TableColumn>
          </TableRow>
        ))}
      </Table>
    </FaktaGruppe>
  );
};

PersonYtelserTable.propTypes = {
  intl: intlShape.isRequired,
  ytelser: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  relatertYtelseStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default injectIntl(PersonYtelserTable);
