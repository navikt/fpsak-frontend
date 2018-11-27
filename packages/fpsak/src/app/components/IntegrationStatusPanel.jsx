import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst, Undertittel, Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Image from 'sharedComponents/Image';
import { dateFormat, timeFormat } from 'utils/dateUtils';

import chevronUp from 'images/pil_opp.svg';
import chevronDown from 'images/pil_ned.svg';
import infoImageUrl from 'images/behandle.svg';

import styles from './integrationStatusPanel.less';

const formatErrorMsgHeader = (systemNavn, nedeFremTilTidspunkt) => (nedeFremTilTidspunkt
  ? (
    <FormattedMessage
      id="IntegrationStatusPanel.DowntimeUntil"
      values={{ system: systemNavn, datetime: `${dateFormat(nedeFremTilTidspunkt)} ${timeFormat(nedeFremTilTidspunkt)}` }}
    />
  )
  : <FormattedMessage id="IntegrationStatusPanel.Downtime" values={{ system: systemNavn }} />);

/**
 * IntegrationStatusPanel
 *
 * Presentasjonskomponent. Panel som viser hvilke systemer/tjenester som har nedetid.
 */
class IntegrationStatusPanel extends Component {
  constructor() {
    super();

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
      <div className={styles.container} tabIndex="0" role="button" onKeyDown={this.togglePanelOnKeyDown}>
        <Image className={styles.cursor} src={toggleOpen ? chevronUp : chevronDown} onClick={this.togglePanelOnClick} />
        <Row className={styles.row} onClick={this.togglePanelOnClick}>
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
      </div>
    );
  }
}

IntegrationStatusPanel.propTypes = {
  integrationStatusList: PropTypes.arrayOf(PropTypes.shape({
    systemNavn: PropTypes.string,
    endepunkt: PropTypes.string,
    nedeFremTilTidspunkt: PropTypes.string,
    feilmelding: PropTypes.string,
    stackTrace: PropTypes.string,
  })).isRequired,
};

export default injectIntl(IntegrationStatusPanel);
