import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from 'form/Fields';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import { Normaltekst } from 'nav-frontend-typografi';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { flatten } from 'utils/arrayUtils';
import FastsettATFLInntektForm
  from 'fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/FastsettATFLInntektForm';

import styles from './nyoppstartetFLForm.less';

const {
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, FASTSETT_BESTEBEREGNING_FODENDE_KVINNE, TILSTOTENDE_YTELSE,
} = faktaOmBeregningTilfelle;

export const utledOverskriftForNyoppstartetFLForm = (tilfeller, manglerIM) => {
  if (!tilfeller.includes(VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return ['BeregningInfoPanel.VurderOgFastsettATFL.ErSokerNyoppstartetFL'];
  }
  return manglerIM
    ? ['BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM',
      'BeregningInfoPanel.VurderOgFastsettATFL.OgsaNyoppstartetFL']
    : ['BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrg',
      'BeregningInfoPanel.VurderOgFastsettATFL.OgsaNyoppstartetFL'];
};

/**
 * NyOppstartetFLForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for tilfelle VURDER_NYOPPSTARTET_FL som ber
 * bruker bestemme om en søker er nyoppstartet frilanser med en radioknapp.
 * Tilhørende tilfelle for å fastsette FL inntekt er FASTSETT_MAANEDSINNTEKT_FL.
 * Denne komponenten kan vise intektstabell under radioknappene dersom skalViseInntektstabell er satt
 */

export const erNyoppstartetFLField = 'NyoppstartetFLField';

const utledTabellstil = (tilfeller, erNyoppstartetFL) => {
  if (tilfeller.includes(VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return erNyoppstartetFL ? styles.arrowLineNyoppstartetFL : styles.arrowLineIkkeNyoppstartetFL;
  } return styles.arrowLineSmal;
};

export const NyoppstartetFLFormImpl = ({
  readOnly,
  isAksjonspunktClosed,
  skalViseInntektstabell,
  tilfeller,
  radioknappOverskrift,
  manglerIM,
  erNyoppstartetFL,
  skalKunFastsetteFL,
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
      name={erNyoppstartetFLField}
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
          <div className={utledTabellstil(tilfeller, erNyoppstartetFL)}>
            <FastsettATFLInntektForm
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed}
              tilfellerSomSkalFastsettes={tilfeller}
              manglerInntektsmelding={manglerIM}
              skalFastsetteAT={!skalKunFastsetteFL}
              skalFastsetteFL
            />
          </div>
        </Column>
      </Row>
      )
      }
  </div>
);

NyoppstartetFLFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  radioknappOverskrift: PropTypes.arrayOf(PropTypes.string).isRequired,
  skalViseInntektstabell: PropTypes.bool,
  erNyoppstartetFL: PropTypes.bool,
  manglerIM: PropTypes.bool.isRequired,
  skalKunFastsetteFL: PropTypes.bool,
};

NyoppstartetFLFormImpl.defaultProps = {
  skalViseInntektstabell: undefined,
  erNyoppstartetFL: undefined,
  skalKunFastsetteFL: false,
};

NyoppstartetFLFormImpl.buildInitialValues = (beregningsgrunnlag) => {
  const initialValues = {};
  if (beregningsgrunnlag === undefined || beregningsgrunnlag.beregningsgrunnlagPeriode === undefined) {
    return initialValues;
  }
  const alleAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode
    .map(periode => periode.beregningsgrunnlagPrStatusOgAndel);
  const flAndeler = flatten(alleAndeler).filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
  if (flAndeler.length > 0) {
    initialValues[erNyoppstartetFLField] = flAndeler[0].erNyoppstartetEllerSammeOrganisasjon;
  }
  return initialValues;
};

const tilfellerSomHandtererAllInntekt = [FASTSETT_BESTEBEREGNING_FODENDE_KVINNE, VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, TILSTOTENDE_YTELSE];

const harIkkeTilfelleSomHandtererInntekt = tilfeller => !tilfeller.some(tilfelle => tilfellerSomHandtererAllInntekt.includes(tilfelle));

NyoppstartetFLFormImpl.transformValues = values => ({
  vurderNyoppstartetFL: { erNyoppstartetFL: values[erNyoppstartetFLField] },
});

NyoppstartetFLFormImpl.nyOppstartetFLInntekt = (values, tilfeller, vurderFaktaValues) => {
  // Dersom vi har tilfellet VURDER_AT_OG_FL_I_SAMME_ORGANISASJON
  // eller FASTSETT_BESTEBEREGNING_FODENDE_KVINNE vil frilansinntekt tas med når det tilfellet submittes
  if (values[erNyoppstartetFLField] && harIkkeTilfelleSomHandtererInntekt(tilfeller)) {
    if (!vurderFaktaValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL);
      return {
        ...FastsettATFLInntektForm.transformValues(values, undefined, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL),
        faktaOmBeregningTilfeller: vurderFaktaValues.faktaOmBeregningTilfeller,
      };
    }
    return {
      ...FastsettATFLInntektForm.transformValues(values, undefined, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL),
    };
  }
  if (vurderFaktaValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)) {
    tilfeller.splice(tilfeller.indexOf(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL), 1);
    return {
      faktaOmBeregningTilfeller: tilfeller,
      ...FastsettATFLInntektForm.eraseValuesFL(),
    };
  }
  return {
    ...FastsettATFLInntektForm.eraseValuesFL(),
  };
};

const mapStateToProps = (state, initialProps) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  let manglerInntektsmelding = false;
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe && faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  return {
    manglerInntektsmelding,
    erNyoppstartetFL: behandlingFormValueSelector(initialProps.formName)(state, erNyoppstartetFLField),
    radioknappOverskrift: utledOverskriftForNyoppstartetFLForm(initialProps.tilfeller, manglerInntektsmelding),
  };
};

export default connect(mapStateToProps)(NyoppstartetFLFormImpl);
