import React from 'react';
import PropTypes from 'prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';


import YtelserFraInfotrygd2 from '../tilstotendeYtelser/YtelserFraInfotrygd_V2';
import GrunnlagForAarsinntektPanelSN2 from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN_V2';
import TilstotendeYtelser2 from '../tilstotendeYtelser/TilstotendeYtelser_V2';
import MilitaerPanel2 from '../militær/MilitaerPanel_V2';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import GrunnlagForAarsinntektPanelFL2 from '../frilanser/GrunnlagForAarsinntektPanelFL_V2';
import SammenlignsgrunnlagAOrdningen from '../fellesPaneler/SammenligningsgrunnlagAOrdningen';
import GrunnlagForAarsinntektPanelAT2 from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';

import NaeringsopplysningsPanel from '../selvstendigNaeringsdrivende/NaeringsOpplysningsPanel';
import beregningStyles from './beregningsgrunnlag_V2.less';
// ------------------------------------------------------------------------------------------ //
// Variables
// ------------------------------------------------------------------------------------------ //

export const TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING = 'begrunnDekningsgradEndring';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  VURDER_DEKNINGSGRAD,
} = aksjonspunktCodes;


// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const harPerioderMedAvsluttedeArbeidsforhold = (allePerioder) => allePerioder.some(({ periodeAarsaker }) => periodeAarsaker
    && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET));

const finnAksjonspunktForATFL = (gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.find(
  (ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS
  || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
);

const finnAksjonspunktForVurderDekningsgrad = (gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD);


const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};

const createRelevantePaneler = (alleAndelerIForstePeriode,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  allePerioder,
  readOnly,
  gjelderBesteberegning,
  behandlingId,
  behandlingVersjon,

  alleKodeverk,
  sammenligningsGrunnlagInntekter,
  skjeringstidspunktDato) => (
    <div className={beregningStyles.panelLeft}>
      { relevanteStatuser.isArbeidstaker
      && (
        <>
          {!harPerioderMedAvsluttedeArbeidsforhold(allePerioder)
          && (
            <>
              <GrunnlagForAarsinntektPanelAT2
                alleAndeler={alleAndelerIForstePeriode}
                aksjonspunkter={gjeldendeAksjonspunkter}
                allePerioder={allePerioder}
                readOnly={readOnly}
                isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
                alleKodeverk={alleKodeverk}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
              />
              <VerticalSpacer fourtyPx />
            </>
          )}
          { harPerioderMedAvsluttedeArbeidsforhold(allePerioder)
          && (
            <>
              <GrunnlagForAarsinntektPanelAT2
                alleAndeler={alleAndelerIForstePeriode}
                aksjonspunkter={gjeldendeAksjonspunkter}
                allePerioder={allePerioder}
                readOnly={readOnly}
                isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
                alleKodeverk={alleKodeverk}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
              />
              <VerticalSpacer fourtyPx />
            </>
          )}
        </>
      )}
      { relevanteStatuser.isFrilanser
    && (
      <>
        <GrunnlagForAarsinntektPanelFL2
          alleAndeler={alleAndelerIForstePeriode}
          aksjonspunkter={gjeldendeAksjonspunkter}
          readOnly={readOnly}
          isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
        />
        <VerticalSpacer fourtyPx />
      </>
    )}

      {(relevanteStatuser.harDagpengerEllerAAP)
      && (
        <div>
          <TilstotendeYtelser2
            alleAndeler={alleAndelerIForstePeriode}
            relevanteStatuser={relevanteStatuser}
            gjelderBesteberegning={gjelderBesteberegning}
          />
          <VerticalSpacer fourtyPx />
        </div>
      )}
      {(relevanteStatuser.isMilitaer)
      && (
        <>
          <MilitaerPanel2
            alleAndeler={alleAndelerIForstePeriode}
          />
          <VerticalSpacer fourtyPx />
        </>
      )}
      {(relevanteStatuser.harAndreTilstotendeYtelser)
      && (
        <>
          <YtelserFraInfotrygd2
            bruttoPrAar={allePerioder[0].bruttoPrAar}
          />
          <VerticalSpacer fourtyPx />
        </>
      )}
      { relevanteStatuser.isSelvstendigNaeringsdrivende
      && (
        <>
          <GrunnlagForAarsinntektPanelSN2
            alleAndeler={alleAndelerIForstePeriode}
          />
          <VerticalSpacer fourtyPx />
          <NaeringsopplysningsPanel
            alleAndelerIForstePeriode={alleAndelerIForstePeriode}
          />
        </>
      )}
      { !relevanteStatuser.isSelvstendigNaeringsdrivende
      && sammenligningsGrunnlagInntekter
      && skjeringstidspunktDato
      && (relevanteStatuser.isFrilanser || relevanteStatuser.isArbeidstaker)
      && (
        <>
          <SammenlignsgrunnlagAOrdningen
            sammenligningsGrunnlagInntekter={sammenligningsGrunnlagInntekter}
            relevanteStatuser={relevanteStatuser}
            skjeringstidspunktDato={skjeringstidspunktDato}
          />
          <VerticalSpacer fourtyPx />
        </>
      )}

    </div>
);

// ------------------------------------------------------------------------------------------ //
// Component : BeregningsgrunnlagImpl
// ------------------------------------------------------------------------------------------ //
/**
 * Beregningsgrunnlag
 *
 * Presentasjonsskomponent. Holder på alle komponenter relatert til å vise beregningsgrunnlaget til de forskjellige
 * statusene og viser disse samlet i en faktagruppe.
 */
export const BeregningsgrunnlagImpl2 = ({
  readOnly,
  relevanteStatuser,
  gjeldendeAksjonspunkter,
  allePerioder,
  gjelderBesteberegning,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  sammenligningsGrunnlagInntekter,
  skjeringstidspunktDato,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  return (

    createRelevantePaneler(
      alleAndelerIForstePeriode,
      gjeldendeAksjonspunkter,
      relevanteStatuser,
      allePerioder,
      readOnly,
      gjelderBesteberegning,
      behandlingId,
      behandlingVersjon,
      alleKodeverk,
      sammenligningsGrunnlagInntekter,
      skjeringstidspunktDato,
    )


  );
};

BeregningsgrunnlagImpl2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  gjelderBesteberegning: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  sammenligningsGrunnlagInntekter: PropTypes.arrayOf(PropTypes.shape()),
  skjeringstidspunktDato: PropTypes.string,
};

BeregningsgrunnlagImpl2.defaultProps = {
  allePerioder: undefined,
  sammenligningsGrunnlagInntekter: undefined,
  skjeringstidspunktDato: undefined,
};

const Beregningsgrunnlag2 = BeregningsgrunnlagImpl2;

Beregningsgrunnlag2.buildInitialValues = (gjeldendeAksjonspunkter) => {
  const aksjonspunktATFL = finnAksjonspunktForATFL(gjeldendeAksjonspunkter);
  const aksjonspunktVurderDekninsgrad = finnAksjonspunktForVurderDekningsgrad(gjeldendeAksjonspunkter);
  return {
    ATFLVurdering: (aksjonspunktATFL) ? aksjonspunktATFL.begrunnelse : '',
    [TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING]: (aksjonspunktVurderDekninsgrad) ? aksjonspunktVurderDekninsgrad.begrunnelse : '',
  };
};

Beregningsgrunnlag2.transformValues = (values, allePerioder) => ({
  kode: FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  begrunnelse: values.ATFLVurdering,
  fastsatteTidsbegrensedePerioder: AksjonspunktBehandlerTB.transformValues(values, allePerioder),
  frilansInntekt: values.inntektFrilanser ? removeSpacesFromNumber(values.inntektFrilanser) : null,
});

export default Beregningsgrunnlag2;
