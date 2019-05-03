import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { clearFields, formPropTypes } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst, Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { behandlingspunktCodes, featureToggle } from '@fpsak-frontend/fp-felles';
import {
  getSimuleringResultat, getTilbakekrevingValg, getAksjonspunkter, getBehandlingVersjon, getBehandlingSprak,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
 getSelectedBehandlingId, getFeatureToggles, getSelectedSaksnummer, isForeldrepengerFagsak,
} from 'behandlingForstegangOgRevurdering/src/duck';
import { RadioOption, RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import {
  VerticalSpacer, AksjonspunktHelpText, ArrowBox, Image, FadingPanel,
} from '@fpsak-frontend/shared-components';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
  getLanguageCodeFromSprakkode,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import avregningCodes from '@fpsak-frontend/kodeverk/src/avregningCodes';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { Hovedknapp } from 'nav-frontend-knapper';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import { createSelector } from 'reselect';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';
import styles from './avregningPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const simuleringAksjonspunkter = [
  aksjonspunktCodes.VURDER_FEILUTBETALING,
  aksjonspunktCodes.VURDER_INNTREKK,
];
const formName = 'AvregnigForm';
const oppfyltTooltipContent = (
  <span className={styles.tooltipContent}>
    <FormattedMessage id="Avregning.måVurderes" />
    <br />
    <FormattedMessage id="Avregning.feilaktigeOpplysninger" />
    <br />
    <FormattedMessage id="Avregning.feilutbetaling" />
    <br />
    <FormattedMessage id="Avregning.arbeidsStatus" />
    <br />
  </span>
);
const tooltipContentReduksjon = (
  <span className={styles.tooltipContent}>
    <FormattedMessage id="Avregning.særligeGrunnerForklaring" />
    <br />
    <FormattedMessage id="Avregning.uaktsomhet" />
    <br />
    <FormattedMessage id="Avregning.feilen" />
    <br />
    <FormattedMessage id="Avregning.størrelsenAvBeløp" />
    <br />
    <FormattedMessage id="Avregning.tidspunktAvFeilutbetaling" />
  </span>
);

const createHelptextTooltip = isForeldrepenger => ({
    header: (
      <Normaltekst>
        <FormattedMessage id={isForeldrepenger ? 'Avregning.HjelpetekstForeldrepenger' : 'Avregning.HjelpetekstEngangsstonad'} />
      </Normaltekst>),
  });
const getApTekst = apCode => (apCode ? [<FormattedMessage id={`Avregning.AksjonspunktHelpText.${apCode}`} key="vurderFeilutbetaling" />] : []);
const findQuestionImage = isHovering => (isHovering ? questionHoverUrl : questionNormalUrl);
const tooltipContent = type => (type === avregningCodes.OPPFYLT ? oppfyltTooltipContent : tooltipContentReduksjon);

const radioGroupLabel = contentType => (
  <span>
    <FormattedMessage id={`Avregning.RadioGroup.${contentType}`} />
    <Image
      className={styles.helpTextImage}
      imageSrcFunction={findQuestionImage}
      altCode={`Avregning.RadioGroup.${contentType}`}
      tooltip={{ header: tooltipContent(contentType) }}
    />
  </span>
);
const getSimuleringResult = (simuleringResultat, feilutbetaling) => {
  if (!simuleringResultat) {
    return simuleringResultat;
  }
  return feilutbetaling === undefined || feilutbetaling ? simuleringResultat.simuleringResultat : simuleringResultat.simuleringResultatUtenInntrekk;
};

export class AvregningPanelImpl extends Component {
  constructor() {
    super();
    this.toggleDetails = this.toggleDetails.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.previewMessage = this.previewMessage.bind(this);
    this.textVarselBox = React.createRef();

    this.state = {
      showDetails: [],
      feilutbetaling: undefined,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { erTilbakekrevingVilkårOppfylt, apCodes } = props;
    if (state.feilutbetaling !== erTilbakekrevingVilkårOppfylt && apCodes[0] === aksjonspunktCodes.VURDER_INNTREKK) {
      return {
        ...state,
        feilutbetaling: erTilbakekrevingVilkårOppfylt,
      };
    }

    return null;
  }

  toggleDetails(id) {
    const { showDetails } = this.state;
    const tableIndex = showDetails.findIndex(table => table.id === id);
    let newShowDetailsArray = [];

    if (tableIndex !== -1) {
      const updatedTable = {
        id,
        show: !showDetails[tableIndex].show,
      };

      newShowDetailsArray = [
        ...showDetails.slice(0, tableIndex),
        updatedTable,
        ...showDetails.slice(tableIndex + 1, showDetails.length - 1),
      ];
    } else {
      newShowDetailsArray = showDetails.concat({
        id,
        show: true,
      });
    }
    this.setState({ showDetails: newShowDetailsArray });
  }

  resetFields() {
    const { behandlingFormPrefix, clearFields: clearFormFields } = this.props;
    const fields = ['videreBehandling', 'grunnerTilReduksjon'];
    clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...fields);
  }

  previewMessage(e, previewCallback) {
    const { varseltekst, saksnummer } = this.props;
    previewCallback('', dokumentMalType.TBKVAR, varseltekst || ' ', saksnummer);
    e.preventDefault();
  }

  render() {
    const { showDetails, feilutbetaling } = this.state;
    const {
      simuleringResultat,
      isApOpen,
      apCodes,
      readOnly,
      erTilbakekrevingVilkårOppfylt,
      grunnerTilReduksjon,
      videreBehandling,
      sprakkode,
      featureVarseltekst,
      previewCallback,
      isForeldrepenger,
      ...formProps
    } = this.props;
    const simuleringResultatOption = getSimuleringResult(simuleringResultat, feilutbetaling);
    const varselBoxHeight = this.textVarselBox.current ? this.textVarselBox.current.clientHeight : null;
    const inlineStyle = {
      radioOption: {
        height: (videreBehandling === avregningCodes.TILBAKEKR_INFOTRYGD && featureVarseltekst) ? varselBoxHeight + 45 : 'auto',
      },
    };

    return (
      <FadingPanel>
        <Undertittel>
          <FormattedMessage id="Avregning.Title" />
        </Undertittel>
        <VerticalSpacer twentyPx />
        { simuleringResultatOption
          && (
          <div>
            <Row>
              <Column xs="12">
                <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
                  { getApTekst(apCodes[0]) }
                </AksjonspunktHelpText>
                <VerticalSpacer twentyPx />
                <AvregningSummary
                  fom={simuleringResultatOption.periodeFom}
                  tom={simuleringResultatOption.periodeTom}
                  feilutbetaling={simuleringResultatOption.sumFeilutbetaling}
                  etterbetaling={simuleringResultatOption.sumEtterbetaling}
                  inntrekk={simuleringResultatOption.sumInntrekk}
                  ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
                />
                <AvregningTable
                  showDetails={showDetails}
                  toggleDetails={this.toggleDetails}
                  simuleringResultat={simuleringResultatOption}
                  ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
                />
                <VerticalSpacer twentyPx />
              </Column>
            </Row>
          </div>
          )
        }
        { !simuleringResultat && (
          <FormattedMessage id="Avregning.ingenData" />
        )
        }
        { apCodes[0]
        && (
          <div>
            <Row>
              <Column xs="12">
                <form onSubmit={formProps.handleSubmit}>
                  <Row>
                    <Column sm="6">
                      <TextAreaField
                        name="begrunnelse"
                        label={{ id: 'Avregning.vurdering' }}
                        validate={[required, minLength3, maxLength1500, hasValidText]}
                        maxLength={1500}
                        readOnly={readOnly}
                        id="avregningVurdering"
                      />
                    </Column>
                    { apCodes[0] === aksjonspunktCodes.VURDER_FEILUTBETALING
                    && (
                      <Column sm="6">
                        <Undertekst><FormattedMessage id="Avregning.videreBehandling" /></Undertekst>
                        <VerticalSpacer eightPx />
                        <RadioGroupField name="videreBehandling" validate={[required]} direction="vertical" readOnly={readOnly}>
                          <RadioOption
                            label={<FormattedMessage id="Avregning.gjennomfør" />}
                            value={avregningCodes.TILBAKEKR_INFOTRYGD}
                            style={inlineStyle.radioOption}
                          />
                          <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value={avregningCodes.TILBAKEKR_IGNORER} />
                        </RadioGroupField>
                        { videreBehandling === avregningCodes.TILBAKEKR_INFOTRYGD && featureVarseltekst
                        && (
                          <div
                            className={styles.varsel}
                            ref={this.textVarselBox}
                          >
                            <ArrowBox alignOffset={20}>
                              <Row>
                                <Column sm="10">
                                  <Normaltekst className={styles.bold}><FormattedMessage id="Avregning.varseltekst" /></Normaltekst>
                                </Column>
                                <Column sm="2">
                                  <Image
                                    tabIndex="0"
                                    imageSrcFunction={findQuestionImage}
                                    altCode="Avregning.HjelpetekstForeldrepenger"
                                    tooltip={createHelptextTooltip(isForeldrepenger)}
                                  />
                                </Column>
                              </Row>
                              <VerticalSpacer eightPx />
                              <TextAreaField
                                name="varseltekst"
                                label={{ id: 'Avregning.fritekst' }}
                                validate={[required, minLength3, maxLength1500, hasValidText]}
                                maxLength={1500}
                                readOnly={readOnly}
                                id="avregningFritekst"
                                badges={[{
                                  type: 'fokus',
                                  textId: getLanguageCodeFromSprakkode(sprakkode),
                                  title: 'Malform.Beskrivelse',
                                }]}
                              />
                              <VerticalSpacer fourPx />
                              <a
                                href=""
                                onClick={(e) => {
                                  this.previewMessage(e, previewCallback);
                                }}
                                className={styles.previewLink}
                              >
                                <FormattedMessage id="Messages.PreviewText" />
                              </a>
                            </ArrowBox>
                          </div>
                        )
                        }
                      </Column>
                    )
                    }
                    { apCodes[0] === aksjonspunktCodes.VURDER_INNTREKK
                    && (
                      <Column sm="6">
                        <RadioGroupField
                          label={radioGroupLabel(avregningCodes.OPPFYLT)}
                          name="erTilbakekrevingVilkårOppfylt"
                          onChange={this.resetFields}
                          readOnly={readOnly}
                        >
                          <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.ja" />} value />
                          <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.nei" />} value={false} />
                        </RadioGroupField>
                        { erTilbakekrevingVilkårOppfylt
                        && (
                          <div className={styles.marginBottom20}>
                            <ArrowBox alignOffset={20}>
                              <RadioGroupField
                                label={radioGroupLabel(avregningCodes.REDUKSJON)}
                                validate={[required]}
                                name="grunnerTilReduksjon"
                                onChange={this.resetFields}
                                readOnly={readOnly}
                              >
                                <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.ja" />} value />
                                <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.nei" />} value={false} />
                              </RadioGroupField>
                              { grunnerTilReduksjon
                              && (
                                <div className={styles.marginBottom20}>
                                  <ArrowBox alignOffset={20}>
                                    <RadioGroupField validate={[required]} name="videreBehandling" direction="vertical" readOnly={readOnly}>
                                      <RadioOption label={<FormattedMessage id="Avregning.gjennomfør" />} value={avregningCodes.TILBAKEKR_INFOTRYGD} />
                                      <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value={avregningCodes.TILBAKEKR_IGNORER} />
                                    </RadioGroupField>
                                  </ArrowBox>
                                </div>
                              )
                              }
                            </ArrowBox>
                          </div>
                        )
                        }
                        { erTilbakekrevingVilkårOppfylt !== undefined && !erTilbakekrevingVilkårOppfylt
                        && (
                          <div className={styles.marginBottom20}>
                            <ArrowBox alignOffset={98}>
                              <RadioGroupField validate={[required]} name="videreBehandling" direction="vertical" readOnly={readOnly}>
                                <RadioOption label={<FormattedMessage id="Avregning.gjennomfør" />} value={avregningCodes.TILBAKEKR_INFOTRYGD} />
                                <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value={avregningCodes.TILBAKEKR_IGNORER} />
                              </RadioGroupField>
                            </ArrowBox>
                          </div>
                        )
                        }
                      </Column>
                    )
                    }
                  </Row>
                  <Row>
                    <Column xs="6">
                      <Hovedknapp
                        mini
                        htmlType="button"
                        onClick={formProps.handleSubmit}
                        disabled={formProps.invalid || formProps.pristine || formProps.submitting}
                        readOnly={readOnly}
                        spinner={formProps.submitting}
                      >
                        <FormattedMessage id="SubmitButton.ConfirmInformation" />
                      </Hovedknapp>
                    </Column>
                  </Row>
                </form>
              </Column>
            </Row>
          </div>
        )
        }
      </FadingPanel>
    );
  }
}

AvregningPanelImpl.propTypes = {
  isApOpen: PropTypes.bool.isRequired,
  simuleringResultat: PropTypes.shape(),
  previewCallback: PropTypes.func.isRequired,
  ...formPropTypes,
};

AvregningPanelImpl.defaultProps = {
  simuleringResultat: null,
};

export const transformValues = (values, ap) => [{
  ...values,
  kode: ap,
  grunnerTilReduksjon: values.erTilbakekrevingVilkårOppfylt ? values.grunnerTilReduksjon : undefined,
  videreBehandling: values.erTilbakekrevingVilkårOppfylt && !values.grunnerTilReduksjon ? avregningCodes.TILBAKEKR_INNTREKK : values.videreBehandling,
}];

const buildInitialValues = createSelector(
  [getTilbakekrevingValg, getAksjonspunkter], (tilbakekrevingValg, aksjonspunkter) => {
    const aksjonspunkt = aksjonspunkter.find(ap => simuleringAksjonspunkter.includes(ap.definisjon.kode));
    if (!aksjonspunkt || !tilbakekrevingValg) {
      return undefined;
    }

    let values = {
      videreBehandling: tilbakekrevingValg.videreBehandling.kode,
      varseltekst: tilbakekrevingValg.varseltekst,
      begrunnelse: aksjonspunkt.begrunnelse,
    };

    if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.VURDER_INNTREKK) {
      values = {
        erTilbakekrevingVilkårOppfylt: tilbakekrevingValg.grunnerTilReduksjon !== null,
        grunnerTilReduksjon: tilbakekrevingValg.grunnerTilReduksjon,
        ...values,
      };
    }
    return values;
  },
);

const mapStateToProps = (state, initialProps) => ({
  simuleringResultat: getSimuleringResultat(state),
  initialValues: buildInitialValues(state),
  ...behandlingFormValueSelector(formName)(state, 'erTilbakekrevingVilkårOppfylt', 'grunnerTilReduksjon', 'videreBehandling', 'varseltekst'),
  sprakkode: getBehandlingSprak(state),
  behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
  featureVarseltekst: getFeatureToggles(state)[featureToggle.SIMULER_VARSELTEKST],
  saksnummer: getSelectedSaksnummer(state),
  isForeldrepenger: isForeldrepengerFagsak(state),
  onSubmit: values => initialProps.submitCallback(transformValues(values, initialProps.apCodes[0])),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const AvregningPanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(AvregningPanelImpl)));

AvregningPanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.AVREGNING || simuleringAksjonspunkter.some(ap => apCodes.includes(ap));

export default AvregningPanel;
