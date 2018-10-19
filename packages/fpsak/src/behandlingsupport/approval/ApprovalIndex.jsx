import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { routerActions } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { createLocationForHistorikkItems } from 'app/paths';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import behandlingStatus from 'kodeverk/behandlingStatus';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import {
  getBehandlingVersjon, getAksjonspunkter, getBehandlingAnsvarligSaksbehandler, getTotrinnskontrollArsakerUtenUdefinert,
  getBehandlingStatus, getBehandlingToTrinnsBehandling, getSelectedBehandlingIdentifier, getTotrinnskontrollArsakerReadOnly,
} from 'behandling/behandlingSelectors';
import navAnsattPropType from 'navAnsatt/navAnsattPropType';
import { fetchVedtaksbrevPreview } from 'fagsak/duck';
import requireProps from 'app/data/requireProps';
import { getNavAnsatt } from 'navAnsatt/duck';
import vurderPaNyttArsakType from 'kodeverk/vurderPaNyttArsakType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import FatterVedtakApprovalModal from './components/FatterVedtakApprovalModal';
import ToTrinnsForm from './components/ToTrinnsForm';
import ToTrinnsFormReadOnly from './components/ToTrinnsFormReadOnly';
import { approve, getApproveFinished, resetApproval } from './duck';

import styles from './ApprovalIndex.less';


const getArsaker = approval => (
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
    .filter(arsak => arsak.isSet)
    .map(arsak => arsak.code)
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
        const skjermlenkeTypeKodeverk = skjemalenkeTyper.find(skjemalenkeType => skjemalenkeType.kode === context.skjermlenkeType);
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
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.forhandsvisVedtaksbrev = this.forhandsvisVedtaksbrev.bind(this);
  }

  componentWillMount() {
    const {
      totrinnskontrollSkjermlenkeContext, totrinnskontrollReadOnlySkjermlenkeContext, toTrinnsBehandling, skjemalenkeTyper,
    } = this.props;
    if (totrinnskontrollSkjermlenkeContext || totrinnskontrollReadOnlySkjermlenkeContext) {
      this.setState({ approvals: mapPropsToContext(toTrinnsBehandling, this.props, skjemalenkeTyper) });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.totrinnskontrollSkjermlenkeContext || nextProps.totrinnskontrollReadOnlySkjermlenkeContext) {
      this.setState({ approvals: mapPropsToContext(nextProps.toTrinnsBehandling, nextProps, nextProps.skjemalenkeTyper) });
    }
  }

  componentWillUnmount() {
    const { resetApproval: reset } = this.props;
    this.setState({ approvals: [] });
    reset();
  }

  onSubmit(values) {
    const { behandlingIdentifier, selectedBehandlingVersjon, approve: approveAp } = this.props;
    const fatteVedtakAksjonspunkt = this.aksjonspunkt();
    const aksjonspunkter = values.approvals
      .map(context => context.aksjonspunkter)
      .reduce((a, b) => a.concat(b));

    const aksjonspunktGodkjenningDtos = aksjonspunkter
      .map(toTrinnsAksjonspunkt => ({
        aksjonspunktKode: toTrinnsAksjonspunkt.aksjonspunktKode,
        godkjent: toTrinnsAksjonspunkt.totrinnskontrollGodkjent,
        begrunnelse: toTrinnsAksjonspunkt.besluttersBegrunnelse,
        arsaker: getArsaker(toTrinnsAksjonspunkt),
      }));

    const fatterVedtakAksjonspunktDto = {
      '@type': fatteVedtakAksjonspunkt.definisjon.kode,
      begrunnelse: null,
      aksjonspunktGodkjenningDtos,
    };
    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon: selectedBehandlingVersjon,
      bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
    };
    this.setAksjonspunktApproved(aksjonspunkter);
    return approveAp(params);
  }

  setAksjonspunktApproved(toTrinnsAksjonspunkter) {
    this.setState({
      allAksjonspunktApproved: toTrinnsAksjonspunkter.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true),
    });
  }

  forhandsvisVedtaksbrev() {
    const { fetchVedtaksbrevPreview: fetchPreview, behandlingIdentifier } = this.props;
    fetchPreview({ behandlingId: behandlingIdentifier.behandlingId });
  }

  aksjonspunkt() {
    const { aksjonspunkter } = this.props;
    for (let i = 0; i < aksjonspunkter.length; i += 1) {
      if (aksjonspunkter[i].definisjon.kode === aksjonspunktCodes.FATTER_VEDTAK) {
        return aksjonspunkter[i];
      }
    }
    return false;
  }

  goToSearchPage() {
    const { push } = this.props;
    push('/');
  }

  render() {
    const {
      totrinnskontrollSkjermlenkeContext, totrinnskontrollReadOnlySkjermlenkeContext, status,
      approvalReceived, location, navAnsatt, ansvarligSaksbehandler,
    } = this.props;
    const { approvals, allAksjonspunktApproved } = this.state;
    const showModalVedtakStatus = approvalReceived;
    const { brukernavn, kanVeilede } = navAnsatt;
    const readOnly = brukernavn === ansvarligSaksbehandler || kanVeilede;

    if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
      return null;
    }

    return (
      <div>
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
                )
              }
            </div>
          )
          : null
        }
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
  fetchVedtaksbrevPreview: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  selectedBehandlingVersjon: PropTypes.number.isRequired,
  ansvarligSaksbehandler: PropTypes.string,
  status: PropTypes.shape().isRequired,
  toTrinnsBehandling: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  approvalReceived: PropTypes.bool.isRequired,
  push: PropTypes.func.isRequired,
  resetApproval: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  skjemalenkeTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ApprovalIndexImpl.defaultProps = {
  ansvarligSaksbehandler: undefined,
  totrinnskontrollSkjermlenkeContext: undefined,
  totrinnskontrollReadOnlySkjermlenkeContext: undefined,
  aksjonspunkter: [],
};

const mapStateToProps = state => ({
  totrinnskontrollSkjermlenkeContext: getTotrinnskontrollArsakerUtenUdefinert(state),
  totrinnskontrollReadOnlySkjermlenkeContext: getTotrinnskontrollArsakerReadOnly(state),
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  ansvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  status: getBehandlingStatus(state),
  toTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
  aksjonspunkter: getAksjonspunkter(state),
  approvalReceived: getApproveFinished(state),
  navAnsatt: getNavAnsatt(state),
  skjemalenkeTyper: getKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...routerActions,
    approve,
    resetApproval,
    fetchVedtaksbrevPreview,
  }, dispatch),
});

const ApprovalIndex = withRouter(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingIdentifier'])(ApprovalIndexImpl)));

export default ApprovalIndex;
