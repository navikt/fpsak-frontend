import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { getSkalRedigereInntekt } from './BgFordelingUtils';

import styles from './inntektFieldArray.less';

const summerFordeling = (fields, skalRedigereInntekt) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    const belop = skalRedigereInntekt(field) ? field.fastsattBelop : field.belopReadOnly;
    sum += belop ? parseInt(removeSpacesFromNumber(belop), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : 0;
};

const SummaryRow = ({
  skalVisePeriode, skalViseRefusjon, readOnly, sumFordeling,
}) => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.FordelingBG.Sum" />
    </TableColumn>
    {skalVisePeriode
          && <TableColumn />}
    <TableColumn className={styles.rightAlign}>
      <div className={styles.readOnlyContainer}>
        <Normaltekst className={readOnly ? styles.readOnlyContent : ''}>
          {sumFordeling}
        </Normaltekst>
      </div>
    </TableColumn>
    {skalViseRefusjon
          && <TableColumn />}
    <TableColumn />
  </TableRow>
);

SummaryRow.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  skalVisePeriode: PropTypes.bool.isRequired,
  skalViseRefusjon: PropTypes.bool.isRequired,
  sumFordeling: PropTypes.number.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  const sumFordeling = summerFordeling(ownProps.fields, getSkalRedigereInntekt(state, ownProps)) || 0;
  return {
    sumFordeling,
  };
};

export default connect(mapStateToProps)(SummaryRow);
