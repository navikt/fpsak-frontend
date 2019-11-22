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
import AvviksopplysningerPanel from '../fellesPaneler/AvvikopplysningerPanel';
import SkjeringspunktOgStatusPanel2, { RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN } from '../fellesPaneler/SkjeringspunktOgStatusPanel_V2';
import VurderOgFastsettSN2 from '../selvstendigNaeringsdrivende/VurderOgFastsettSN_V2';
import GrunnlagForAarsinntektPanelFL2 from '../frilanser/GrunnlagForAarsinntektPanelFL_V2';
import GrunnlagForAarsinntektPanelAT2 from '../arbeidstaker/GrunnlagForAarsinntektPanelAT_V2';
import AksjonsbehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import Beregningsgrunnlag2, { TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING } from '../beregningsgrunnlagPanel/Beregningsgrunnlag_V2';
import AksjonspunktBehandler from '../fellesPaneler/AksjonspunktBehandler';
import BeregningsresultatTable2 from '../beregningsresultatPanel/BeregningsresultatTable_V2';
import AksjonspunktHelpTextV2 from '../redesign/AksjonspunktHelpText_V2';
import AksjonspunktBehandlerAT from '../arbeidstaker/AksjonspunktBehandlerAT';

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
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  VURDER_DEKNINGSGRAD,
} = aksjonspunktCodes;

// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const gjelderBehandlingenBesteberegning = (faktaOmBeregning) => (faktaOmBeregning && faktaOmBeregning.faktaOmBeregningTilfeller
  ? faktaOmBeregning.faktaOmBeregningTilfeller.some((tilfelle) => tilfelle.kode === faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
  : false);

const findAksjonspunktHelpTekst = (gjeldendeAksjonspunkt) => {
  switch (gjeldendeAksjonspunkt.definisjon.kode) {
    case FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS:
      return 'Beregningsgrunnlag.Helptext.Arbeidstaker';
    case VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE:
      return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende';
    case FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD:
      return 'Beregningsgrunnlag.Helptext.TidsbegrensetArbeidsforhold';
    case FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET:
      return 'Beregningsgrunnlag.Helptext.NyIArbeidslivetSN';
    case VURDER_DEKNINGSGRAD:
      return 'Beregningsgrunnlag.Helptext.BarnetHarDødDeFørsteSeksUkene';
    default:
      return 'Beregningsgrunnlag.Helptext.Ukjent';
  }
};

const lagAksjonspunktViser = (gjeldendeAksjonspunkter, avvikProsent) => {
  if (gjeldendeAksjonspunkter === undefined || gjeldendeAksjonspunkter === null) {
    return undefined;
  }
  const vurderDekninsgradAksjonspunkt = gjeldendeAksjonspunkter.filter((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD);

  // Aksjonspunkt FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE håndteres sammen med andre og skal ikke ha egen tekst
  const andreAksjonspunkter = gjeldendeAksjonspunkter.filter((ap) => ap.definisjon.kode !== VURDER_DEKNINGSGRAD)
    .filter((ap) => ap.definisjon.kode !== FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE);

  const sorterteAksjonspunkter = vurderDekninsgradAksjonspunkt.concat(andreAksjonspunkter);
  const apneAksjonspunkt = sorterteAksjonspunkter.filter((ap) => isAksjonspunktOpen(ap.status.kode));
  const erDetMinstEttApentAksjonspunkt = apneAksjonspunkt.length > 0;
  const lukkedeAksjonspunkt = sorterteAksjonspunkter.filter((ap) => !isAksjonspunktOpen(ap.status.kode));
  const erDetMinstEttLukketAksjonspunkt = lukkedeAksjonspunkt.length > 0;
  return (
    <div>
      { erDetMinstEttApentAksjonspunkt && (
        <AksjonspunktHelpTextV2 isAksjonspunktOpen marginBottom>
          { apneAksjonspunkt.map((ap) => (
            <FormattedMessage key={ap.definisjon.kode} id={findAksjonspunktHelpTekst(ap)} values={{ verdi: avvikProsent }} />
          ))}
        </AksjonspunktHelpTextV2>
      )}
      { erDetMinstEttLukketAksjonspunkt && (
        <div>
          <VerticalSpacer sixteenPx />
          <AksjonspunktHelpTextV2 isAksjonspunktOpen={false}>
            { lukkedeAksjonspunkt.map((ap) => (
              <FormattedMessage key={ap.definisjon.kode} id={findAksjonspunktHelpTekst(ap)} values={{ verdi: avvikProsent }} />
            ))}
          </AksjonspunktHelpTextV2>
        </div>
      )}
    </div>
  );
};

const buildInitialValues = createSelector(
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
      ...AksjonsbehandlerTB.buildInitialValues(allePerioder),
      ...VurderOgFastsettSN2.buildInitialValues(selvstendigNaeringAndeler, gjeldendeAksjonspunkter),
      ...GrunnlagForAarsinntektPanelFL2.buildInitialValues(frilanserAndeler),
      ...GrunnlagForAarsinntektPanelAT2.buildInitialValues(arbeidstakerAndeler),
      ...SkjeringspunktOgStatusPanel2.buildInitialValues(gjeldendeDekningsgrad, gjeldendeAksjonspunkter),
    };
  },
);

const harAksjonspunkt = (aksjonspunktKode, gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter !== undefined && gjeldendeAksjonspunkter !== null
  && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktKode);

export const transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode, gjeldendeAksjonspunkter, allePerioder) => {
  const aksjonspunkter = [];
  const vurderDekningsgradAksjonspunkt = {
    kode: VURDER_DEKNINGSGRAD,
    begrunnelse: values[TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING],
    dekningsgrad: values[RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN],
  };
  if (harAksjonspunkt(VURDER_DEKNINGSGRAD, gjeldendeAksjonspunkter)) {
    aksjonspunkter.push(vurderDekningsgradAksjonspunkt);
  }
  if (harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS, gjeldendeAksjonspunkter)) {
    // todo: refactoreres til å bruke transform values from Aksjonspunkt behandler
    // return aksjonspunkter.concat(GrunnlagForAarsinntektPanelAT2.transformValues(values, relevanteStatuser, alleAndelerIForstePeriode));
    return aksjonspunkter.concat(AksjonspunktBehandlerAT.transformValues(values, relevanteStatuser, alleAndelerIForstePeriode));
  }
  if (harAksjonspunkt(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, gjeldendeAksjonspunkter)
    || harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return aksjonspunkter.concat(VurderOgFastsettSN2.transformValues(values, gjeldendeAksjonspunkter));
  }
  if (harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD, gjeldendeAksjonspunkter)) {
    return aksjonspunkter.concat(Beregningsgrunnlag2.transformValues(values, allePerioder));
  }
  return aksjonspunkter;
};

const getSammenligningsgrunnlagSum = (bg) => (bg.sammenligningsgrunnlag ? bg.sammenligningsgrunnlag.rapportertPrAar : undefined);

const getAvviksprosent = (beregningsgrunnlag) => {
  if (!beregningsgrunnlag.sammenligningsgrunnlag) {
    return undefined;
  }
  const { avvikPromille } = beregningsgrunnlag.sammenligningsgrunnlag;
  if (avvikPromille || avvikPromille === 0) {
    return avvikPromille / 10;
  }
  return undefined;
};
const getStatusList = (beregningsgrunnlagPeriode) => {
  const statusList = beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel.map((statusAndel) => statusAndel.aktivitetStatus);
  return statusList;
};
const harPerioderMedAvsluttedeArbeidsforhold = (allePerioder, gjeldendeAksjonspunkter) => allePerioder.some(({ periodeAarsaker }) => periodeAarsaker
  && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET))
  && gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);


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
  const avvikProsent = getAvviksprosent(beregningsgrunnlag);
  const aktivitetStatusList = getStatusList(beregningsgrunnlagPeriode);
  const tidsBegrensetInntekt = harPerioderMedAvsluttedeArbeidsforhold(beregningsgrunnlagPeriode, gjeldendeAksjonspunkter);

  return (
    <form onSubmit={formProps.handleSubmit}>

      { gjeldendeAksjonspunkter
        && (
        <ElementWrapper>
          <VerticalSpacer eightPx />
          { lagAksjonspunktViser(gjeldendeAksjonspunkter, avvikProsent)}
        </ElementWrapper>
        )}
      <Row>
        <Column xs="12" md="6">
          <Undertittel>
            <FormattedMessage id="Beregningsgrunnlag.Title.Beregning" />
          </Undertittel>
        </Column>
        <Column xs="12" md="6">
          <Undertittel>
            <FormattedMessage id="Beregningsgrunnlag.Title.Fastsettelse" />
          </Undertittel>
        </Column>
      </Row>
      <Row>
        <Column xs="12" md="6">
          <SkjeringspunktOgStatusPanel2
            readOnly={readOnly}
            gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
            alleKodeverk={alleKodeverk}
            aktivitetStatusList={aktivitetStatusList}
            skjeringstidspunktDato={skjaeringstidspunktBeregning}
            gjeldendeDekningsgrad={dekningsgrad}
          />
          { relevanteStatuser.skalViseBeregningsgrunnlag && (
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
          )}
        </Column>
        <Column xs="12" md="6">
          <AvviksopplysningerPanel
            beregnetAarsinntekt={årsinntektVisningstall}
            sammenligningsgrunnlag={sammenligningsgrunnlagSum}
            avvik={avvikProsent}
            relevanteStatuser={relevanteStatuser}
            allePerioder={beregningsgrunnlagPeriode}
          />
          {gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 0
          && (
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
          )}
          <BeregningsresultatTable2
            halvGVerdi={beregningsgrunnlag.halvG}
            beregningsgrunnlagPerioder={beregningsgrunnlag.beregningsgrunnlagPeriode}
            ledetekstBrutto={beregningsgrunnlag.ledetekstBrutto}
            ledetekstAvkortet={beregningsgrunnlag.ledetekstAvkortet}
            ledetekstRedusert={beregningsgrunnlag.ledetekstRedusert}
            vilkaarBG={vilkaarBG}
            aksjonspunkter={gjeldendeAksjonspunkter}
          />


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
  const onSubmit = (values) => submitCallback(transformValues(values, relevanteStatuser, alleAndelerIForstePeriode, gjeldendeAksjonspunkter, allePerioder));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(state, ownProps),
  });
};

const BeregningForm2 = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BeregningFormImpl2));

export default BeregningForm2;
