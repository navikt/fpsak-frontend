import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import RenderBruttoBGFordelingFieldArray from './RenderBruttoBGFordelingFieldArray';
import {
  settAndelIArbeid, preutfyllInntektskategori, setArbeidsforholdInitialValues,
  setGenerellAndelsinfo,
} from '../BgFordelingUtils';

export const fordelingAvBruttoBGFieldArrayName = 'bruttoBGFordeling';

/**
 * FordelingAvBruttoBeregningsgrunnlagPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for avklaring av beregningsgrunnlag ved tilstøtende ytelse.
 */

const FordelingAvBruttoBeregningsgrunnlagPanel = ({
  readOnly,
  formName,
}) => (
  <div>
    <FieldArray
      name={fordelingAvBruttoBGFieldArrayName}
      component={RenderBruttoBGFordelingFieldArray}
      readOnly={readOnly}
      formName={formName}
    />
  </div>
);

FordelingAvBruttoBeregningsgrunnlagPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

const settBelopFraInntektsmelding = (andel, endretBGPeriode) => {
  if (!endretBGPeriode) {
    return null;
  }
  const andelerFraEndretBGDto = endretBGPeriode.endringBeregningsgrunnlagAndeler
    .filter(({ andelsnr }) => andel.andelsnr === andelsnr);
  return andelerFraEndretBGDto.length > 0 && andelerFraEndretBGDto[0].belopFraInntektsmelding !== null
    ? andelerFraEndretBGDto[0].belopFraInntektsmelding * 12 : null;
};

const settRefusjonskravFraInntektsmelding = (andel, endretBGPeriode) => {
  if (!endretBGPeriode) {
    return null;
  }
  const andelerFraEndretBGDto = endretBGPeriode.endringBeregningsgrunnlagAndeler
    .filter(({ andelsnr }) => andel.andelsnr === andelsnr);
  return andelerFraEndretBGDto.length > 0 ? andelerFraEndretBGDto[0].refusjonskravFraInntektsmelding * 12 : 0;
};

const settAndelIArbeidFraEndringBgPeriode = (andel, endretBGPeriode) => {
  if (!endretBGPeriode) {
    return settAndelIArbeid(andel.andelIArbeid);
  }
  const riktigAndelFraPeriode = endretBGPeriode.endringBeregningsgrunnlagAndeler.filter(({ andelsnr }) => andel.andelsnr === andelsnr);
  return riktigAndelFraPeriode.length === 0 ? settAndelIArbeid(andel.andelIArbeid) : settAndelIArbeid(riktigAndelFraPeriode[0].andelIArbeid);
};


FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues = (tilstotendeYtelse, endretBGPeriode) => {
  if (!tilstotendeYtelse || !tilstotendeYtelse.tilstøtendeYtelseAndeler) {
    return {};
  }
  return {
    [fordelingAvBruttoBGFieldArrayName]: tilstotendeYtelse.tilstøtendeYtelseAndeler.map(andel => ({
      ...setGenerellAndelsinfo(andel),
      ...setArbeidsforholdInitialValues(andel),
      skalKunneEndreRefusjon: endretBGPeriode && endretBGPeriode.skalKunneEndreRefusjon ? endretBGPeriode.skalKunneEndreRefusjon : false,
      fordelingForrigeYtelse: andel.lagtTilAvSaksbehandler === true ? '' : formatCurrencyNoKr(andel.fordelingForrigeYtelse),
      fastsattBeløp: andel.fastsattPrAar || andel.fastsattPrAar === 0
        ? formatCurrencyNoKr(andel.fastsattPrAar) : '',
      refusjonskrav: andel.refusjonskrav ? formatCurrencyNoKr(andel.refusjonskrav) : '0',
      inntektskategori: preutfyllInntektskategori(andel),
      andelIArbeid: settAndelIArbeidFraEndringBgPeriode(andel, endretBGPeriode),
      belopFraInntektsmelding: settBelopFraInntektsmelding(andel, endretBGPeriode),
      refusjonskravFraInntektsmelding: settRefusjonskravFraInntektsmelding(andel, endretBGPeriode),
    })),
  };
};

FordelingAvBruttoBeregningsgrunnlagPanel.validate = (values) => {
  if (!values) {
    return {};
  }
  const errors = {};
  errors[fordelingAvBruttoBGFieldArrayName] = RenderBruttoBGFordelingFieldArray.validate(values[fordelingAvBruttoBGFieldArrayName]);
  return errors;
};


export default FordelingAvBruttoBeregningsgrunnlagPanel;
