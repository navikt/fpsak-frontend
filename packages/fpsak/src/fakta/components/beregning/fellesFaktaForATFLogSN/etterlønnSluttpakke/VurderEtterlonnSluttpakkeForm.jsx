import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField, RadioOption } from 'form/Fields';
import { Column, Row } from 'nav-frontend-grid';
import { required } from 'utils/validation/validators';
import OAType from 'kodeverk/opptjeningAktivitetType';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { connect } from 'react-redux';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import FastsettEtterlonnSluttpakkeForm from './FastsettEtterlonnSluttpakkeForm';
import styles from './vurderEtterlonnSluttpakkeForm.less';

/**
 * VurderEtterlønnSluttpakkeForm
 *
 * Presentasjonskomponent. Setter opp fakta om beregning tilfelle VURDER_ETTERLØNN_SLUTTPAKKE som ber
 * saksbehandler bestemme om en søker har inntekt fra etterlønn eller sluttpakke.
 */
const harEtterlonnSluttpakkeField = 'vurderEtterlønnSluttpakke';

const VurderEtterlonnSluttpakkeForm = ({
  readOnly,
  isAksjonspunktClosed,
  harEtterlonnSluttpakke,
}) => (
  <div>
    <RadioGroupField
      name={harEtterlonnSluttpakkeField}
      validate={[required]}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
      label={<FormattedMessage id="BeregningInfoPanel.EtterlønnSluttpakke.HarSøkerInntekt" />}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
    {harEtterlonnSluttpakke && harEtterlonnSluttpakke
    && (
      <Row>
        <Column xs="12">
          <div className={styles.arrowLineEtterlonnSluttpakke}>
            <FastsettEtterlonnSluttpakkeForm
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed}
            />
          </div>
        </Column>
      </Row>
    )
    }
  </div>
);

VurderEtterlonnSluttpakkeForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  harEtterlonnSluttpakke: PropTypes.bool.isRequired,
};

const {
  FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, FASTSETT_BESTEBEREGNING_FODENDE_KVINNE,
} = faktaOmBeregningTilfelle;

const tilfellerSomHandtererAllInntekt = [FASTSETT_BESTEBEREGNING_FODENDE_KVINNE,
  FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];

const harIkkeTilfelleSomHandtererInntekt = tilfeller => !tilfeller.some(tilfelle => tilfellerSomHandtererAllInntekt.includes(tilfelle));

VurderEtterlonnSluttpakkeForm.buildInitialValues = (beregningsgrunnlag, faktaAksjonspunkt) => {
  const initialValues = {};
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode || !faktaAksjonspunkt) {
    return initialValues;
  }
  const apErTidligereLost = !isAksjonspunktOpen(faktaAksjonspunkt.status.kode);
  const relevanteAndeler = beregningsgrunnlag.beregningsgrunnlagPeriode
    .flatMap(periode => periode.beregningsgrunnlagPrStatusOgAndel)
    .filter(({ arbeidsforhold }) => arbeidsforhold
  && arbeidsforhold.arbeidsforholdType.kode === OAType.ETTERLONN_SLUTTPAKKE);
  if (relevanteAndeler.length > 0) {
    initialValues[harEtterlonnSluttpakkeField] = apErTidligereLost ? relevanteAndeler[0].beregnetPrAar > 0 : undefined;
  }
  return initialValues;
};

VurderEtterlonnSluttpakkeForm.etterlonnSluttpakkeInntekt = (values, tilfeller, vurderFaktaValues) => {
  if (values[harEtterlonnSluttpakkeField] && harIkkeTilfelleSomHandtererInntekt(tilfeller)) {
    if (!vurderFaktaValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ETTERLONN_SLUTTPAKKE)) {
      vurderFaktaValues.faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_ETTERLONN_SLUTTPAKKE);
      return {
        ...FastsettEtterlonnSluttpakkeForm.transformValues(values),
        faktaOmBeregningTilfeller: vurderFaktaValues.faktaOmBeregningTilfeller,
      };
    }
    return {
      ...FastsettEtterlonnSluttpakkeForm.transformValues(values),
    };
  }
  if (vurderFaktaValues.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ETTERLØNN_SLUTTPAKKE)) {
    tilfeller.splice(tilfeller.indexOf(faktaOmBeregningTilfelle.FASTSETT_ETTERLØNN_SLUTTPAKKE), 1);
    return {
      faktaOmBeregningTilfeller: tilfeller,
      ...FastsettEtterlonnSluttpakkeForm.eraseValues(),
    };
  }
  return {
    ...FastsettEtterlonnSluttpakkeForm.eraseValues(),
  };
};

VurderEtterlonnSluttpakkeForm.transformValues = values => ({
  vurderEtterlønnSluttpakke: { erEtterlønnSluttpakke: values[harEtterlonnSluttpakkeField] },
});

const mapStateToProps = (state, initialProps) => ({
  harEtterlonnSluttpakke: behandlingFormValueSelector(initialProps.formName)(state, harEtterlonnSluttpakkeField),
});

export default connect(mapStateToProps)(VurderEtterlonnSluttpakkeForm);
