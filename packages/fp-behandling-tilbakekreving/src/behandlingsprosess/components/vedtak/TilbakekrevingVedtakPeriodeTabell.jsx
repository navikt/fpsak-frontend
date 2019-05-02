import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import {
  Table, TableColumn, TableRow, PeriodLabel,
} from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingVedtakPeriodeTabell.less';

const headerTextCodes = [
  'TilbakekrevingVedtakPeriodeTabell.Periode',
  'TilbakekrevingVedtakPeriodeTabell.FeilutbetaltBelop',
  'TilbakekrevingVedtakPeriodeTabell.Vurdering',
  'TilbakekrevingVedtakPeriodeTabell.AndelAvBelop',
  'TilbakekrevingVedtakPeriodeTabell.Renter',
  'TilbakekrevingVedtakPeriodeTabell.BelopSomTilbakekreves',
];

const TilbakekrevingVedtakPeriodeTabell = ({
  perioder,
}) => {
  const rader = perioder.map(periode => (
    <TableRow key={periode.fomDato}>
      <TableColumn><Normaltekst><PeriodLabel dateStringFom={periode.fomDato} dateStringTom={periode.tomDato} /></Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(periode.feilUtbetaltBelop)}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{periode.vurdering}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{`${periode.andelAvBelop}%`}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{periode.renter ? periode.renter : ''}</Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(periode.belopSomTilbakekreves)}</Normaltekst></TableColumn>
    </TableRow>
  )).concat(
    <TableRow key="sum">
      <TableColumn><Normaltekst><FormattedMessage id="TilbakekrevingVedtakPeriodeTabell.Sum" /></Normaltekst></TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.feilUtbetaltBelop, 0))}</Normaltekst></TableColumn>
      <TableColumn />
      <TableColumn />
      <TableColumn />
      <TableColumn><Element>{formatCurrencyNoKr(perioder.reduce((sum, periode) => sum + periode.belopSomTilbakekreves, 0))}</Element></TableColumn>
    </TableRow>,
  );

  return (
    <div className={styles.table}>
      <Table noHover headerTextCodes={headerTextCodes}>
        {rader}
      </Table>
    </div>
  );
};

TilbakekrevingVedtakPeriodeTabell.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape()),
};

export default TilbakekrevingVedtakPeriodeTabell;
