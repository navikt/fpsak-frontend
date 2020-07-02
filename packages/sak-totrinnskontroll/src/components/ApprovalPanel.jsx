import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AksjonspunktHelpTextHTML, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { skjermlenkeCodes } from '@fpsak-frontend/konstanter';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import ToTrinnsForm from './ToTrinnsForm';
import ToTrinnsFormReadOnly from './ToTrinnsFormReadOnly';

import styles from './approvalPanel.less';

const sorterteSkjermlenkeCodesForTilbakekreving = [
  skjermlenkeCodes.FAKTA_OM_FEILUTBETALING,
  skjermlenkeCodes.FORELDELSE,
  skjermlenkeCodes.TILBAKEKREVING,
  skjermlenkeCodes.VEDTAK,
];

const sorterTilbakekrevingContext = (approvals) => (
  sorterteSkjermlenkeCodesForTilbakekreving
    .map((s) => approvals.find((el) => el.contextCode === s.kode))
    .filter((s) => s)
);

export const mapPropsToContext = (toTrinnsBehandling, props, skjemalenkeTyper, createLocationForSkjermlenke) => {
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
          skjermlenke: createLocationForSkjermlenke(props.location, context.skjermlenkeType),
          skjermlenkeNavn: skjermlenkeTypeKodeverk.navn,
          aksjonspunkter: context.totrinnskontrollAksjonspunkter,
        };
      });
      if (props.erTilbakekreving) {
        return totrinnsContext ? sorterTilbakekrevingContext(totrinnsContext) : null;
      }

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
      totrinnskontrollSkjermlenkeContext, totrinnskontrollReadOnlySkjermlenkeContext, toTrinnsBehandling, skjemalenkeTyper, createLocationForSkjermlenke,
    } = props;
    if (totrinnskontrollSkjermlenkeContext || totrinnskontrollReadOnlySkjermlenkeContext) {
      this.state = {
        ...this.state,
        approvals: mapPropsToContext(toTrinnsBehandling, props, skjemalenkeTyper, createLocationForSkjermlenke),
      };
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.totrinnskontrollSkjermlenkeContext || nextProps.totrinnskontrollReadOnlySkjermlenkeContext) {
      this.setState({
        approvals: mapPropsToContext(nextProps.toTrinnsBehandling, nextProps, nextProps.skjemalenkeTyper, nextProps.createLocationForSkjermlenke),
      });
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
      behandlingsresultat,
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
                      <>
                        <AksjonspunktHelpTextHTML>
                          {[<FormattedMessage key={1} id="HelpText.ToTrinnsKontroll" />]}
                        </AksjonspunktHelpTextHTML>
                        <VerticalSpacer sixteenPx />
                      </>
                    )}
                    <ToTrinnsForm
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                      behandlingsresultat={behandlingsresultat}
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
                      <FormattedMessage
                        id="ToTrinnsForm.LøstAksjonspunkt"
                        values={{
                          b: (...chunks) => <b>{chunks}</b>,
                        }}
                      />
                    </div>
                    <div>
                      <ToTrinnsFormReadOnly
                        approvalList={approvals}
                        isForeldrepengerFagsak={isForeldrepengerFagsak}
                        behandlingKlageVurdering={behandlingKlageVurdering}
                        behandlingStatus={behandlingStatus}
                        alleKodeverk={alleKodeverk}
                        erTilbakekreving={erTilbakekreving}
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
  behandlingsresultat: PropTypes.shape(),
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  disableGodkjennKnapp: PropTypes.bool.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
  erTilbakekreving: PropTypes.bool,
};

ApprovalPanel.defaultProps = {
  totrinnskontrollSkjermlenkeContext: undefined,
  totrinnskontrollReadOnlySkjermlenkeContext: undefined,
  behandlingKlageVurdering: undefined,
  erTilbakekreving: false,
  behandlingsresultat: undefined,
};

export default ApprovalPanel;
