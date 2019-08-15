import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';

import findStatusIcon from './statusIconHelper';
import BehandlingsprosessPanel from './components/BehandlingsprosessPanel';
import IverksetterVedtakStatusModal from './components/vedtak/IverksetterVedtakStatusModal';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

/**
 * withBehandlingsprosessIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
const withBehandlingsprosessIndex = (setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn) => (WrappedComponent) => {
  class BehandlingsprosessIndex extends Component {
    componentDidMount = () => {
      this.setup();
    }

    componentDidUpdate = (prevProps) => {
      this.setup(prevProps.behandlingVersjon);
    }

    componentWillUnmount = () => {
      const { resetBehandlingspunkter: resetBp } = this.props;
      resetBp();
    }

    setup = (prevBehandlingVersjon) => {
      const { behandlingVersjon, resetBehandlingspunkter: resetBp } = this.props;
      if (behandlingVersjon !== prevBehandlingVersjon) {
        resetBp();
      }
    }

    /* NOTE: Denne er en slags toggle, selv om ikke navnet tilsier det */
    goToBehandlingspunkt = (punktName) => {
      const { selectedBehandlingspunkt, push: pushLocation, location } = this.props;
      if (!punktName || punktName === selectedBehandlingspunkt) {
        pushLocation(getBehandlingspunktLocation(location)(null));
      } else {
        pushLocation(getBehandlingspunktLocation(location)(formatBehandlingspunktName(punktName)));
      }
    }

    goToBehandlingWithDefaultPunktAndFakta = () => {
      const { push: pushLocation, location } = this.props;
      pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
    }

    goToSearchPage = () => {
      const { push: pushLocation } = this.props;
      pushLocation('/');
    }

    previewCallback = (data) => {
      const { behandlingIdentifier, fetchPreview: fetchBrevPreview } = this.props;
      const brevData = {
        ...data,
        behandlingId: behandlingIdentifier.behandlingId,
      };
      fetchBrevPreview(brevData);
    }

    submitAksjonspunkter = (aksjonspunktModels, afterSubmitCallback, shouldUpdateInfo) => {
      const {
        resolveProsessAksjonspunkter: resolveAksjonspunkter,
        behandlingIdentifier, behandlingVersjon,
      } = this.props;

      const models = aksjonspunktModels.map(ap => ({
        '@type': ap.kode,
        ...ap,
      }));

      const params = {
        ...behandlingIdentifier.toJson(),
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: models,
      };

      return resolveAksjonspunkter(behandlingIdentifier, params, shouldUpdateInfo)
        .then(afterSubmitCallback);
    }

    render = () => {
      const {
        behandlingspunkter, selectedBehandlingspunkt, isSelectedBehandlingHenlagt, fagsakYtelseType,
        resolveProsessAksjonspunkterSuccess, behandlingStatus, behandlingsresultat, getBehandlingspunkterStatus,
        getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus,
      } = this.props;

      return (
        <React.Fragment>
          <BehandlingsprosessPanel
            behandlingspunkter={behandlingspunkter}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
            selectBehandlingspunktCallback={this.goToBehandlingspunkt}
            isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
            findBehandlingsprosessIcon={findStatusIcon}
            getBehandlingspunkterStatus={getBehandlingspunkterStatus}
            getBehandlingspunkterTitleCodes={getBehandlingspunkterTitleCodes}
            getAksjonspunkterOpenStatus={getAksjonspunkterOpenStatus}
          >
            <WrappedComponent
              submitCallback={this.submitAksjonspunkter}
              previewCallback={this.previewCallback}
              selectedBehandlingspunkt={selectedBehandlingspunkt}
              goToSearchPage={this.goToSearchPage}
              goToDefaultPage={this.goToBehandlingWithDefaultPunktAndFakta}
            />
          </BehandlingsprosessPanel>
          <IverksetterVedtakStatusModal
            closeEvent={this.goToSearchPage}
            behandlingsresultat={behandlingsresultat}
            behandlingStatusKode={behandlingStatus.kode}
            fagsakYtelseType={fagsakYtelseType}
            resolveFaktaAksjonspunkterSuccess
            resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
          />
        </React.Fragment>
      );
    }
  }

  BehandlingsprosessIndex.propTypes = {
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
    selectedBehandlingspunkt: PropTypes.string,
    resetBehandlingspunkter: PropTypes.func.isRequired,
    isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
    location: PropTypes.shape().isRequired,
    push: PropTypes.func.isRequired,
    resolveProsessAksjonspunkter: PropTypes.func.isRequired,
    fetchPreview: PropTypes.func.isRequired,
    fagsakYtelseType: kodeverkObjektPropType.isRequired,
    behandlingStatus: kodeverkObjektPropType.isRequired,
    resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
    behandlingsresultat: PropTypes.shape(),
    getBehandlingspunkterStatus: PropTypes.func.isRequired,
    getBehandlingspunkterTitleCodes: PropTypes.func.isRequired,
    getAksjonspunkterOpenStatus: PropTypes.func.isRequired,
  };

  BehandlingsprosessIndex.defaultProps = {
    behandlingspunkter: undefined,
    selectedBehandlingspunkt: undefined,
    behandlingsresultat: undefined,
  };

  const mapDispatchToProps = (dispatch, ownProps) => ({
    ...bindActionCreators({
      push,
      fetchPreview: ownProps.fetchPreviewBrev,
      resolveProsessAksjonspunkter: ownProps.resolveProsessAksjonspunkter,
      resetBehandlingspunkter: ownProps.resetBehandlingspunkter,
    }, dispatch),
  });

  const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessIndex);
  const TrackRouteParamBehandlingsprosessIndex = trackRouteParam({
    paramName: 'punkt',
    paramPropType: PropTypes.string,
    storeParam: setSelectedBehandlingspunktNavn,
    getParamFromStore: getSelectedBehandlingspunktNavn,
    isQueryParam: true,
  })(connect(() => ({}), mapDispatchToProps)(withPropsCheck));

  return TrackRouteParamBehandlingsprosessIndex;
};

export default withBehandlingsprosessIndex;
