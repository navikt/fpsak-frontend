import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { FlexRow } from '@fpsak-frontend/shared-components';
import AvvikopplysningerATFLSN from '../fellesPaneler/AvvikopplysningerATFLSN';

const AvviksopplysningerSN = ({
  sammenligningsgrunnlagPrStatus, alleAndelerIForstePeriode, relevanteStatuser,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const { pgiSnitt } = snAndel;
  const erNyArbLivet = snAndel.erNyIArbeidslivet;
  const erVarigEndring = snAndel.næringer && snAndel.næringer.some((naring) => naring.erVarigEndret === true);
  const erNyoppstartet = snAndel.næringer && snAndel.næringer.some((naring) => naring.erNyoppstartet === true);
  const sammenligningsGrunnlagSN = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_SN'
      || status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_ATFL_SN')
    : undefined;
  let avvikSN;
  let avvikRoundedSN;
  let sammenligningsgrunnlagSumSN;
  let differanseBeregnet;
  if (sammenligningsGrunnlagSN) {
    avvikSN = sammenligningsGrunnlagSN.avvikProsent;
    avvikRoundedSN = avvikSN ? parseFloat((avvikSN.toFixed(1))) : 0;
    sammenligningsgrunnlagSumSN = sammenligningsGrunnlagSN.rapportertPrAar;
    differanseBeregnet = sammenligningsGrunnlagSN.differanseBeregnet;
  }
  const visPaneler = {
    visAT: false,
    visFL: false,
    visSN: true,
  };
  if (erNyArbLivet) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.NyIArbeidslivet" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  if (!erVarigEndring && !erNyoppstartet) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.IkkeVarigEndring" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  if (sammenligningsgrunnlagSumSN) {
    return (
      <AvvikopplysningerATFLSN
        beregnetAarsinntekt={pgiSnitt}
        avvikProsentAvrundet={avvikRoundedSN}
        differanseBeregnet={differanseBeregnet}
        relevanteStatuser={relevanteStatuser}
        visPanel={visPaneler}
        sammenligningsgrunnlagSum={sammenligningsgrunnlagSumSN}
      />
    );
  }
  return null;
};


AvviksopplysningerSN.propTypes = {
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()),
  relevanteStatuser: PropTypes.shape().isRequired,
};
AvviksopplysningerSN.defaultProps = {
  sammenligningsgrunnlagPrStatus: undefined,
};

export default AvviksopplysningerSN;
