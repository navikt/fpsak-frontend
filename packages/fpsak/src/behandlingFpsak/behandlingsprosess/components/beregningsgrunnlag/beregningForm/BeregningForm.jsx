import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { behandlingForm } from 'behandlingFpsak/behandlingForm';
import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Undertittel } from 'nav-frontend-typografi';
import { VerticalSpacer, ElementWrapper, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingFpsak/behandlingsprosess/behandlingsprosessSelectors';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  getAlleAndelerIForstePeriode,
  getBeregningsgrunnlagPerioder,
  getGjeldendeBeregningAksjonspunkter,
  getGjeldendeDekningsgrad,
} from 'behandlingFpsak/behandlingSelectors';

import InntektsopplysningerPanel from '../fellesPaneler/InntektsopplysningerPanel';
import SkjeringspunktOgStatusPanel, { RADIO_GROUP_FIELD_DEKNINGSGRAD_NAVN } from '../fellesPaneler/SkjeringspunktOgStatusPanel';
import Beregningsgrunnlag, { TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING } from '../beregningsgrunnlagPanel/Beregningsgrunnlag';
import FastsettInntektTidsbegrenset from '../arbeidstaker/FastsettInntektTidsbegrenset';
import GrunnlagForAarsinntektPanelAT from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import FastsettNaeringsinntektSN from '../selvstendigNaeringsdrivende/FastsettNaeringsinntektSN';

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

const harAksjonspunkt = (aksjonspunktKode, gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter !== undefined && gjeldendeAksjonspunkter !== null
  && gjeldendeAksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktKode);

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
  const vurderDekninsgradAksjonspunkt = gjeldendeAksjonspunkter.filter(ap => ap.definisjon.kode === VURDER_DEKNINGSGRAD);
  const andreAksjonspunkter = gjeldendeAksjonspunkter.filter(ap => ap.definisjon.kode !== VURDER_DEKNINGSGRAD);
  const sorterteAksjonspunkter = vurderDekninsgradAksjonspunkt.concat(andreAksjonspunkter);
  const apneAksjonspunkt = sorterteAksjonspunkter.filter(ap => isAksjonspunktOpen(ap.status.kode));
  const erDetMinstEttApentAksjonspunkt = apneAksjonspunkt.length > 0;
  const lukkedeAksjonspunkt = sorterteAksjonspunkter.filter(ap => !isAksjonspunktOpen(ap.status.kode));
  const erDetMinstEttLukketAksjonspunkt = lukkedeAksjonspunkt.length > 0;
  return (
    <div>
      { erDetMinstEttApentAksjonspunkt && (
        <AksjonspunktHelpText isAksjonspunktOpen>
          { apneAksjonspunkt.map(ap => (
            <FormattedMessage key={ap.definisjon.kode} id={findAksjonspunktHelpTekst(ap)} values={{ verdi: avvikProsent }} />
          ))}
        </AksjonspunktHelpText>
      )}
      { erDetMinstEttLukketAksjonspunkt && (
        <div>
          <VerticalSpacer sixteenPx />
          <AksjonspunktHelpText isAksjonspunktOpen={false}>
            { lukkedeAksjonspunkt.map(ap => (
              <FormattedMessage key={ap.definisjon.kode} id={findAksjonspunktHelpTekst(ap)} values={{ verdi: avvikProsent }} />
            ))}
          </AksjonspunktHelpText>
        </div>
      )}
    </div>
  );
};

const buildInitialValues = createSelector(
  [getAlleAndelerIForstePeriode, getSelectedBehandlingspunktAksjonspunkter, getGjeldendeBeregningAksjonspunkter,
    getBeregningsgrunnlagPerioder, getGjeldendeDekningsgrad],
  (alleAndelerIForstePeriode, aksjonspunkter, gjeldendeAksjonspunkter, allePerioder, gjeldendeDekningsgrad) => {
    const arbeidstakerAndeler = alleAndelerIForstePeriode.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
    const frilanserAndeler = alleAndelerIForstePeriode.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
    const selvstendigNaeringAndeler = alleAndelerIForstePeriode.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
    return {
      ...Beregningsgrunnlag.buildInitialValues(gjeldendeAksjonspunkter),
      ...FastsettInntektTidsbegrenset.buildInitialValues(allePerioder),
      ...GrunnlagForAarsinntektPanelAT.buildInitialValues(arbeidstakerAndeler),
      ...GrunnlagForAarsinntektPanelFL.buildInitialValues(frilanserAndeler),
      ...FastsettNaeringsinntektSN.buildInitialValues(selvstendigNaeringAndeler, gjeldendeAksjonspunkter),
      ...SkjeringspunktOgStatusPanel.buildInitialValues(gjeldendeDekningsgrad, gjeldendeAksjonspunkter),
    };
  },
);

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
    return aksjonspunkter.concat(FastsettNaeringsinntektSN.transformValues(values, gjeldendeAksjonspunkter));
  }
  if (harAksjonspunkt(FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD, gjeldendeAksjonspunkter)) {
    return aksjonspunkter.concat(Beregningsgrunnlag.transformValues(values, allePerioder));
  }
  return aksjonspunkter;
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
  gjeldendeAksjonspunkter,
  avvikProsent,
  beregnetAarsinntekt,
  sammenligningsgrunnlag,
  relevanteStatuser,
  submitCallback,
  readOnlySubmitButton,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <Undertittel>
      <FormattedMessage id="Beregningsgrunnlag.Title" />
    </Undertittel>
    { gjeldendeAksjonspunkter && (
      <ElementWrapper>
        <VerticalSpacer eightPx />
        { lagAksjonspunktViser(gjeldendeAksjonspunkter, avvikProsent)}
      </ElementWrapper>
    )}
    <Row>
      <Column xs="6">
        <InntektsopplysningerPanel
          beregnetAarsinntekt={beregnetAarsinntekt}
          sammenligningsgrunnlag={sammenligningsgrunnlag}
          sammenligningsgrunnlagTekst={findSammenligningsgrunnlagTekst(relevanteStatuser)}
          avvik={avvikProsent}
        />
      </Column>
      <Column xs="6">
        <SkjeringspunktOgStatusPanel
          readOnly={readOnly}
          gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
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
      />)}

  </form>
);

BeregningFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  avvikProsent: PropTypes.number,
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  relevanteStatuser: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

BeregningFormImpl.defaultProps = {
  avvikProsent: undefined,
  beregnetAarsinntekt: undefined,
  sammenligningsgrunnlag: undefined,
};

const mapStateToProps = (state, ownProps) => {
  const { gjeldendeAksjonspunkter, relevanteStatuser } = ownProps;
  const allePerioder = getBeregningsgrunnlagPerioder(state);
  const alleAndelerIForstePeriode = getAlleAndelerIForstePeriode(state);
  return {
    onSubmit: values => ownProps.submitCallback(
      transformValues(values, relevanteStatuser, alleAndelerIForstePeriode, gjeldendeAksjonspunkter, allePerioder),
    ),
    initialValues: buildInitialValues(state),
  };
};

const BeregningForm = connect(mapStateToProps)(behandlingForm({ form: formName })(BeregningFormImpl));

export default BeregningForm;
