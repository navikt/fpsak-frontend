import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import faktaOmBeregningTilfelle, {
  erATFLSpesialtilfelle,
  harKunATFLISammeOrgUtenBestebergning,
} from 'kodeverk/faktaOmBeregningTilfelle';
import LonnsendringForm, { lonnsendringField } from 'fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import NyoppstartetFLForm, { erNyoppstartetFLField } from 'fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import FastsettATFLInntektForm from './forms/FastsettATFLInntektForm';
import InntektstabellPanel from '../InntektstabellPanel';


export const skalViseInntektsTabellUnderRadioknapp = (tilfeller, lonnEndringEllerNyFL) => {
  // Dersom vi har tilfellet for besteberegning fødende kvinne skal alle inntekter fastsettes der.
  // Skal aldri vise inntektstabell under radioknapp dersom det er et spesialtilfelle
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE) || erATFLSpesialtilfelle(tilfeller)) {
    return false;
  }
  return (lonnEndringEllerNyFL) || (lonnEndringEllerNyFL === false
    && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON));
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
  formName,
  tilfeller,
  manglerInntektsmelding,
}) => (
  <div>
    <InntektstabellPanel
      key="inntektstabell"
      tabell={(
        <FastsettATFLInntektForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          tilfellerSomSkalFastsettes={tilfeller}
          manglerInntektsmelding={manglerInntektsmelding}
        />
      )}
      skalViseTabell={erATFLSpesialtilfelle(tilfeller) || harKunATFLISammeOrgUtenBestebergning(tilfeller)}
    >
      {tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
      && (
        <LonnsendringForm
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          formName={formName}
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
          formName={formName}
          tilfeller={tilfeller}
          skalViseInntektstabell={skalViseInntektsTabellUnderRadioknapp(tilfeller, erNyoppstartetFL)}
          manglerIM={manglerInntektsmelding}
          skalKunFastsetteFL={!tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)}
        />
      )
      }
    </InntektstabellPanel>
  </div>
);

VurderOgFastsettATFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  manglerInntektsmelding: PropTypes.bool.isRequired,
  erLonnsendring: PropTypes.bool,
  erNyoppstartetFL: PropTypes.bool,
};

VurderOgFastsettATFL.defaultProps = {
  erLonnsendring: undefined,
  erNyoppstartetFL: undefined,
};

const mapStateToProps = (state, initialProps) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  const { formName } = initialProps;
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  return {
    erLonnsendring: behandlingFormValueSelector(formName)(state, lonnsendringField),
    erNyoppstartetFL: behandlingFormValueSelector(formName)(state, erNyoppstartetFLField),
    manglerInntektsmelding,
  };
};

export default connect(mapStateToProps)(VurderOgFastsettATFL);
