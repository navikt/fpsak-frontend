import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import {
  Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import style from './arbeidsforholdTable.less';

/**
 * Svangerskapspenger
 * tabell av arbforhold
 */

const headerTextCodes = [
  'ArbeidsforholdTable.Arbeidsforhold',
  'ArbeidsforholdTable.TilretteleggingFra',
  'ArbeidsforholdTable.Revurdering',
];

const ArbeidsforholdTable = ({
  arbeidsforhold,
  selectArbeidsforholdCallback,
  selectedArbeidsforhold,
}) => (
  <Table headerTextCodes={headerTextCodes}>
    {arbeidsforhold.map(a => (
      <TableRow
        key={a.tilretteleggingId}
        id={a.tilretteleggingId}
        model={a}
        onMouseDown={selectArbeidsforholdCallback}
        onKeyDown={selectArbeidsforholdCallback}
        isSelected={a.tilretteleggingId === selectedArbeidsforhold}
        className={a.tilretteleggingId === selectedArbeidsforhold ? style.selectedArbeidsforhold : null}
      >
        <TableColumn>
          <Normaltekst>
            {a.arbeidsgiverNavn}
            {' '}
            {a.arbeidsgiverIdent && (
            <span>
            (
              {a.arbeidsgiverIdent}
            )
            </span>

)}
          </Normaltekst>
        </TableColumn>
        <TableColumn>
          <Normaltekst>{moment(a.tilretteleggingBehovFom).format(DDMMYYYY_DATE_FORMAT)}</Normaltekst>
        </TableColumn>
        <TableColumn>
          <FormattedMessage
            id={a.kopiertFraTidligereBehandling ? 'ArbeidsforholdTable.Ja' : 'ArbeidsforholdTable.Nei'}
          />
        </TableColumn>
      </TableRow>
    ))}
  </Table>
);
ArbeidsforholdTable.propTypes = {
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedArbeidsforhold: PropTypes.number,
  selectArbeidsforholdCallback: PropTypes.func.isRequired,
};

ArbeidsforholdTable.defaultProps = {
  selectedArbeidsforhold: undefined,
};

export default ArbeidsforholdTable;
