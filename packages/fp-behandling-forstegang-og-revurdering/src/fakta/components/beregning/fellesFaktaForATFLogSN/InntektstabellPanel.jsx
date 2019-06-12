import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { CheckboxField } from '@fpsak-frontend/form';
import { createSelector } from 'reselect';
import { getRettigheter } from 'navAnsatt/duck';
import { getFeatureToggles } from 'app/duck';
import { featureToggle } from '@fpsak-frontend/fp-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  getAksjonspunkter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import PropTypes from 'prop-types';

import styles from './InntektstabellPanel.less';

export const MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD = 'manuellOverstyringRapportertInntekt';


const {
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;

/**
 * Inntektstabell
 *
 *
 */
export const InntektstabellPanelImpl = ({
  tabell,
  hjelpeTekstId,
  children,
  skalViseTabell,
  kanOverstyre,
  readOnly,
  aksjonspunkter,
}) => (
  <ElementWrapper>
    {children}
    <div className={styles.fadeinTabell}>
      <VerticalSpacer sixteenPx />
      {kanOverstyre
          && (
          <div className={styles.rightAligned}>
            <CheckboxField
              key="manuellOverstyring"
              name={MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD}
              label={{ id: 'VurderFaktaBeregning.ManuellOverstyring' }}
              readOnly={hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter) || readOnly}
            />
          </div>
        )
      }
      {skalViseTabell
      && (
      <ElementWrapper>
        {hjelpeTekstId
        && (
          <Element>
            <FormattedMessage id={hjelpeTekstId} />
          </Element>
        )}
        {tabell}
      </ElementWrapper>
      )
      }
    </div>
  </ElementWrapper>
);


InntektstabellPanelImpl.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  tabell: PropTypes.node.isRequired,
  hjelpeTekstId: PropTypes.string,
  skalViseTabell: PropTypes.bool,
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

InntektstabellPanelImpl.buildInitialValues = aksjonspunkter => ({
  [MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD]: hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter),
});

InntektstabellPanelImpl.defaultProps = {
  hjelpeTekstId: undefined,
  skalViseTabell: true,
};


const getSkalKunneOverstyre = createSelector([getRettigheter, getAksjonspunkter, getFeatureToggles],
  (rettigheter, aksjonspunkter, toggles) => rettigheter.kanOverstyreAccess.isEnabled
  && !aksjonspunkter.some(ap => ap.definisjon.kode === AVKLAR_AKTIVITETER && isAksjonspunktOpen(ap.status.kode))
  && toggles[featureToggle.OVERSTYR_BEREGNINGSGRUNNLAG]);

const mapStateToPropsFactory = (initialState) => {
  const aksjonspunkter = getAksjonspunkter(initialState);
  return state => ({
    kanOverstyre: getSkalKunneOverstyre(state),
    aksjonspunkter,
  });
};

export default connect(mapStateToPropsFactory)(InntektstabellPanelImpl);
