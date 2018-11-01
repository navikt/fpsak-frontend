import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import styles from './summary.less';
import AvregningTable from './Table';

/**
 * Summary
 *
 * Presentationskomponent
 */


const Summary = () => (
  <div>
    <Column xs="12">
      <div className={styles.infoSummary}>
        <Row>
          <Column xs="4">
            <Element>
              15.01.2018 - 31.03.2019
            </Element>
          </Column>
          <Column xs="3">
            <Normaltekst>
              10 Uker 3 Dager
            </Normaltekst>
          </Column>
        </Row>
        <Row className={styles.daysSum}>
          <Column xs="3">
            <Normaltekst>
              Tilbakekreving: 0
            </Normaltekst>
          </Column>
          <Column xs="3">
            <Normaltekst>
              Etterbetaling: 0
            </Normaltekst>
          </Column>
        </Row>
      </div>
      <div className={styles.table}>
        <AvregningTable />
      </div>
    </Column>
  </div>
);

export default Summary;
