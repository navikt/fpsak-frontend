import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


/**
 * YtelserFraInfotrygd
 *
 * Presentasjonskomponent. Viser navn og sum på alle andeler som er tilstøttende ytelser fra infotrygd
 */
const YtelserFraInfotrygd2 = ({
  bruttoPrAar,
}) => (
  <>
    <Row>
      <Column xs="12">
        <Element>
          <FormattedMessage
            id="Beregningsgrunnlag.YtelserFraInfotrygd.Ytelse2"
          />
        </Element>
      </Column>
    </Row>
    <Row>
      <Column xs="7" />
      <Column xs="2" className={beregningStyles.colMaanedText}>
        <Undertekst>
          <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
        </Undertekst>
      </Column>
      <Column xs="2" className={beregningStyles.colAarText}>
        <Undertekst>
          <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar" />
        </Undertekst>
      </Column>
      <Column xs="2" />
    </Row>
    <Row>
      <Column xs="7">
        <Normaltekst>
          <FormattedMessage
            id="Beregningsgrunnlag.YtelserFraInfotrygd.YtelseNavn"
          />
        </Normaltekst>
      </Column>
      <Column xs="2" className={beregningStyles.colMaanedText}>
        <Normaltekst>
          {formatCurrencyNoKr(bruttoPrAar / 12)}
        </Normaltekst>
      </Column>
      <Column xs="2" className={beregningStyles.colAarText}>
        <Element>{formatCurrencyNoKr(bruttoPrAar)}</Element>
      </Column>
    </Row>
  </>
);

YtelserFraInfotrygd2.propTypes = {
  bruttoPrAar: PropTypes.number.isRequired,
};

export default YtelserFraInfotrygd2;
