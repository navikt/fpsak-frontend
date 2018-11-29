import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { clearFields, formPropTypes } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { RadioOption, RadioGroupField, TextAreaField } from 'form/Fields';
import FadingPanel from 'sharedComponents/FadingPanel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import ArrowBox from 'sharedComponents/ArrowBox';
import Image from 'sharedComponents/Image';
import { getSimuleringResultat } from 'behandling/behandlingSelectors';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from 'utils/validation/validators';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import avregningCodes from 'kodeverk/avregningCodes';
import { Hovedknapp } from 'nav-frontend-knapper';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';
import styles from './avregningPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const aksjonspunkter = [
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

export class AvregningPanelImpl extends Component {
  constructor() {
    super();
    this.toggleDetails = this.toggleDetails.bind(this);
    this.resetFields = this.resetFields.bind(this);

    this.state = {
      showDetails: [],
    };
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

  render() {
    const { showDetails } = this.state;
    const {
      simuleringResultat,
      isApOpen,
      apCodes,
      readOnly,
      erTilbakekrevingVilkårOppfylt,
      grunnerTilReduksjon,
      ...formProps
    } = this.props;
    return (
      <FadingPanel>
        <Undertittel>
          <FormattedMessage id="Avregning.Title" />
        </Undertittel>
        <VerticalSpacer twentyPx />
        { simuleringResultat
          && (
          <div>
            <Row>
              <Column xs="12">
                <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
                  { getApTekst(apCodes[0]) }
                </AksjonspunktHelpText>
                <VerticalSpacer twentyPx />
                <AvregningSummary
                  fom={simuleringResultat.periodeFom}
                  tom={simuleringResultat.periodeTom}
                  feilutbetaling={simuleringResultat.sumFeilutbetaling}
                  etterbetaling={simuleringResultat.sumEtterbetaling}
                  inntrekk={simuleringResultat.sumInntrekk}
                />
                <AvregningTable
                  showDetails={showDetails}
                  toggleDetails={this.toggleDetails}
                  simuleringResultat={simuleringResultat}
                />
                <VerticalSpacer twentyPx />
              </Column>
            </Row>
            { apCodes[0]
            && (
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
                            <RadioOption label={<FormattedMessage id="Avregning.gjennomfør" />} value={avregningCodes.TILBAKEKR_INFOTRYGD} />
                            <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value={avregningCodes.TILBAKEKR_IGNORER} />
                          </RadioGroupField>
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
                              <ArrowBox alignOffset={12}>
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
                                    <ArrowBox alignOffset={12}>
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
                              <ArrowBox alignOffset={90}>
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
                          disabled={formProps.invalid}
                          readOnly={readOnly}
                        >
                          <FormattedMessage id="SubmitButton.ConfirmInformation" />
                        </Hovedknapp>
                      </Column>
                    </Row>
                  </form>
                </Column>
              </Row>
            )
            }
          </div>
          )
        }
        { !simuleringResultat && (
          <FormattedMessage id="Avregning.ingenData" />
        )
        }
      </FadingPanel>
    );
  }
}

AvregningPanelImpl.propTypes = {
  isApOpen: PropTypes.bool.isRequired,
  simuleringResultat: PropTypes.shape(),
  ...formPropTypes,
};

AvregningPanelImpl.defaultProps = {
  simuleringResultat: null,
};

const transformValues = (values, ap) => [{
  kode: ap,
  ...values,
}];

const mapStateToProps = (state, initialProps) => ({
  simuleringResultat: getSimuleringResultat(state),
  erTilbakekrevingVilkårOppfylt: behandlingFormValueSelector(formName)(state, 'erTilbakekrevingVilkårOppfylt'),
  grunnerTilReduksjon: behandlingFormValueSelector(formName)(state, 'grunnerTilReduksjon'),
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

AvregningPanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.AVREGNING || aksjonspunkter.some(ap => apCodes.includes(ap));

export default AvregningPanel;
