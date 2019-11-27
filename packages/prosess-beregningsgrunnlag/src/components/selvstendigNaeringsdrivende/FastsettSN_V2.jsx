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
import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

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
const FastsettSN2 = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <>
    <Row className={styles.verticalAlignMiddle}>
      <Column xs="7">
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.BruttoBerGr2" />
        </Normaltekst>
      </Column>
      <Column xs="5">
        <div id="readOnlyWrapper" className={readOnly ? styles.inputPadding : undefined}>
          <InputField
            name={fastsettInntektFieldname}
            bredde="XS"
            validate={[required]}
            parse={parseCurrencyInput}
            className={styles['input--xs']}
            readOnly={readOnly}
          />
        </div>
      </Column>
    </Row>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="12" className={styles.marginTop}>
        <div id="readOnlyWrapper" className={readOnly ? styles.verticalLine : styles.textAreaWrapper}>
          <TextAreaField
            name={begrunnelseFieldname}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            isEdited={isAksjonspunktClosed}
          />
        </div>
      </Column>
    </Row>

  </>
);

FastsettSN2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

FastsettSN2.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => {
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

  if (gjeldendeAP) {
    return {
      [fastsettInntektFieldname]: snAndel ? formatCurrencyNoKr(snAndel.overstyrtPrAar) : undefined,
      [begrunnelseFieldname]: gjeldendeAP.begrunnelse ? gjeldendeAP.begrunnelse : '',
    };
  }
  return undefined;
};

FastsettSN2.transformValues = (values) => ({
  begrunnelse: values[begrunnelseFieldname],
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});

export default FastsettSN2;