import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import featureToggle from 'app/featureToggle';
import {
  getBehandlingspunktAksjonspunkterCodes,
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  isSelectedBehandlingspunktReadOnly,
} from 'behandlingsprosess/behandlingsprosessSelectors';
import { getFeatureToggles } from 'app/duck';
import CheckPersonStatusForm from './saksopplysninger/CheckPersonStatusForm';
import AvregningPanel from './avregning/AvregningPanel';
import TilkjentYtelsePanel from './tilkjentYtelse/TilkjentYtelsePanel';
import UttakPanel from './uttak/UttakPanel';
import VedtakPanels from './vedtak/VedtakPanels';
import VilkarPanels from './vilkar/VilkarPanels';
import BehandleKlageNfpForm from './klage/BehandleKlageNfpForm';
import BehandleKlageNfpFormNy from './klage/BehandleKlageNfpFormNy';
import BehandleKlageNkForm from './klage/BehandleKlageNkForm';
import BehandleKlageNkFormNy from './klage/BehandleKlageNkFormNy';
import FormkravKlageFormNfp from './klage/FormkravKlageFormNfp';
import FormkravKlageFormKa from './klage/FormkravKlageFormKa';
import InnsynForm from './innsyn/InnsynForm';
import BeregningFP from './beregningsgrunnlag/BeregningFP';
import VarselOmRevurderingForm from './revurdering/VarselOmRevurderingForm';
import BeregningsresultatEngangsstonadForm from './beregningsresultat/BeregningsresultatEngangsstonadForm';
import VurderSoknadsfristForeldrepengerForm from './soknadsfrist/VurderSoknadsfristForeldrepengerForm';

import styles from './behandlingspunktInfoPanel.less';

const findStyle = (isApOpen, isApSolvable, readOnly) => (isApOpen && isApSolvable && !readOnly ? styles.statusAksjonspunkt : undefined);
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
  featureToggleFormkrav,
}) => (
  <div className={findStyle(openAksjonspunkt, isApSolvable, readOnly)}>
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

      {InnsynForm.supports(apCodes)
      && <InnsynForm submitCallback={submitCallback} readOnly={readOnly} isSubmittable={readOnlySubmitButton} />
      }
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

      {(BehandleKlageNkForm.supports(apCodes) && !featureToggleFormkrav)
      && (
      <BehandleKlageNkForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {(BehandleKlageNkFormNy.supports(apCodes) && featureToggleFormkrav)
      && (
      <BehandleKlageNkFormNy
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {(BehandleKlageNfpForm.supports(apCodes) && !featureToggleFormkrav)
      && (
      <BehandleKlageNfpForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {(BehandleKlageNfpFormNy.supports(apCodes) && featureToggleFormkrav)
      && (
      <BehandleKlageNfpFormNy
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {FormkravKlageFormNfp.supports(apCodes)
      && (
        <FormkravKlageFormNfp
          submitCallback={submitCallback}
          readOnly={readOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )
      }
      {FormkravKlageFormKa.supports(apCodes)
      && (
        <FormkravKlageFormKa
          submitCallback={submitCallback}
          readOnly={readOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
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
  featureToggleFormkrav: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  featureToggleFormkrav: getFeatureToggles(state)[featureToggle.FORMKRAV],
});

export default connect(mapStateToProps)(BehandlingspunktInfoPanel);
