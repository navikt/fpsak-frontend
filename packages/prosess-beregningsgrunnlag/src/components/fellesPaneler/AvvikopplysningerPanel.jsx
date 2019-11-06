import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import AvviksopplysningerSN from '../selvstendigNaeringsdrivende/AvvikopplysningerSN';
import AvviksopplysningerAT from '../arbeidstaker/AvvikopplysningerAT';

const AvviksopplysningerPanel = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, relevanteStatuser, allePerioder,
}) => {
  console.log('AvviksopplysningerPanel props', beregnetAarsinntekt, sammenligningsgrunnlag, avvik, relevanteStatuser, allePerioder);
  return (
    <Panel>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
      </Element>
      <VerticalSpacer sixteenPx />
      {relevanteStatuser.isArbeidstaker && (
      <AvviksopplysningerAT beregnetAarsinntekt={beregnetAarsinntekt} avvik={avvik} sammenligningsgrunnlag={sammenligningsgrunnlag} />
      )}
      {relevanteStatuser.isSelvstendigNaeringsdrivende && (
        <AvviksopplysningerSN beregnetAarsinntekt={beregnetAarsinntekt} avvik={avvik} sammenligningsgrunnlag={sammenligningsgrunnlag} />
      )}
    </Panel>
  );
};

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
