import React from 'react';
import { connect } from 'react-redux';
import { TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { SelectField } from '@fpsak-frontend/form';
import moment from 'moment';
import feilutbetalingÅrsak from '@fpsak-frontend/kodeverk/src/feilutbetalingÅrsak';
import PropTypes from 'prop-types';
import { behandlingFormValueSelector } from 'behandlingTilbakekreving/src/behandlingForm';
import styles from './feilutbetalingPerioderTable.less';

const årsaker = [
  {
    navn: 'Utsettels p.g.a skykdom',
    value: feilutbetalingÅrsak.UTSETTELSE_SKYDOM,
  },
  {
    navn: 'Utsettels p.g.a ferie',
    value: feilutbetalingÅrsak.UTSETTELSE_FERIE,
  },
];

const FeilutbetalingPerioderForm = ({ periode, årsak, elementId }) => (
  <TableRow>
    <TableColumn>
      {moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)}
      {' '}
      -
      {moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}
    </TableColumn>
    <TableColumn>
      <SelectField
        name={`perioder.${elementId}.årsak`}
        selectValues={årsaker.map(a => <option key={a.value} value={a.value}>{a.navn}</option>)}
        bredde="m"
        label=""
      />
      { årsak === feilutbetalingÅrsak.UTSETTELSE_SKYDOM
      && (
        <SelectField
          name={`perioder.${elementId}.grunn`}
          selectValues={årsaker.map(a => <option key={a.value} value={a.value}>{a.navn}</option>)}
          bredde="m"
          label=""
        />
      )
      }
    </TableColumn>
    <TableColumn className={styles.redText}>
      {periode.belop}
    </TableColumn>
  </TableRow>
);

FeilutbetalingPerioderForm.defaultProps = {
  årsak: null,
};

FeilutbetalingPerioderForm.propTypes = {
  periode: PropTypes.shape().isRequired,
  elementId: PropTypes.number.isRequired,
  årsak: PropTypes.string,
};

const mapStateToProps = (state, initialProps) => ({
  årsak: behandlingFormValueSelector(initialProps.formName)(state, `periode.${initialProps.elementId}.årsak`),
});

export default connect(mapStateToProps)(FeilutbetalingPerioderForm);
