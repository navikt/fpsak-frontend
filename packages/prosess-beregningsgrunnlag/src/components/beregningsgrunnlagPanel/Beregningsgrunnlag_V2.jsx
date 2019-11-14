import React from 'react';
import PropTypes from 'prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';


import YtelserFraInfotrygd from '../tilstotendeYtelser/YtelserFraInfotrygd';
import GrunnlagForAarsinntektPanelSN2 from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN_V2';
import TilstotendeYtelser2 from '../tilstotendeYtelser/TilstotendeYtelser_V2';
import MilitaerPanel from '../militær/MilitaerPanel';
import styles from './beregningsgrunnlag.less';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import GrunnlagForAarsinntektPanelFL2 from '../frilanser/GrunnlagForAarsinntektPanelFL_V2';
import GrunnlagForAarsinntektPanelAT2 from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';
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

const harPerioderMedAvsluttedeArbeidsforhold = (allePerioder, gjeldendeAksjonspunkter) => allePerioder.some(({ periodeAarsaker }) => periodeAarsaker
    && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET))
    && gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);


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
  alleKodeverk) => (
    <div>

      {(relevanteStatuser.harDagpengerEllerAAP)
    && (
    <div>
      <TilstotendeYtelser2
        alleAndeler={alleAndelerIForstePeriode}
        relevanteStatuser={relevanteStatuser}
        gjelderBesteberegning={gjelderBesteberegning}
      />
      <VerticalSpacer twentyPx />
    </div>
    )}
      <VerticalSpacer eightPx />
      {(relevanteStatuser.isMilitaer)
      && (
        <div>
          <MilitaerPanel
            alleAndeler={alleAndelerIForstePeriode}
          />
          <VerticalSpacer twentyPx />
        </div>
      )}
      {(relevanteStatuser.harAndreTilstotendeYtelser)
    && (
      <div>
        <YtelserFraInfotrygd
          bruttoPrAar={allePerioder[0].bruttoPrAar}
        />
        <VerticalSpacer twentyPx />
      </div>
    )}
      { relevanteStatuser.isArbeidstaker
      && (
        <div>
          {!harPerioderMedAvsluttedeArbeidsforhold(allePerioder, gjeldendeAksjonspunkter)
          && (
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

          )}
          { harPerioderMedAvsluttedeArbeidsforhold(allePerioder, gjeldendeAksjonspunkter)
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
            </>
          )}
        </div>
      )}
      { relevanteStatuser.isFrilanser
    && (
    <div>
      <GrunnlagForAarsinntektPanelFL2
        alleAndeler={alleAndelerIForstePeriode}
        aksjonspunkter={gjeldendeAksjonspunkter}
        readOnly={readOnly}
        isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
      />
    </div>
    )}
      { relevanteStatuser.isSelvstendigNaeringsdrivende
      && (
        <GrunnlagForAarsinntektPanelSN2
          alleAndeler={alleAndelerIForstePeriode}
        />
      )}
      <VerticalSpacer eightPx />


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
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  return (
    <div className={styles.beregningsgrunnlagPanel}>
      {
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
          )
        }
    </div>
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
};

BeregningsgrunnlagImpl2.defaultProps = {
  allePerioder: undefined,
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
