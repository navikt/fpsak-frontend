import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatCurrencyNoKr, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';
import styles from './periodSummary.less';

/**
 * Tilbakekreving periode oppsummering
 *
 * Presentationskomponent
 */


const PeriodSummary = ({
  fom, tom, feilutbetaling,
}) => (
  <Row>
    <Column md="6">
      <div className={styles.infoSummary}>
        <Row>
          <Column xs="12">
            <Element>
              { moment(fom).format(DDMMYYYY_DATE_FORMAT)}
              {' '}
              -
              {' '}
              { moment(tom).format(DDMMYYYY_DATE_FORMAT)}
            </Element>
          </Column>
        </Row>
        <div className={styles.resultSum}>
          <Row className={styles.redNumbers}>
            <Column xs="3">
              <Normaltekst className={styles.resultName}>
                <FormattedMessage id="Avregning.tilbakekreving" />
                :
              </Normaltekst>
            </Column>
            <Column xs="2">
              <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>{ formatCurrencyNoKr(feilutbetaling) }</span>
            </Column>
          </Row>
        </div>
      </div>
    </Column>
  </Row>
);

PeriodSummary.propTypes = {
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  feilutbetaling: PropTypes.number.isRequired,
};

export default PeriodSummary;
