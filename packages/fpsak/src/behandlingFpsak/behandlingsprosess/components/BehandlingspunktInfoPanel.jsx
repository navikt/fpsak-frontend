import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getBehandlingspunktAksjonspunkterCodes,
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  isSelectedBehandlingspunktReadOnly,
} from 'behandlingFpsak/behandlingsprosess/behandlingsprosessSelectors';
import CheckPersonStatusForm from './saksopplysninger/CheckPersonStatusForm';
import AvregningPanel from './avregning/AvregningPanel';
import TilkjentYtelsePanel from './tilkjentYtelse/TilkjentYtelsePanel';
import UttakPanel from './uttak/UttakPanel';
import VedtakPanels from './vedtak/VedtakPanels';
import VilkarPanels from './vilkar/VilkarPanels';
import BehandleKlageFormNfp from './klage/Klagevurdering/Nfp/BehandleKlageFormNfp';
import BehandleKlageFormKa from './klage/Klagevurdering/KA/BehandleKlageFormKa';
import FormkravKlageFormNfp from './klage/Formkrav/FormkravKlageFormNfp';
import FormkravKlageFormKa from './klage/Formkrav/FormkravKlageFormKa';
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
  saveTempKlage,
  submitCallback,
  previewCallback,
  previewCallbackKlage,
  previewManueltBrevCallback,
  previewVedtakCallback,
  dispatchSubmitFailed,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
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
        previewKlageBrevCallback={previewCallbackKlage}
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
      {BehandleKlageFormKa.supports(apCodes)
      && (
      <BehandleKlageFormKa
        saveKlage={saveTempKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallbackKlage}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {BehandleKlageFormNfp.supports(apCodes)
      && (
      <BehandleKlageFormNfp
        saveKlage={saveTempKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallbackKlage}
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
  saveTempKlage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewCallbackKlage: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewManueltBrevCallback: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
});

export default connect(mapStateToProps)(BehandlingspunktInfoPanel);
