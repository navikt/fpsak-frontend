import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import faktaOmBeregningTilfelle, {
  harKunATFLISammeOrgUtenBestebergning,
  erATFLSpesialtilfelle,
  harVurderMottarYtelseUtenBesteberegning,
  erATFLSpesialtilfelleEllerVurderMottarYtelseUtenBesteberegning,
} from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import LonnsendringForm, { lonnsendringField }
  from 'behandlingFpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import NyoppstartetFLForm, { erNyoppstartetFLField }
  from 'behandlingFpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { getFaktaOmBeregning } from 'behandlingFpsak/src/behandlingSelectors';
import { harVurdertMottarYtelse } from './forms/VurderMottarYtelseUtils';
import FastsettATFLInntektForm from './forms/FastsettATFLInntektForm';
import InntektstabellPanel from '../InntektstabellPanel';
import VurderMottarYtelseForm from './forms/VurderMottarYtelseForm';
import FastsettEndretBeregningsgrunnlag from '../endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';


export const skalViseInntektsTabellUnderRadioknapp = (tilfeller, lonnEndringEllerNyFL) => {
  // Dersom vi har tilfellet for besteberegning fødende kvinne skal alle inntekter fastsettes der.
  // Skal aldri vise inntektstabell under radioknapp dersom det er et spesialtilfelle
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
  || erATFLSpesialtilfelleEllerVurderMottarYtelseUtenBesteberegning(tilfeller)
  || tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return false;
  }
  return (lonnEndringEllerNyFL) || (lonnEndringEllerNyFL === false
    && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON));
};


const finnInntektstabell = (tilfeller, readOnly, isAksjonspunktClosed, manglerInntektsmelding, erNyoppstartetFL) => {
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return (
      <FastsettEndretBeregningsgrunnlag
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
    );
  }
  return (
    <FastsettATFLInntektForm
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      tilfellerSomSkalFastsettes={tilfeller}
      manglerInntektsmelding={manglerInntektsmelding}
      erNyoppstartetFL={erNyoppstartetFL}
    />
  );
};


/**
 * VurderOgFastsettATFL
 *
 * Presentasjonskomponent. Styrer samspillet mellom tre tilfeller av vurdering: VURDER_LONNSENDRING,
 * VURDER_NYOPPSTARTET_FL og VURDER_AT_OG_FL_I_SAMME_ORGANISASJON.
 * Dersom alle tre opptrer samtidig er det et spesialtilfelle, der saksbehandler først må vurdere to
 * tilfeller før h*n kan fastsette inntekt.
 */

const VurderOgFastsettATFL = ({
  readOnly,
  erLonnsendring,
  erNyoppstartetFL,
  isAksjonspunktClosed,
  tilfeller,
  manglerInntektsmelding,
  skalViseTabell,
}) => (
  <div>
    <InntektstabellPanel
      key="inntektstabell"
      tabell={finnInntektstabell(tilfeller, readOnly, isAksjonspunktClosed, manglerInntektsmelding, erNyoppstartetFL)}
      skalViseTabell={skalViseTabell}
    >
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
      && (
        <LonnsendringForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
          manglerIM={manglerInntektsmelding}
          skalViseInntektstabell={skalViseInntektsTabellUnderRadioknapp(tilfeller, erLonnsendring)}
          skalKunFastsetteAT={!tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)}
        />
      )
      }
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)
      && (
        <NyoppstartetFLForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
          skalViseInntektstabell={skalViseInntektsTabellUnderRadioknapp(tilfeller, erNyoppstartetFL)}
          manglerIM={manglerInntektsmelding}
          skalKunFastsetteFL={!tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)}
        />
      )
      }
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE)
      && (
        <VurderMottarYtelseForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfeller={tilfeller}
        />
      )
      }
    </InntektstabellPanel>
  </div>
);

VurderOgFastsettATFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  manglerInntektsmelding: PropTypes.bool.isRequired,
  erLonnsendring: PropTypes.bool,
  erNyoppstartetFL: PropTypes.bool,
  skalViseTabell: PropTypes.bool.isRequired,
};

VurderOgFastsettATFL.defaultProps = {
  erLonnsendring: undefined,
  erNyoppstartetFL: undefined,
};

export const skalViseInntektstabell = (tilfeller, values, faktaOmBeregning) => {
  if ((harKunATFLISammeOrgUtenBestebergning(tilfeller) || erATFLSpesialtilfelle(tilfeller))
  && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    return true;
  }
  if (harVurderMottarYtelseUtenBesteberegning(tilfeller)) {
    if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)) {
      const harLonnsendring = values[lonnsendringField];
      if (harLonnsendring === undefined || harLonnsendring === null) {
        return false;
      }
    }
    if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)) {
      const erNyoppstartetFL = values[erNyoppstartetFLField];
      if (erNyoppstartetFL === undefined || erNyoppstartetFL === null) {
        return false;
      }
    }
    return harVurdertMottarYtelse(values, faktaOmBeregning.vurderMottarYtelse);
  }
  return false;
};

const mapStateToProps = (state, initialProps) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  const values = getFormValuesForBeregning(state);
  return {
    erLonnsendring: values[lonnsendringField],
    erNyoppstartetFL: values[erNyoppstartetFLField],
    skalViseTabell: skalViseInntektstabell(initialProps.tilfeller, values, faktaOmBeregning),
    manglerInntektsmelding,
  };
};

export default connect(mapStateToProps)(VurderOgFastsettATFL);
