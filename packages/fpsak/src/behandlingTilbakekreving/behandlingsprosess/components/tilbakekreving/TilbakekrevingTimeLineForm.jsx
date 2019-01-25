import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
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
const handleSubmit = () => null;
const andeler = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

export const TilbakekrevingTimeLineFormImpl = ({
  oppfylt,
  selectedItemData,
  handletUaktsomhetGrad,
  grunnerTilReduksjon,
  cancelSelectedActivity,
  updateActivity,
  ...formProps
}) => (
  <>
    <form onSubmit={handleSubmit}>
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
                name="handletUaktsomhetGrad"
                readOnly={readOnly}
              >
                <RadioOption label={<FormattedMessage id="Tilbakekreving.RadioGroup.Forsett" />} value={tilbakekrevingCodes.FORSETT} />
                <RadioOption label={<FormattedMessage id="Tilbakekreving.RadioGroup.GrovUaktsomhet" />} value={tilbakekrevingCodes.GROVUAKTSOMHET} />
                <RadioOption label={<FormattedMessage id="Tilbakekreving.RadioGroup.SimpelUaktsomhet" />} value={tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER} />
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
                      name="grunnerTilReduksjon"
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
                                name="uaktsomhetRetterSeg"
                                label={<FormattedMessage id="Tilbakekreving.Checkbox.UaktsomhetRetterSeg" />}
                              />
                              <CheckboxField
                                name="feilTilskrivesTilNav"
                                label={<FormattedMessage id="Tilbakekreving.Checkbox.FeilTilskrivesTilNav" />}
                              />
                              <CheckboxField
                                name="feilutbetalingStørrelsen"
                                label={<FormattedMessage id="Tilbakekreving.Checkbox.FeilutbetalingStørrelsen" />}
                              />
                              <CheckboxField
                                name="tideSidenFeilutbetaling"
                                label={<FormattedMessage id="Tilbakekreving.Checkbox.TideSidenFeilutbetaling" />}
                              />
                              <CheckboxField
                                name="annet"
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
                                  name="andelSomTilbakekreves"
                                  validate={[required]}
                                  selectValues={andeler.map(andel => <option key={andel} value={andel}>{andel}</option>)}
                                  bredde="md"
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
  </>
);

TilbakekrevingTimeLineFormImpl.propTypes = {
  selectedItemData: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  updateActivity: PropTypes.func.isRequired,
};

const transformValues = (selectedItemData, values) => ({ ...selectedItemData, ...values });

const mapStateToProps = (state, initialProps) => ({
  oppfylt: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'oppfylt'),
  handletUaktsomhetGrad: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'handletUaktsomhetGrad'),
  grunnerTilReduksjon: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'grunnerTilReduksjon'),
  onSubmit: values => initialProps.updateActivity(transformValues(initialProps.selectedItemData, values)),
});

const TilbakekrevingTimeLineForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: 'tilbakekrevingsresultatActivity',
  enableReinitialize: true,
})(TilbakekrevingTimeLineFormImpl)));

export default TilbakekrevingTimeLineForm;
