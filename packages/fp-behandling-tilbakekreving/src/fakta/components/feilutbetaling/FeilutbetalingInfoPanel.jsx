import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { FaktaEkspandertpanel } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';

import { getFeilutbetalingFakta } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from '../../../behandlingForm';
import styles from './feilutbetalingInfoPanel.less';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

const formName = 'FaktaFeilutbetalingForm';

export const FeilutbetalingInfoPanelImpl = ({
  toggleInfoPanelCallback,
  openInfoPanels,
  hasOpenAksjonspunkter,
  intl,
  feilutbetaling,
  årsak,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'FeilutbetalingInfoPanel.FaktaFeilutbetaling' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FEILUTBETALING)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.FEILUTBETALING}
  >
    <form onSubmit={formProps.handleSubmit}>
      <Row className={styles.smallMarginBottom}>
        <Column xs="12" md="6">
          <Row className={styles.smallMarginBottom}>
            <Column xs="12">
              <Element>
                <FormattedMessage id="FeilutbetalingInfoPanel.Feilutbetaling" />
              </Element>
            </Column>
          </Row>
          <Row>
            <Column xs="12" md="4">
              <Row>
                <Column xs="12">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.PeriodeMedFeilutbetaling" />
                  </Undertekst>
                </Column>
              </Row>
              <Row>
                <Column xs="12">
                  <Normaltekst className={styles.smallPaddingRight}>
                    {moment(feilutbetaling.totalPeriodeFom).format(DDMMYYYY_DATE_FORMAT)}
                    {' '}
  -
                    {moment(feilutbetaling.totalPeriodeTom).format(DDMMYYYY_DATE_FORMAT)}
                  </Normaltekst>
                </Column>
              </Row>
            </Column>
            <Column xs="12" md="4">
              <Row>
                <Column xs="12">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.FeilutbetaltBeløp" />
                  </Undertekst>
                </Column>
              </Row>
              <Row>
                <Column xs="12" className={styles.smallPaddingRight}>
                  <Normaltekst className={styles.redText}>
                    {feilutbetaling.aktuellFeilUtbetaltBeløp}
                  </Normaltekst>
                </Column>
              </Row>
            </Column>
            <Column xs="12" md="4">
              <Row>
                <Column xs="12">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.TidligereVarseltBeløp" />
                  </Undertekst>
                </Column>
              </Row>
              <Row>
                <Column xs="12">
                  <Normaltekst className={styles.smallPaddingRight}>
                    {feilutbetaling.tidligereVarseltBeløp}
                  </Normaltekst>
                </Column>
              </Row>
            </Column>
          </Row>
          <Row className={styles.smallMarginTop}>
            <Column xs="11">
              <FeilutbetalingPerioderTable perioder={feilutbetaling.perioder} årsak={årsak} />
            </Column>
          </Row>
        </Column>
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
              <Row>
                <Column xs="12">
                  <Undertekst className={styles.undertekstMarginBottom}>
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
              <Row className={styles.smallMarginTop}>
                <Column xs="12">
                  <Undertekst className={styles.undertekstMarginBottom}>
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
            <Column xs="12" md="6">
              <Row>
                <Column xs="12">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.DatoForRevurdering" />
                  </Undertekst>
                </Column>
              </Row>
              <Row>
                <Column xs="12">
                  <Normaltekst className={styles.smallPaddingRight}>
                    {moment(feilutbetaling.datoForRevurderingsvedtak).format(DDMMYYYY_DATE_FORMAT)}
                  </Normaltekst>
                </Column>
              </Row>
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
    </form>
  </FaktaEkspandertpanel>
);

FeilutbetalingInfoPanelImpl.defaultProps = {
  årsak: null,
};

FeilutbetalingInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  feilutbetaling: PropTypes.shape.isRequired,
  submitCallback: PropTypes.func.isRequired,
  årsak: PropTypes.string,
  ...formPropTypes,
};

const mapStateToProps = (state, initialProps) => ({
  feilutbetaling: getFeilutbetalingFakta(state).behandlingFakta[0],
  årsak: behandlingFormValueSelector(formName)(state, 'årsak'),
  onSubmit: values => initialProps.submitCallback(values),
});

const FeilutbetalingInfoPanel = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(FeilutbetalingInfoPanelImpl)));

export default FeilutbetalingInfoPanel;
