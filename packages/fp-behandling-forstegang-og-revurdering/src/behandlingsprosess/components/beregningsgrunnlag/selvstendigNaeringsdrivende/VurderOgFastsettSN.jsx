import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

import { ArrowBox } from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import VurderVarigEndretEllerNyoppstartetSN, { varigEndringRadioname } from './VurderVarigEndretEllerNyoppstartetSN';
import FastsettSN from './FastsettSN';

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
      <FastsettSN
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
    );
  }
  return (
    <>
      <VurderVarigEndretEllerNyoppstartetSN
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
      {erVarigEndretNaering
        && (
        <ArrowBox alignOffset={350}>
          <Row>
            <Column xs="11">
              <Element>
                <FormattedMessage
                  id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.FastsettNaeringsinntekt"
                />
              </Element>
            </Column>
          </Row>
          <FastsettSN
            readOnly={readOnly}
            isAksjonspunktClosed={isAksjonspunktClosed}
          />
        </ArrowBox>
        )}
    </>
  );
};

VurderOgFastsettSNImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

VurderOgFastsettSNImpl.defaultProps = {
  erVarigEndretNaering: undefined,
};

const mapStateToPropsFactory = (initialState, { gjeldendeAksjonspunkter }) => {
  const aksjonspunkt = finnSnAksjonspunkt(gjeldendeAksjonspunkter);
  return (state) => ({
    isAksjonspunktClosed: !isAksjonspunktOpen(aksjonspunkt.status.kode),
    erVarigEndretNaering: behandlingFormValueSelector(FORM_NAME)(state, varigEndringRadioname),
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
