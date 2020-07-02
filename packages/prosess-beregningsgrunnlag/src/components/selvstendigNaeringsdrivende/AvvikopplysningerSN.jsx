import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';
import { FlexRow } from '@fpsak-frontend/shared-components';
import AvvikopplysningerATFLSN from '../fellesPaneler/AvvikopplysningerATFLSN';

const ingenAvviksvurdering = (forklarendeTekst) => (
  <FlexRow>
    <Column xs="12">
      <Normaltekst>
        <FormattedMessage id={forklarendeTekst} />
      </Normaltekst>
    </Column>
  </FlexRow>
);

const AvviksopplysningerSN = ({
  sammenligningsgrunnlagPrStatus, alleAndelerIForstePeriode, relevanteStatuser,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const erNyArbLivet = snAndel.erNyIArbeidslivet;
  const erVarigEndring = snAndel.næringer && snAndel.næringer.some((naring) => naring.erVarigEndret === true);
  const erNyoppstartet = snAndel.næringer && snAndel.næringer.some((naring) => naring.erNyoppstartet === true);
  if (erNyArbLivet) {
    return ingenAvviksvurdering('Beregningsgrunnlag.Avviksopplysninger.SN.NyIArbeidslivet');
  }
  if (!erVarigEndring && !erNyoppstartet) {
    return ingenAvviksvurdering('Beregningsgrunnlag.Avviksopplysninger.SN.IkkeVarigEndring');
  }
  const sammenligningsGrunnlagSN = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === sammenligningType.SN
      || status.sammenligningsgrunnlagType.kode === sammenligningType.ATFLSN)
    : undefined;
  if (!sammenligningsGrunnlagSN || !snAndel) {
    return null;
  }
  const { pgiSnitt } = snAndel;
  const avvikSN = sammenligningsGrunnlagSN.avvikProsent;
  const avvikRoundedSN = avvikSN ? parseFloat((avvikSN.toFixed(1))) : 0;
  const sammenligningsgrunnlagSumSN = sammenligningsGrunnlagSN.rapportertPrAar;
  const { differanseBeregnet } = sammenligningsGrunnlagSN;
  const visPaneler = {
    visAT: false,
    visFL: false,
    visSN: true,
  };
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
