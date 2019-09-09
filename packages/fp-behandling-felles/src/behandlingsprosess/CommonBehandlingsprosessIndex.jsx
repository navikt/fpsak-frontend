import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import {
  BehandlingIdentifier,
  getBehandlingspunktLocation,
  getLocationWithDefaultBehandlingspunktAndFakta,
  requireProps,
} from '@fpsak-frontend/fp-felles';

import { injectIntl } from 'react-intl';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import findStatusIcon from './statusIconHelper';
import BehandlingsprosessPanel from './components/BehandlingsprosessPanel';
import IverksetterVedtakStatusModal from './components/vedtak/IverksetterVedtakStatusModal';
import FatterVedtakStatusModal from './components/vedtak/FatterVedtakStatusModal';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const hasOverstyringAp = (aksjonspunkter) => (
  aksjonspunkter
    .some((ap) => ap.aksjonspunktType.kode === aksjonspunktType.OVERSTYRING || ap.aksjonspunktType.kode === aksjonspunktType.SAKSBEHANDLEROVERSTYRING)
);


/**
 * CommonBehandlingsprosessIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class CommonBehandlingsprosessIndex extends Component {
  componentDidMount = () => {
    this.setup();
  };

  componentDidUpdate = (prevProps) => {
    this.setup(prevProps.behandlingVersjon);
  };

  componentWillUnmount = () => {
    const { resetBehandlingspunkter: resetBp } = this.props;
    resetBp();
  };

  setup = (prevBehandlingVersjon) => {
    const { behandlingVersjon, resetBehandlingspunkter: resetBp } = this.props;
    if (behandlingVersjon !== prevBehandlingVersjon) {
      resetBp();
    }
  };

  /* NOTE: Denne er en slags toggle, selv om ikke navnet tilsier det */
  goToBehandlingspunkt = (punktName) => {
    const { selectedBehandlingspunkt, push: pushLocation, location } = this.props;
    if (!punktName || punktName === selectedBehandlingspunkt) {
      pushLocation(getBehandlingspunktLocation(location)(null));
    } else {
      pushLocation(getBehandlingspunktLocation(location)(formatBehandlingspunktName(punktName)));
    }
  };

  goToBehandlingWithDefaultPunktAndFakta = () => {
    const { push: pushLocation, location } = this.props;
    pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
  };

  goToSearchPage = () => {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  };

  previewCallback = (data) => {
    const { behandlingUuid, fagsakYtelseType, fetchPreview: fetchBrevPreview } = this.props;
    const brevData = {
      ...data,
      behandlingUuid,
      ytelseType: fagsakYtelseType,
    };
    fetchBrevPreview(brevData);
  };

  submitAksjonspunkter = (aksjonspunktModels, afterSubmitCallback, shouldUpdateInfo) => {
    const {
      resolveProsessAksjonspunkter: resolveAksjonspunkter,
      overrideProsessAksjonspunkter: overrideAksjonspunkter,
      behandlingIdentifier,
      behandlingVersjon,
      aksjonspunkter,
    } = this.props;

    const models = aksjonspunktModels.map((ap) => ({
      '@type': ap.kode,
      ...ap,
    }));

    if (overrideAksjonspunkter) {
      const apCodes = aksjonspunktModels.map((ap) => ap.kode);
      const aktuelleAksjonspunkter = aksjonspunkter.filter((ap) => apCodes.includes(ap.definisjon.kode));
      if (aktuelleAksjonspunkter.length === 0 || hasOverstyringAp(aktuelleAksjonspunkter)) {
        const params = {
          ...behandlingIdentifier.toJson(),
          behandlingVersjon,
          overstyrteAksjonspunktDtoer: models,
        };
        return overrideAksjonspunkter(behandlingIdentifier, params, shouldUpdateInfo)
          .then(afterSubmitCallback);
      }
    }

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: models,
    };

    return resolveAksjonspunkter(behandlingIdentifier, params, shouldUpdateInfo)
      .then(afterSubmitCallback);
  };

  render = () => {
    const {
      behandlingspunkter, selectedBehandlingspunkt, isSelectedBehandlingHenlagt, fagsakYtelseType,
      resolveProsessAksjonspunkterSuccess, behandlingStatus, behandlingsresultat, behandlingspunkterStatus,
      behandlingspunkterTitleCodes, aksjonspunkterOpenStatus, doNotUseFatterVedtakModal, behandlingIdentifier,
      aksjonspunkter, behandlingType, isKlageWithKA, doNotUseIverksetterVedtakModal, additionalBehandlingspunktImages,
      intl, render,
    } = this.props;

    const punkter = [];
    const findIcon = findStatusIcon(additionalBehandlingspunktImages);
    behandlingspunkter.forEach((navn) => {
      const selected = navn === selectedBehandlingspunkt;
      const status = behandlingspunkterStatus ? behandlingspunkterStatus[navn] : null;
      const hasOpenAksjonspunkt = aksjonspunkterOpenStatus ? aksjonspunkterOpenStatus[navn] : null;
      const titleCode = behandlingspunkterTitleCodes[navn];
      const isIkkeVurdert = status === vilkarUtfallType.IKKE_VURDERT && !hasOpenAksjonspunkt;
      punkter.push({
        navn,
        selected,
        src: findIcon(navn, status, selected, isSelectedBehandlingHenlagt, hasOpenAksjonspunkt)(false),
        srcHoover: findIcon(navn, status, selected, isSelectedBehandlingHenlagt, hasOpenAksjonspunkt)(true),
        title: intl.formatMessage({ id: titleCode }),
        isIkkeVurdert,
        callback: () => this.goToBehandlingspunkt(navn),
      });
    });
    return (
      <>
        <BehandlingsprosessPanel
          punkter={punkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        >
          {render(this.previewCallback, this.submitAksjonspunkter,
            this.goToBehandlingWithDefaultPunktAndFakta, this.goToSearchPage)}
        </BehandlingsprosessPanel>
        {!doNotUseIverksetterVedtakModal && (
          <IverksetterVedtakStatusModal
            closeEvent={this.goToSearchPage}
            behandlingsresultat={behandlingsresultat}
            behandlingStatusKode={behandlingStatus.kode}
            fagsakYtelseType={fagsakYtelseType}
            resolveFaktaAksjonspunkterSuccess
            resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
          />
        )}
        {!doNotUseFatterVedtakModal && behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK && (
          <FatterVedtakStatusModal
            closeEvent={this.goToSearchPage}
            selectedBehandlingId={behandlingIdentifier.behandlingId}
            fagsakYtelseType={fagsakYtelseType}
            isVedtakSubmission={resolveProsessAksjonspunkterSuccess}
            behandlingStatus={behandlingStatus}
            behandlingsresultat={behandlingsresultat}
            aksjonspunkter={aksjonspunkter}
            behandlingType={behandlingType}
            isKlageWithKA={isKlageWithKA}
          />
        )}
      </>
    );
  };
}

CommonBehandlingsprosessIndex.propTypes = {
  behandlingUuid: PropTypes.string.isRequired,
  additionalBehandlingspunktImages: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  doNotUseFatterVedtakModal: PropTypes.bool,
  doNotUseIverksetterVedtakModal: PropTypes.bool,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  fetchPreview: PropTypes.func,
  intl: PropTypes.shape().isRequired,
  isKlageWithKA: PropTypes.bool,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  overrideProsessAksjonspunkter: PropTypes.func,
  push: PropTypes.func.isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  render: PropTypes.func.isRequired,
};

CommonBehandlingsprosessIndex.defaultProps = {
  behandlingspunkter: undefined,
  selectedBehandlingspunkt: undefined,
  behandlingsresultat: undefined,
  doNotUseFatterVedtakModal: false,
  doNotUseIverksetterVedtakModal: false,
  overrideProsessAksjonspunkter: undefined,
  isKlageWithKA: false,
  fetchPreview: undefined,
  additionalBehandlingspunktImages: {},
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const defaultFunc = {
    push,
    fetchPreview: ownProps.fetchPreviewBrev,
    resolveProsessAksjonspunkter: ownProps.resolveProsessAksjonspunkter,
    resetBehandlingspunkter: ownProps.resetBehandlingspunkter,
  };

  if (ownProps.overrideProsessAksjonspunkter) {
    return {
      ...bindActionCreators({
        ...defaultFunc,
        overrideProsessAksjonspunkter: ownProps.overrideProsessAksjonspunkter,
      }, dispatch),
    };
  }

  return {
    ...bindActionCreators({
      ...defaultFunc,
    }, dispatch),
  };
};

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(injectIntl(CommonBehandlingsprosessIndex));
export default connect(() => ({}), mapDispatchToProps)(withPropsCheck);
