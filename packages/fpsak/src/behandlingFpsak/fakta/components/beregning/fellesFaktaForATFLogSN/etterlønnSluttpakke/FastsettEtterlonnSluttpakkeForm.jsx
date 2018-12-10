import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { required } from 'utils/validation/validators';
import OAType from 'kodeverk/opptjeningAktivitetType';
import { InputField } from 'form/Fields';
import { parseCurrencyInput, formatCurrencyNoKr, removeSpacesFromNumber } from 'utils/currencyUtils';

/**
 * FastsettEtterlønnSluttpakkeForm
 *
 * Presentasjonskomponent. Setter opp fakta om beregning tilfelle FASTSETT_ETTERLØNN_SLUTTPAKKE som ber
 * saksbehandler fastsette månedsinntekt fra etterlønn eller sluttpakke.
 */

const etterlonnSluttpakkeFieldname = 'inntektEtterlønnSluttpakke';

const FastsettEtterlonnSluttpakkeForm = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <div>
    <Normaltekst>
      <FormattedMessage id="BeregningInfoPanel.EtterlønnSluttpakke.Månedsinntekt" />
    </Normaltekst>
    <div>
      <InputField
        name={etterlonnSluttpakkeFieldname}
        bredde="S"
        validate={[required]}
        parse={parseCurrencyInput}
        isEdited={isAksjonspunktClosed}
        readOnly={readOnly}
      />
    </div>
  </div>
);

FastsettEtterlonnSluttpakkeForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

FastsettEtterlonnSluttpakkeForm.buildInitialValues = (beregningsgrunnlag) => {
  const initialValues = {};
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return initialValues;
  }
  const relevanteAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode
    .flatMap(periode => periode.beregningsgrunnlagPrStatusOgAndel)
    .filter(({ arbeidsforhold }) => arbeidsforhold
  && arbeidsforhold.arbeidsforholdType.kode === OAType.ETTERLONN_SLUTTPAKKE);
  if (relevanteAndeler.length > 0) {
    const tidligereBeregnetPrÅr = relevanteAndeler[0].beregnetPrAar;
    const tidligereBeregnetPrMnd = tidligereBeregnetPrÅr === undefined || tidligereBeregnetPrÅr === null ? undefined : tidligereBeregnetPrÅr / 12;
    initialValues[etterlonnSluttpakkeFieldname] = tidligereBeregnetPrMnd === undefined || tidligereBeregnetPrMnd === null
      ? '' : formatCurrencyNoKr(tidligereBeregnetPrMnd);
  }
  return initialValues;
};

FastsettEtterlonnSluttpakkeForm.transformValues = values => ({
  fastsettEtterlønnSluttpakke: { fastsattPrMnd: removeSpacesFromNumber(values[etterlonnSluttpakkeFieldname]) },
});

FastsettEtterlonnSluttpakkeForm.eraseValues = () => ({
  fastsettEtterlønnSluttpakke: null,
});


export default FastsettEtterlonnSluttpakkeForm;
