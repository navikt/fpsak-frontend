import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { behandlingForm } from '@fpsak-frontend/fp-felles';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';

import { Undertittel } from 'nav-frontend-typografi';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';
import AvviksopplysningerPanel from '../fellesPaneler/AvvikopplysningerPanel';
import SkjeringspunktOgStatusPanel2, { RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN } from '../fellesPaneler/SkjeringspunktOgStatusPanel_V2';
import VurderOgFastsettSN2 from '../selvstendigNaeringsdrivende/VurderOgFastsettSN_V2';
import GrunnlagForAarsinntektPanelFL2 from '../frilanser/GrunnlagForAarsinntektPanelFL_V2';
import GrunnlagForAarsinntektPanelAT2 from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import Beregningsgrunnlag2, { TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING } from '../beregningsgrunnlagPanel/Beregningsgrunnlag_V2';
import AksjonspunktBehandler from '../fellesPaneler/AksjonspunktBehandler';
import BeregningsresultatTable2 from '../beregningsresultatPanel/BeregningsresultatTable_V2';
import AksjonspunktHelpTextV2 from '../redesign/AksjonspunktHelpText_V2';
import AksjonspunktBehandlerAT from '../arbeidstaker/AksjonspunktBehandlerAT';
import AksjonspunktBehandlerFL from '../frilanser/AksjonspunktBehandlerFL';

import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

// TODO Denne klassen bør refaktoreres, gjøres i https://jira.adeo.no/browse/TFP-1313

// ------------------------------------------------------------------------------------------ //
// Variables
// ------------------------------------------------------------------------------------------ //

const formName = 'BeregningForm';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_DEKNINGSGRAD,
} = aksjonspunktCodes;
// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const gjelderBehandlingenBesteberegning = (faktaOmBeregning) => (faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
  ? faktaOmBeregning.faktaOmBeregningTilfeller.some((tilfelle) => tilfelle.kode === faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
  : false);

const harPerioderMedAvsluttedeArbeidsforhold = (allePerioder) => allePerioder.some(({ periodeAarsaker }) => periodeAarsaker
  && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET));

const lagAksjonspunktViser = (gjeldendeAksjonspunkter, avvikProsent, alleAndelerIForstePeriode) => {
  if (gjeldendeAksjonspunkter === undefined || gjeldendeAksjonspunkter === null) {
    return undefined;
  }
  const vurderDekninsgradAksjonspunkt = gjeldendeAksjonspunkter.filter((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD);
  const sorterteAksjonspunkter = vurderDekninsgradAksjonspunkt.concat(gjeldendeAksjonspunkter);
  const apneAksjonspunkt = sorterteAksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode));
  const erDetMinstEttApentAksjonspunkt = apneAksjonspunkt.length > 0;
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const erVarigEndring = snAndel && snAndel.næringer && snAndel.næringer.some((naring) => naring.erVarigEndret === true);
  const erNyoppstartet = snAndel && snAndel.næringer && snAndel.næringer.some((naring) => naring.erNyoppstartet === true);
  const erNyArbLivet = snAndel && snAndel.erNyIArbeidslivet;
  return (
    <div>
      { erDetMinstEttApentAksjonspunkt && (
        <AksjonspunktHelpTextV2
          apneAksjonspunkt={apneAksjonspunkt}
          avvikProsent={avvikProsent}
          erVarigEndring={erVarigEndring}
          erNyArbLivet={erNyArbLivet}
          erNyoppstartet={erNyoppstartet}
        />
      )}

    </div>
  );
};

export const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.beregningsgrunnlag,
    (state, ownProps) => ownProps.gjeldendeAksjonspunkter],
  (beregningsgrunnlag, gjeldendeAksjonspunkter) => {
    if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
      return undefined;
    }
    const allePerioder = beregningsgrunnlag.beregningsgrunnlagPeriode;
    const gjeldendeDekningsgrad = beregningsgrunnlag.dekningsgrad;
    const alleAndelerIForstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel;
    const arbeidstakerAndeler = alleAndelerIForstePeriode.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
    const frilanserAndeler = alleAndelerIForstePeriode.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
    const selvstendigNaeringAndeler = alleAndelerIForstePeriode.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
    return {
      ...Beregningsgrunnlag2.buildInitialValues(gjeldendeAksjonspunkter),
      ...AksjonspunktBehandlerTB.buildInitialValues(allePerioder),
      ...VurderOgFastsettSN2.buildInitialValues(selvstendigNaeringAndeler, gjeldendeAksjonspunkter),
      ...GrunnlagForAarsinntektPanelFL2.buildInitialValues(frilanserAndeler),
      ...GrunnlagForAarsinntektPanelAT2.buildInitialValues(arbeidstakerAndeler),
      ...SkjeringspunktOgStatusPanel2.buildInitialValues(gjeldendeDekningsgrad, gjeldendeAksjonspunkter),
    };
  },
);

const harAksjonspunkt = (aksjonspunktKode, gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter !== undefined && gjeldendeAksjonspunkter !== null
  && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktKode);

const transformValuesATFLHverForSeg = (values, skalFastsetteAT, skalFastsetteFL, alleAndelerIForstePeriode) => ([{
  kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  begrunnelse: AksjonspunktBehandler.transformValues(values),
  inntektFrilanser: skalFastsetteFL ? AksjonspunktBehandlerFL.transformValuesForFL(values) : undefined,
  inntektPrAndelList: skalFastsetteAT ? AksjonspunktBehandlerAT.transformValuesForAT(values, alleAndelerIForstePeriode) : undefined,
}]);

const transformValuesATFLHverForSegTidsbegrenset = (values, skalFastsetteAT, skalFastsetteFL, allePerioder) => ([{
  kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  begrunnelse: AksjonspunktBehandler.transformValues(values),
  inntektFrilanser: skalFastsetteFL ? AksjonspunktBehandlerFL.transformValuesForFL(values) : undefined,
  fastsatteTidsbegrensedePerioder: skalFastsetteAT ? AksjonspunktBehandlerTB.transformValues(values, allePerioder) : undefined,
}]);

export const transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode,
  gjeldendeAksjonspunkter, allePerioder, harNyttIkkeSamletSammenligningsgrunnlag) => {
  const skalFastsetteAT = alleAndelerIForstePeriode.some((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && andel.skalFastsetteGrunnlag);
  const skalFastsetteFL = alleAndelerIForstePeriode.some((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER && andel.skalFastsetteGrunnlag);
  const skalATOgFLFastsettesHverForSeg = (skalFastsetteAT || skalFastsetteFL) && harNyttIkkeSamletSammenligningsgrunnlag;
  const harTidsbegrensedeArbeidsforhold = harPerioderMedAvsluttedeArbeidsforhold(allePerioder);
  const aksjonspunkter = [];
  const vurderDekningsgradAksjonspunkt = {
    kode: VURDER_DEKNINGSGRAD,
    begrunnelse: values[TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING],
    dekningsgrad: values[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN],
  };
  if (harAksjonspunkt(VURDER_DEKNINGSGRAD, gjeldendeAksjonspunkter)) {
    aksjonspunkter.push(vurderDekningsgradAksjonspunkt);
  }
  if (harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, gjeldendeAksjonspunkter) && !harTidsbegrensedeArbeidsforhold) {
    if (skalATOgFLFastsettesHverForSeg) {
      return aksjonspunkter.concat(transformValuesATFLHverForSeg(values, skalFastsetteAT, skalFastsetteFL, alleAndelerIForstePeriode));
    }
    return aksjonspunkter.concat(AksjonspunktBehandlerAT.transformValues(values, relevanteStatuser, alleAndelerIForstePeriode));
  }
  if (harAksjonspunkt(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, gjeldendeAksjonspunkter)
    || harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return aksjonspunkter.concat(VurderOgFastsettSN2.transformValues(values, gjeldendeAksjonspunkter));
  }
  if ((harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, gjeldendeAksjonspunkter)
  || harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD, gjeldendeAksjonspunkter)) && harTidsbegrensedeArbeidsforhold) {
    if (skalATOgFLFastsettesHverForSeg) {
      const t = transformValuesATFLHverForSegTidsbegrenset(values, skalFastsetteAT, skalFastsetteFL, allePerioder);
      return aksjonspunkter.concat(t);
    }
    return aksjonspunkter.concat(Beregningsgrunnlag2.transformValues(values, allePerioder));
  }
  return aksjonspunkter;
};

const getSammenligningsgrunnlagsPrStatus = (bg) => (bg.sammenligningsgrunnlagPrStatus ? bg.sammenligningsgrunnlagPrStatus : undefined);
const getSammenligningsgrunnlagSum = (bg) => (bg.sammenligningsgrunnlag ? bg.sammenligningsgrunnlag.rapportertPrAar : undefined);
const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const getAvviksprosent = (sammenligningsgrunnlagPrStatus) => {
  if (!sammenligningsgrunnlagPrStatus) {
    return undefined;
  }
  const avvikElem = sammenligningsgrunnlagPrStatus.find((status) => status.avvikProsent > 25);
  const avvikProsent = avvikElem && avvikElem.avvikProsent ? avvikElem.avvikProsent : 0;
  if (avvikProsent || avvikProsent === 0) {
    return avvikProsent;
  }
  return undefined;
};

const getStatusList = (beregningsgrunnlagPeriode) => {
  const statusList = beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel.map((statusAndel) => statusAndel.aktivitetStatus);
  return statusList;
};

// ------------------------------------------------------------------------------------------ //
// Component : BeregningFormImpl
// ------------------------------------------------------------------------------------------ //
/**
 *
 * BeregningForm
 *
 * Fungerer som den overordnene formen for beregningkomponentene og håndterer alt av submits
 * relatert til beregning.
 *
 */
export const BeregningFormImpl2 = ({
  readOnly,
  beregningsgrunnlag,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  vilkaarBG,
  ...formProps
}) => {
  const {
    dekningsgrad, skjaeringstidspunktBeregning,
    årsinntektVisningstall, beregningsgrunnlagPeriode, faktaOmBeregning,
  } = beregningsgrunnlag;
  const gjelderBesteberegning = gjelderBehandlingenBesteberegning(faktaOmBeregning);
  const sammenligningsgrunnlagSum = getSammenligningsgrunnlagSum(beregningsgrunnlag);
  const sammenligningsgrunnlagPrStatus = getSammenligningsgrunnlagsPrStatus(beregningsgrunnlag);
  const avvikProsent = getAvviksprosent(sammenligningsgrunnlagPrStatus);
  const aktivitetStatusList = getStatusList(beregningsgrunnlagPeriode);
  const tidsBegrensetInntekt = harPerioderMedAvsluttedeArbeidsforhold(beregningsgrunnlagPeriode);
  const harAksjonspunkter = gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 0;
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(beregningsgrunnlagPeriode);
  return (
    <form onSubmit={formProps.handleSubmit} className={beregningStyles.beregningForm}>
      { gjeldendeAksjonspunkter
        && (
        <ElementWrapper>
          <VerticalSpacer eightPx />
          { lagAksjonspunktViser(gjeldendeAksjonspunkter, avvikProsent, alleAndelerIForstePeriode)}
        </ElementWrapper>
        )}
      <Row>
        <Column xs="12" md="6">
          <Undertittel className={beregningStyles.panelLeft}>
            <FormattedMessage id="Beregningsgrunnlag.Title.Beregning" />
          </Undertittel>
          <VerticalSpacer fourtyPx />
          <SkjeringspunktOgStatusPanel2
            readOnly={readOnly}
            gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
            alleKodeverk={alleKodeverk}
            aktivitetStatusList={aktivitetStatusList}
            skjeringstidspunktDato={skjaeringstidspunktBeregning}
            gjeldendeDekningsgrad={dekningsgrad}
          />
          { relevanteStatuser.skalViseBeregningsgrunnlag && (
            <>
              <VerticalSpacer fourtyPx />
              <Beregningsgrunnlag2
                relevanteStatuser={relevanteStatuser}
                readOnly={readOnly}
                submitCallback={submitCallback}
                gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
                readOnlySubmitButton={readOnlySubmitButton}
                formName={formName}
                allePerioder={beregningsgrunnlagPeriode}
                gjelderBesteberegning={gjelderBesteberegning}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                alleKodeverk={alleKodeverk}
              />
            </>
          )}
        </Column>
        <Column xs="12" md="6">
          <Undertittel className={beregningStyles.panelRight}>
            <FormattedMessage id="Beregningsgrunnlag.Title.Fastsettelse" />
          </Undertittel>
          <VerticalSpacer fourtyPx />
          <AvviksopplysningerPanel
            beregnetAarsinntekt={årsinntektVisningstall}
            sammenligningsgrunnlagPrStatus={sammenligningsgrunnlagPrStatus}
            sammenligningsgrunnlag={sammenligningsgrunnlagSum}
            avvik={avvikProsent}
            relevanteStatuser={relevanteStatuser}
            allePerioder={beregningsgrunnlagPeriode}
            harAksjonspunkter={harAksjonspunkter}
          />
          {harAksjonspunkter
          && (
            <>
              <VerticalSpacer fourtyPx />
              <AksjonspunktBehandler
                readOnly={readOnly}
                readOnlySubmitButton={readOnlySubmitButton}
                formName={formName}
                allePerioder={beregningsgrunnlagPeriode}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                alleKodeverk={alleKodeverk}
                aksjonspunkter={gjeldendeAksjonspunkter}
                relevanteStatuser={relevanteStatuser}
                tidsBegrensetInntekt={tidsBegrensetInntekt}
              />
            </>
          )}
          <>
            <VerticalSpacer fourtyPx />
            <BeregningsresultatTable2
              beregningsgrunnlagPerioder={beregningsgrunnlag.beregningsgrunnlagPeriode}
              dekningsgrad={dekningsgrad}
              vilkaarBG={vilkaarBG}
              aksjonspunkter={gjeldendeAksjonspunkter}
              aktivitetStatusList={aktivitetStatusList}
              grunnbelop={beregningsgrunnlag.grunnbeløp}
              harAksjonspunkter={harAksjonspunkter}
            />
          </>

        </Column>
      </Row>
    </form>
  );
};

BeregningFormImpl2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  vilkaarBG: PropTypes.shape().isRequired,
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const {
    gjeldendeAksjonspunkter, relevanteStatuser,
    submitCallback, beregningsgrunnlag,
  } = initialOwnProps;
  const allePerioder = beregningsgrunnlag ? beregningsgrunnlag.beregningsgrunnlagPeriode : [];
  const alleAndelerIForstePeriode = allePerioder && allePerioder.length > 0
    ? allePerioder[0].beregningsgrunnlagPrStatusOgAndel : [];

  const sammenligningsgrunnlagPrStatus = getSammenligningsgrunnlagsPrStatus(beregningsgrunnlag);
  const samletSammenligningsgrunnnlag = sammenligningsgrunnlagPrStatus
  && sammenligningsgrunnlagPrStatus.find((sammenLigGr) => sammenLigGr.sammenligningsgrunnlagType.kode === sammenligningType.ATFLSN);
  const harNyttIkkeSamletSammenligningsgrunnlag = sammenligningsgrunnlagPrStatus && !samletSammenligningsgrunnnlag;

  const onSubmit = (values) => submitCallback(transformValues(values, relevanteStatuser, alleAndelerIForstePeriode, gjeldendeAksjonspunkter,
    allePerioder, harNyttIkkeSamletSammenligningsgrunnlag));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(state, ownProps),
  });
};

const BeregningForm2 = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BeregningFormImpl2));

export default BeregningForm2;
