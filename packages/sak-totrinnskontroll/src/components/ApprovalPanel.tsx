import React, { Component } from 'react';

import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles';

import ToTrinnsForm from './ToTrinnsForm';
import ToTrinnsFormReadOnly from './ToTrinnsFormReadOnly';

import styles from './approvalPanel.less';
import { TotrinnskontrollAksjonspunkter, BehandlingStatusType, SkjemalenkeTyper } from '../TotrinnskontrollSakIndex';

export const mapPropsToContext = (
  toTrinnsBehandling: boolean,
  props: ApprovalPanelProps,
  skjemalenkeTyper: SkjemalenkeTyper[],
) => {
  if (toTrinnsBehandling) {
    let skjermlenkeContext;
    if (props.behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK && props.totrinnskontrollSkjermlenkeContext) {
      skjermlenkeContext = props.totrinnskontrollSkjermlenkeContext;
    }
    if (
      props.behandlingStatus.kode !== BehandlingStatus.FATTER_VEDTAK
      && props.totrinnskontrollReadOnlySkjermlenkeContext
    ) {
      skjermlenkeContext = props.totrinnskontrollReadOnlySkjermlenkeContext;
    }
    if (skjermlenkeContext) {
      const totrinnsContext = skjermlenkeContext.map((context) => {
        const skjermlenkeTypeKodeverk = skjemalenkeTyper.find(
          (skjemalenkeType) => skjemalenkeType.kode === context.skjermlenkeType,
        );
        return {
          contextCode: context.skjermlenkeType,
          skjermlenke: createLocationForHistorikkItems(props.location, context.skjermlenkeType),
          skjermlenkeNavn: skjermlenkeTypeKodeverk?.navn,
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
export class ApprovalPanel extends Component<ApprovalPanelProps, ApprovalPanelState> {
  constructor(props: ApprovalPanelProps) {
    super(props);
    this.state = {
      approvals: [],
    };

    const {
      totrinnskontrollSkjermlenkeContext,
      totrinnskontrollReadOnlySkjermlenkeContext,
      toTrinnsBehandling,
      skjemalenkeTyper,
    } = props;
    if (totrinnskontrollSkjermlenkeContext || totrinnskontrollReadOnlySkjermlenkeContext) {
      this.state = {
        ...this.state,
        approvals: mapPropsToContext(toTrinnsBehandling, props, skjemalenkeTyper),
      };
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: ApprovalPanelProps) {
    if (nextProps.totrinnskontrollSkjermlenkeContext || nextProps.totrinnskontrollReadOnlySkjermlenkeContext) {
      this.setState({
        approvals: mapPropsToContext(nextProps.toTrinnsBehandling, nextProps, nextProps.skjemalenkeTyper),
      });
    }
  }

  componentWillUnmount() {
    this.setState({ approvals: [] });
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
    } = this.props;
    const { approvals } = this.state;

    return (
      <div className={styles.approvalContainer}>
        {approvals && approvals.length > 0 ? (
          <div>
            {behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK ? (
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
                />
              </div>
            ) : (
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
        ) : null}
      </div>
    );
  }
}

interface ApprovalPanelProps {
  behandlingId: number;
  behandlingVersjon: number;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  totrinnskontrollReadOnlySkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  behandlingStatus: BehandlingStatusType;
  toTrinnsBehandling: boolean;
  location: object;
  skjemalenkeTyper: SkjemalenkeTyper[];
  onSubmit: () => void;
  readOnly: boolean;
  forhandsvisVedtaksbrev: () => void;
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: {
    klageVurdering: string;
    klageVurderingOmgjoer: string;
  };
  alleKodeverk: object;
  erBehandlingEtterKlage: boolean;
  disableGodkjennKnapp: boolean;
}

export interface Approvals {
  contextCode: string;
  skjermlenke: string;
  aksjonspunkter: { aksjonspunktKode: string }[];
  skjermlenkeNavn?: string;
}

interface ApprovalPanelState {
  approvals: Approvals[] | null;
}

export default ApprovalPanel;
