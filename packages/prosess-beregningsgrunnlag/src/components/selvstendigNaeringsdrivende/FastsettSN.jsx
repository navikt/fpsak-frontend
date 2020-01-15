import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  hasValidText, maxLength, minLength, parseCurrencyInput, removeSpacesFromNumber, required, formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import {
  TextAreaField, InputField,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import styles from './fastsettSN.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);
export const begrunnelseFieldname = 'fastsettBeregningsgrnunnlagSNBegrunnelse';
export const fastsettInntektFieldname = 'bruttoBeregningsgrunnlag';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

/**
 * FastsettSN
 *
 * Aksjonspunkt: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE
 *
 * Presentasjonskomponent. Setter opp inputfelt som lar saksbehandler fastsette
 * næringsinntekt for selvstendig næringsdrivende. Opprettes enten hvis det er varig endret / nyoppstartet næring eller søker er ny i arbeidslivet.
 */
const FastsettSN = ({
  readOnly,
  isAksjonspunktClosed,
  gjeldendeAksjonspunkter,
}) => {
  const harGammeltAPFastsettBrutto = gjeldendeAksjonspunkter
    ? gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE)
    : false;
  const harAPSNNyiArbLiv = gjeldendeAksjonspunkter
    ? gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET)
    : false;
  return (
    <>
      {(harGammeltAPFastsettBrutto || harAPSNNyiArbLiv)
    && (
    <Row>
      <Column xs="11" className={styles.marginTop}>
        <TextAreaField
          name={begrunnelseFieldname}
          label={<FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />}
          validate={[required, maxLength1500, minLength3, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
        />
      </Column>
    </Row>
    )}
      <Row>
        <Column xs="12" className={styles.rightAlignInput}>
          <InputField
            name={fastsettInntektFieldname}
            label={{ id: 'Beregningsgrunnlag.FastsettSelvstendigNaeringForm.BruttoBerGr' }}
            bredde="S"
            validate={[required]}
            parse={parseCurrencyInput}
            isEdited={isAksjonspunktClosed}
            readOnly={readOnly}
          />
        </Column>
      </Row>
    </>
  );
};

FastsettSN.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
};

FastsettSN.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => {
  if (relevanteAndeler.length === 0 || !gjeldendeAksjonspunkter || gjeldendeAksjonspunkter.length === 0) {
    return undefined;
  }

  const snAndel = relevanteAndeler.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);

  // Vi vil kun ha et av disse aksjonspunktene om gangen
  const fastsettBruttoEtterVarigEndring = gjeldendeAksjonspunkter
    .find((ap) => ap.definisjon.kode === FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE);
  const fastsettBruttoNyIArbeidslivet = gjeldendeAksjonspunkter
    .find((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET);
  const gjeldendeAP = fastsettBruttoEtterVarigEndring || fastsettBruttoNyIArbeidslivet;

  if (gjeldendeAP || (snAndel.overstyrtPrAar || snAndel.overstyrtPrAar === 0)) {
    return {
      [fastsettInntektFieldname]: snAndel ? formatCurrencyNoKr(snAndel.overstyrtPrAar) : undefined,
      [begrunnelseFieldname]: gjeldendeAP && gjeldendeAP.begrunnelse ? gjeldendeAP.begrunnelse : '',
    };
  }
  return undefined;
};

FastsettSN.transformValuesUtenBegrunnelse = (values) => ({
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});

FastsettSN.transformValuesMedBegrunnelse = (values) => ({
  begrunnelse: values[begrunnelseFieldname],
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});

export default FastsettSN;
