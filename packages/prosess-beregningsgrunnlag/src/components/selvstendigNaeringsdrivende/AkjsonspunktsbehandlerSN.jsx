import React from 'react';
import PropTypes from 'prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import VurderOgFastsettSN2 from './VurderOgFastsettSN_V2';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;


const skalFastsetteSN = (aksjonspunkter) => aksjonspunkter && aksjonspunkter.some(
  (ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
    || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);

const AksjonspunktBehandlerSN = ({
  readOnly,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  erNyArbLivet,
  erVarigEndring,
  erNyoppstartet,
  endretTekst,
}) => (
  <>
    { skalFastsetteSN(aksjonspunkter)
      && (
        <VurderOgFastsettSN2
          gjeldendeAksjonspunkter={aksjonspunkter}
          readOnly={readOnly}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          erNyArbLivet={erNyArbLivet}
          erVarigEndring={erVarigEndring}
          erNyoppstartet={erNyoppstartet}
          endretTekst={endretTekst}
        />
      )}
  </>
);

AksjonspunktBehandlerSN.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  erNyArbLivet: PropTypes.bool,
  erVarigEndring: PropTypes.bool,
  erNyoppstartet: PropTypes.bool,
  endretTekst: PropTypes.node,

};
AksjonspunktBehandlerSN.defaultProps = {
  erNyArbLivet: false,
  erVarigEndring: false,
  erNyoppstartet: false,
};

export default AksjonspunktBehandlerSN;
