import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Undertittel } from 'nav-frontend-typografi';
import { AksjonspunktHelpTextTemp, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { behandlingForm } from '@fpsak-frontend/fp-felles';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

import InntektsopplysningerPanel from '../fellesPaneler/InntektsopplysningerPanel';
import SkjeringspunktOgStatusPanel, { RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN } from '../fellesPaneler/SkjeringspunktOgStatusPanel';
import Beregningsgrunnlag, { TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING } from '../beregningsgrunnlagPanel/Beregningsgrunnlag';
import VurderOgFastsettSN from '../selvstendigNaeringsdrivende/VurderOgFastsettSN';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import GrunnlagForAarsinntektPanelAT from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import FastsettInntektTidsbegrenset from '../arbeidstaker/FastsettInntektTidsbegrenset';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

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

const findSammenligningsgrunnlagTekst = (relevanteStatuser) => {
  const tekster = [];
  if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
    tekster.push('Beregningsgrunnlag.Inntektsopplysninger.OppgittInntekt');
  } else {
    tekster.push('Beregningsgrunnlag.Inntektsopplysninger.Sammenligningsgrunnlag');
    tekster.push('Beregningsgrunnlag.Inntektsopplysninger.Sum12Mnd');
  }
  return tekster;
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
        <AksjonspunktHelpTextTemp isAksjonspunktOpen>
          { apneAksjonspunkt.map((ap) => (
            <FormattedMessage key={ap.definisjon.kode} id={findAksjonspunktHelpTekst(ap)} values={{ verdi: avvikProsent }} />
          ))}
        </AksjonspunktHelpTextTemp>
      )}
      { erDetMinstEttLukketAksjonspunkt && (
        <div>
          <VerticalSpacer sixteenPx />
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={false}>
            { lukkedeAksjonspunkt.map((ap) => (
              <FormattedMessage key={ap.definisjon.kode} id={findAksjonspunktHelpTekst(ap)} values={{ verdi: avvikProsent }} />
            ))}
          </AksjonspunktHelpTextTemp>
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
      ...Beregningsgrunnlag.buildInitialValues(gjeldendeAksjonspunkter),
      ...FastsettInntektTidsbegrenset.buildInitialValues(allePerioder),
      ...VurderOgFastsettSN.buildInitialValues(selvstendigNaeringAndeler, gjeldendeAksjonspunkter),
      ...GrunnlagForAarsinntektPanelFL.buildInitialValues(frilanserAndeler),
      ...GrunnlagForAarsinntektPanelAT.buildInitialValues(arbeidstakerAndeler),
      ...SkjeringspunktOgStatusPanel.buildInitialValues(gjeldendeDekningsgrad, gjeldendeAksjonspunkter),
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
    return aksjonspunkter.concat(GrunnlagForAarsinntektPanelAT.transformValues(values, relevanteStatuser, alleAndelerIForstePeriode));
  }
  if (harAksjonspunkt(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, gjeldendeAksjonspunkter)
    || harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return aksjonspunkter.concat(VurderOgFastsettSN.transformValues(values, gjeldendeAksjonspunkter));
  }
  if (harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD, gjeldendeAksjonspunkter)) {
    return aksjonspunkter.concat(Beregningsgrunnlag.transformValues(values, allePerioder));
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
export const BeregningFormImpl = ({
  readOnly,
  beregningsgrunnlag,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  ...formProps
}) => {
  const {
    dekningsgrad, skjaeringstidspunktBeregning,
    årsinntektVisningstall, beregningsgrunnlagPeriode, faktaOmBeregning,
  } = beregningsgrunnlag;
  const gjelderBesteberegning = gjelderBehandlingenBesteberegning(faktaOmBeregning);
  const sammenligningsgrunnlagSum = getSammenligningsgrunnlagSum(beregningsgrunnlag);
  const avvikProsent = getAvviksprosent(beregningsgrunnlag);
  return (
    <form onSubmit={formProps.handleSubmit}>
      <Undertittel>
        <FormattedMessage id="Beregningsgrunnlag.Title" />
      </Undertittel>
      { gjeldendeAksjonspunkter
        && (
        <ElementWrapper>
          <VerticalSpacer eightPx />
          { lagAksjonspunktViser(gjeldendeAksjonspunkter, avvikProsent)}
        </ElementWrapper>
        )}
      <Row>
        <Column xs="6">
          <InntektsopplysningerPanel
            beregnetAarsinntekt={årsinntektVisningstall}
            sammenligningsgrunnlag={sammenligningsgrunnlagSum}
            sammenligningsgrunnlagTekst={findSammenligningsgrunnlagTekst(relevanteStatuser)}
            avvik={avvikProsent}
          />
        </Column>
        <Column xs="6">
          <SkjeringspunktOgStatusPanel
            readOnly={readOnly}
            gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
            alleKodeverk={alleKodeverk}
            aktivitetStatusList={beregningsgrunnlag.aktivitetStatus}
            skjeringstidspunktDato={skjaeringstidspunktBeregning}
            gjeldendeDekningsgrad={dekningsgrad}
          />
        </Column>
      </Row>
      { relevanteStatuser.skalViseBeregningsgrunnlag && (
      <Beregningsgrunnlag
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

    </form>
  );
};

BeregningFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
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

const BeregningForm = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BeregningFormImpl));

export default BeregningForm;
