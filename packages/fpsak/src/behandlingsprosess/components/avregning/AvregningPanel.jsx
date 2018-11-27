import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { clearFields, formPropTypes } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
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
import { Hovedknapp } from 'nav-frontend-knapper';
import questionNormalUrl from 'images/question_normal.svg';
import questionHoverUrl from 'images/question_hover.svg';
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

const getApTekst = apCode => [<FormattedMessage id={`Avregning.AksjonspunktHelpText.${apCode}`} key="vurderFeilutbetaling" />];
const findQuestionImage = isHovering => (isHovering ? questionHoverUrl : questionNormalUrl);
const tooltipContentOppfylt = (
  <div>
    <Element>
      <FormattedMessage id="Avregning.måVurderes" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.feilaktigeOpplysninger" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.feilutbetaling" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.arbeidsStatus" />
    </Element>
  </div>
);

const tooltipContentReduksjon = (
  <div>
    <Element>
      <FormattedMessage id="Avregning.måVurderes" />
    </Element>
    <Element className={styles.særligeGrunnerForklaring}>
      <FormattedMessage id="Avregning.særligeGrunnerForklaring" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.uaktsomhet" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.feilen" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.størrelsenAvBeløp" />
    </Element>
    <Element>
      <FormattedMessage id="Avregning.tidspunktAvFeilutbetaling" />
    </Element>
  </div>
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
      erOppfylt,
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
                        <RadioGroupField name="videreBehandling" validate={[required]} direction="vertical">
                          <RadioOption label={<FormattedMessage id="Avregning.gjennomfør" />} value="gjennomfør" />
                          <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value="avvent" />
                        </RadioGroupField>
                      </Column>
                      )
                    }
                    { apCodes[0] === aksjonspunktCodes.VURDER_INNTREKK
                    && (
                      <Column sm="6">
                        <Undertekst>
                          <FormattedMessage id="Avregning.erVilkåreneOppfylt" />
                          <Image
                            className={styles.helpTextImage}
                            imageSrcFunction={findQuestionImage}
                            altCode="Avregning.erVilkåreneOppfylt"
                            tooltip={{ header: tooltipContentOppfylt }}
                          />
                        </Undertekst>
                        <VerticalSpacer eightPx />
                        <RadioGroupField name="erOppfylt" onChange={this.resetFields}>
                          <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.ja" />} value />
                          <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.nei" />} value={false} />
                        </RadioGroupField>
                        { erOppfylt
                        && (
                          <div className={styles.marginBottom20}>
                            <ArrowBox alignOffset={12}>
                              <Undertekst>
                                <FormattedMessage id="Avregning.grunnerTilReduksjon" />
                                <Image
                                  className={styles.helpTextImage}
                                  imageSrcFunction={findQuestionImage}
                                  altCode="Avregning.grunnerTilReduksjon"
                                  tooltip={{ header: tooltipContentReduksjon }}
                                />
                              </Undertekst>
                              <VerticalSpacer eightPx />
                              <RadioGroupField validate={[required]} name="grunnerTilReduksjon" onChange={this.resetFields}>
                                <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.ja" />} value />
                                <RadioOption label={<FormattedMessage id="Avregning.formAlternativ.nei" />} value={false} />
                              </RadioGroupField>
                              { grunnerTilReduksjon
                              && (
                                <div className={styles.marginBottom20}>
                                  <ArrowBox alignOffset={12}>
                                    <RadioGroupField validate={[required]} name="videreBehandling" direction="vertical">
                                      <RadioOption label={<FormattedMessage id="Avregning.gjennomfør" />} value="gjennomfør" />
                                      <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value="avvent" />
                                    </RadioGroupField>
                                  </ArrowBox>
                                </div>
                              )
                              }
                            </ArrowBox>
                          </div>
                        )
                        }
                        { erOppfylt !== undefined && !erOppfylt
                        && (
                          <div className={styles.marginBottom20}>
                            <ArrowBox alignOffset={90}>
                              <RadioGroupField validate={[required]} name="videreBehandling" direction="vertical">
                                <RadioOption label={<FormattedMessage id="Avregning.gjennomfør" />} value="gjennomfør" />
                                <RadioOption label={<FormattedMessage id="Avregning.avvent" />} value="avvent" />
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
  erOppfylt: behandlingFormValueSelector(formName)(state, 'erOppfylt'),
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
