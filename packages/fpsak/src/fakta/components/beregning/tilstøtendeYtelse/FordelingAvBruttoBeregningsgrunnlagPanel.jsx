import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import inntektskategorier from 'kodeverk/inntektskategorier';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import RenderBruttoBGFordelingFieldArray from './RenderBruttoBGFordelingFieldArray';

export const fordelingAvBruttoBGFieldArrayName = 'bruttoBGFordeling';

/**
 * FordelingAvBruttoBeregningsgrunnlagPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for avklaring av beregningsgrunnlag ved tilstøtende ytelse.
 */

const FordelingAvBruttoBeregningsgrunnlagPanel = ({
  readOnly,
}) => (
  <div>
    <FieldArray
      name={fordelingAvBruttoBGFieldArrayName}
      component={RenderBruttoBGFordelingFieldArray}
      readOnly={readOnly}
    />
  </div>
);

FordelingAvBruttoBeregningsgrunnlagPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
};


export const createAndelnavn = (andel, aktivitetstatuskoder) => {
  if (andel.arbeidsforhold !== undefined && andel.arbeidsforhold !== null) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold);
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.UDEFINERT) {
    return '';
  }
  return aktivitetstatuskoder.filter(ik => ik.kode === andel.aktivitetStatus.kode)[0].navn;
};

const preutfyllInntektskategori = andel => (andel.inntektskategori
&& andel.inntektskategori.kode !== inntektskategorier.UDEFINERT ? andel.inntektskategori.kode : '');


FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues = (tilstotendeYtelse, aktivitetstatuskoder) => {
  if (!tilstotendeYtelse || !tilstotendeYtelse.tilstøtendeYtelseAndeler) {
    return {};
  }

  return {
    [fordelingAvBruttoBGFieldArrayName]: tilstotendeYtelse.tilstøtendeYtelseAndeler.map(andel => ({
      andel: createAndelnavn(andel, aktivitetstatuskoder),
      andelsnr: andel.andelsnr,
      arbeidsforholdId: andel.arbeidsforhold ? andel.arbeidsforhold.arbeidsforholdId : '',
      arbeidsperiodeFom: andel.arbeidsforhold ? andel.arbeidsforhold.startdato : '',
      arbeidsperiodeTom: andel.arbeidsforhold && andel.arbeidsforhold.opphoersdato !== null
        ? andel.arbeidsforhold.opphoersdato : '',
      fordelingForrigeYtelse: andel.lagtTilAvSaksbehandler === true ? '' : formatCurrencyNoKr(andel.fordelingForrigeYtelse),
      fastsattBeløp: formatCurrencyNoKr(andel.fastsattPrAar),
      refusjonskrav: formatCurrencyNoKr(andel.refusjonskrav),
      inntektskategori: preutfyllInntektskategori(andel),
      nyAndel: false,
      andelIArbeid: andel.andelIArbeid,
      lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler,
    })),
  };
};

export default FordelingAvBruttoBeregningsgrunnlagPanel;
