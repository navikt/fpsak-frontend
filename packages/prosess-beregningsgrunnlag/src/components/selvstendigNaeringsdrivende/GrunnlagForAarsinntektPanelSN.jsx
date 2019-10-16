import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import styles from './grunnlagForAarsinntektPanelSN.less';

const createHeaders = (pgiVerdier, erNyIArbeidslivet) => {
  const headers = [
    <FormattedMessage
      id="Beregningsgrunnlag.AarsinntektPanel.TomString"
      key="TomStringITabellTittel"
    />,
  ];
  pgiVerdier.forEach(({ årstall }) => {
    headers.push(
      <FormattedMessage
        id="Beregningsgrunnlag.AarsinntektPanel.Aar"
        values={{ aar: årstall.toString() }}
        key={`InntektSistseTreÅr_${årstall.toString()}`}
      />,
    );
  });
  if (!erNyIArbeidslivet) {
    headers.push(<FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.BeregnetAarsinntekt" />);
  }
  return headers;
};

/**
 * GrunnlagForAarsinntektPanelSN
 *
 * Presentasjonskomponent. Viser PGI-verdier for selvstendig næringsdrivende.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer selvstendig næringsdrivende.
 */
export const GrunnlagForAarsinntektPanelSN = ({
  alleAndeler,
}) => {
  const snAndel = alleAndeler.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  if (!snAndel) {
    return null;
  }
  const { pgiVerdier, pgiSnitt, erNyIArbeidslivet } = snAndel;
  const headers = createHeaders(pgiVerdier, erNyIArbeidslivet);
  return (
    <Table headerTextCodes={headers} allowFormattedHeader classNameTable={styles.inntektTable} noHover>
      <TableRow>
        <TableColumn>
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Pensjonsgivende" />
          </Normaltekst>
        </TableColumn>
        {pgiVerdier.map((element) => (
          <TableColumn key={element.årstall}>
            <Normaltekst>
              {element.beløp === undefined ? '' : formatCurrencyNoKr(element.beløp)}
            </Normaltekst>
          </TableColumn>
        ))}
        {pgiSnitt !== undefined && !erNyIArbeidslivet
        && <TableColumn><Element>{formatCurrencyNoKr(pgiSnitt)}</Element></TableColumn>}
      </TableRow>
    </Table>
  );
};

GrunnlagForAarsinntektPanelSN.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default GrunnlagForAarsinntektPanelSN;
