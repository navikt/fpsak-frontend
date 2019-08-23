import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { formatCurrencyNoKr, DDMMYYYY_DATE_FORMAT, calcDaysAndWeeks } from '@fpsak-frontend/utils';

import styles from './periodeInformasjon.less';

/**
 * PeriodeInformasjon
 *
 * Tilbakekreving periode oppsummering
 *
 * Presentationskomponent
 */
const PeriodeInformasjon = ({
  fom,
  tom,
  feilutbetaling,
  arsak,
}) => {
  const daysAndWeeks = calcDaysAndWeeks(moment(fom.toString()), moment(tom.toString()));
  return (
    <Row>
      <Column md="8">
        <div className={styles.infoSummary}>
          <Row>
            <Column xs="6">
              <Element>
                { `${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}` }
              </Element>
            </Column>
            <Column xs="6">
              <Normaltekst>
                <FormattedMessage
                  id={daysAndWeeks.id}
                  values={{
                    weeks: daysAndWeeks.weeks,
                    days: daysAndWeeks.days,
                  }}
                />
              </Normaltekst>
            </Column>
          </Row>
          <div className={styles.resultSum}>
            <Row className={styles.redNumbers}>
              <Column xs="6">
                <Normaltekst className={styles.resultName}>
                  <FormattedMessage id="PeriodeInformasjon.Feilutbetaling" />
                  :
                  <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>{ formatCurrencyNoKr(feilutbetaling) }</span>
                </Normaltekst>
              </Column>
              <Column xs="6">
                {arsak && (
                  <Normaltekst className={styles.resultName}>
                    {arsak.årsak}
                  </Normaltekst>
                )}
              </Column>
            </Row>
          </div>
        </div>
      </Column>
    </Row>
  );
};

PeriodeInformasjon.propTypes = {
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  feilutbetaling: PropTypes.number.isRequired,
  arsak: PropTypes.shape({
    årsak: PropTypes.string.isRequired,
  }),
};

PeriodeInformasjon.defaultProsp = {
  arsak: undefined,
};

export default PeriodeInformasjon;
