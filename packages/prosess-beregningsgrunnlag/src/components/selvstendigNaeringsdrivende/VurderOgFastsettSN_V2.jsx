import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import VurderVarigEndretEllerNyoppstartetSN2, { varigEndringRadioname } from './VurderVarigEndretEllerNyoppstartetSN_V2';
import FastsettSN2 from './FastsettSN_V2';

const FORM_NAME = 'BeregningForm';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

const finnSnAksjonspunkt = (aksjonspunkter) => aksjonspunkter && aksjonspunkter.find(
  (ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
    || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);


/**
 * VurderOgFastsettSNImpl
 *
 * Containerkomponent. Setter opp riktige forms basert på hvilket aksjonspunkt vi har og hva som er valgt i radioknapper
 */
export const VurderOgFastsettSNImpl2 = ({
  readOnly,
  erVarigEndretNaering,
  isAksjonspunktClosed,
  erNyArbLivet,
  erNyoppstartet,
  erVarigEndring,
}) => {
  if (erNyArbLivet) {
    return (
      <FastsettSN2
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
    );
  }
  return (
    <>
      <VurderVarigEndretEllerNyoppstartetSN2
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
        erVarigEndring={erVarigEndring}
        erNyoppstartet={erNyoppstartet}
      />
      {erVarigEndretNaering
        && (
        <FastsettSN2
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
        )}
    </>
  );
};

VurderOgFastsettSNImpl2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  erNyArbLivet: PropTypes.bool.isRequired,
  erVarigEndring: PropTypes.bool.isRequired,
  erNyoppstartet: PropTypes.bool.isRequired,
};

VurderOgFastsettSNImpl2.defaultProps = {
  erVarigEndretNaering: undefined,
};

const mapStateToPropsFactory = (initialState, ownPropsStatic) => {
  const aksjonspunkt = finnSnAksjonspunkt(ownPropsStatic.gjeldendeAksjonspunkter);
  return (state, ownProps) => ({
    erVarigEndretNaering: behandlingFormValueSelector(FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state, 'erVarigEndretNaering',
    ),
    isAksjonspunktClosed: !isAksjonspunktOpen(aksjonspunkt.status.kode),
  });
};

const VurderOgFastsettSN2 = connect(mapStateToPropsFactory)(VurderOgFastsettSNImpl2);

VurderOgFastsettSN2.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => ({
  ...VurderVarigEndretEllerNyoppstartetSN2.buildInitialValues(relevanteAndeler, gjeldendeAksjonspunkter),
  ...FastsettSN2.buildInitialValues(relevanteAndeler, gjeldendeAksjonspunkter),
});

VurderOgFastsettSN2.transformValues = (values, gjeldendeAksjonspunkter) => {
  if (hasAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return [{
      kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      ...FastsettSN2.transformValues(values),
    }];
  }
  const varigEndretTransformed = {
    kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    ...VurderVarigEndretEllerNyoppstartetSN2.transformValues(values),
  };
  const losteAksjonspunkt = [varigEndretTransformed];
  if (values[varigEndringRadioname]) {
    losteAksjonspunkt.push({
      kode: FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      ...FastsettSN2.transformValues(values),
    });
  }
  return losteAksjonspunkt;
};

export default VurderOgFastsettSN2;
