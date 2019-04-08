import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatCurrencyNoKr, DDMMYYYY_DATE_FORMAT, calcDaysAndWeeks } from '@fpsak-frontend/utils';
import { FormattedMessage } from 'react-intl';
import styles from './periodSummary.less';

/**
 * Tilbakekreving periode oppsummering
 *
 * Presentationskomponent
 */


const PeriodSummary = ({
  fom, tom, feilutbetaling, arsak,
}) => (
  <Row>
    <Column md="8">
      <div className={styles.infoSummary}>
        <Row>
          <Column xs="6">
            <Element>
              { moment(fom).format(DDMMYYYY_DATE_FORMAT)}
              {' '}
              -
              {' '}
              { moment(tom).format(DDMMYYYY_DATE_FORMAT)}
            </Element>
          </Column>
          <Column xs="6">
            <Normaltekst>
              <FormattedMessage
                id={calcDaysAndWeeks(moment(fom.toString()), moment(tom.toString())).id}
                values={{
                  weeks: calcDaysAndWeeks(moment(fom.toString()), moment(tom.toString())).weeks,
                  days: calcDaysAndWeeks(moment(fom.toString()), moment(tom.toString())).days,
                }}
              />
            </Normaltekst>
          </Column>
        </Row>
        <div className={styles.resultSum}>
          <Row className={styles.redNumbers}>
            <Column xs="6">
              <Normaltekst className={styles.resultName}>
                <FormattedMessage id="Avregning.tilbakekreving" />
                :
                <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>{ formatCurrencyNoKr(feilutbetaling) }</span>
              </Normaltekst>
            </Column>
            <Column xs="6">
              <Normaltekst className={styles.resultName}>
                {arsak}
              </Normaltekst>
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
  arsak: PropTypes.string.isRequired,
};

export default PeriodSummary;
