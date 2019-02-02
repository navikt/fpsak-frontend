import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Table, TableRow, TableColumn, DateLabel,
} from '@fpsak-frontend/shared-components';
import { injectIntl } from 'react-intl';
import { behandlingFormValueSelector } from 'behandlingFpsak/src/behandlingForm';

const headerTextCodes = [
  'MedlemskapEndringerTabell.GjeldeneFom',
  'MedlemskapEndringerTabell.Opplysning',
];

// TODO sortere perioder på dato
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
        isApLeftBorder={periode.begrunnelse === null}
      >
        <TableColumn>
          <DateLabel dateString={periode.vurderingsdato} />
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
    perioder: (behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'perioder') || [])
      .sort((a, b) => a.vurderingsdato.localeCompare(b.vurderingsdato)),
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
