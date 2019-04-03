import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';

import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import {
  Table, TableRow, TableColumn,
} from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingAktivitetTabell.less';

const headerTextCodes = [
  'TilbakekrevingAktivitetTabell.Aktivitet',
  'TilbakekrevingAktivitetTabell.FeilutbetaltBelop',
];

const TilbakekrevingAktivitetTabell = ({
  ytelser,
}) => {
  if (ytelser.length === 0) {
    return null;
  }
  return (
    <Table headerTextCodes={headerTextCodes} noHover classNameTable={styles.feilutbetalingTable}>
      {ytelser.map(y => (
        <TableRow key={y.aktivitet + y.belop}>
          <TableColumn>
            <Normaltekst>{y.aktivitet}</Normaltekst>
          </TableColumn>
          <TableColumn>
            <Normaltekst>{formatCurrencyNoKr(y.belop)}</Normaltekst>
          </TableColumn>
        </TableRow>
      ))}
    </Table>
  );
    };

TilbakekrevingAktivitetTabell.propTypes = {
  ytelser: PropTypes.arrayOf(PropTypes.shape({
    aktivitet: PropTypes.string.isRequired,
    belop: PropTypes.number.isRequired,
  })).isRequired,
};

export default TilbakekrevingAktivitetTabell;
