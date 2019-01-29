import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { reset as resetReduxForm, formPropTypes } from 'redux-form';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingTilbakekreving/behandlingForm';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import {
  RadioOption, RadioGroupField, TextAreaField, CheckboxField, SelectField,
} from '@fpsak-frontend/form';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import {
  VerticalSpacer, ArrowBox, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import tilbakekrevingCodes from './tilbakekrevingCodes';
import TilbakekrevingPeriodSummary from './TilbakekrevingPeriodSummary';
import styles from './tilbakekrevingTimeLineForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const readOnly = false;
const andeler = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];


export class TilbakekrevingTimeLineFormImpl extends Component {
  constructor() {
    super();
    this.resetFields = this.resetFields.bind(this);

    this.state = {
      fieldPrefix: undefined,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { oppfylt } = props;
    if (state.fieldPrefix !== oppfylt) {
      return {
        ...state,
        fieldPrefix: oppfylt,
      };
    }

    return null;
  }

  resetFields() {
    const {
      behandlingFormPrefix, activityPanelName, resetReduxForm: resetForm,
    } = this.props;
    resetForm(`${behandlingFormPrefix}.${activityPanelName}`);
  }

  render() {
    const {
      oppfylt,
      selectedItemData,
      handletUaktsomhetGrad,
      grunnerTilReduksjon,
      cancelSelectedActivity,
      ...formProps
    } = this.props;
    const { fieldPrefix } = this.state;

    return (
      <form onSubmit={formProps.handleSubmit}>
        <Row>
          <Column md="6">
            <TilbakekrevingPeriodSummary
              feilutbetaling={selectedItemData.feilutbetaling}
              fom={selectedItemData.fom}
              tom={selectedItemData.tom}
            />
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <Row>
          <Column md="6">
            <TextAreaField
              name="begrunnelse"
              label={{ id: 'Tilbakekreving.Vurdering' }}
              validate={[required, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
              id="tilbakekrevingVurdering"
            />
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <Row>
          <Column md="6">
            <Undertekst><FormattedMessage id="Tilbakekreving.RadioGroup.oppfylt" /></Undertekst>
            <VerticalSpacer eightPx />
            <RadioGroupField
              validate={[required]}
              name="oppfylt"
              direction="vertical"
              readOnly={readOnly}
              onChange={this.resetFields}
            >
              <RadioOption
                label={<FormattedMessage id="Tilbakekreving.RadioGroup.Forstått" />}
                value={tilbakekrevingCodes.FORSTÅTT}
              />
              <RadioOption
                label={<FormattedMessage id="Tilbakekreving.RadioGroup.FeilaktigeOpplysninger" />}
                value={tilbakekrevingCodes.FEILAKTIGEOPPLYSNINGER}
              />
              <RadioOption
                label={<FormattedMessage id="Tilbakekreving.RadioGroup.MangelfulleOpplysniner" />}
                value={tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER}
              />
              <RadioOption
                label={<FormattedMessage id="Tilbakekreving.RadioGroup.GodTro" />}
                value={tilbakekrevingCodes.GODTRO}
              />
            </RadioGroupField>
          </Column>
          <Column md="6">
            {oppfylt !== tilbakekrevingCodes.GODTRO && (
              <>
                <Undertekst><FormattedMessage id="Tilbakekreving.RadioGroup.HandletUaktsomhetGrad" /></Undertekst>
                <VerticalSpacer eightPx />
                <RadioGroupField
                  validate={[required]}
                  name={`${fieldPrefix}.handletUaktsomhetGrad`}
                  readOnly={readOnly}
                >
                  <RadioOption
                    label={<FormattedMessage id="Tilbakekreving.RadioGroup.Forsett" />}
                    value={tilbakekrevingCodes.FORSETT}
                  />
                  <RadioOption
                    label={<FormattedMessage id="Tilbakekreving.RadioGroup.GrovUaktsomhet" />}
                    value={tilbakekrevingCodes.GROVUAKTSOMHET}
                  />
                  <RadioOption
                    label={<FormattedMessage id="Tilbakekreving.RadioGroup.SimpelUaktsomhet" />}
                    value={tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER}
                  />
                </RadioGroupField>
                { handletUaktsomhetGrad === tilbakekrevingCodes.FORSETT
                && (
                  <div className={styles.marginBottom20}>
                    <ArrowBox alignOffset={12}>
                      <Normaltekst>
                        <FormattedMessage id="Tilbakekreving.RadioGroup.Andel" />
                      </Normaltekst>
                      <Normaltekst>100%</Normaltekst>
                      <Normaltekst>
                        <FormattedMessage id="Tilbakekreving.RadioGroup.Renter" />
                      </Normaltekst>
                    </ArrowBox>
                  </div>
                )
                }
                { handletUaktsomhetGrad === tilbakekrevingCodes.GROVUAKTSOMHET
                && (
                  <div className={styles.marginBottom20}>
                    <ArrowBox alignOffset={112}>
                      <Undertekst><FormattedMessage id="Tilbakekreving.RadioGroup.GrunnerTilReduksjon" /></Undertekst>
                      <VerticalSpacer eightPx />
                      <RadioGroupField
                        validate={[required]}
                        name={`${fieldPrefix}.grunnerTilReduksjon`}
                        readOnly={readOnly}
                      >
                        <RadioOption label={<FormattedMessage id="Tilbakekreving.Ja" />} value />
                        <RadioOption label={<FormattedMessage id="Tilbakekreving.Nei" />} value={false} />
                      </RadioGroupField>
                      {grunnerTilReduksjon && (
                        <div>
                          <Row>
                            <Column md="12">
                              <ArrowBox alignOffset={12}>
                                <CheckboxField
                                  name={`${fieldPrefix}.uaktsomhetRetterSeg`}
                                  label={<FormattedMessage id="Tilbakekreving.Checkbox.UaktsomhetRetterSeg" />}
                                />
                                <CheckboxField
                                  name={`${fieldPrefix}.feilTilskrivesTilNav`}
                                  label={<FormattedMessage id="Tilbakekreving.Checkbox.FeilTilskrivesTilNav" />}
                                />
                                <CheckboxField
                                  name={`${fieldPrefix}.feilutbetalingStørrelsen`}
                                  label={<FormattedMessage id="Tilbakekreving.Checkbox.FeilutbetalingStørrelsen" />}
                                />
                                <CheckboxField
                                  name={`${fieldPrefix}.tideSidenFeilutbetaling`}
                                  label={<FormattedMessage id="Tilbakekreving.Checkbox.TideSidenFeilutbetaling" />}
                                />
                                <CheckboxField
                                  name={`${fieldPrefix}.annet`}
                                  label={<FormattedMessage id="Tilbakekreving.Checkbox.Annet" />}
                                />
                              </ArrowBox>
                            </Column>
                          </Row>
                          <VerticalSpacer eightPx />
                          <Row>
                            <Column md="6">
                              <Undertekst><FormattedMessage id="Tilbakekreving.andelSomTilbakekreves" /></Undertekst>
                              <FlexRow>
                                <FlexColumn>
                                  <SelectField
                                    name={`${fieldPrefix}.andelSomTilbakekreves`}
                                    validate={[required]}
                                    selectValues={andeler.map(andel => <option key={andel} value={andel}>{andel}</option>)}
                                    bredde="m"
                                  />
                                </FlexColumn>
                                <FlexColumn className={styles.suffix}>%</FlexColumn>
                              </FlexRow>
                            </Column>
                            <Column md="6">
                              <Normaltekst>
                                <FormattedMessage id="Tilbakekreving.RenterTillegges" />
                              </Normaltekst>
                              <VerticalSpacer twentyPx />
                              <Normaltekst><FormattedMessage id="Tilbakekreving.Nei" /></Normaltekst>
                            </Column>
                          </Row>
                        </div>
                      )
                      }
                    </ArrowBox>
                  </div>
                )
                }
              </>
            )
            }
            {oppfylt === tilbakekrevingCodes.GODTRO && (
              <>
                <Undertekst><FormattedMessage id="Tilbakekreving.RadioGroup.BeløpetIBehold" /></Undertekst>
                <VerticalSpacer eightPx />
                <RadioGroupField
                  validate={[required]}
                  name="beløpetIBehold"
                  readOnly={readOnly}
                >
                  <RadioOption label={<FormattedMessage id="Tilbakekreving.Ja" />} value />
                  <RadioOption label={<FormattedMessage id="Tilbakekreving.Nei" />} value={false} />
                </RadioGroupField>
              </>
            )
            }
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <Hovedknapp
              mini
              htmlType="button"
              onClick={formProps.handleSubmit}
              disabled={formProps.pristine}
            >
              <FormattedMessage id="UttakActivity.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="button" onClick={cancelSelectedActivity}>
              <FormattedMessage id="UttakActivity.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </form>
    );
  }
}

TilbakekrevingTimeLineFormImpl.propTypes = {
  selectedItemData: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  updateActivity: PropTypes.func.isRequired,
  ...formPropTypes,
};

const transformValues = (selectedItemData, values) => {
  const { oppfylt, begrunnelse } = values;

  return {
    oppfylt,
    begrunnelse,
    ...selectedItemData,
    ...values[values.oppfylt],
  };
};

const buildInitalValues = (selectedItemData) => {
  const { oppfylt, begrunnelse } = selectedItemData;

  if (oppfylt) {
    return {
      oppfylt,
      begrunnelse,
      [oppfylt]: { ...selectedItemData },
    };
  }

  return { oppfylt };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    resetReduxForm,
  }, dispatch),
});

const mapStateToProps = (state, initialProps) => {
  const oppfylt = behandlingFormValueSelector(initialProps.activityPanelName)(state, 'oppfylt');
  return {
    oppfylt,
    handletUaktsomhetGrad: behandlingFormValueSelector(initialProps.activityPanelName)(state, `${oppfylt}.handletUaktsomhetGrad`),
    grunnerTilReduksjon: behandlingFormValueSelector(initialProps.activityPanelName)(state, `${oppfylt}.grunnerTilReduksjon`),
    initialValues: buildInitalValues(initialProps.selectedItemData),
    onSubmit: values => initialProps.updateActivity(transformValues(initialProps.selectedItemData, values)),
  };
};

const TilbakekrevingTimeLineForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: 'tilbakekrevingsresultatActivity',
  enableReinitialize: true,
})(TilbakekrevingTimeLineFormImpl)));

export default TilbakekrevingTimeLineForm;
