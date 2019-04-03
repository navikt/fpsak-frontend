import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSection, clearFields, formPropTypes } from 'redux-form';
import { Undertekst, Element } from 'nav-frontend-typografi';
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
import TilbakekrevingAktivitetTabell from './TilbakekrevingAktivitetTabell';
import BelopetMottattIGodTroFormPanel from './BelopetMottattIGodTroFormPanel';
import UaktsomhetFormPanel from './UaktsomhetFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const PERIODE_RESULTAT_TYPE = 'PERIODE_RESULTAT_TYPE';
const innvilgetTekst = 'Innvilget';

export class TilbakekrevingFormImpl extends Component {
  static propTypes = {
    selectedItemData: PropTypes.shape({}).isRequired,
    behandlingFormPrefix: PropTypes.string.isRequired,
    cancelSelectedActivity: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    erBelopetIBehold: PropTypes.bool,
    formName: PropTypes.string.isRequired,
    activityPanelName: PropTypes.string.isRequired,
    aktiviteter: PropTypes.arrayOf(PropTypes.shape()),
    updateActivity: PropTypes.func.isRequired,
    andelSomSkalTilbakekreves: PropTypes.number.isRequired,
    ...formPropTypes,
  };

  static defaultProps = {
    erBelopetIBehold: undefined,
  }

  resetFields = () => {
    const {
      behandlingFormPrefix, activityPanelName, clearFields: clearFormFields, oppfylt,
    } = this.props;
    const fields = [oppfylt];
    clearFormFields(`${behandlingFormPrefix}.${activityPanelName}`, false, false, ...fields);
  }

  resetAnnetTextField = () => {
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
      selectedItemData,
      readOnly,
      erBelopetIBehold,
      annet,
      andelSomSkalTilbakekreves,
      ...formProps
    } = this.props;
    return (
      <>
        <VerticalSpacer twentyPx />
        <TilbakekrevingAktivitetTabell ytelser={selectedItemData.ytelser} />
        <VerticalSpacer twentyPx />
        <Row>
          <Column md="6">
            <Row>
              <Column md="10">
                <Element>
                  <FormattedMessage id="TilbakekrevingForm.VilkarForTilbakekreving" />
                </Element>
                <VerticalSpacer eightPx />
                <TextAreaField
                  name="begrunnelse"
                  label={{ id: 'Tilbakekreving.Vurdering' }}
                  validate={[required, minLength3, maxLength1500, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                  id="tilbakekrevingVurdering"
                />
                <VerticalSpacer twentyPx />
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
            </Row>
          </Column>
          <Column md="6">
            <Row>
              <Column md="10">
                {oppfylt && (
                  <FormSection name={oppfylt}>
                    {oppfylt === tilbakekrevingCodes.GODTRO && (
                      <BelopetMottattIGodTroFormPanel readOnly={readOnly} erBelopetIBehold={erBelopetIBehold} />
                    )}
                    {oppfylt !== tilbakekrevingCodes.GODTRO && (
                      <UaktsomhetFormPanel
                        grunnerTilReduksjon={grunnerTilReduksjon}
                        readOnly={readOnly}
                        handletUaktsomhetGrad={handletUaktsomhetGrad}
                        resetFields={this.resetFields}
                        resetAnnetTextField={this.resetAnnetTextField}
                        annet={annet}
                        andelSomSkalTilbakekreves={andelSomSkalTilbakekreves}
                      />
                    )}
                  </FormSection>
                )}
              </Column>
            </Row>
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
      </>
    );
  }
}

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
    periodValues: { ...values[oppfylt][handletUaktsomhetGrad] },
  };
};

const buildInitalValues = (selectedItemData) => {
  const {
    oppfylt, begrunnelse, handletUaktsomhetGrad, periodValues,
  } = selectedItemData;

  if (oppfylt) {
    return {
      oppfylt,
      begrunnelse,
      [oppfylt]: {
        handletUaktsomhetGrad,
        [handletUaktsomhetGrad]: { ...periodValues },
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

const mapStateToProps = (state, ownProps) => {
  const oppfylt = behandlingFormValueSelector(ownProps.activityPanelName)(state, 'oppfylt');
  const handletUaktsomhetGrad = behandlingFormValueSelector(ownProps.activityPanelName)(state, `${oppfylt}.handletUaktsomhetGrad`);
  return {
    oppfylt,
    handletUaktsomhetGrad,
    andelSomSkalTilbakekreves: 75,
    grunnerTilReduksjon: behandlingFormValueSelector(ownProps.activityPanelName)(state, `${oppfylt}.${handletUaktsomhetGrad}.grunnerTilReduksjon`),
    annet: behandlingFormValueSelector(ownProps.activityPanelName)(state, `${oppfylt}.${handletUaktsomhetGrad}.annet`),
    erBelopetIBehold: behandlingFormValueSelector(ownProps.activityPanelName)(state, `${oppfylt}.erBelopetIBehold`),
    initialValues: buildInitalValues(ownProps.selectedItemData),
    onSubmit: values => ownProps.updateActivity(transformValues(ownProps.selectedItemData, values)),
  };
};

const TilbakekrevingForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: 'tilbakekrevingsresultatActivity',
})(TilbakekrevingFormImpl)));

export default TilbakekrevingForm;
