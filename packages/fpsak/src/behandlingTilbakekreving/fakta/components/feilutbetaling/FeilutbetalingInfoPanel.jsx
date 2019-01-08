import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { getFeilutbetalingFakta } from 'behandlingTilbakekreving/tilbakekrevingBehandlingSelectors';
import FaktaEkspandertpanel from 'behandlingFelles/fakta/components/FaktaEkspandertpanel';
import faktaPanelCodes from 'behandlingTilbakekreving/fakta/faktaPanelCodes';
import styles from './feilutbetalingInfoPanel.less';

export const FeilutbetalingInfoPanelImpl = ({
  toggleInfoPanelCallback,
  openInfoPanels,
  hasOpenAksjonspunkter,
  intl,
  feilutbetaling,
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'FeilutbetalingInfoPanel.FaktaFeilutbetaling' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FEILUTBETALING)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.FEILUTBETALING}
  >
    {
      feilutbetaling && (
        <>
          <Row className={styles.smallMarginBottom}>
            <Column xs="12" md="6">
              <Row className={styles.smallMarginBottom}>
                <Column xs="12">
                  <Element>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Revurdering" />
                  </Element>
                </Column>
              </Row>
              <Row>
                <Column xs="12" md="6">
                  <FormattedMessage id="FeilutbetalingInfoPanel.Årsaker" />
                </Column>
                <Column xs="12" md="6">
                  <FormattedMessage id="FeilutbetalingInfoPanel.DatoForRevurdering" />
                </Column>
              </Row>
            </Column>
            <Column xs="12" md="6">
              <Row className={styles.smallMarginBottom}>
                <Column xs="12">
                  <Element>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Feilutbetaling" />
                  </Element>
                </Column>
              </Row>
              <Row>
                <Column xs="12" md="6">
                  <FormattedMessage id="FeilutbetalingInfoPanel.PeriodeMedFeilutbetaling" />
                </Column>
                <Column xs="12" md="6">
                  <FormattedMessage id="FeilutbetalingInfoPanel.FeilutbetaltBeløp" />
                </Column>
              </Row>
            </Column>
          </Row>
          <Row className={styles.smallMarginBottom}>
            <Column xs="12" md="6">
              <Element>
                <FormattedMessage id="FeilutbetalingInfoPanel.TidligereVarsel" />
              </Element>
            </Column>
          </Row>
        </>
      )
    }
  </FaktaEkspandertpanel>
);

FeilutbetalingInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  feilutbetaling: PropTypes.shape.isRequired,
};

const mapStateToProps = state => ({
  feilutbetaling: getFeilutbetalingFakta(state),
});

const FeilutbetalingInfoPanel = connect(mapStateToProps)(injectIntl(FeilutbetalingInfoPanelImpl));

export default FeilutbetalingInfoPanel;
