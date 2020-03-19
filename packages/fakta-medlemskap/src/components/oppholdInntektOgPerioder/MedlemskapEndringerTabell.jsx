import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import {
  DateLabel, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector } from '@fpsak-frontend/form';

const headerTextCodes = [
  'MedlemskapEndringerTabell.GjeldeneFom',
  'MedlemskapEndringerTabell.Opplysning',
];

const MedlemskapEndringerTabellImpl = ({
  perioder,
  velgPeriodeCallback,
  selectedId,
}) => (
  <Table headerTextCodes={headerTextCodes}>
    {perioder.map((periode) => (
      <TableRow
        key={periode.id}
        id={periode.id}
        onMouseDown={velgPeriodeCallback}
        onKeyDown={velgPeriodeCallback}
        isSelected={periode.id === selectedId}
        model={periode}
        isApLeftBorder={periode.begrunnelse === null && periode.aksjonspunkter.length > 0}
      >
        <TableColumn>
          <DateLabel dateString={periode.vurderingsdato} />
        </TableColumn>
        <TableColumn>
          {periode.årsaker.join()}
        </TableColumn>
      </TableRow>
    ))}
  </Table>
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { behandlingId, behandlingVersjon } = initialOwnProps;
  const perioder = (behandlingFormValueSelector('OppholdInntektOgPerioderForm', behandlingId, behandlingVersjon)(initialState, 'perioder') || [])
    .sort((a, b) => a.vurderingsdato.localeCompare(b.vurderingsdato));
  return () => ({
    perioder,
  });
};

const MedlemskapEndringerTabell = connect(mapStateToPropsFactory)(injectIntl(MedlemskapEndringerTabellImpl));

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
