import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import VurderVarigEndretEllerNyoppstartetSN2, { varigEndringRadioname } from './VurderVarigEndretEllerNyoppstartetSN_V2';
import FastsettSN2 from './FastsettSN_V2';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

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
export const VurderOgFastsettSNImpl = ({
  readOnly,
  erVarigEndretNaering,
  isAksjonspunktClosed,
  gjeldendeAksjonspunkter,
}) => {
  if (hasAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
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
      />
      {erVarigEndretNaering
        && (
          <>

            <FastsettSN2
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed}
            />
          </>
        )}
    </>
  );
};

VurderOgFastsettSNImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
};

VurderOgFastsettSNImpl.defaultProps = {
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

const VurderOgFastsettSN = connect(mapStateToPropsFactory)(VurderOgFastsettSNImpl);

VurderOgFastsettSN.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => ({
  ...VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(relevanteAndeler, gjeldendeAksjonspunkter),
  ...FastsettSN.buildInitialValues(relevanteAndeler, gjeldendeAksjonspunkter),
});

VurderOgFastsettSN.transformValues = (values, gjeldendeAksjonspunkter) => {
  if (hasAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return [{
      kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      ...FastsettSN.transformValues(values),
    }];
  }
  const losteAksjonspunkt = [];
  losteAksjonspunkt.push({
    kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    ...VurderVarigEndretEllerNyoppstartetSN.transformValues(values),
  });
  if (values[varigEndringRadioname]) {
    losteAksjonspunkt.push({
      kode: FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      ...FastsettSN.transformValues(values),
    });
  }
  return losteAksjonspunkt;
};

export default VurderOgFastsettSN;
