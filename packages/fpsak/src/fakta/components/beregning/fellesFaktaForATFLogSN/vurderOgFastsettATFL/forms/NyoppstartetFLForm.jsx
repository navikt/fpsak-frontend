import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { RadioOption, RadioGroupField } from 'form/Fields';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import { Normaltekst } from 'nav-frontend-typografi';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Row, Column } from 'nav-frontend-grid';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { flatten } from 'utils/arrayUtils';
import FastsettATFLInntektForm
  from 'fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/FastsettATFLInntektForm';

import styles from './nyoppstartetFLForm.less';

const bestemTilfellerSomSkalFastsettes = tilfeller => (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  ? [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL]
  : [faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL]);

export const utledOverskriftForNyoppstartetFLForm = (tilfeller, manglerIM) => {
  if (!tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
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
  if (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
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
              tilfellerSomSkalFastsettes={bestemTilfellerSomSkalFastsettes(tilfeller)}
              manglerInntektsmelding={manglerIM}
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
};

NyoppstartetFLFormImpl.defaultProps = {
  skalViseInntektstabell: undefined,
  erNyoppstartetFL: undefined,
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

const harIkkeATFLSameOrgEllerBesteberegningEllerTY = tilfeller => !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
  && !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON) && !tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE);

NyoppstartetFLFormImpl.transformValues = values => ({
  vurderNyoppstartetFL: { erNyoppstartetFL: values[erNyoppstartetFLField] },
});

NyoppstartetFLFormImpl.nyOppstartetFLInntekt = (values, tilfeller) => {
  // Dersom vi har tilfellet VURDER_AT_OG_FL_I_SAMME_ORGANISASJON
  // eller FASTSETT_BESTEBEREGNING_FODENDE_KVINNE
  // eller TILSTOTENDE_YTELSE vil frilansinntekt tas med når det tilfellet submittes
  if (values[erNyoppstartetFLField] && harIkkeATFLSameOrgEllerBesteberegningEllerTY(tilfeller)) {
    if (!tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)) {
      return {
        ...FastsettATFLInntektForm.transformValues(values, undefined, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL),
        faktaOmBeregningTilfeller: tilfeller.concat([faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL]),
      };
    }
    return {
      ...FastsettATFLInntektForm.transformValues(values, undefined, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL),
    };
  }
  if (tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)) {
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
  if (faktaOmBeregning.atogFLISammeOrganisasjonListe && faktaOmBeregning.atogFLISammeOrganisasjonListe.length > 0) {
    manglerInntektsmelding = faktaOmBeregning.atogFLISammeOrganisasjonListe.find(forhold => !forhold.inntektPrMnd) !== undefined;
  }
  return {
    erNyoppstartetFL: behandlingFormValueSelector(initialProps.formName)(state, erNyoppstartetFLField),
    manglerInntektsmelding,
    radioknappOverskrift: utledOverskriftForNyoppstartetFLForm(initialProps.tilfeller, manglerInntektsmelding),
  };
};

export default connect(mapStateToProps)(NyoppstartetFLFormImpl);
