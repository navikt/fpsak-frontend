import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import {
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  isSelectedBehandlingspunktReadOnly,
  getNotAcceptedByBeslutter,
} from 'behandlingKlage/src/anke/behandlingsprosess/BehandlingsprosessAnkeSelectors';
import styles from './behandlingspunktAnkeInfoPanel.less';
import BehandleAnkeForm from './BehandleAnkeForm';
import BehandleMerknaderForm from './BehandleMerknaderForm';
import BehandleResultatForm from './BehandleResultatForm';

const classNames = classnames.bind(styles);

/*
 * BehandlingspunktAnkeInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktAnkeInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  saveTempKlage,
  submitCallback,
  previewCallback,
  previewCallbackKlage,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
  innstilling,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    {behandlingspunktCodes.ANKEBEHANDLING === selectedBehandlingspunkt
    && (
      <BehandleAnkeForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        saveKlage={saveTempKlage}
        previewCallback={previewCallback}
        previewVedtakCallback={previewCallbackKlage}
        readOnlySubmitButton={readOnlySubmitButton}
        innstilling={innstilling}
      />
    )
    }
    {behandlingspunktCodes.ANKE_MERKNADER === selectedBehandlingspunkt
    && (
      <BehandleMerknaderForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        saveKlage={saveTempKlage}
        previewCallback={previewCallback}
        previewVedtakCallback={previewCallbackKlage}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )
    }
    {behandlingspunktCodes.ANKE_RESULTAT === selectedBehandlingspunkt
    && (
      <BehandleResultatForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        ankevurderingresultat={innstilling}
        saveKlage={saveTempKlage}
        previewCallback={previewCallback}
        previewVedtakCallback={previewCallbackKlage}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )
    }
  </div>
);

BehandlingspunktAnkeInfoPanel.propTypes = {
  saveTempKlage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewCallbackKlage: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
  innstilling: PropTypes.shape({}),
};

BehandlingspunktAnkeInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
  innstilling: {},
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  readOnlySubmitButton: isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: getNotAcceptedByBeslutter(state),
});

export default connect(mapStateToProps)(BehandlingspunktAnkeInfoPanel);
