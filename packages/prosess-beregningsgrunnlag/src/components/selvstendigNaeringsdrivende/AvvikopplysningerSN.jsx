import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


const AvviksopplysningerSN = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, alleAndelerIForstePeriode,
}) => {
  const { erNyIArbeidslivet } = alleAndelerIForstePeriode[0];
  if (erNyIArbeidslivet) {
    return (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.NyIArbeidslivet" />
          </Normaltekst>
        </Column>
      </Row>
    );
  }
  return (
    <div>
      <Row>
        <Column xs="6">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.PensjonsgivendeInntekt" />
          </Normaltekst>
        </Column>

        <Column xs="3" className={beregningStyles.rightAlignElement}>
          <Normaltekst>
            {beregnetAarsinntekt === undefined ? '-' : formatCurrencyNoKr(beregnetAarsinntekt)}
          </Normaltekst>
        </Column>
        <Column xs="3" />
      </Row>
      <Row>
        <Column xs="6">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt" />
          </Normaltekst>
        </Column>

        <Column xs="3" className={beregningStyles.rightAlignElement}>
          <Normaltekst>
            {formatCurrencyNoKr(sammenligningsgrunnlag)}
          </Normaltekst>
        </Column>
        <Column xs="3" />

      </Row>
      <Row>
        <Column xs="9">
          <hr />
        </Column>
      </Row>
      <Row>
        <Column xs="6">
          <Normaltekst className={beregningStyles.semiBoldText}>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
          </Normaltekst>
        </Column>
        <Column xs="3" className={beregningStyles.rightAlignElement}>
          <Normaltekst>
            {formatCurrencyNoKr(beregnetAarsinntekt === undefined ? 0 : beregnetAarsinntekt - sammenligningsgrunnlag)}
          </Normaltekst>
        </Column>
        <Column xs="3">
          <Normaltekst className={`${avvik > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
            {`${avvik}%`}
          </Normaltekst>
        </Column>
      </Row>
    </div>
  );
};


AvviksopplysningerSN.propTypes = {
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  beregnetAarsinntekt: PropTypes.number,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
};

AvviksopplysningerSN.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
};
export default AvviksopplysningerSN;
