import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes, FormSection } from 'redux-form';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import {
  formatCurrencyNoKr, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import {
  AdvarselModal, FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';

import sarligGrunn from '../kodeverk/sarligGrunn';
import Aktsomhet, { AKTSOMHET_REKKEFØLGE } from '../kodeverk/aktsomhet';
import VilkarResultat from '../kodeverk/vilkarResultat';
import TilbakekrevingAktivitetTabell from './tilbakekrevingPeriodePaneler/TilbakekrevingAktivitetTabell';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import BelopetMottattIGodTroFormPanel from './tilbakekrevingPeriodePaneler/godTro/BelopetMottattIGodTroFormPanel';
import AktsomhetFormPanel from './tilbakekrevingPeriodePaneler/aktsomhet/AktsomhetFormPanel';
import TilbakekrevingTimelineData from './splittePerioder/TilbakekrevingTimelineData';

import styles from './tilbakekrevingPeriodeForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const TILBAKEKREVING_PERIODE_FORM_NAME = 'TilbakekrevingPeriodeForm';

export class TilbakekrevingPeriodeFormImpl extends Component {
  state = { showModal: false };

  static propTypes = {
    behandlingFormPrefix: PropTypes.string.isRequired,
    skjulPeriode: PropTypes.func.isRequired,
    setNestePeriode: PropTypes.func.isRequired,
    setForrigePeriode: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    erBelopetIBehold: PropTypes.bool,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: PropTypes.bool,
    oppdaterPeriode: PropTypes.func.isRequired,
    oppdaterSplittedePerioder: PropTypes.func.isRequired,
    antallPerioderMedAksjonspunkt: PropTypes.number.isRequired,
    andelSomTilbakekreves: PropTypes.string,
    vilkarResultatTyper: PropTypes.arrayOf(PropTypes.shape()),
    aktsomhetTyper: PropTypes.arrayOf(PropTypes.shape()),
    sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
    reduserteBelop: PropTypes.arrayOf(PropTypes.shape({
      erTrekk: PropTypes.bool.isRequired,
      belop: PropTypes.number.isRequired,
    })),
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    beregnBelop: PropTypes.func.isRequired,
    ...formPropTypes,
  };

  static defaultProps = {
    erBelopetIBehold: undefined,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: undefined,
    andelSomTilbakekreves: undefined,
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
      data,
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
      antallPerioderMedAksjonspunkt,
      ...formProps
    } = this.props;

    if (antallPerioderMedAksjonspunkt > 1 && data.erTotalBelopUnder4Rettsgebyr && tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false) {
      this.setState((state) => ({ ...state, showModal: !showModal }));
    } else {
      formProps.handleSubmit();
    }
  }

  saveForm = () => {
    const { showModal } = this.state;
    const {
      ...formProps
    } = this.props;

    this.setState((state) => ({ ...state, showModal: !showModal }));
    formProps.handleSubmit();
  }

  render() {
    const {
      valgtVilkarResultatType,
      handletUaktsomhetGrad,
      harGrunnerTilReduksjon,
      skjulPeriode,
      readOnly,
      erBelopetIBehold,
      erSerligGrunnAnnetValgt,
      vilkarResultatTyper,
      aktsomhetTyper,
      sarligGrunnTyper,
      reduserteBelop,
      setNestePeriode,
      setForrigePeriode,
      oppdaterSplittedePerioder,
      data,
      andelSomTilbakekreves,
      behandlingId,
      behandlingVersjon,
      beregnBelop,
      ...formProps
    } = this.props;
    const { showModal } = this.state;
    return (
      <div className={styles.container}>
        <TilbakekrevingTimelineData
          periode={data}
          callbackForward={setNestePeriode}
          callbackBackward={setForrigePeriode}
          oppdaterSplittedePerioder={oppdaterSplittedePerioder}
          readOnly={readOnly}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          beregnBelop={beregnBelop}
        />
        <VerticalSpacer twentyPx />
        {reduserteBelop.map((belop) => (
          <>
            <Normaltekst>
              <FormattedHTMLMessage
                id={belop.erTrekk ? 'TilbakekrevingPeriodeForm.FeilutbetaltBelopTrekk' : 'TilbakekrevingPeriodeForm.FeilutbetaltBelopEtterbetaling'}
                values={{ belop: formatCurrencyNoKr(belop.belop) }}
              />
            </Normaltekst>
            <VerticalSpacer eigthPx />
          </>
        ))}
        <TilbakekrevingAktivitetTabell ytelser={data.ytelser} />
        <VerticalSpacer twentyPx />
        <Row>
          <Column md={data.erForeldet ? '12' : '6'}>
            <Row>
              {data.erForeldet && (
                <Column md="12">
                  <ForeldetFormPanel />
                </Column>
              )}
              {!data.erForeldet && (
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
                    {vilkarResultatTyper.map((vrt) => (
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
                  <>
                    <Element>
                      <FormattedMessage id={valgtVilkarResultatType === VilkarResultat.GOD_TRO
                        ? 'TilbakekrevingPeriodeForm.BelopetMottattIGodTro' : 'TilbakekrevingPeriodeForm.Aktsomhet'}
                      />
                    </Element>
                    <VerticalSpacer eightPx />
                    <TextAreaField
                      name="vurderingBegrunnelse"
                      label={{ id: 'TilbakekrevingPeriodeForm.Vurdering' }}
                      validate={[required, minLength3, maxLength1500, hasValidText]}
                      maxLength={1500}
                      readOnly={readOnly}
                    />
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
                          erValgtResultatTypeForstoBurdeForstaatt={valgtVilkarResultatType === VilkarResultat.FORSTO_BURDE_FORSTAATT}
                          aktsomhetTyper={aktsomhetTyper}
                          sarligGrunnTyper={sarligGrunnTyper}
                          antallYtelser={data.ytelser.length}
                          feilutbetalingBelop={data.feilutbetaling}
                          erTotalBelopUnder4Rettsgebyr={data.erTotalBelopUnder4Rettsgebyr}
                          andelSomTilbakekreves={andelSomTilbakekreves}
                        />
                      )}
                    </FormSection>
                  </>
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
            <Knapp mini htmlType="button" onClick={skjulPeriode}>
              <FormattedMessage id="TilbakekrevingPeriodeForm.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
        { showModal
          && <AdvarselModal textCode="TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr" showModal submit={this.saveForm} />}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const validate = (values, sarligGrunnTyper, data) => {
  let errors = {};
  if (!values) {
    return errors;
  }
  const vilkarResultatInfo = values[values.valgtVilkarResultatType];
  if (vilkarResultatInfo && vilkarResultatInfo.handletUaktsomhetGrad && vilkarResultatInfo.handletUaktsomhetGrad !== Aktsomhet.FORSETT) {
    const aktsomhetInfo = vilkarResultatInfo[vilkarResultatInfo.handletUaktsomhetGrad];
    if (aktsomhetInfo && !sarligGrunnTyper.some((type) => aktsomhetInfo[type.kode])) {
      errors = {
        [values.valgtVilkarResultatType]: {
          [vilkarResultatInfo.handletUaktsomhetGrad]: {
            [sarligGrunn.ANNET]: [{ id: 'TilbakekrevingPeriodeForm.MaVelgeSarligGrunn' }],
          },
        },
      };
    }
    if (aktsomhetInfo && aktsomhetInfo.belopSomSkalTilbakekreves && aktsomhetInfo.belopSomSkalTilbakekreves >= data.feilutbetaling) {
      errors = {
        ...errors,
        [values.valgtVilkarResultatType]: {
          [vilkarResultatInfo.handletUaktsomhetGrad]: {
            belopSomSkalTilbakekreves: [{ id: 'TilbakekrevingPeriodeForm.BelopMaVereMindreEnnFeilutbetalingen' }],
          },
        },
      };
    }
  }
  if (vilkarResultatInfo && vilkarResultatInfo.tilbakekrevdBelop && vilkarResultatInfo.tilbakekrevdBelop > data.feilutbetaling) {
    errors = {
      ...errors,
      [values.valgtVilkarResultatType]: {
        tilbakekrevdBelop: [{ id: 'TilbakekrevingPeriodeForm.BelopKanIkkeVereStorreEnnFeilutbetalingen' }],
      },
    };
  }

  return errors;
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const sarligGrunnTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.SARLIG_GRUNN];
  const vilkarResultatTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.VILKAR_RESULTAT];
  const aktsomhetTyper = ownProps.alleKodeverk[tilbakekrevingKodeverkTyper.AKTSOMHET];
  const sorterteAktsomhetTyper = AKTSOMHET_REKKEFØLGE.map((a) => aktsomhetTyper.find((el) => el.kode === a));
  const submitCallback = (values) => ownProps.oppdaterPeriode(values);
  const validateForm = (values) => validate(values, sarligGrunnTyper, ownProps.data);
  return (state, oProps) => {
    const { behandlingId, behandlingVersjon } = oProps;
    const sel = behandlingFormValueSelector(TILBAKEKREVING_PERIODE_FORM_NAME, behandlingId, behandlingVersjon);
    const valgtVilkarResultatType = sel(state, 'valgtVilkarResultatType');
    const handletUaktsomhetGrad = sel(state, `${valgtVilkarResultatType}.handletUaktsomhetGrad`);
    return {
      harGrunnerTilReduksjon: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.harGrunnerTilReduksjon`),
      andelSomTilbakekreves: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.andelSomTilbakekreves`),
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`),
      erSerligGrunnAnnetValgt: sel(state, `${valgtVilkarResultatType}.${handletUaktsomhetGrad}.${sarligGrunn.ANNET}`),
      erBelopetIBehold: sel(state, `${valgtVilkarResultatType}.erBelopetIBehold`),
      initialValues: oProps.periode,
      reduserteBelop: ownProps.data.redusertBeloper,
      onSubmit: submitCallback,
      validate: validateForm,
      valgtVilkarResultatType,
      handletUaktsomhetGrad,
      vilkarResultatTyper,
      aktsomhetTyper: sorterteAktsomhetTyper,
      sarligGrunnTyper,
    };
  };
};

const TilbakekrevingPeriodeForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_PERIODE_FORM_NAME,
  enableReinitialize: true,
})(TilbakekrevingPeriodeFormImpl)));

TilbakekrevingPeriodeForm.buildInitialValues = (periode, foreldelsePerioder) => {
  const { vilkarResultat, begrunnelse, vilkarResultatInfo } = periode;

  const vilkarResultatKode = vilkarResultat && vilkarResultat.kode ? vilkarResultat.kode : vilkarResultat;
  let foreldetData = { erForeldet: false };
  const erForeldet = periode.erForeldet ? periode.erForeldet : periode.foreldet;
  if (erForeldet) {
    const foreldelsePeriode = foreldelsePerioder.perioder.find((p) => p.fom === periode.fom && p.tom === periode.tom);
    foreldetData = {
      erForeldet,
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
    vurderingBegrunnelse: vilkarResultatInfo ? vilkarResultatInfo.begrunnelse : undefined,
    [initialValues.valgtVilkarResultatType]: {
      ...godTroData,
      ...annetData,
    },
  };
};

TilbakekrevingPeriodeForm.transformValues = (values, sarligGrunnTyper) => {
  const { valgtVilkarResultatType, begrunnelse, vurderingBegrunnelse } = values;
  const info = values[valgtVilkarResultatType];

  const godTroData = valgtVilkarResultatType === VilkarResultat.GOD_TRO ? BelopetMottattIGodTroFormPanel.transformValues(info, vurderingBegrunnelse) : {};
  const annetData = valgtVilkarResultatType !== VilkarResultat.GOD_TRO ? AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse) : {};

  return {
    begrunnelse,
    fom: values.fom,
    tom: values.tom,
    vilkarResultat: valgtVilkarResultatType,
    vilkarResultatInfo: {
      ...godTroData,
      ...annetData,
    },
  };
};

export default TilbakekrevingPeriodeForm;
