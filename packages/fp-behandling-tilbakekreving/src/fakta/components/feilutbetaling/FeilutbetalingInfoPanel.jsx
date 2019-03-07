import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { TextAreaField } from '@fpsak-frontend/form';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getFeilutbetalingFakta, getFeilutbetalingAarsaker } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { behandlingForm } from 'behandlingTilbakekreving/src/behandlingForm';
import {
  DDMMYYYY_DATE_FORMAT,
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import styles from './feilutbetalingInfoPanel.less';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

const formName = 'FaktaFeilutbetalingForm';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const feilutbetalingAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_FAKTA_FOR_FEILUTBETALING,
];

export const FeilutbetalingInfoPanelImpl = ({
  toggleInfoPanelCallback,
  openInfoPanels,
  hasOpenAksjonspunkter,
  intl,
  feilutbetaling,
  årsak,
  årsaker,
  readOnly,
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
              <FeilutbetalingPerioderTable
                perioder={feilutbetaling.perioder}
                formName={formName}
                årsaker={årsaker}
                readOnly={readOnly || !hasOpenAksjonspunkter}
              />
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
      <VerticalSpacer twentyPx />
      <Row>
        <Column md="6">
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'FeilutbetalingInfoPanel.Begrunnelse' }}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly || !hasOpenAksjonspunkter}
            id="begrunnelse"
          />
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      <Row>
        <Column md="6">
          <Hovedknapp
            mini
            htmlType="button"
            onClick={formProps.handleSubmit}
            disabled={formProps.invalid || formProps.pristine || formProps.submitting}
            readOnly={readOnly || !hasOpenAksjonspunkter}
            spinner={formProps.submitting}
          >
            <FormattedMessage id="Uttak.Confirm" />
          </Hovedknapp>
        </Column>
      </Row>
    </form>
  </FaktaEkspandertpanel>
);

FeilutbetalingInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  feilutbetaling: PropTypes.shape.isRequired,
  submitCallback: PropTypes.func.isRequired,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

const buildInitalValues = perioder => ({
  perioder: perioder.map(p => ({
    fom: p.fom,
    tom: p.tom,
    årsak: p.feilutbetalingÅrsakDto.årsakKode,
    underÅrsak: p.feilutbetalingÅrsakDto.underÅrsaker[0].underÅrsakKode,
  })),
});

const transformValues = (values, aksjonspunkter, årsaker) => {
  const apCode = aksjonspunkter.find(ap => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);
  return [
    {
      kode: apCode.definisjon.kode,
      feilutbetalingFakta: values.perioder.map((periode) => {
        const feilutbetalingÅrsak = årsaker.find(el => el.årsakKode === periode.årsak);
        const feilutbetalingUnderÅrsak = feilutbetalingÅrsak.underÅrsaker.find(el => el.underÅrsakKode === periode.underÅrsak);
        return {
          fom: periode.fom,
          tom: periode.tom,
          årsak: {
            årsakKode: periode.årsak,
            årsak: feilutbetalingÅrsak.årsak,
            underÅrsaker: feilutbetalingUnderÅrsak ? [feilutbetalingUnderÅrsak] : [],
          },
        };
      }),
    }];
};
const mapStateToProps = (state, initialProps) => {
  const feilutbetaling = getFeilutbetalingFakta(state).behandlingFakta;
  const årsaker = getFeilutbetalingAarsaker(state);
  return {
    feilutbetaling,
    årsaker,
    initialValues: buildInitalValues(feilutbetaling.perioder),
    onSubmit: values => initialProps.submitCallback(transformValues(values, initialProps.aksjonspunkter, årsaker)),
  };
};

const feilutbetalingForm = injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(FeilutbetalingInfoPanelImpl));

const FeilutbetalingInfoPanel = withDefaultToggling(faktaPanelCodes.FEILUTBETALING, feilutbetalingAksjonspunkter)(feilutbetalingForm);

export default connect(mapStateToProps)(FeilutbetalingInfoPanel);
