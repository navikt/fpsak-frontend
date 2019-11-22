import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import AvviksopplysningerSN from '../selvstendigNaeringsdrivende/AvvikopplysningerSN';
import AvviksopplysningerAT from '../arbeidstaker/AvvikopplysningerAT';
import AvviksopplysningerFL from '../frilanser/AvvikopplysningerFL';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const AvviksopplysningerPanel = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, relevanteStatuser, allePerioder, harAksjonspunkter,
}) => (
  <Panel className={beregningStyles.panelRight}>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
    </Element>
    <VerticalSpacer eightPx />
    {relevanteStatuser.isArbeidstaker && (
      <AvviksopplysningerAT
        beregnetAarsinntekt={beregnetAarsinntekt}
        avvik={avvik}
        sammenligningsgrunnlag={sammenligningsgrunnlag}
        relevanteStatuser={relevanteStatuser}
      />
    )}
    {relevanteStatuser.isFrilanser && !relevanteStatuser.isKombinasjonsstatus && (
      <AvviksopplysningerFL
        beregnetAarsinntekt={beregnetAarsinntekt}
        avvik={avvik}
        sammenligningsgrunnlag={sammenligningsgrunnlag}
        relevanteStatuser={relevanteStatuser}
      />
    )}
    {relevanteStatuser.isKombinasjonsstatus && (
      <VerticalSpacer sixteenPx />
    )}
    {relevanteStatuser.isSelvstendigNaeringsdrivende && (
      <AvviksopplysningerSN
        beregnetAarsinntekt={beregnetAarsinntekt}
        avvik={avvik}
        sammenligningsgrunnlag={sammenligningsgrunnlag}
        alleAndelerIForstePeriode={finnAlleAndelerIFørstePeriode(allePerioder)}
        harAksjonspunkter={harAksjonspunkter}
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
  harAksjonspunkter: PropTypes.bool,
};

AvviksopplysningerPanel.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
  harAksjonspunkter: false,
};
export default AvviksopplysningerPanel;
