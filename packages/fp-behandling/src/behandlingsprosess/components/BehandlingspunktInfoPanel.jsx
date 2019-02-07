import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import {
  getBehandlingspunktAksjonspunkterCodes,
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  isSelectedBehandlingspunktReadOnly,
  getNotAcceptedByBeslutter,
} from 'behandlingFpsak/src/behandlingsprosess/behandlingsprosessSelectors';
import CheckPersonStatusForm from './saksopplysninger/CheckPersonStatusForm';
import AvregningPanel from './avregning/AvregningPanel';
import TilkjentYtelsePanel from './tilkjentYtelse/TilkjentYtelsePanel';
import UttakPanel from './uttak/UttakPanel';
import VedtakPanels from './vedtak/VedtakPanels';
import VilkarPanels from './vilkar/VilkarPanels';
import BeregningFP from './beregningsgrunnlag/BeregningFP';
import VarselOmRevurderingForm from './revurdering/VarselOmRevurderingForm';
import BeregningsresultatEngangsstonadForm from './beregningsresultat/BeregningsresultatEngangsstonadForm';
import VurderSoknadsfristForeldrepengerForm from './soknadsfrist/VurderSoknadsfristForeldrepengerForm';

import styles from './behandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

/*
 * PunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  submitCallback,
  previewCallback,
  previewManueltBrevCallback,
  previewVedtakCallback,
  dispatchSubmitFailed,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <VilkarPanels
        aksjonspunktCodes={apCodes}
        behandlingspunkt={selectedBehandlingspunkt}
        isAksjonspunktOpen={openAksjonspunkt}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        submitCallback={submitCallback}
      />
      <VedtakPanels
        behandlingspunkt={selectedBehandlingspunkt}
        readOnly={readOnly}
        previewCallback={previewCallback}
        previewVedtakCallback={previewVedtakCallback}
        previewManueltBrevCallback={previewManueltBrevCallback}
        submitCallback={submitCallback}
      />

      {BeregningsresultatEngangsstonadForm.supports(selectedBehandlingspunkt)
      && <BeregningsresultatEngangsstonadForm submitCallback={submitCallback} />
      }
      {CheckPersonStatusForm.supports(apCodes)
      && <CheckPersonStatusForm submitCallback={submitCallback} readOnly={readOnly} readOnlySubmitButton={readOnlySubmitButton} />
      }
      {VarselOmRevurderingForm.supports(apCodes)
      && (
      <VarselOmRevurderingForm
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        dispatchSubmitFailed={dispatchSubmitFailed}
        readOnly={readOnly}
      />
      )
      }
      {BeregningFP.supports(selectedBehandlingspunkt)
      && (
      <BeregningFP
        readOnly={readOnly}
        submitCallback={submitCallback}
        apCodes={apCodes}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {TilkjentYtelsePanel.supports(selectedBehandlingspunkt)
      && (
      <TilkjentYtelsePanel
        readOnly={readOnly}
      />
      )
      }
      {UttakPanel.supports(selectedBehandlingspunkt, apCodes)
      && (
      <UttakPanel
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        apCodes={apCodes}
        isApOpen={openAksjonspunkt}
      />
      )
      }
      {AvregningPanel.supports(selectedBehandlingspunkt, apCodes)
      && (
        <AvregningPanel
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          apCodes={apCodes}
          isApOpen={openAksjonspunkt}
        />
      )
      }
      {VurderSoknadsfristForeldrepengerForm.supports(apCodes)
      && (
      <VurderSoknadsfristForeldrepengerForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isApOpen={openAksjonspunkt}
      />
      )
      }
    </div>
  </div>
);

BehandlingspunktInfoPanel.propTypes = {
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewManueltBrevCallback: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
};

BehandlingspunktInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: getNotAcceptedByBeslutter(state),
});

export default connect(mapStateToProps)(BehandlingspunktInfoPanel);
