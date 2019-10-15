import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { SelectField } from '@fpsak-frontend/form';

import { behandlingFormValueSelector } from 'behandlingTilbakekreving/src/behandlingFormTilbakekreving';

import styles from './feilutbetalingPerioderTable.less';

const getHendelseUndertyper = (årsakNavn, årsaker) => {
  const årsak = årsaker.find((a) => a.hendelseType.kode === årsakNavn);
  return årsak && årsak.hendelseUndertyper.length > 0 ? årsak.hendelseUndertyper : null;
};

export const FeilutbetalingPerioderFormImpl = ({
  periode,
  årsak,
  elementId,
  årsaker,
  readOnly,
  resetFields,
}) => {
  const hendelseUndertyper = getHendelseUndertyper(årsak, årsaker);
  return (
    <TableRow>
      <TableColumn>
        {`${moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}`}
      </TableColumn>
      <TableColumn>
        <SelectField
          name={`perioder.${elementId}.årsak`}
          selectValues={årsaker.map((a) => <option key={a.hendelseType.kode} value={a.hendelseType.kode}>{a.hendelseType.navn}</option>)}
          validate={[required]}
          disabled={readOnly}
          onChange={() => resetFields(elementId, årsak)}
          bredde="m"
          label=""
        />
        {hendelseUndertyper
        && (
          <SelectField
            name={`perioder.${elementId}.${årsak}.underÅrsak`}
            selectValues={hendelseUndertyper.map((a) => <option key={a.kode} value={a.kode}>{a.navn}</option>)}
            validate={[required]}
            disabled={readOnly}
            bredde="m"
            label=""
          />
        )}
      </TableColumn>
      <TableColumn className={styles.redText}>
        {periode.belop}
      </TableColumn>
    </TableRow>
  );
};

FeilutbetalingPerioderFormImpl.defaultProps = {
  årsak: null,
};

FeilutbetalingPerioderFormImpl.propTypes = {
  periode: PropTypes.shape().isRequired,
  elementId: PropTypes.number.isRequired,
  årsak: PropTypes.string,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
};

const mapStateToProps = (state, initialProps) => ({
  årsak: behandlingFormValueSelector(initialProps.formName)(state, `perioder.${initialProps.elementId}.årsak`),
});

const FeilutbetalingPerioderForm = connect(mapStateToProps)(FeilutbetalingPerioderFormImpl);
export default FeilutbetalingPerioderForm;
