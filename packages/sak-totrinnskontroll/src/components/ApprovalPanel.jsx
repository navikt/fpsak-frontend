import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles';

import ToTrinnsForm from './ToTrinnsForm';
import ToTrinnsFormReadOnly from './ToTrinnsFormReadOnly';

import styles from './approvalPanel.less';

export const mapPropsToContext = (toTrinnsBehandling, props, skjemalenkeTyper) => {
  if (toTrinnsBehandling) {
    let skjermlenkeContext;
    if (props.behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK && props.totrinnskontrollSkjermlenkeContext) {
      skjermlenkeContext = props.totrinnskontrollSkjermlenkeContext;
    }
    if (props.behandlingStatus.kode !== BehandlingStatus.FATTER_VEDTAK && props.totrinnskontrollReadOnlySkjermlenkeContext) {
      skjermlenkeContext = props.totrinnskontrollReadOnlySkjermlenkeContext;
    }
    if (skjermlenkeContext) {
      const totrinnsContext = skjermlenkeContext.map((context) => {
        const skjermlenkeTypeKodeverk = skjemalenkeTyper.find((skjemalenkeType) => skjemalenkeType.kode === context.skjermlenkeType);
        return {
          contextCode: context.skjermlenkeType,
          skjermlenke: createLocationForHistorikkItems(props.location, context.skjermlenkeType),
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
 * ApprovalPanel
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
export class ApprovalPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      approvals: [],
    };

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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.totrinnskontrollSkjermlenkeContext || nextProps.totrinnskontrollReadOnlySkjermlenkeContext) {
      this.setState({ approvals: mapPropsToContext(nextProps.toTrinnsBehandling, nextProps, nextProps.skjemalenkeTyper) });
    }
  }

  componentWillUnmount() {
    this.setState({ approvals: [] });
  }

  setAksjonspunktApproved(toTrinnsAksjonspunkter) {
    this.setState({
      allAksjonspunktApproved: toTrinnsAksjonspunkter.every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true),
    });
  }

  render() {
    const {
      behandlingId,
      behandlingVersjon,
      behandlingStatus,
      location,
      readOnly,
      onSubmit,
      forhandsvisVedtaksbrev,
      behandlingKlageVurdering,
      isForeldrepengerFagsak,
      alleKodeverk,
      erBehandlingEtterKlage,
      disableGodkjennKnapp,
      erTilbakekreving,
    } = this.props;
    const { approvals } = this.state;

    return (
      <>
        {approvals && approvals.length > 0
          ? (
            <div>
              {behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK
                ? (
                  <div>
                    {!readOnly && (
                      <AksjonspunktHelpText isAksjonspunktOpen marginBottom>
                        {[<FormattedMessage key={1} id="HelpText.ToTrinnsKontroll" />]}
                      </AksjonspunktHelpText>
                    )}
                    <ToTrinnsForm
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                      totrinnskontrollContext={approvals}
                      initialValues={{ approvals }}
                      onSubmit={onSubmit}
                      location={location}
                      forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
                      readOnly={readOnly}
                      isForeldrepengerFagsak={isForeldrepengerFagsak}
                      behandlingKlageVurdering={behandlingKlageVurdering}
                      behandlingStatus={behandlingStatus}
                      alleKodeverk={alleKodeverk}
                      erBehandlingEtterKlage={erBehandlingEtterKlage}
                      disableGodkjennKnapp={disableGodkjennKnapp}
                      erTilbakekreving={erTilbakekreving}
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
                        isForeldrepengerFagsak={isForeldrepengerFagsak}
                        behandlingKlageVurdering={behandlingKlageVurdering}
                        behandlingStatus={behandlingStatus}
                        alleKodeverk={alleKodeverk}
                      />
                    </div>
                  </div>
                )}
            </div>
          )
          : null}
      </>
    );
  }
}

ApprovalPanel.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  totrinnskontrollSkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollReadOnlySkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  behandlingStatus: PropTypes.shape().isRequired,
  toTrinnsBehandling: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  skjemalenkeTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  forhandsvisVedtaksbrev: PropTypes.func.isRequired,
  isForeldrepengerFagsak: PropTypes.bool.isRequired,
  behandlingKlageVurdering: PropTypes.shape({
    klageVurdering: PropTypes.string,
    klageVurderingOmgjoer: PropTypes.string,
  }),
  alleKodeverk: PropTypes.shape().isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  disableGodkjennKnapp: PropTypes.bool.isRequired,
  erTilbakekreving: PropTypes.bool,
};

ApprovalPanel.defaultProps = {
  totrinnskontrollSkjermlenkeContext: undefined,
  totrinnskontrollReadOnlySkjermlenkeContext: undefined,
  behandlingKlageVurdering: undefined,
  erTilbakekreving: false,
};

export default ApprovalPanel;
