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
import { behandlingForm, behandlingFormValueSelector } from '../../../behandlingForm';
import vilkarResultat from '../../../kodeverk/vilkarResultat';
import tilbakekrevingKodeverkTyper from '../../../kodeverk/tilbakekrevingKodeverkTyper';
import { getTilbakekrevingKodeverk } from '../../../duckTilbake';
import TilbakekrevingAktivitetTabell from './TilbakekrevingAktivitetTabell';
import BelopetMottattIGodTroFormPanel from './BelopetMottattIGodTroFormPanel';
import UaktsomhetFormPanel from './UaktsomhetFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const TILBAKEKREVING_PERIODE_FORM_NAME = 'TilbakekrevingPeriodeForm';

export class TilbakekrevingPeriodeFormImpl extends Component {
  static propTypes = {
    selectedItemData: PropTypes.shape({}).isRequired,
    behandlingFormPrefix: PropTypes.string.isRequired,
    cancelSelectedActivity: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    erBelopetIBehold: PropTypes.bool,
    formName: PropTypes.string.isRequired,
    aktiviteter: PropTypes.arrayOf(PropTypes.shape()),
    updateActivity: PropTypes.func.isRequired,
    andelSomSkalTilbakekreves: PropTypes.number.isRequired,
    vilkarResultatTyper: PropTypes.arrayOf(PropTypes.shape()),
    aktsomhetTyper: PropTypes.arrayOf(PropTypes.shape()),
    sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
    ...formPropTypes,
  };

  static defaultProps = {
    erBelopetIBehold: undefined,
  }

  resetFields = () => {
    const {
      behandlingFormPrefix, clearFields: clearFormFields, oppfylt,
    } = this.props;
    const fields = [oppfylt];
    clearFormFields(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, false, false, ...fields);
  }

  resetAnnetTextField = () => {
    const {
      behandlingFormPrefix, clearFields: clearFormFields, oppfylt, handletUaktsomhetGrad, annet,
    } = this.props;
    if (!annet) {
      const fields = [`${oppfylt}.${handletUaktsomhetGrad}.annetBegrunnelse`];
      clearFormFields(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, false, false, ...fields);
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
      vilkarResultatTyper,
      aktsomhetTyper,
      sarligGrunnTyper,
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
                  {vilkarResultatTyper.map(vrt => (
                    <RadioOption
                      key={vrt.kode}
                      label={vrt.navn}
                      value={vrt.kode}
                    />
                  ))}
                </RadioGroupField>
              </Column>
            </Row>
          </Column>
          <Column md="6">
            <Row>
              <Column md="10">
                {oppfylt && (
                  <FormSection name={oppfylt}>
                    {oppfylt === vilkarResultat.GOD_TRO && (
                      <BelopetMottattIGodTroFormPanel readOnly={readOnly} erBelopetIBehold={erBelopetIBehold} />
                    )}
                    {oppfylt !== vilkarResultat.GOD_TRO && (
                      <UaktsomhetFormPanel
                        grunnerTilReduksjon={grunnerTilReduksjon}
                        readOnly={readOnly}
                        handletUaktsomhetGrad={handletUaktsomhetGrad}
                        resetFields={this.resetFields}
                        resetAnnetTextField={this.resetAnnetTextField}
                        annet={annet}
                        andelSomSkalTilbakekreves={andelSomSkalTilbakekreves}
                        aktsomhetTyper={aktsomhetTyper}
                        sarligGrunnTyper={sarligGrunnTyper}
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
    const info = values[oppfylt];
    return {
      ...selectedItemData,
      begrunnelse,
      oppfylt,
      ...info,
    };
};

const buildInitalValues = (selectedItemData) => {
  const {
    oppfylt, begrunnelse, erBelopetIBehold, godTroBegrunnelse, aktsomhetBegrunnelse, handletUaktsomhetGrad,
  } = selectedItemData;

  if (oppfylt === vilkarResultat.GOD_TRO) {
    return {
      oppfylt,
      begrunnelse,
      [vilkarResultat.GOD_TRO]: {
        erBelopetIBehold,
        godTroBegrunnelse,
      },
    };
  }
    return {
      oppfylt,
      begrunnelse,
      [oppfylt]: {
        aktsomhetBegrunnelse,
        handletUaktsomhetGrad,
      },
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const mapStateToProps = (state, ownProps) => {
  const oppfylt = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, 'oppfylt');
  const handletUaktsomhetGrad = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${oppfylt}.handletUaktsomhetGrad`);
  return {
    oppfylt,
    handletUaktsomhetGrad,
    andelSomSkalTilbakekreves: 75,
    grunnerTilReduksjon: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${oppfylt}.${handletUaktsomhetGrad}.grunnerTilReduksjon`),
    annet: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${oppfylt}.${handletUaktsomhetGrad}.annet`),
    erBelopetIBehold: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${oppfylt}.erBelopetIBehold`),
    initialValues: buildInitalValues(ownProps.selectedItemData),
    onSubmit: values => ownProps.updateActivity(transformValues(ownProps.selectedItemData, values)),
    vilkarResultatTyper: getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.VILKAR_RESULTAT)(state),
    aktsomhetTyper: getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.AKTSOMHET)(state),
    sarligGrunnTyper: getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.SARLIG_GRUNN)(state),
  };
};

const TilbakekrevingPeriodeForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_PERIODE_FORM_NAME,
  enableReinitialize: true,
})(TilbakekrevingPeriodeFormImpl)));

export default TilbakekrevingPeriodeForm;
