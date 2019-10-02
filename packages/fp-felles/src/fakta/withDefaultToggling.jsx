import React from 'react';
import PropTypes from 'prop-types';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';

const isInfoPanelOpen = (aksjonspunkter) => aksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode)).length > 0;

const checkIfAksjonspunkterIsSolveable = (aksjonspunkter) => aksjonspunkter.some((ap) => ap.kanLoses);

const isInactiv = (aksjonspunkter) => !aksjonspunkter.some((a) => a.erAktivt);

const withDefaultToggling = (infoPanelId, aksjonspunktCodes, skalKunneOverstyre = false) => (WrappedComponent) => {
  class InfoPanel extends React.Component {
    constructor() {
      super();
      this.toggleOnDefault = this.toggleOnDefault.bind(this);
    }

    componentDidMount() {
      this.toggleOnDefault();
    }

    componentDidUpdate() {
      this.toggleOnDefault();
    }

    toggleOnDefault() {
      const { aksjonspunkter, shouldOpenDefaultInfoPanels, toggleInfoPanelCallback } = this.props;
      const filteredAps = aksjonspunkter.filter((ap) => aksjonspunktCodes.includes(ap.definisjon.kode));
      if (shouldOpenDefaultInfoPanels
        && isInfoPanelOpen(filteredAps)
        && checkIfAksjonspunkterIsSolveable(filteredAps)) {
        toggleInfoPanelCallback(infoPanelId);
      }
    }

    render() {
      const { aksjonspunkter, readOnly, erOverstyrer } = this.props;
      const filteredAps = aksjonspunkter.filter((ap) => aksjonspunktCodes.includes(ap.definisjon.kode));
      const hasOpenAksjonspunkter = isInfoPanelOpen(filteredAps);
      const canSolveAksjonspunkter = checkIfAksjonspunkterIsSolveable(filteredAps);

      const newProps = {
        readOnly: readOnly || (!(skalKunneOverstyre && erOverstyrer) && isInactiv(filteredAps)),
        submittable: !hasOpenAksjonspunkter || canSolveAksjonspunkter,
        hasOpenAksjonspunkter: hasOpenAksjonspunkter && canSolveAksjonspunkter,
        aksjonspunkter: filteredAps,
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }

  InfoPanel.displayName = `InfoPanel(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  InfoPanel.propTypes = {
    aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
    toggleInfoPanelCallback: PropTypes.func.isRequired,
    shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    erOverstyrer: PropTypes.bool,
  };

  InfoPanel.defaultProps = {
    erOverstyrer: false,
    aksjonspunkter: [],
  };

  return InfoPanel;
};

export default withDefaultToggling;