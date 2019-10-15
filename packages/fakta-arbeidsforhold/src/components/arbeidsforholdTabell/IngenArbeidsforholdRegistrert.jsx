import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';

import Table from '@fpsak-frontend/shared-components/src/table/Table';
import TableRow from '@fpsak-frontend/shared-components/src/table/TableRow';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';

const IngenArbeidsforholdRegistrert = ({
  headerTextCodes,
}) => (
  <Table headerTextCodes={headerTextCodes} noHover>
    <TableRow>
      <TableColumn>
        <Normaltekst>
          <FormattedMessage id="PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert" />
        </Normaltekst>
      </TableColumn>
      <TableColumn />
      <TableColumn />
      <TableColumn />
      <TableColumn />
      <TableColumn />
    </TableRow>
  </Table>
);

IngenArbeidsforholdRegistrert.propTypes = {
  headerTextCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IngenArbeidsforholdRegistrert;
