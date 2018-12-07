import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { getKunYtelse } from 'behandlingFpsak/behandlingSelectors';
import { formatCurrencyNoKr, removeSpacesFromNumber } from 'utils/currencyUtils';
import BrukersAndelFieldArray from './BrukersAndelFieldArray';
import KunYtelseBesteberegningPanel from './KunYtelseBesteberegningPanel';
import KunYtelseUtenBesteberegningPanel from './KunYtelseUtenBesteberegningPanel';
import { setGenerellAndelsinfo } from '../BgFordelingUtils';

export const brukersAndelFieldArrayName = 'brukersAndelBG';

/**
 * KunYtelsePanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for kun ytelse.
 */

const KunYtelsePanel = ({
  readOnly,
  formName,
  skalSjekkeBesteberegning,
  isAksjonspunktClosed,
}) => (
  <div>
    {skalSjekkeBesteberegning
    && (
      <KunYtelseBesteberegningPanel
        readOnly={readOnly}
        formName={formName}
        isAksjonspunktClosed={isAksjonspunktClosed}
        brukersAndelFieldArrayName={brukersAndelFieldArrayName}
      />
    )
    }
    {!skalSjekkeBesteberegning
    && (
      <KunYtelseUtenBesteberegningPanel
        readOnly={readOnly}
        formName={formName}
        brukersAndelFieldArrayName={brukersAndelFieldArrayName}
      />
    )
    }
  </div>
);

KunYtelsePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalSjekkeBesteberegning: PropTypes.bool.isRequired,
};

KunYtelsePanel.buildInitialValues = (kunYtelse) => {
  if (!kunYtelse || !kunYtelse.andeler || kunYtelse.andeler.length === 0) {
    return {};
  }
  const initialValues = {
    [brukersAndelFieldArrayName]: kunYtelse.andeler.map(andel => ({
      ...setGenerellAndelsinfo(andel),
      fastsattBeløp: andel.fastsattBelopPrMnd || andel.fastsattBelopPrMnd === 0
        ? formatCurrencyNoKr(andel.fastsattBelopPrMnd) : '',
    })),
  };
  if (kunYtelse.fodendeKvinneMedDP) {
    return {
      ...KunYtelseBesteberegningPanel.buildInitialValues(kunYtelse),
      ...initialValues,
    };
  }
  return initialValues;
};


KunYtelsePanel.transformValues = (values, kunYtelse) => ({
  kunYtelseFordeling: {
    andeler: values[brukersAndelFieldArrayName].map(fieldValue => ({
      andelsnr: fieldValue.andelsnr,
      fastsattBeløp: removeSpacesFromNumber(fieldValue.fastsattBeløp),
      inntektskategori: fieldValue.inntektskategori,
      nyAndel: fieldValue.nyAndel,
      lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    })),
    skalBrukeBesteberegning: kunYtelse.fodendeKvinneMedDP
      ? KunYtelseBesteberegningPanel.transformValues(values) : null,
  },
});

KunYtelsePanel.validate = (values, aktivertePaneler, kunYtelse) => {
  if (!values || !aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return {};
  }
  const errors = {};
  errors[brukersAndelFieldArrayName] = BrukersAndelFieldArray.validate(values[brukersAndelFieldArrayName]);
  if (kunYtelse.fodendeKvinneMedDP) {
    return {
      ...errors,
      ...KunYtelseBesteberegningPanel.validate(values),
    };
  }
  return errors;
};

const mapStateToProps = (state) => {
  const kunYtelse = getKunYtelse(state);
  return {
    skalSjekkeBesteberegning: kunYtelse.fodendeKvinneMedDP,
  };
};

export default connect(mapStateToProps)(KunYtelsePanel);
