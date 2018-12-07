import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import { FormattedMessage } from 'react-intl';
import styles from './avregningSummary.less';

/**
 * Avregning oppsummering
 *
 * Presentationskomponent
 */


const AvregningSummary = ({
  fom, tom, feilutbetaling, etterbetaling, inntrekk,
}) => (
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
      <Row>
        <Column xs="3">
          <Normaltekst className={styles.resultName}>
            <FormattedMessage id="Avregning.etterbetaling" />
            :
          </Normaltekst>
        </Column>
        <Column xs="2">
          <span className={styles.number}>{ formatCurrencyNoKr(etterbetaling) }</span>
        </Column>
      </Row>
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
        { inntrekk !== null
          && (
          <Column xs="4">
            <Normaltekst>
              <FormattedMessage id="Avregning.inntrekk" />
              :
              <span className={styles.lastNumber}>{ formatCurrencyNoKr(inntrekk) }</span>
            </Normaltekst>
          </Column>
          )
        }
      </Row>
    </div>
  </div>
);

AvregningSummary.propTypes = {
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  feilutbetaling: PropTypes.number.isRequired,
  etterbetaling: PropTypes.number.isRequired,
  inntrekk: PropTypes.number,
};

AvregningSummary.defaultProps = {
  inntrekk: null,
};

export default AvregningSummary;
