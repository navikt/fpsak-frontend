import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormSection, clearFields, formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertekst, Element } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import {
  RadioOption, RadioGroupField, TextAreaField,
} from '@fpsak-frontend/form';

import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import {
  VerticalSpacer, FlexRow, FlexColumn, AdvarselModal,
} from '@fpsak-frontend/shared-components';

import { getForeldelsePerioder } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingTilbakekreving/src/behandlingForm';
import sarligGrunn from 'behandlingTilbakekreving/src/kodeverk/sarligGrunn';
import Aktsomhet from 'behandlingTilbakekreving/src/kodeverk/aktsomhet';
import VilkarResultat from 'behandlingTilbakekreving/src/kodeverk/vilkarResultat';
import tilbakekrevingKodeverkTyper from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingKodeverkTyper';
import { getTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckTilbake';
import TilbakekrevingAktivitetTabell from './tilbakekrevingPeriodePaneler/TilbakekrevingAktivitetTabell';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import BelopetMottattIGodTroFormPanel from './tilbakekrevingPeriodePaneler/godTro/BelopetMottattIGodTroFormPanel';
import AktsomhetFormPanel from './tilbakekrevingPeriodePaneler/aktsomhet/AktsomhetFormPanel';

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
    updateActivity: PropTypes.func.isRequired,
    antallPerioderMedAksjonspunkt: PropTypes.number.isRequired,
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
      behandlingFormPrefix, clearFields: clearFormFields, valgtVilkarResultatType, handletUaktsomhetGrad, erSerligGrunnAnnetValgt,
    } = this.props;
    if (!erSerligGrunnAnnetValgt) {
      const fields = [`${valgtVilkarResultatType}.${handletUaktsomhetGrad}.annetBegrunnelse`];
      clearFormFields(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, false, false, ...fields);
    }
  }

  saveOrToggleModal = () => {
    const { showModal } = this.state;
    const {
      selectedItemData,
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
      antallPerioderMedAksjonspunkt,
      ...formProps
    } = this.props;

    if (antallPerioderMedAksjonspunkt > 1 && selectedItemData.erTotalBelopUnder4Rettsgebyr && tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false) {
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
      erSerligGrunnAnnetValgt,
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
          <Column md={selectedItemData.erForeldet ? '12' : '6'}>
            <Row>
              {selectedItemData.erForeldet && (
                <Column md="12">
                  <ForeldetFormPanel />
                </Column>
              )}
              {!selectedItemData.erForeldet && (
                <Column md="10">
                  <Element>
                    <FormattedMessage id="TilbakekrevingPeriodeForm.VilkarForTilbakekreving" />
                  </Element>
                  <VerticalSpacer eightPx />
                  <TextAreaField
                    name="begrunnelse"
                    label={{ id: 'TilbakekrevingPeriodeForm.Vurdering' }}
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
                )}
            </Row>
          </Column>
          <Column md="6">
            <Row>
              <Column md="10">
                {valgtVilkarResultatType && (
                  <FormSection name={valgtVilkarResultatType}>
                    {valgtVilkarResultatType === VilkarResultat.GOD_TRO && (
                      <BelopetMottattIGodTroFormPanel readOnly={readOnly} erBelopetIBehold={erBelopetIBehold} />
                    )}
                    {valgtVilkarResultatType !== VilkarResultat.GOD_TRO && (
                      <AktsomhetFormPanel
                        harGrunnerTilReduksjon={harGrunnerTilReduksjon}
                        readOnly={readOnly}
                        handletUaktsomhetGrad={handletUaktsomhetGrad}
                        resetFields={this.resetFields}
                        resetAnnetTextField={this.resetAnnetTextField}
                        erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
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
              disabled={formProps.pristine || readOnly}
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

const transformValues = (selectedItemData, values, sarligGrunnTyper) => {
  const { valgtVilkarResultatType, begrunnelse } = values;
  const info = values[valgtVilkarResultatType];

  const godTroData = valgtVilkarResultatType === VilkarResultat.GOD_TRO ? BelopetMottattIGodTroFormPanel.transformValues(info) : {};
  const annetData = valgtVilkarResultatType !== VilkarResultat.GOD_TRO ? AktsomhetFormPanel.transformValues(info, sarligGrunnTyper) : {};

  return {
    ...selectedItemData,
    storedData: {
      begrunnelse,
      fom: selectedItemData.fom,
      tom: selectedItemData.tom,
      vilkarResultat: { kode: valgtVilkarResultatType },
      vilkarResultatInfo: {
        ...godTroData,
        ...annetData,
      },
    },
  };
};

const buildInitalValues = (period, foreldelsePerioder) => {
  const { vilkarResultat, begrunnelse, vilkarResultatInfo } = period.storedData;

  const vilkarResultatKode = vilkarResultat ? vilkarResultat.kode : undefined;
  let foreldetData = { erForeldet: false };
  if (period.erForeldet) {
    const foreldelsePeriode = foreldelsePerioder.find(p => p.fom === period.fom && p.tom === period.tom);
    foreldetData = {
      erForeldet: period.erForeldet,
      periodenErForeldet: true,
      foreldetBegrunnelse: foreldelsePeriode.begrunnelse,
    };
  }

  const initialValues = {
    valgtVilkarResultatType: vilkarResultatKode,
    begrunnelse,
    ...foreldetData,
  };

  const godTroData = vilkarResultatKode === VilkarResultat.GOD_TRO ? BelopetMottattIGodTroFormPanel.buildIntialValues(vilkarResultatInfo) : {};
  const annetData = vilkarResultatKode !== undefined && vilkarResultatKode !== VilkarResultat.GOD_TRO
    ? AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo) : {};
  return {
    ...initialValues,
    [initialValues.valgtVilkarResultatType]: {
      ...godTroData,
      ...annetData,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const validate = (values, sarligGrunnTyper) => {
  let errors = {};
  const vilkarResultatInfo = values[values.valgtVilkarResultatType];
  if (vilkarResultatInfo && vilkarResultatInfo.handletUaktsomhetGrad && vilkarResultatInfo.handletUaktsomhetGrad !== Aktsomhet.FORSETT) {
    const aktsomhetInfo = vilkarResultatInfo[vilkarResultatInfo.handletUaktsomhetGrad];
    if (aktsomhetInfo && !sarligGrunnTyper.some(type => aktsomhetInfo[type.kode])) {
       // eslint-disable-next-line no-underscore-dangle
       errors = {
         [values.valgtVilkarResultatType]: {
           [vilkarResultatInfo.handletUaktsomhetGrad]: {
             [sarligGrunn.ANNET]: [{ id: 'TilbakekrevingPeriodeForm.MaVelgeSarligGrunn' }],
           },
          },
        };
    }
  }

  return errors;
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const sarligGrunnTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.SARLIG_GRUNN)(initialState);
  const vilkarResultatTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.VILKAR_RESULTAT)(initialState);
  const aktsomhetTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.AKTSOMHET)(initialState);
  const submitCallback = values => ownProps.updateActivity(transformValues(ownProps.selectedItemData, values, sarligGrunnTyper));
  const validateForm = values => validate(values, sarligGrunnTyper);
  const foreldelsePerioder = getForeldelsePerioder(initialState).perioder;
  return (state) => {
    const valgtVilkarResultatType = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, 'valgtVilkarResultatType');
    const handletUaktsomhetGrad = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${valgtVilkarResultatType}.handletUaktsomhetGrad`);
    return {
      harGrunnerTilReduksjon: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(
        state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.harGrunnerTilReduksjon`,
      ),
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(
        state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`,
      ),
      erSerligGrunnAnnetValgt: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state,
        `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.${sarligGrunn.ANNET}`),
      erBelopetIBehold: behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME)(state, `${valgtVilkarResultatType}.erBelopetIBehold`),
      initialValues: buildInitalValues(ownProps.selectedItemData, foreldelsePerioder),
      onSubmit: submitCallback,
      validate: validateForm,
      valgtVilkarResultatType,
      handletUaktsomhetGrad,
      vilkarResultatTyper,
      aktsomhetTyper,
      sarligGrunnTyper,
    };
  };
};

const TilbakekrevingPeriodeForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_PERIODE_FORM_NAME,
  enableReinitialize: true,
})(TilbakekrevingPeriodeFormImpl)));

export default TilbakekrevingPeriodeForm;
