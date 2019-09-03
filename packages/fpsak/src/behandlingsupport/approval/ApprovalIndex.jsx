import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier, requireProps } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import { getNavAnsatt } from 'app/duck';
import { createLocationForHistorikkItems } from 'kodeverk/skjermlenkeCodes';
import {
  getBehandlingAnsvarligSaksbehandler,
  getBehandlingIdentifier,
  getBehandlingStatus,
  getBehandlingToTrinnsBehandling,
  getBehandlingType,
  getBehandlingVersjon,
  getTotrinnskontrollArsakerReadOnly,
  getTotrinnskontrollArsakerUtenUdefinert,
} from 'behandling/duck';
import { getKodeverk, getFpTilbakeKodeverk } from 'kodeverk/duck';
import FatterVedtakApprovalModal from './components/FatterVedtakApprovalModal';
import ToTrinnsForm from './components/ToTrinnsForm';
import ToTrinnsFormReadOnly from './components/ToTrinnsFormReadOnly';
import { approve, fetchApprovalVedtaksbrevPreview, resetApproval } from './duck';

import styles from './ApprovalIndex.less';


const getArsaker = (approval) => (
  [
    {
      code: vurderPaNyttArsakType.FEIL_FAKTA,
      isSet: approval.feilFakta,
    },
    {
      code: vurderPaNyttArsakType.FEIL_LOV,
      isSet: approval.feilLov,
    },
    {
      code: vurderPaNyttArsakType.FEIL_REGEL,
      isSet: approval.feilRegel,
    },
    {
      code: vurderPaNyttArsakType.ANNET,
      isSet: approval.annet,
    },
  ]
    .filter((arsak) => arsak.isSet)
    .map((arsak) => arsak.code)
);

export const mapPropsToContext = (toTrinnsBehandling, nextProps, skjemalenkeTyper) => {
  if (toTrinnsBehandling) {
    let skjermlenkeContext;
    if (nextProps.status.kode === behandlingStatus.FATTER_VEDTAK && nextProps.totrinnskontrollSkjermlenkeContext) {
      skjermlenkeContext = nextProps.totrinnskontrollSkjermlenkeContext;
    }
    if (nextProps.status.kode !== behandlingStatus.FATTER_VEDTAK && nextProps.totrinnskontrollReadOnlySkjermlenkeContext) {
      skjermlenkeContext = nextProps.totrinnskontrollReadOnlySkjermlenkeContext;
    }
    if (skjermlenkeContext) {
      const totrinnsContext = skjermlenkeContext.map((context) => {
        const skjermlenkeTypeKodeverk = skjemalenkeTyper.find((skjemalenkeType) => skjemalenkeType.kode === context.skjermlenkeType);
        return {
          contextCode: context.skjermlenkeType,
          skjermlenke: createLocationForHistorikkItems(nextProps.location, context.skjermlenkeType),
          skjermlenkeNavn: skjermlenkeTypeKodeverk.navn,
          aksjonspunkter: context.totrinnskontrollAksjonspunkter,
        };
      });
      return totrinnsContext || null;
    }
  }
  return null;
};

/**
 * ApprovalIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
export class ApprovalIndexImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      approvals: [],
      allAksjonspunktApproved: undefined,
      showBeslutterModal: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.forhandsvisVedtaksbrev = this.forhandsvisVedtaksbrev.bind(this);

    const {
      totrinnskontrollSkjermlenkeContext, totrinnskontrollReadOnlySkjermlenkeContext, toTrinnsBehandling, skjemalenkeTyper,
    } = props;
    if (totrinnskontrollSkjermlenkeContext || totrinnskontrollReadOnlySkjermlenkeContext) {
      this.state = {
        ...this.state,
        approvals: mapPropsToContext(toTrinnsBehandling, props, skjemalenkeTyper),
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.totrinnskontrollSkjermlenkeContext || nextProps.totrinnskontrollReadOnlySkjermlenkeContext) {
      this.setState({ approvals: mapPropsToContext(nextProps.toTrinnsBehandling, nextProps, nextProps.skjemalenkeTyper) });
    }
  }

  componentWillUnmount() {
    const { resetApproval: reset, erTilbakekreving } = this.props;
    this.setState({ approvals: [] });
    reset(erTilbakekreving);
  }

  onSubmit(values) {
    const {
      behandlingIdentifier,
      selectedBehandlingVersjon,
      approve: approveAp,
      erTilbakekreving,
    } = this.props;
    const aksjonspunkter = values.approvals
      .map((context) => context.aksjonspunkter)
      .reduce((a, b) => a.concat(b));

    const aksjonspunktGodkjenningDtos = aksjonspunkter
      .map((toTrinnsAksjonspunkt) => ({
        aksjonspunktKode: toTrinnsAksjonspunkt.aksjonspunktKode,
        godkjent: toTrinnsAksjonspunkt.totrinnskontrollGodkjent,
        begrunnelse: toTrinnsAksjonspunkt.besluttersBegrunnelse,
        arsaker: getArsaker(toTrinnsAksjonspunkt),
      }));

    // TODO (TOR) Fjern hardkodinga av 5005
    const fatterVedtakAksjonspunktDto = {
      '@type': erTilbakekreving ? '5005' : aksjonspunktCodes.FATTER_VEDTAK,
      begrunnelse: null,
      aksjonspunktGodkjenningDtos,
    };
    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon: selectedBehandlingVersjon,
      bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
    };
    this.setAksjonspunktApproved(aksjonspunkter);
    this.setState({
      showBeslutterModal: true,
    });
    return approveAp(erTilbakekreving, params);
  }

  setAksjonspunktApproved(toTrinnsAksjonspunkter) {
    this.setState({
      allAksjonspunktApproved: toTrinnsAksjonspunkter.every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true),
    });
  }

  forhandsvisVedtaksbrev() {
    const { fetchApprovalVedtaksbrevPreview: fetchPreview, behandlingIdentifier } = this.props;
    fetchPreview({ behandlingId: behandlingIdentifier.behandlingId });
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  render() {
    const {
      totrinnskontrollSkjermlenkeContext, totrinnskontrollReadOnlySkjermlenkeContext, status,
      location, navAnsatt, ansvarligSaksbehandler,
    } = this.props;
    const { approvals, allAksjonspunktApproved, showBeslutterModal } = this.state;
    const showModalVedtakStatus = showBeslutterModal;
    const { brukernavn, kanVeilede } = navAnsatt;
    const readOnly = brukernavn === ansvarligSaksbehandler || kanVeilede;

    if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
      return null;
    }

    return (
      <div className={styles.approvalContainer}>
        {approvals && approvals.length > 0
          ? (
            <div>
              {status.kode === behandlingStatus.FATTER_VEDTAK
                ? (
                  <div>
                    {!readOnly && (
                      <AksjonspunktHelpText isAksjonspunktOpen marginBottom>
                        {[<FormattedMessage key={1} id="HelpText.ToTrinnsKontroll" />]}
                      </AksjonspunktHelpText>
                    )}
                    <ToTrinnsForm
                      totrinnskontrollContext={approvals}
                      initialValues={{ approvals }}
                      onSubmit={this.onSubmit}
                      location={location}
                      forhandsvisVedtaksbrev={this.forhandsvisVedtaksbrev}
                      readOnly={readOnly}
                    />
                  </div>
                )
                : (
                  <div>
                    <div className={styles.resultatFraGodkjenningTextContainer}>
                      <FormattedHTMLMessage id="ToTrinnsForm.LøstAksjonspunkt" />
                    </div>
                    <div>
                      <ToTrinnsFormReadOnly
                        approvalList={approvals}
                      />
                    </div>
                  </div>
                )}
            </div>
          )
          : null}
        <FatterVedtakApprovalModal
          showModal={showModalVedtakStatus}
          closeEvent={this.goToSearchPage}
          allAksjonspunktApproved={allAksjonspunktApproved}
        />
      </div>
    );
  }
}


ApprovalIndexImpl.propTypes = {
  totrinnskontrollSkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollReadOnlySkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  approve: PropTypes.func.isRequired,
  fetchApprovalVedtaksbrevPreview: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  selectedBehandlingVersjon: PropTypes.number.isRequired,
  ansvarligSaksbehandler: PropTypes.string,
  status: PropTypes.shape().isRequired,
  toTrinnsBehandling: PropTypes.bool.isRequired,
  push: PropTypes.func.isRequired,
  resetApproval: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  skjemalenkeTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erTilbakekreving: PropTypes.bool.isRequired,
};

ApprovalIndexImpl.defaultProps = {
  ansvarligSaksbehandler: undefined,
  totrinnskontrollSkjermlenkeContext: undefined,
  totrinnskontrollReadOnlySkjermlenkeContext: undefined,
};

const mapStateToPropsFactory = (initialState) => {
  const skjermlenkeTyperFpsak = getKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(initialState);
  const skjermlenkeTyperFptilbake = getFpTilbakeKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(initialState);
  return (state) => {
    const behandlingType = getBehandlingType(state);
    const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
    const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandlingTypeKode;
    return {
      totrinnskontrollSkjermlenkeContext: getTotrinnskontrollArsakerUtenUdefinert(state),
      totrinnskontrollReadOnlySkjermlenkeContext: getTotrinnskontrollArsakerReadOnly(state),
      behandlingIdentifier: getBehandlingIdentifier(state),
      selectedBehandlingVersjon: getBehandlingVersjon(state),
      ansvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
      status: getBehandlingStatus(state),
      toTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
      navAnsatt: getNavAnsatt(state),
      skjemalenkeTyper: erTilbakekreving ? skjermlenkeTyperFptilbake : skjermlenkeTyperFpsak,
      location: state.router.location,
      erTilbakekreving,
    };
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    approve,
    resetApproval,
    fetchApprovalVedtaksbrevPreview,
  }, dispatch),
});

const ApprovalIndex = withRouter(connect(mapStateToPropsFactory, mapDispatchToProps)(requireProps(['behandlingIdentifier'])(ApprovalIndexImpl)));

export default ApprovalIndex;
