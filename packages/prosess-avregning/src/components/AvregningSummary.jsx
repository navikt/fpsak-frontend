import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './avregningSummary.less';

/**
 * Avregning oppsummering
 *
 * Presentationskomponent
 */
const AvregningSummary = ({
  fom,
  tom,
  feilutbetaling,
  etterbetaling,
  inntrekk,
  ingenPerioderMedAvvik,
}) => (
  <>
    <Normaltekst className={styles.summaryTitle}><FormattedMessage id="Avregning.bruker" /></Normaltekst>
    <VerticalSpacer eightPx />
    <div className={styles.infoSummary}>
      { ingenPerioderMedAvvik && (
        <div className={styles.ingenPerioder}>
          <FormattedMessage id="Avregning.ingenPerioder" />
        </div>
      )}
      { !ingenPerioderMedAvvik && (
        <>
          <Row>
            <Column xs="12">
              <Element>
                { `${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
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
              { inntrekk !== null && (
                <Column xs="4">
                  <Normaltekst>
                    <FormattedMessage id="Avregning.inntrekk" />
                    :
                    <span className={inntrekk ? styles.lastNumberRed : styles.lastNumberPositiv}>{ formatCurrencyNoKr(inntrekk) }</span>
                  </Normaltekst>
                </Column>
              )}
            </Row>
          </div>
        </>
      )}
    </div>
  </>
);

AvregningSummary.propTypes = {
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  feilutbetaling: PropTypes.number.isRequired,
  etterbetaling: PropTypes.number.isRequired,
  inntrekk: PropTypes.number,
  ingenPerioderMedAvvik: PropTypes.bool.isRequired,
};

AvregningSummary.defaultProps = {
  inntrekk: null,
};

export default AvregningSummary;
