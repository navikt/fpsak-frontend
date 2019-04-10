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
  VerticalSpacer, FlexRow, FlexColumn, AdvarselModal,
} from '@fpsak-frontend/shared-components';
import { behandlingForm, behandlingFormValueSelector } from '../../../behandlingForm';
import vilkarResultat from '../../../kodeverk/vilkarResultat';
import tilbakekrevingKodeverkTyper from '../../../kodeverk/tilbakekrevingKodeverkTyper';
import { getTilbakekrevingKodeverk } from '../../../duckTilbake';
import TilbakekrevingAktivitetTabell from './TilbakekrevingAktivitetTabell';
import BelopetMottattIGodTroFormPanel from './BelopetMottattIGodTroFormPanel';
import UaktsomhetFormPanel from './UaktsomhetFormPanel';
import sarligGrunn from '../../../kodeverk/sarligGrunn';


const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const TILBAKEKREVING_PERIODE_FORM_NAME = 'TilbakekrevingPeriodeForm';

export class TilbakekrevingPeriodeFormImpl extends Component {
  state = { showModal: false };

  static propTypes = {
    selectedItemData: PropTypes.shape({}).isRequired,
    behandlingFormPrefix: PropTypes.string.isRequired,
    cancelSelectedActivity: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    erBelopetIBehold: PropTypes.bool,
    formName: PropTypes.string.isRequired,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: PropTypes.bool,
    aktiviteter: PropTypes.arrayOf(PropTypes.shape()),
    updateActivity: PropTypes.func.isRequired,
    vilkarResultatTyper: PropTypes.arrayOf(PropTypes.shape()),
    aktsomhetTyper: PropTypes.arrayOf(PropTypes.shape()),
    sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
    ...formPropTypes,
  };

  static defaultProps = {
    erBelopetIBehold: undefined,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: undefined,
  }

  resetFields = () => {
    const {
      behandlingFormPrefix, clearFields: clearFormFields, valgtVilkarResultatType,
    } = this.props;
    const fields = [valgtVilkarResultatType];
    clearFormFields(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, false, false, ...fields);
  }

  resetAnnetTextField = () => {
    const {
      behandlingFormPrefix, clearFields: clearFormFields, valgtVilkarResultatType, handletUaktsomhetGrad, annet,
    } = this.props;
    if (!annet) {
      const fields = [`${valgtVilkarResultatType}.${handletUaktsomhetGrad}.annetBegrunnelse`];
      clearFormFields(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, false, false, ...fields);
    }
  }

  saveOrToggleModal = () => {
    const { showModal } = this.state;
    const {
      selectedItemData,
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
      ...formProps
    } = this.props;

    if (selectedItemData.erTotalBelopUnder4Rettsgebyr && tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false) {
      this.setState(state => ({ ...state, showModal: !showModal }));
    } else {
      formProps.handleSubmit();
    }
  }

  saveForm = () => {
    const { showModal } = this.state;
    const {
      ...formProps
    } = this.props;

    this.setState(state => ({ ...state, showModal: !showModal }));
    formProps.handleSubmit();
  }

  render() {
    const {
      valgtVilkarResultatType,
      handletUaktsomhetGrad,
      harGrunnerTilReduksjon,
      cancelSelectedActivity,
      selectedItemData,
      readOnly,
      erBelopetIBehold,
      annet,
      vilkarResultatTyper,
      aktsomhetTyper,
      sarligGrunnTyper,
      ...formProps
    } = this.props;
    const { showModal } = this.state;
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
                  <FormattedMessage id="TilbakekrevingPeriodeForm.VilkarForTilbakekreving" />
                </Element>
                <VerticalSpacer eightPx />
                <TextAreaField
                  name="begrunnelse"
                  label={{ id: 'Tilbakekreving.Vurdering' }}
                  validate={[required, minLength3, maxLength1500, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                />
                <VerticalSpacer twentyPx />
                <Undertekst><FormattedMessage id="TilbakekrevingPeriodeForm.oppfylt" /></Undertekst>
                <VerticalSpacer eightPx />
                <RadioGroupField
                  validate={[required]}
                  name="valgtVilkarResultatType"
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
                {valgtVilkarResultatType && (
                  <FormSection name={valgtVilkarResultatType}>
                    {valgtVilkarResultatType === vilkarResultat.GOD_TRO && (
                      <BelopetMottattIGodTroFormPanel readOnly={readOnly} erBelopetIBehold={erBelopetIBehold} />
                    )}
                    {valgtVilkarResultatType !== vilkarResultat.GOD_TRO && (
                      <UaktsomhetFormPanel
                        harGrunnerTilReduksjon={harGrunnerTilReduksjon}
                        readOnly={readOnly}
                        handletUaktsomhetGrad={handletUaktsomhetGrad}
                        resetFields={this.resetFields}
                        resetAnnetTextField={this.resetAnnetTextField}
                        annet={annet}
                        aktsomhetTyper={aktsomhetTyper}
                        sarligGrunnTyper={sarligGrunnTyper}
                        antallYtelser={selectedItemData.ytelser.length}
                        feilutbetalingBelop={selectedItemData.feilutbetaling}
                        erTotalBelopUnder4Rettsgebyr={selectedItemData.erTotalBelopUnder4Rettsgebyr}
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
              onClick={this.saveOrToggleModal}
              disabled={formProps.pristine}
            >
              <FormattedMessage id="TilbakekrevingPeriodeForm.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="button" onClick={cancelSelectedActivity}>
              <FormattedMessage id="TilbakekrevingPeriodeForm.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
        { showModal
          && <AdvarselModal textCode="TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr" showModal submit={this.saveForm} />
        }
      </>
    );
  }
}

const formatAktsomhetData = (aktsomhet, sarligGrunnTyper) => {
  if (!aktsomhet) {
    return { };
  }
  return {
    harGrunnerTilReduksjon: aktsomhet.harGrunnerTilReduksjon,
    skalDetTilleggesRenter: aktsomhet.skalDetTilleggesRenter,
    sarligGrunner: sarligGrunnTyper.reduce((acc, type) => (aktsomhet[type.kode] ? acc.concat(type.kode) : acc), []),
    andelSomTilbakekreves: aktsomhet.andelSomTilbakekreves,
    belopSomSkalTilbakekreves: aktsomhet.belopSomSkalTilbakekreves,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhet.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
  };
};

const transformValues = (selectedItemData, values, sarligGrunnTyper) => {
  const { valgtVilkarResultatType, begrunnelse } = values;
  const info = values[valgtVilkarResultatType];
  const aktsomhet = info[info.handletUaktsomhetGrad];
  return {
    ...selectedItemData,
    begrunnelse,
    valgtVilkarResultatType,
    ...info,
    ...formatAktsomhetData(aktsomhet, sarligGrunnTyper, values.aktsomhetBegrunnelse),
  };
};

const buildInitalValues = (selectedItemData) => {
  const {
    valgtVilkarResultatType, begrunnelse, erBelopetIBehold, godTroBegrunnelse, annetBegrunnelse, handletUaktsomhetGrad, aktsomhetBegrunnelse,
  } = selectedItemData;
  if (valgtVilkarResultatType === vilkarResultat.GOD_TRO) {
    return {
      valgtVilkarResultatType,
      begrunnelse,
      [vilkarResultat.GOD_TRO]: {
        erBelopetIBehold,
        godTroBegrunnelse,
      },
    };
  }
    return {
      valgtVilkarResultatType,
      begrunnelse,
      [valgtVilkarResultatType]: {
        aktsomhetBegrunnelse,
        annetBegrunnelse,
        handletUaktsomhetGrad,
        [handletUaktsomhetGrad]: selectedItemData[handletUaktsomhetGrad],
      },
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const mapStateToProps = (state, ownProps) => {
  const valgtVilkarResultatType = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, 'valgtVilkarResultatType');
  const handletUaktsomhetGrad = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${valgtVilkarResultatType}.handletUaktsomhetGrad`);
  const sarligGrunnTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.SARLIG_GRUNN)(state);
  return {
    valgtVilkarResultatType,
    handletUaktsomhetGrad,
    harGrunnerTilReduksjon: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(
      state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.harGrunnerTilReduksjon`,
    ),
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(
      state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`,
),
    annet: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.${sarligGrunn.ANNET}`),
    erBelopetIBehold: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${valgtVilkarResultatType}.erBelopetIBehold`),
    initialValues: buildInitalValues(ownProps.selectedItemData),
    onSubmit: values => ownProps.updateActivity(transformValues(ownProps.selectedItemData, values, sarligGrunnTyper)),
    vilkarResultatTyper: getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.VILKAR_RESULTAT)(state),
    aktsomhetTyper: getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.AKTSOMHET)(state),
    sarligGrunnTyper,
  };
};

const TilbakekrevingPeriodeForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_PERIODE_FORM_NAME,
})(TilbakekrevingPeriodeFormImpl)));

export default TilbakekrevingPeriodeForm;
