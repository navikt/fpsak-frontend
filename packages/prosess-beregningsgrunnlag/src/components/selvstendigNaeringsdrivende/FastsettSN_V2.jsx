import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  hasValidText,
  maxLength,
  minLength,
  parseCurrencyInput,
  removeSpacesFromNumber,
  required,
  formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import {
  InputField,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import TextAreaField2 from '../redesign/TextAreaField_V2';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
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
export const FastsettSN2 = ({
  readOnly,
  isAksjonspunktClosed,
  intl,
  gjeldendeAksjonspunkter,
  erNyArbLivet,
  endretTekst,
}) => {
  const harGammeltAPFastsettBrutto = gjeldendeAksjonspunkter
    ? gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE)
    : false;
  const harAPSNNyiArbLiv = gjeldendeAksjonspunkter
    ? gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET)
    : false;

  return (
    <>
      {erNyArbLivet && (
        <>
          <Row className={styles.verticalAlignMiddle}>
            <Column className={styles.dynamiskKolonne}>
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
        </>
      )}

      {(harGammeltAPFastsettBrutto || harAPSNNyiArbLiv)
      && (
        <>
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="12" className={styles.marginTop}>
              <div id="readOnlyWrapper" className={readOnly ? styles.verticalLine : styles.textAreaWrapperHeigh}>
                <TextAreaField2
                  name={begrunnelseFieldname}
                  label={<FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />}
                  validate={[required, maxLength1500, minLength3, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                  isEdited={isAksjonspunktClosed}
                  placeholder={intl.formatMessage({ id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag.Placeholder' })}
                  endrettekst={endretTekst}
                />
              </div>
            </Column>
          </Row>
        </>
      )}
    </>
  );
};

FastsettSN2.propTypes = {
  intl: PropTypes.shape().isRequired,
  endretTekst: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  erNyArbLivet: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
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

  if (gjeldendeAP || (snAndel.overstyrtPrAar || snAndel.overstyrtPrAar === 0)) {
    return {
      [fastsettInntektFieldname]: snAndel ? formatCurrencyNoKr(snAndel.overstyrtPrAar) : undefined,
      [begrunnelseFieldname]: gjeldendeAP && gjeldendeAP.begrunnelse ? gjeldendeAP.begrunnelse : '',
    };
  }
  return undefined;
};

FastsettSN2.transformValuesMedBegrunnelse = (values) => ({
  begrunnelse: values[begrunnelseFieldname],
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});
FastsettSN2.transformValuesUtenBegrunnelse = (values) => ({
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});

export default injectIntl(FastsettSN2);
