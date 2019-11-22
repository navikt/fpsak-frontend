import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


const AvviksopplysningerFL = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik,
}) => (
  <>
    <Row>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Frilans" />
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
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Frilans" />
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
  </>
);


AvviksopplysningerFL.propTypes = {
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  beregnetAarsinntekt: PropTypes.number,
};

AvviksopplysningerFL.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
};
export default AvviksopplysningerFL;
