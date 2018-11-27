import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import { injectIntl } from 'react-intl';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';

const headerTextCodes = [
  'MedlemskapEndringerTabell.GjeldeneFom',
  'MedlemskapEndringerTabell.Register',
  'MedlemskapEndringerTabell.Opplysning',
];

const MedlemskapEndringerTabellImpl = ({
  perioder,
  velgPeriodeCallback,
  selectedId,
}) => (
  <Table headerTextCodes={headerTextCodes}>
    {perioder.map(periode => (
      <TableRow
        key={periode.id}
        id={periode.id}
        onMouseDown={velgPeriodeCallback}
        onKeyDown={velgPeriodeCallback}
        isSelected={periode.id === selectedId}
        model={periode}
      >
        <TableColumn>
          <DateLabel dateString={periode.vurderingsdato} />
        </TableColumn>
        <TableColumn>
          {periode.personopplysninger.opplysningsKilde.navn}
        </TableColumn>
        <TableColumn>
          {periode.årsaker.join()}
        </TableColumn>
      </TableRow>
    ))
    }
  </Table>
);


const MedlemskapEndringerTabell = connect(state => (
  {
    perioder: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'perioder'),
  }))(injectIntl(MedlemskapEndringerTabellImpl));

MedlemskapEndringerTabellImpl.propTypes = {
  selectedId: PropTypes.string,
  velgPeriodeCallback: PropTypes.func.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()),
};

MedlemskapEndringerTabellImpl.defaultProps = {
  perioder: [],
  selectedId: undefined,
};

export default MedlemskapEndringerTabell;
