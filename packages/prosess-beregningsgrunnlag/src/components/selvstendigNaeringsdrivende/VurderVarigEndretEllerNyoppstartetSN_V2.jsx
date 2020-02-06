import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  hasValidText,
  maxLength,
  minLength,
  required,
  parseCurrencyInput,
  formatCurrencyNoKr,
  removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import {
  InputField,
  RadioGroupField, RadioOption,
} from '@fpsak-frontend/form';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import TextAreaField2 from '../redesign/TextAreaField_V2';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);
export const begrunnelseFieldname = 'varigEndringNyoppstartetBegrunnelse';
export const varigEndringRadioname = 'erVarigEndretNaering';
export const fastsettInntektFieldname = 'bruttoBeregningsgrunnlag';
const { VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE } = aksjonspunktCodes;


/**
 * VurderVarigEndretEllerNyoppstartetSN
 *
 * Aksjonspunkt: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
 *
 * Presentasjonskomponent. Setter opp radioknapper som lar saksbehandler vurdere
 * aksjonspunkt om søker har hatt varig endret eller nyoppstaret næring.
 */
export const VurderVarigEndretEllerNyoppstartetSN2 = ({
  intl,
  readOnly,
  erVarigEndring,
  erNyoppstartet,
  erVarigEndretNaering,
  endretTekst,
}) => {
  let radioLabel1 = (<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IngenEndring" />);
  let radioLabel2 = (<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.EndretNaering" />);
  if (erNyoppstartet && !erVarigEndring) {
    radioLabel1 = (<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IkkeNyoppstartet" />);
    radioLabel2 = (<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.Nyoppstartet" />);
  }
  if (erVarigEndring && !erNyoppstartet) {
    radioLabel1 = (<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IkkeVarigEndring" />);
    radioLabel2 = (<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.VarigEndring" />);
  }
  return (
    <>
      {!readOnly && (
      <Row>
        <Column xs="12">
          <RadioGroupField
            name={varigEndringRadioname}
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
          >
            <RadioOption
              label={radioLabel1}
              value={false}
            />
            <RadioOption
              label={radioLabel2}
              value
            />
          </RadioGroupField>
        </Column>
      </Row>
      )}
      {readOnly && (
        <>
          <Row>
            <Column xs="12">
              <Normaltekst>
                {erNyoppstartet && (
                <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.Nyoppstartet" />
                )}
                {erVarigEndring && (
                <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.VarigEndring" />
                )}
              </Normaltekst>
            </Column>
          </Row>
          <VerticalSpacer sixteenPx />
        </>
      )}
      {erVarigEndretNaering
      && (
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
          <VerticalSpacer sixteenPx />
        </>
      )}
      <Row>
        <Column xs="12">
          <TextAreaField2
            name={begrunnelseFieldname}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            placeholder={intl.formatMessage({ id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag.Placeholder' })}
            endrettekst={endretTekst}
          />
        </Column>
      </Row>
    </>
  );
};

VurderVarigEndretEllerNyoppstartetSN2.propTypes = {
  intl: PropTypes.shape().isRequired,
  endretTekst: PropTypes.node,
  readOnly: PropTypes.bool.isRequired,
  erVarigEndring: PropTypes.bool.isRequired,
  erNyoppstartet: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,

};

VurderVarigEndretEllerNyoppstartetSN2.defaultProps = {
  erVarigEndretNaering: false,
};

VurderVarigEndretEllerNyoppstartetSN2.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => {
  if (relevanteAndeler.length === 0 || !gjeldendeAksjonspunkter || gjeldendeAksjonspunkter.length === 0) {
    return undefined;
  }
  const snAndel = relevanteAndeler.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const varigEndretNaeringAP = gjeldendeAksjonspunkter
    .find((ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
  if (varigEndretNaeringAP) {
    return {
      [varigEndringRadioname]: isAksjonspunktOpen(varigEndretNaeringAP.status.kode) ? undefined : relevanteAndeler[0].overstyrtPrAar !== null,
      [begrunnelseFieldname]: varigEndretNaeringAP.begrunnelse ? varigEndretNaeringAP.begrunnelse : '',
      [fastsettInntektFieldname]: snAndel ? formatCurrencyNoKr(snAndel.overstyrtPrAar) : undefined,
    };
  }
  return undefined;
};

VurderVarigEndretEllerNyoppstartetSN2.transformValues = (values) => ({
  begrunnelse: values[begrunnelseFieldname],
  erVarigEndretNaering: values[varigEndringRadioname],
  bruttoBeregningsgrunnlag: removeSpacesFromNumber(values[fastsettInntektFieldname]),
});


export default injectIntl(VurderVarigEndretEllerNyoppstartetSN2);
