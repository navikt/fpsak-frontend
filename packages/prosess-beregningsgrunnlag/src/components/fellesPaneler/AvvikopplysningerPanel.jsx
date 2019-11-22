import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import AvviksopplysningerSN from '../selvstendigNaeringsdrivende/AvvikopplysningerSN';
import AvviksopplysningerAT from '../arbeidstaker/AvvikopplysningerAT';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const AvviksopplysningerPanel = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, relevanteStatuser, allePerioder,
}) => (
  <Panel className={beregningStyles.panel}>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
    </Element>
    <VerticalSpacer eightPx />
    {relevanteStatuser.isArbeidstaker && (
      <AvviksopplysningerAT beregnetAarsinntekt={beregnetAarsinntekt} avvik={avvik} sammenligningsgrunnlag={sammenligningsgrunnlag} />
    )}
    {relevanteStatuser.isArbeidstaker && relevanteStatuser.isSelvstendigNaeringsdrivende && (
    <VerticalSpacer eightPx />
    )}
    {relevanteStatuser.isSelvstendigNaeringsdrivende && (
    <AvviksopplysningerSN
      beregnetAarsinntekt={beregnetAarsinntekt}
      avvik={avvik}
      sammenligningsgrunnlag={sammenligningsgrunnlag}
      alleAndelerIForstePeriode={finnAlleAndelerIFørstePeriode(allePerioder)}
    />
    )}
  </Panel>
);

AvviksopplysningerPanel.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
};

AvviksopplysningerPanel.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,

};
export default AvviksopplysningerPanel;
