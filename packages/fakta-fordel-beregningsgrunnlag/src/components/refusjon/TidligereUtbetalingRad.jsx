import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { dateFormat, TIDENES_ENDE } from '@fpsak-frontend/utils';

import { refusjonAndelTilVurderingPropType } from '../../propTypes/beregningsgrunnlagPropType';
import styles from './tidligereUtbetalingRad.less';

const visningsnavn = (andel) => {
  if (andel.arbeidsgiverNavn) {
    return andel.arbeidsgiverNavn;
  } if (andel.arbeidsgiverId && andel.arbeidsgiverId.arbeidsgiverOrgnr) {
    return andel.arbeidsgiverId.arbeidsgiverOrgnr;
  } if (andel.arbeidsgiverId && andel.arbeidsgiverId.arbeidsgiverAktørId) {
    return andel.arbeidsgiverId.arbeidsgiverAktørId;
  }
  return undefined;
};

const tidligereUtbetaling = (utbetaling) => {
  if (!utbetaling) {
    return undefined;
  }
  if (utbetaling.erTildeltRefusjon) {
    return visningsnavn(andel);
  }
  return <FormattedMessage id="BeregningInfoPanel.RefusjonBG.Direkteutbetaling" />;
};

const tidligereUtbetalingDato = (utbetaling) => {
  if (!utbetaling) {
    return undefined;
  }
  const utbTom = utbetaling.tom === TIDENES_ENDE ? undefined : utbetaling.tom;
  return (
    <FormattedMessage
      id="BeregningInfoPanel.RefusjonBG.Periode"
      values={{ fom: dateFormat(utbetaling.fom), tom: utbTom ? dateFormat(utbTom) : '' }}
    />
  );
};

export const TidligereUtbetalingRad = ({
  refusjonAndel,
}) => (
  <TableRow>
    <TableColumn>
      {visningsnavn(refusjonAndel)}
    </TableColumn>
    <TableColumn>
      <Table headerTextCodes={[]} noHover classNameTable={styles.utbetalingTabell}>
        { refusjonAndel.tidligereUtbetalinger.map((utbetaling) => (
          <TableRow key={utbetaling.fom + utbetaling.erTildeltRefusjon}>
            <TableColumn>
              <Normaltekst>{tidligereUtbetaling(utbetaling)}</Normaltekst>
            </TableColumn>
            <TableColumn>
              <Normaltekst>{tidligereUtbetalingDato(utbetaling)}</Normaltekst>
            </TableColumn>
          </TableRow>
        ))}
      </Table>
    </TableColumn>
  </TableRow>
);
TidligereUtbetalingRad.propTypes = {
  refusjonAndel: refusjonAndelTilVurderingPropType,
};

export default TidligereUtbetalingRad;
