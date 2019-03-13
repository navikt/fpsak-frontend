import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Normaltekst } from 'nav-frontend-typografi';
import { flatten, required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

/**
 * NyOppstartetFLForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for tilfelle VURDER_NYOPPSTARTET_FL som ber
 * bruker bestemme om en søker er nyoppstartet frilanser med en radioknapp.
 * Tilhørende tilfelle for å fastsette FL inntekt er FASTSETT_MAANEDSINNTEKT_FL.
 * Denne komponenten kan vise intektstabell under radioknappene dersom skalViseInntektstabell er satt
 */

export const erNyoppstartetFLField = 'NyoppstartetFLField';

const NyoppstartetFLForm = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <div>
    <Normaltekst>
      <FormattedMessage id={"'BeregningInfoPanel.VurderOgFastsettATFL.ErSokerNyoppstartetFL'"} />
    </Normaltekst>
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
  </div>
);

NyoppstartetFLForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

NyoppstartetFLForm.buildInitialValues = (beregningsgrunnlag) => {
  const initialValues = {};
  if (beregningsgrunnlag === undefined || beregningsgrunnlag.beregningsgrunnlagPeriode === undefined) {
    return initialValues;
  }
  const alleAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode
    .map(periode => periode.beregningsgrunnlagPrStatusOgAndel);
  const flAndeler = flatten(alleAndeler).filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
  if (flAndeler.length > 0) {
    initialValues[erNyoppstartetFLField] = flAndeler[0].erNyoppstartet;
  }
  return initialValues;
};

NyoppstartetFLForm.transformValues = (values, inntektPrMnd, faktaOmBeregning, fastsatteAndelsnr) => {
  if (!faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)) {
    return {};
  }
  if (!inntektPrMnd || inntektPrMnd.length === 0) {
    return ({
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL],
      vurderNyoppstartetFL: { erNyoppstartetFL: values[erNyoppstartetFLField] },
    });
  }
  const frilansField = inntektPrMnd
    .find(field => field.aktivitetStatus === aktivitetStatus.FRILANSER);
  if (!frilansField) {
    return ({
      faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL],
      vurderNyoppstartetFL: { erNyoppstartetFL: values[erNyoppstartetFLField] },
    });
  }
  fastsatteAndelsnr.push(frilansField.andelsnr);

  const inntekt = {
    fastsettMaanedsinntektFL: { maanedsinntekt: frilansField.fastsattBelop },
  };
  return {
    faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL],
    ...inntekt,
    vurderNyoppstartetFL: { erNyoppstartetFL: values[erNyoppstartetFLField] },
  };
};

export default NyoppstartetFLForm;
