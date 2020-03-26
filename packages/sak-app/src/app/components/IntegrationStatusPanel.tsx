import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { dateFormat, timeFormat } from '@fpsak-frontend/utils';
import chevronUp from '@fpsak-frontend/assets/images/pil_opp.svg';
import chevronDown from '@fpsak-frontend/assets/images/pil_ned.svg';
import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg';

import styles from './integrationStatusPanel.less';

const formatErrorMsgHeader = (systemNavn, nedeFremTilTidspunkt) => (nedeFremTilTidspunkt
  ? (
    <FormattedMessage
      id="IntegrationStatusPanel.DowntimeUntil"
      values={{ system: systemNavn, datetime: `${dateFormat(nedeFremTilTidspunkt)} ${timeFormat(nedeFremTilTidspunkt)}` }}
    />
  )
  : <FormattedMessage id="IntegrationStatusPanel.Downtime" values={{ system: systemNavn }} />);

interface OwnProps {
  integrationStatusList: {
    systemNavn?: string;
    endepunkt?: string;
    nedeFremTilTidspunkt?: string;
    feilmelding?: string;
    stackTrace?: string;
  }[];
}

interface OwnState {
  toggleOpen: boolean;
}

/**
 * IntegrationStatusPanel
 *
 * Presentasjonskomponent. Panel som viser hvilke systemer/tjenester som har nedetid.
 */
class IntegrationStatusPanel extends Component<OwnProps, OwnState> {
  constructor(props) {
    super(props);

    this.state = {
      toggleOpen: false,
    };

    this.togglePanelOnClick = this.togglePanelOnClick.bind(this);
    this.togglePanelOnKeyDown = this.togglePanelOnKeyDown.bind(this);
  }

  togglePanelOnClick() {
    const { toggleOpen } = this.state;
    this.setState({ toggleOpen: !toggleOpen });
  }

  togglePanelOnKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.togglePanelOnClick();
    }
  }

  render() {
    const {
      integrationStatusList,
    } = this.props;
    const { toggleOpen } = this.state;

    return (
      <button
        type="button"
        tabIndex={0}
        className={styles.container}
        onClick={this.togglePanelOnClick}
        onKeyDown={this.togglePanelOnKeyDown}
      >
        <Image className={styles.cursor} src={toggleOpen ? chevronUp : chevronDown} />
        <Row className={styles.row}>
          <Column xs="1">
            <Image src={infoImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="9" className={styles.text}>
            <Undertittel><FormattedMessage id="IntegrationStatusPanel.ServiceDowntime" /></Undertittel>
          </Column>
        </Row>
        <VerticalSpacer eightPx />
        <Row className={styles.rowContents}>
          <Column xs="1" />
          <Column xs="11">
            {integrationStatusList.map((isl) => {
              if (toggleOpen) {
                return (
                  <div key={isl.systemNavn}>
                    <Normaltekst>{formatErrorMsgHeader(isl.systemNavn, isl.nedeFremTilTidspunkt)}</Normaltekst>
                    <VerticalSpacer fourPx />
                    <div className={styles.details}>
                      <Undertekst><FormattedMessage id="IntegrationStatusPanel.Endpoint" /></Undertekst>
                      <Normaltekst>{isl.endepunkt}</Normaltekst>
                      <VerticalSpacer fourPx />
                      <Undertekst><FormattedMessage id="IntegrationStatusPanel.ErrorMessage" /></Undertekst>
                      <Normaltekst>{isl.feilmelding}</Normaltekst>
                      <VerticalSpacer fourPx />
                      <Undertekst><FormattedMessage id="IntegrationStatusPanel.Stacktrace" /></Undertekst>
                      <div className={styles.stacktrace}>
                        <Normaltekst>{isl.stackTrace}</Normaltekst>
                      </div>
                    </div>
                    <VerticalSpacer sixteenPx />
                  </div>
                );
              }
              return <Normaltekst key={isl.systemNavn}>{formatErrorMsgHeader(isl.systemNavn, isl.nedeFremTilTidspunkt)}</Normaltekst>;
            })}
          </Column>
        </Row>
      </button>
    );
  }
}

export default injectIntl(IntegrationStatusPanel);
