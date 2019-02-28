import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';

const headerTextCodes = [
  'ArbeidsforholdFaktaPanel.Arbeidsforhold',
  'ArbeidsforholdFaktaPanel.TilretteleggingFra',
];

const ArbeidsforholdTable = ({
  arbeidsforhold,
  selectArbeidsforholdCallback,
  selectedArbeidsforhold,
}) => (
  <Table headerTextCodes={headerTextCodes}>
    {arbeidsforhold.map(a => (
      <TableRow
        key={a.id}
        id={a.id}
        model={a}
        onMouseDown={selectArbeidsforholdCallback}
        onKeyDown={selectArbeidsforholdCallback}
        isSelected={a.id === selectedArbeidsforhold}
      >
        <TableColumn>
          <Normaltekst>{a.arbeidsforhold.navn}</Normaltekst>
        </TableColumn>
        <TableColumn>
          <Normaltekst>{a.jordmor.tilretteleggingFra}</Normaltekst>
        </TableColumn>
      </TableRow>
    ))}
  </Table>
);
ArbeidsforholdTable.propTypes = {
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedArbeidsforhold: PropTypes.string,
  selectArbeidsforholdCallback: PropTypes.func.isRequired,
};

ArbeidsforholdTable.defaultProps = {
  selectedArbeidsforhold: undefined,
};

export default ArbeidsforholdTable;
