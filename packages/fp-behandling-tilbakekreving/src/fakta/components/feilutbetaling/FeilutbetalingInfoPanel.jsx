import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import { TextAreaField } from '@fpsak-frontend/form';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import {
 DDMMYYYY_DATE_FORMAT, minLength, maxLength, hasValidText, required,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import {
  getFeilutbetalingFakta,
  getFeilutbetalingAarsaker,
  getBehandlingVersjon,
} from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId } from 'behandlingTilbakekreving/src/duckTilbake';
import { behandlingForm, getBehandlingFormPrefix } from 'behandlingTilbakekreving/src/behandlingForm';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

import styles from './feilutbetalingInfoPanel.less';

const formName = 'FaktaFeilutbetalingForm';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const feilutbetalingAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_FAKTA_FOR_FEILUTBETALING,
];

export class FeilutbetalingInfoPanelImpl extends Component {
  constructor() {
    super();
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields(elementId, årsak) {
    const {
      behandlingFormPrefix, clearFields: clearFormFields,
    } = this.props;
    const fields = [`perioder.${elementId}.${årsak}`];
    clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...fields);
  }

  render() {
    const {
      toggleInfoPanelCallback,
      openInfoPanels,
      hasOpenAksjonspunkter,
      intl,
      feilutbetaling,
      årsaker,
      readOnly,
      ...formProps
    } = this.props;

    return (
      <FaktaEkspandertpanel
        title={intl.formatMessage({ id: 'FeilutbetalingInfoPanel.FaktaFeilutbetaling' })}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FEILUTBETALING)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.FEILUTBETALING}
        readOnly={readOnly}
      >
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
          {[<FormattedMessage key="1" id="FeilutbetalingInfoPanel.Aksjonspunkt" />]}
        </AksjonspunktHelpText>
        <VerticalSpacer sixteenPx />
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
                        {moment(feilutbetaling.totalPeriodeFom)
                          .format(DDMMYYYY_DATE_FORMAT)}
                        {' - '}
                        {moment(feilutbetaling.totalPeriodeTom)
                          .format(DDMMYYYY_DATE_FORMAT)}
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
                    readOnly={readOnly}
                    resetFields={this.resetFields}
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
                        {moment(feilutbetaling.datoForRevurderingsvedtak)
                          .format(DDMMYYYY_DATE_FORMAT)}
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
                readOnly={readOnly}
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
                disabled={formProps.pristine || formProps.submitting}
                readOnly={readOnly}
                spinner={formProps.submitting}
              >
                <FormattedMessage id="Uttak.Confirm" />
              </Hovedknapp>
            </Column>
          </Row>
        </form>
      </FaktaEkspandertpanel>
    );
  }
}

FeilutbetalingInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  feilutbetaling: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

const buildInitalValues = (perioder, aksjonspunkter) => {
  const apCode = aksjonspunkter.find(ap => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);
  return {
    begrunnelse: apCode ? apCode.begrunnelse : null,
    perioder: perioder.sort((a, b) => moment(a.fom) - moment(b.fom))
      .map((p) => {
        const {
          fom, tom, feilutbetalingÅrsakDto: { årsakKode }, feilutbetalingÅrsakDto: { underÅrsaker },
        } = p;
        return {
          fom,
          tom,
          årsak: årsakKode,
          [årsakKode]: {
            underÅrsak: underÅrsaker[0] ? underÅrsaker[0].underÅrsakKode : null,
          },
        };
      }),
  };
};

const transformValues = (values, aksjonspunkter, årsaker, initialPerioder) => {
  const apCode = aksjonspunkter.find(ap => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);
  const checkUnderÅrsak = underÅrsaker => (underÅrsaker[0] ? underÅrsaker[0].underÅrsakKode : null);
  const checkPeriodeUnderÅrsak = periode => (periode[periode.årsak] ? periode[periode.årsak].underÅrsak : null);
  const underÅrsakNotEqual = (periode, underÅrsaker) => checkPeriodeUnderÅrsak(periode) !== checkUnderÅrsak(underÅrsaker);
  const hendelseEndringer = values.perioder.some((periode, index) => periode.årsak !== initialPerioder[index].feilutbetalingÅrsakDto.årsakKode
    || underÅrsakNotEqual(periode, initialPerioder[index].feilutbetalingÅrsakDto.underÅrsaker));
  return [
    {
      kode: apCode.definisjon.kode,
      begrunnelse: values.begrunnelse,
      feilutbetalingFakta: hendelseEndringer ? values.perioder.map((periode) => {
        const feilutbetalingÅrsak = årsaker.find(el => el.årsakKode === periode.årsak);
        const findUnderÅrsakObjekt = underÅrsak => feilutbetalingÅrsak.underÅrsaker.find(el => el.underÅrsakKode === underÅrsak);
        const feilutbetalingUnderÅrsak = periode[periode.årsak] ? findUnderÅrsakObjekt(periode[periode.årsak].underÅrsak) : false;

        return {
          fom: periode.fom,
          tom: periode.tom,
          årsak: {
            årsakKode: periode.årsak,
            årsak: feilutbetalingÅrsak.årsak,
            kodeverk: feilutbetalingÅrsak.kodeverk,
            underÅrsaker: feilutbetalingUnderÅrsak ? [feilutbetalingUnderÅrsak] : [],
          },
        };
      }) : [],
    }];
};
const mapStateToProps = (state, initialProps) => {
  const feilutbetaling = getFeilutbetalingFakta(state).behandlingFakta;
  const årsaker = getFeilutbetalingAarsaker(state);
  return {
    feilutbetaling,
    årsaker,
    initialValues: buildInitalValues(feilutbetaling.perioder, initialProps.aksjonspunkter),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    onSubmit: values => initialProps.submitCallback(transformValues(values, initialProps.aksjonspunkter, årsaker, feilutbetaling.perioder)),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const feilutbetalingForm = injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(FeilutbetalingInfoPanelImpl));

const FeilutbetalingInfoPanel = withDefaultToggling(faktaPanelCodes.FEILUTBETALING, feilutbetalingAksjonspunkter)(feilutbetalingForm);

export default connect(mapStateToProps, mapDispatchToProps)(FeilutbetalingInfoPanel);
