import React from 'react';
import { Table } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';

import beregningsgrunnlagPropType from '../../propTypes/beregningsgrunnlagPropType';
import styles from './tidligereUtbetalinger.less';
import TidligereUtbetalingRad from './TidligereUtbetalingRad';

export const TidligereUtbetalinger = ({
  beregningsgrunnlag,
}) => {
  const { andeler } = beregningsgrunnlag.refusjonTilVurdering;
  return (
    <>
      <Row>
        <Column xs="8">
          <Table
            headerTextCodes={['BeregningInfoPanel.RefusjonBG.Aktivitet', 'BeregningInfoPanel.RefusjonBG.TidligereUtb']}
            noHover
            classNameTable={styles.tabell}
          >
            { andeler.map((andel) => (
              <TidligereUtbetalingRad
                refusjonAndel={andel}
                readOnly
                key={andel.arbeidsgiverNavn}
              />
            ))}
          </Table>
        </Column>
      </Row>
    </>
  );
};
TidligereUtbetalinger.propTypes = {
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
};

export default TidligereUtbetalinger;
