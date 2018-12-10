import React from 'react';
import PropTypes from 'prop-types';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import aktivitetStatus from 'kodeverk/aktivitetStatus';

/**
 * OppsummeringSN
 *
 * Presentasjonskomponent. Viser næringsinntekt. Vil kun vises når status er en
 * kombinasjonsstatus som inkluderer selvstendig næringsdrivende.
 */

export const OppsummeringSN = ({
  alleAndeler,
}) => {
  const relevanteAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  let naeringsinntekt = 0;
  if (relevanteAndeler && relevanteAndeler[0] && relevanteAndeler[0].beregnetPrAar !== null) {
    naeringsinntekt = formatCurrencyNoKr(relevanteAndeler[0].beregnetPrAar);
  }
  return (
    <div>
      <Row>
        <Column xs="12">
          <Element><FormattedMessage id="Beregningsgrunnlag.OppsummeringSN.Tittel" /></Element>
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="12">
          <Normaltekst><FormattedMessage id="Beregningsgrunnlag.OppsummeringSN.Naeringsinntekt" /></Normaltekst>
        </Column>
      </Row>
      { naeringsinntekt
      && (
      <Row>
        <Column xs="12">
          <Element>{naeringsinntekt}</Element>
        </Column>
      </Row>
      )
      }
    </div>
  );
};

OppsummeringSN.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default OppsummeringSN;
