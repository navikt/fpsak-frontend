import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import {
  VerticalSpacer, OverstyringKnapp, FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import PropTypes from 'prop-types';
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
  reduxFormChange,
  behandlingFormPrefix,
}) => {
  const [erOverstyrt, setOverstyring] = useState(false);
  const toggleOverstyring = useCallback(() => {
    setOverstyring(!erOverstyrt);
    reduxFormChange(`${behandlingFormPrefix}.vurderFaktaBeregningForm`, MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD, !erOverstyrt);
  }, [erOverstyrt]);
  return (
    <>
      {children}
      <div className={styles.fadeinTabell}>
        <VerticalSpacer sixteenPx />
        {skalViseTabell && (
          <>
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <Element className={styles.avsnittOverskrift}>
                    <FormattedMessage id="InntektstabellPanel.RapporterteInntekter" />
                  </Element>
                </FlexColumn>
                {(kanOverstyre || erOverstyrt) && (
                <FlexColumn>
                  <OverstyringKnapp
                    onClick={toggleOverstyring}
                    erOverstyrt={erOverstyrt || hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter) || readOnly}
                  />
                </FlexColumn>
                )}
              </FlexRow>
            </FlexContainer>
            <VerticalSpacer sixteenPx />
            {hjelpeTekstId && (
              <Element>
                <FormattedMessage id={hjelpeTekstId} />
              </Element>
            )}
            {tabell}
            {erOverstyrt && (
              <Knapp
                htmlType="button"
                onClick={toggleOverstyring}
                mini
              >
                <FormattedMessage id="InntektstabellPanel.Avbryt" />
              </Knapp>
            )}
          </>
        )}
      </div>
    </>
  );
};

InntektstabellPanelImpl.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  tabell: PropTypes.node.isRequired,
  hjelpeTekstId: PropTypes.string,
  skalViseTabell: PropTypes.bool,
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
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
  kanOverstyre: getSkalKunneOverstyre(ownProps),
  behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange: change,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InntektstabellPanelImpl);
