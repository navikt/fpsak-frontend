import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray } from 'redux-form';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { formatCurrencyNoKr, removeSpacesFromNumber } from 'utils/currencyUtils';
import BorderBox from 'sharedComponents/BorderBox';
import BrukersAndelFieldArray from './BrukersAndelFieldArray';
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
}) => (
  <BorderBox>
    <Element>
      <FormattedMessage id="KunYtelsePanel.Overskrift" />
    </Element>
    <FieldArray
      name={brukersAndelFieldArrayName}
      component={BrukersAndelFieldArray}
      readOnly={readOnly}
      formName={formName}
    />
  </BorderBox>
);

KunYtelsePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

KunYtelsePanel.buildInitialValues = (kunYtelse) => {
  if (!kunYtelse || !kunYtelse.andeler || kunYtelse.andeler.length === 0) {
    return {};
  }
  return {
    [brukersAndelFieldArrayName]: kunYtelse.andeler.map(andel => ({
      ...setGenerellAndelsinfo(andel),
      fastsattBeløp: andel.fastsattBelopPrMnd || andel.fastsattBelopPrMnd === 0
        ? formatCurrencyNoKr(andel.fastsattBelopPrMnd) : '',
    })),
  };
};


KunYtelsePanel.transformValues = values => ({
  kunYtelseFordeling: {
    andeler: values[brukersAndelFieldArrayName].map(fieldValue => ({
      andelsnr: fieldValue.andelsnr,
      fastsattBeløp: removeSpacesFromNumber(fieldValue.fastsattBeløp),
      inntektskategori: fieldValue.inntektskategori,
      nyAndel: fieldValue.nyAndel,
      lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    })),
  },
});

KunYtelsePanel.validate = (values, aktivertePaneler) => {
  if (!values || !aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)) {
    return {};
  }
  const errors = {};
  errors[brukersAndelFieldArrayName] = BrukersAndelFieldArray.validate(values[brukersAndelFieldArrayName]);
  return errors;
};


export default KunYtelsePanel;
