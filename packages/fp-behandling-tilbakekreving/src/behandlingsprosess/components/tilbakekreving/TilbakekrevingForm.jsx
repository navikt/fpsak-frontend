import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { FormSection, clearFields, formPropTypes } from 'redux-form';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import {
  RadioOption, RadioGroupField, TextAreaField,
} from '@fpsak-frontend/form';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import {
  VerticalSpacer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import { getStatusPeriode } from '../felles/behandlingspunktTimelineSkjema/BpTimelineHelper';
import { behandlingForm, behandlingFormValueSelector } from '../../../behandlingForm';
import tilbakekrevingCodes from './tilbakekrevingCodes';
import Uaktsomhet from './Uaktsomhet';
import HandletUaktsomhetGrad from './HandletUaktsomhetGrad';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const readOnly = false;
const uaktsomhetCodes = [
  tilbakekrevingCodes.GROVUAKTSOMHET,
  tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER,
  tilbakekrevingCodes.FORSETT,
];
const PERIODE_RESULTAT_TYPE = 'PERIODE_RESULTAT_TYPE';
const innvilgetTekst = 'Innvilget';

export class TilbakekrevingFormImpl extends Component {
  constructor() {
    super();
    this.resetFields = this.resetFields.bind(this);
    this.resetAnnetTextField = this.resetAnnetTextField.bind(this);
  }

  resetFields() {
    const {
      behandlingFormPrefix, activityPanelName, clearFields: clearFormFields, oppfylt,
    } = this.props;
    const fields = [oppfylt];
    clearFormFields(`${behandlingFormPrefix}.${activityPanelName}`, false, false, ...fields);
  }

  resetAnnetTextField() {
    const {
      behandlingFormPrefix, activityPanelName, clearFields: clearFormFields, oppfylt, handletUaktsomhetGrad, annet,
    } = this.props;
    if (!annet) {
      const fields = [`${oppfylt}.${handletUaktsomhetGrad}.annetTekst`];
      clearFormFields(`${behandlingFormPrefix}.${activityPanelName}`, false, false, ...fields);
    }
  }

  render() {
    const {
      oppfylt,
      handletUaktsomhetGrad,
      grunnerTilReduksjon,
      cancelSelectedActivity,
      annet,
      ...formProps
    } = this.props;

    return (
      <>
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
          {oppfylt
            && (
            <Column md="6">
              <FormSection name={oppfylt}>
                {oppfylt !== tilbakekrevingCodes.GODTRO && (
                  <>
                    <Uaktsomhet
                      grunnerTilReduksjon={grunnerTilReduksjon}
                      readOnly={readOnly}
                      handletUaktsomhetGrad={handletUaktsomhetGrad}
                      resetFields={this.resetFields}
                    />
                    { uaktsomhetCodes.includes(handletUaktsomhetGrad)
                    && (
                      <FormSection name={handletUaktsomhetGrad} key={handletUaktsomhetGrad}>
                        <HandletUaktsomhetGrad
                          grunnerTilReduksjon={grunnerTilReduksjon}
                          readOnly={readOnly}
                          handletUaktsomhetGrad={handletUaktsomhetGrad}
                          annet={annet}
                          resetAnnetTextField={this.resetAnnetTextField}
                        />
                      </FormSection>
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
              </FormSection>
            </Column>
            )
          }
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
      </>
    );
  }
}

TilbakekrevingFormImpl.propTypes = {
  selectedItemData: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  updateActivity: PropTypes.func.isRequired,
  ...formPropTypes,
};

const transformValues = (selectedItemData, values) => {
  const { oppfylt, begrunnelse } = values;
  const { handletUaktsomhetGrad } = values[oppfylt];
  const resultatType = {
    kode: periodeResultatType.INNVILGET,
    navn: innvilgetTekst,
    kodeverk: PERIODE_RESULTAT_TYPE,
  };

  return {
    ...selectedItemData,
    begrunnelse,
    oppfylt,
    handletUaktsomhetGrad,
    className: getStatusPeriode(resultatType),
    periodeResultatType: resultatType,
    ...values[oppfylt][handletUaktsomhetGrad],
  };
};

const buildInitalValues = (selectedItemData) => {
  const { oppfylt, begrunnelse, handletUaktsomhetGrad } = selectedItemData;

  if (oppfylt) {
    return {
      oppfylt,
      begrunnelse,
      [oppfylt]: {
        handletUaktsomhetGrad,
        [handletUaktsomhetGrad]: { ...selectedItemData },
      },
    };
  }

  return null;
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const mapStateToProps = (state, initialProps) => {
  const oppfylt = behandlingFormValueSelector(initialProps.activityPanelName)(state, 'oppfylt');
  const handletUaktsomhetGrad = behandlingFormValueSelector(initialProps.activityPanelName)(state, `${oppfylt}.handletUaktsomhetGrad`);
  return {
    oppfylt,
    handletUaktsomhetGrad,
    grunnerTilReduksjon: behandlingFormValueSelector(initialProps.activityPanelName)(state, `${oppfylt}.${handletUaktsomhetGrad}.grunnerTilReduksjon`),
    annet: behandlingFormValueSelector(initialProps.activityPanelName)(state, `${oppfylt}.${handletUaktsomhetGrad}.annet`),
    initialValues: buildInitalValues(initialProps.selectedItemData),
    onSubmit: values => initialProps.updateActivity(transformValues(initialProps.selectedItemData, values)),
  };
};

const TilbakekrevingForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: 'tilbakekrevingsresultatActivity',
  enableReinitialize: true,
})(TilbakekrevingFormImpl)));

export default TilbakekrevingForm;
