import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import { TextAreaField } from '@fpsak-frontend/form';
import {
  faktaPanelCodes, getBehandlingFormPrefix, FaktaGruppe, FaktaEkspandertpanel, withDefaultToggling, injectKodeverk,
} from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  DDMMYYYY_DATE_FORMAT, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';

import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getFagsakYtelseType, getSelectedBehandlingId, getAlleTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import { behandlingFormTilbakekreving } from 'behandlingTilbakekreving/src/behandlingFormTilbakekreving';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';
import tilbakekrevingAksjonspunktCodes from '../../../kodeverk/tilbakekrevingAksjonspunktCodes';

import styles from './feilutbetalingInfoPanel.less';

const formName = 'FaktaFeilutbetalingForm';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const feilutbetalingAksjonspunkter = [
  tilbakekrevingAksjonspunktCodes.AVKLAR_FAKTA_FOR_FEILUTBETALING,
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
      merknaderFraBeslutter,
      getKodeverknavn,
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
                      <Normaltekst className={styles.smallPaddingRight}>
                        {`${moment(feilutbetaling.totalPeriodeFom)
                          .format(DDMMYYYY_DATE_FORMAT)} - ${
                          moment(feilutbetaling.totalPeriodeTom)
                            .format(DDMMYYYY_DATE_FORMAT)}`}
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
                      <Normaltekst className={styles.smallPaddingRight}>
                        {feilutbetaling.tidligereVarseltBeløp}
                      </Normaltekst>
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="11">
                  <FaktaGruppe
                    aksjonspunktCode={tilbakekrevingAksjonspunktCodes.AVKLAR_FAKTA_FOR_FEILUTBETALING}
                    merknaderFraBeslutter={merknaderFraBeslutter}
                    withoutBorder
                  >
                    <FeilutbetalingPerioderTable
                      perioder={feilutbetaling.perioder}
                      formName={formName}
                      årsaker={årsaker}
                      readOnly={readOnly}
                      resetFields={this.resetFields}
                    />
                  </FaktaGruppe>
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
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Årsaker" />
                  </Undertekst>
                  { feilutbetaling.behandlingÅrsaker && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {feilutbetaling.behandlingÅrsaker.map((ba) => getKodeverknavn(ba.behandlingArsakType)).join(', ')}
                    </Normaltekst>
                  )}
                </Column>
                {feilutbetaling.datoForRevurderingsvedtak && (
                  <Column xs="6">
                    <Undertekst className={styles.undertekstMarginBottom}>
                      <FormattedMessage id="FeilutbetalingInfoPanel.DatoForRevurdering" />
                    </Undertekst>
                    <Normaltekst className={styles.smallPaddingRight}>
                      {moment(feilutbetaling.datoForRevurderingsvedtak)
                        .format(DDMMYYYY_DATE_FORMAT)}
                    </Normaltekst>
                  </Column>
                )}
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Resultat" />
                  </Undertekst>
                  {feilutbetaling.behandlingsresultat && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {getKodeverknavn(feilutbetaling.behandlingsresultat.type)}
                    </Normaltekst>
                  )}
                </Column>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Konsekvens" />
                  </Undertekst>
                  {feilutbetaling.behandlingsresultat && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {feilutbetaling.behandlingsresultat.konsekvenserForYtelsen.map((ba) => getKodeverknavn(ba)).join(', ')}
                    </Normaltekst>
                  )}
                </Column>
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Tilbakekrevingsvalg" />
                  </Undertekst>
                  {feilutbetaling.tilbakekrevingValg && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {getKodeverknavn(feilutbetaling.tilbakekrevingValg.videreBehandling)}
                    </Normaltekst>
                  )}
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
  intl: PropTypes.shape().isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  feilutbetaling: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  ...formPropTypes,
};

const buildInitialValues = createSelector([behandlingSelectors.getFeilutbetalingFakta, behandlingSelectors.getAksjonspunkter], (
  feilutbetalingFakta, aksjonspunkter,
) => {
  const { perioder } = feilutbetalingFakta.behandlingFakta;
  const apCode = aksjonspunkter.find((ap) => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);
  return {
    begrunnelse: apCode ? apCode.begrunnelse : null,
    perioder: perioder.sort((a, b) => moment(a.fom) - moment(b.fom))
      .map((p) => {
        const {
          fom, tom, feilutbetalingÅrsakDto,
        } = p;

        const period = { fom, tom };

        if (!feilutbetalingÅrsakDto) {
          return period;
        }

        const {
          hendelseType,
          hendelseUndertype,
        } = feilutbetalingÅrsakDto;

        return {
          ...period,
          årsak: hendelseType.kode,
          [hendelseType.kode]: {
            underÅrsak: hendelseUndertype ? hendelseUndertype.kode : null,
          },
        };
      }),
  };
});

const getSortedFeilutbetalingArsaker = createSelector([behandlingSelectors.getFeilutbetalingAarsaker, getFagsakYtelseType], (
  feilutbetalingArsaker, fagsakYtelseType,
) => {
  const { hendelseTyper } = feilutbetalingArsaker.find((a) => a.ytelseType.kode === fagsakYtelseType.kode);
  return hendelseTyper.sort((ht1, ht2) => {
    const hendelseType1 = ht1.hendelseType.navn;
    const hendelseType2 = ht2.hendelseType.navn;
    const hendelseType1ErParagraf = hendelseType1.startsWith('§');
    const hendelseType2ErParagraf = hendelseType2.startsWith('§');
    const ht1v = hendelseType1ErParagraf ? hendelseType1.replace(/\D/g, '') : hendelseType1;
    const ht2v = hendelseType2ErParagraf ? hendelseType2.replace(/\D/g, '') : hendelseType2;
    return hendelseType1ErParagraf && hendelseType2ErParagraf ? ht1v - ht2v : ht1v.localeCompare(ht2v);
  });
});

const transformValues = (values, aksjonspunkter, årsaker) => {
  const apCode = aksjonspunkter.find((ap) => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);

  const feilutbetalingFakta = values.perioder.map((periode) => {
    const feilutbetalingÅrsak = årsaker.find((el) => el.hendelseType.kode === periode.årsak);
    const findUnderÅrsakObjekt = (underÅrsak) => feilutbetalingÅrsak.hendelseUndertyper.find((el) => el.kode === underÅrsak);
    const feilutbetalingUnderÅrsak = periode[periode.årsak] ? findUnderÅrsakObjekt(periode[periode.årsak].underÅrsak) : false;

    return {
      fom: periode.fom,
      tom: periode.tom,
      årsak: {
        hendelseType: feilutbetalingÅrsak.hendelseType,
        hendelseUndertype: feilutbetalingUnderÅrsak,
      },
    };
  });

  return [{
    kode: apCode.definisjon.kode,
    begrunnelse: values.begrunnelse,
    feilutbetalingFakta,
  }];
};
const mapStateToPropsFactory = (initialState, ownProps) => {
  const feilutbetaling = behandlingSelectors.getFeilutbetalingFakta(initialState).behandlingFakta;
  const årsaker = getSortedFeilutbetalingArsaker(initialState);
  const submitCallback = (values) => ownProps.submitCallback(transformValues(values, ownProps.aksjonspunkter, årsaker));
  return (state) => ({
    feilutbetaling,
    årsaker,
    initialValues: buildInitialValues(state),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), behandlingSelectors.getBehandlingVersjon(state)),
    merknaderFraBeslutter: behandlingSelectors.getMerknaderFraBeslutter(tilbakekrevingAksjonspunktCodes.AVKLAR_FAKTA_FOR_FEILUTBETALING)(state),
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const feilutbetalingForm = injectIntl(behandlingFormTilbakekreving({
  form: formName,
})(FeilutbetalingInfoPanelImpl));

const FeilutbetalingInfoPanelMedKodeverk = injectKodeverk(getAlleTilbakekrevingKodeverk)(feilutbetalingForm);
const FeilutbetalingInfoPanel = withDefaultToggling(faktaPanelCodes.FEILUTBETALING, feilutbetalingAksjonspunkter)(FeilutbetalingInfoPanelMedKodeverk);

export default connect(mapStateToPropsFactory, mapDispatchToProps)(FeilutbetalingInfoPanel);
