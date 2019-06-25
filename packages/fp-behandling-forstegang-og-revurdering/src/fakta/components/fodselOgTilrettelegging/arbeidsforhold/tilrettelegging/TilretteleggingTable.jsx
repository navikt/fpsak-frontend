import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
 Table, TableColumn, TableRow, DateLabel,
} from '@fpsak-frontend/shared-components';

const headerTextCodes = [
  'TilretteleggingTable.NodvendigTilrettelegging',
  'TilretteleggingTable.Dato',
  'TilretteleggingTable.Stillingsprosent',
];

const getTextCode = (type) => {
  if (type === 'kanGjennomfores') {
    return 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores';
  }
  return type === 'redusertArbeid'
    ? 'ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid'
    : 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores';
};

/**
 * TilretteleggingTable
 *
 * Viser tilretteleggingsalternativer for et gitt arbeidsforhold
 */
const TilretteleggingTable = ({
  tilrettelegginger,
  settValgtTilrettelegging,
  valgtTilrettelegging,
}) => (
  <Table headerTextCodes={headerTextCodes}>
    {tilrettelegginger.map(t => (
      <TableRow
        key={t.fom}
        model={t}
        onMouseDown={settValgtTilrettelegging}
        onKeyDown={settValgtTilrettelegging}
        isSelected={t === valgtTilrettelegging}
      >
        <TableColumn>
          <Normaltekst><FormattedMessage id={getTextCode(t.type)} /></Normaltekst>
        </TableColumn>
        <TableColumn>
          <Normaltekst><DateLabel dateString={t.fom} /></Normaltekst>
        </TableColumn>
        <TableColumn>
          <Normaltekst>{`${t.stillingsprosent}%`}</Normaltekst>
        </TableColumn>
      </TableRow>
    ))}
  </Table>
);

TilretteleggingTable.propTypes = {
  tilrettelegginger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settValgtTilrettelegging: PropTypes.func.isRequired,
  valgtTilrettelegging: PropTypes.shape(),
};

TilretteleggingTable.defaultProps = {
  valgtTilrettelegging: undefined,
};

export default TilretteleggingTable;
