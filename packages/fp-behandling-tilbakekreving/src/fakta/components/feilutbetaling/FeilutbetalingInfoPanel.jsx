import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';

import { formatCurrencyNoKr, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { FaktaEkspandertpanel } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import { getFeilutbetalingFakta } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';

import styles from './feilutbetalingInfoPanel.less';

const perioderDatoer = periode => `${moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}`;
const perioderBeloper = periode => formatCurrencyNoKr(periode.belop);
const getPerioder = (perioder, children) => perioder.map(periode => (
  <Row>
    <Column xs="12">
      <Normaltekst className={styles.smallPaddingRight}>
        {children(periode)}
      </Normaltekst>
    </Column>
  </Row>
));

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
            <Row className={styles.undertekstMarginBottom}>
              <Column xs="12">
                <Undertekst>
                  <FormattedMessage id="FeilutbetalingInfoPanel.Årsaker" />
                </Undertekst>
              </Column>
            </Row>
            <Row>
              <Column xs="12">
                <Normaltekst className={styles.smallPaddingRight}>
                  {feilutbetaling.årsakRevurdering}
                </Normaltekst>
              </Column>
            </Row>
          </Column>
          <Column xs="12" md="6">
            <Row className={styles.undertekstMarginBottom}>
              <Column xs="12">
                <Undertekst>
                  <FormattedMessage id="FeilutbetalingInfoPanel.DatoForRevurdering" />
                </Undertekst>
              </Column>
            </Row>
            <Row className={styles.undertekstMarginBottom}>
              <Column xs="12">
                <Undertekst>
                  <FormattedMessage id="FeilutbetalingInfoPanel.Resultat" />
                </Undertekst>
              </Column>
            </Row>
            <Row>
              <Column xs="12">
                <Normaltekst className={styles.smallPaddingRight}>
                  {feilutbetaling.resultatFeilutbetaling}
                </Normaltekst>
              </Column>
            </Row>
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
            <Row className={styles.undertekstMarginBottom}>
              <Column xs="12">
                <Undertekst>
                  <FormattedMessage id="FeilutbetalingInfoPanel.PeriodeMedFeilutbetaling" />
                </Undertekst>
              </Column>
            </Row>
            {getPerioder(feilutbetaling.perioder, perioderDatoer)}
          </Column>
          <Column xs="12" md="6">
            <Row className={styles.undertekstMarginBottom}>
              <Column xs="12">
                <Undertekst>
                  <FormattedMessage id="FeilutbetalingInfoPanel.FeilutbetaltBeløp" />
                </Undertekst>
              </Column>
            </Row>
            {getPerioder(feilutbetaling.perioder, perioderBeloper)}
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
  feilutbetaling: getFeilutbetalingFakta(state).behandlingFakta[0],
});

const FeilutbetalingInfoPanel = connect(mapStateToProps)(injectIntl(FeilutbetalingInfoPanelImpl));

export default FeilutbetalingInfoPanel;
