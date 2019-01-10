import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Normaltekst } from 'nav-frontend-typografi';
import { getFaktaOmBeregning } from 'behandlingFpsak/behandlingSelectors';
import { behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import { required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import faktaOmBeregningTilfelle, {
  erATFLSpesialtilfelleEllerVurderMottarYtelseUtenBesteberegning,
  harIkkeATFLSameOrgEllerBesteberegning,
} from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import FastsettATFLInntektForm
  from 'behandlingFpsak/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/FastsettATFLInntektForm';

import styles from './lonnsendringForm.less';

export const utledOverskriftForLonnsendringForm = (tilfeller, manglerIM) => {
  if (!tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  || erATFLSpesialtilfelleEllerVurderMottarYtelseUtenBesteberegning(tilfeller)) {
    return ['BeregningInfoPanel.VurderOgFastsettATFL.HarSokerEndring'];
  }
  return manglerIM
    ? ['BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM',
      'BeregningInfoPanel.VurderOgFastsettATFL.OgsaLonnsendring']
    : ['BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrg',
      'BeregningInfoPanel.VurderOgFastsettATFL.OgsaLonnsendring'];
};


/**
 * LonnsendringForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for tilfelle VURDER_LØNNSENDRING som ber
 * bruker fastsette lønnsendring for en liste med arbeidsforhold.
 * Tilhørende tilfelle for å fastsette FL inntekt er FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING.
 * Denne komponenten kan vise intektstabell under radioknappene dersom skalViseInntektstabell er satt
 */

export const lonnsendringField = 'lonnsendringField';

export const LonnsendringFormImpl = ({
  readOnly,
  isAksjonspunktClosed,
  skalViseInntektstabell,
  tilfeller,
  radioknappOverskrift,
  manglerIM,
  erLonnsendring,
  skalKunFastsetteAT,
  formName,
}) => (
  <div>
    {radioknappOverskrift.map(kode => (
      <div key={kode}>
        <Normaltekst>
          <FormattedMessage id={kode} />
        </Normaltekst>
      </div>
    ))
      }
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={lonnsendringField}
      validate={[required]}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
    { skalViseInntektstabell
      && (
      <Row>
        <Column xs="12">
          <div className={erLonnsendring ? styles.arrowLineLonnsendring : styles.arrowLineIngenLonnsendring}>
            <FastsettATFLInntektForm
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed}
              tilfellerSomSkalFastsettes={tilfeller}
              manglerInntektsmelding={manglerIM}
              skalViseFL={!skalKunFastsetteAT}
              skalViseAT
              formName={formName}
            />
          </div>
        </Column>
      </Row>
      )
      }
  </div>
);

LonnsendringFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalViseInntektstabell: PropTypes.bool,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  radioknappOverskrift: PropTypes.arrayOf(PropTypes.string).isRequired,
  manglerIM: PropTypes.bool.isRequired,
  erLonnsendring: PropTypes.bool,
  skalKunFastsetteAT: PropTypes.bool,
  formName: PropTypes.string.isRequired,
};

LonnsendringFormImpl.defaultProps = {
  skalViseInntektstabell: undefined,
  erLonnsendring: undefined,
  skalKunFastsetteAT: false,
};

LonnsendringFormImpl.buildInitialValues = (beregningsgrunnlag) => {
  let initialValues = {};
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return initialValues;
  }
  const alleAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel;
  if (!alleAndeler || alleAndeler.length < 1) {
    return initialValues;
  }
  const alleATAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  if (!alleATAndeler || alleATAndeler.length < 1) {
    return initialValues;
  }
  // Alle andeler vil ha den samme verdien, trenger derfor kun sjekke første element
  initialValues = {
    lonnsendringField: alleATAndeler[0].lonnsendringIBeregningsperioden,
  };
  return initialValues;
};

LonnsendringFormImpl.transformValues = values => ({
  vurdertLonnsendring: { erLønnsendringIBeregningsperioden: values[lonnsendringField] },
});

LonnsendringFormImpl.lonnendringFastsatt = (values, tilfeller, faktaOmBeregning, transformedValues) => {
  // Dersom vi har tilfellet VURDER_AT_OG_FL_I_SAMME_ORGANISASJON
  // eller FASTSETT_BESTEBEREGNING_FODENDE_KVINNE vil arbeidsinntekt tas med når det tilfellet submittes
  if (values[lonnsendringField] && harIkkeATFLSameOrgEllerBesteberegning(tilfeller)) {
    if (!transformedValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)) {
      transformedValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING);
      return {
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING),
        faktaOmBeregningTilfeller: transformedValues.faktaOmBeregningTilfeller,
      };
    }
    if (!transformedValues.fastsatteLonnsendringer) {
      return {
        ...FastsettATFLInntektForm.transformValues(values, faktaOmBeregning, faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING),
      };
    }
  }
  return {};
};

const mapStateToProps = (state, initialProps) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  return {
    erLonnsendring: behandlingFormValueSelector(initialProps.formName)(state, lonnsendringField),
    radioknappOverskrift: utledOverskriftForLonnsendringForm(initialProps.tilfeller, manglerInntektsmelding),
  };
};

export default connect(mapStateToProps)(LonnsendringFormImpl);
