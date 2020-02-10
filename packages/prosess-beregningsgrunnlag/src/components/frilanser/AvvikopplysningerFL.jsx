import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { FlexRow } from '@fpsak-frontend/shared-components';
import { Column } from 'nav-frontend-grid';
import AvvikopplysningerATFL from '../fellesPaneler/AvvikopplysningerATFL';

const AvviksopplysningerFL = ({
  relevanteStatuser, sammenligningsgrunnlagPrStatus, beregnetAarsinntekt,
}) => {
  const kombinasjonsstatusFNSN = relevanteStatuser.isKombinasjonsstatus
    && !relevanteStatuser.isArbeidstaker
    && relevanteStatuser.isSelvstendigNaeringsdrivende
    && relevanteStatuser.isFrilanser;
  if (kombinasjonsstatusFNSN) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.FL.KobinasjonsStatusFLSN" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  const sammenligningsGrunnlagFL = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_FL')
    : undefined;
  if (!sammenligningsGrunnlagFL) {
    return null;
  }
  const avvikFL = sammenligningsGrunnlagFL.avvikProsent !== undefined ? sammenligningsGrunnlagFL.avvikProsent : '';
  const avvikRoundedFL = avvikFL ? parseFloat((avvikFL.toFixed(1))) : 0;
  const sammenligningsgrunnlagSumFL = sammenligningsGrunnlagFL.rapportertPrAar;
  const { differanseBeregnet } = sammenligningsGrunnlagFL;
  const visPaneler = {
    visAT: false,
    visFL: true,
    visSN: false,
  };

  if (sammenligningsgrunnlagSumFL) {
    return (
      <AvvikopplysningerATFL
        beregnetAarsinntekt={beregnetAarsinntekt}
        avvikProsentAvrundet={avvikRoundedFL}
        differanseBeregnet={differanseBeregnet}
        relevanteStatuser={relevanteStatuser}
        visPanel={visPaneler}
        sammenligningsgrunnlagSum={sammenligningsgrunnlagSumFL}
      />
    );
  }
  return null;
};


AvviksopplysningerFL.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()),
  relevanteStatuser: PropTypes.shape().isRequired,
};

AvviksopplysningerFL.defaultProps = {
  beregnetAarsinntekt: undefined,
  sammenligningsgrunnlagPrStatus: undefined,
};
export default AvviksopplysningerFL;
