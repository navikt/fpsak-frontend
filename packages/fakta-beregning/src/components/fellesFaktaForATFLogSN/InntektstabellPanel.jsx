import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { Element } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { CheckboxField } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import PropTypes from 'prop-types';
import { getFormValuesForBeregning } from '../BeregningFormUtils';
import beregningAksjonspunkterPropType from '../../propTypes/beregningAksjonspunkterPropType';

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
  erOverstyrt,
}) => (
  <>
    {children}
    <div className={styles.fadeinTabell}>
      <VerticalSpacer sixteenPx />
      {(kanOverstyre || erOverstyrt) && (
      <div className={styles.rightAligned}>
        <CheckboxField
          key="manuellOverstyring"
          name={MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD}
          label={{ id: 'VurderFaktaBeregning.ManuellOverstyring' }}
          readOnly={hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter) || readOnly}
        />
      </div>
      )}
      {skalViseTabell && (
        <div>
          {hjelpeTekstId && (
            <Element>
              <FormattedMessage id={hjelpeTekstId} />
            </Element>
          )}
          {tabell}
        </div>
      )}
    </div>
  </>
);

InntektstabellPanelImpl.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  tabell: PropTypes.node.isRequired,
  hjelpeTekstId: PropTypes.string,
  skalViseTabell: PropTypes.bool,
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
};

InntektstabellPanelImpl.buildInitialValues = (aksjonspunkter) => ({
  [MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD]: hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter),
});

InntektstabellPanelImpl.defaultProps = {
  hjelpeTekstId: undefined,
  skalViseTabell: true,
};

const getSkalKunneOverstyre = createSelector([(ownProps) => ownProps.erOverstyrer, (ownProps) => ownProps.aksjonspunkter],
  (erOverstyrer, aksjonspunkter) => erOverstyrer
&& !aksjonspunkter.some((ap) => ap.definisjon.kode === AVKLAR_AKTIVITETER && isAksjonspunktOpen(ap.status.kode)));

const mapStateToProps = (state, ownProps) => ({
  erOverstyrt: getFormValuesForBeregning(state, ownProps)[MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD],
  kanOverstyre: getSkalKunneOverstyre(ownProps),
});

export default connect(mapStateToProps)(InntektstabellPanelImpl);
