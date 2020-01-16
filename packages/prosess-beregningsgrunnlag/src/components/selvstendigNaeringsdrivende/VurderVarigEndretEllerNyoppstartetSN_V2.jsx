import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import {
  RadioGroupField, RadioOption, TextAreaField,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Normaltekst } from 'nav-frontend-typografi';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';


const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);
export const begrunnelseFieldname = 'varigEndringNyoppstartetBegrunnelse';
export const varigEndringRadioname = 'erVarigEndretNaering';
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
  readOnly,
  erVarigEndring,
  erNyoppstartet,
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
      <Row>
        <Column xs="12">
          <div id="readOnlyWrapper" className={readOnly ? styles.verticalLine : styles.textAreaWrapper}>
            <TextAreaField
              name={begrunnelseFieldname}
              label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
              validate={[required, maxLength1500, minLength3, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </div>
        </Column>
      </Row>
      <Row>
        {!readOnly && (
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
        )}
        {readOnly && (
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.EndretNaering" />
          </Normaltekst>
        </Column>
        )}
      </Row>
    </>
  );
};

VurderVarigEndretEllerNyoppstartetSN2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erVarigEndring: PropTypes.bool.isRequired,
  erNyoppstartet: PropTypes.bool.isRequired,
};

VurderVarigEndretEllerNyoppstartetSN2.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => {
  if (relevanteAndeler.length === 0 || !gjeldendeAksjonspunkter || gjeldendeAksjonspunkter.length === 0) {
    return undefined;
  }
  const varigEndretNaeringAP = gjeldendeAksjonspunkter
    .find((ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
  if (varigEndretNaeringAP) {
    return {
      [varigEndringRadioname]: isAksjonspunktOpen(varigEndretNaeringAP.status.kode) ? undefined : relevanteAndeler[0].overstyrtPrAar !== null,
      [begrunnelseFieldname]: varigEndretNaeringAP.begrunnelse ? varigEndretNaeringAP.begrunnelse : '',
    };
  }
  return undefined;
};

VurderVarigEndretEllerNyoppstartetSN2.transformValues = (values) => ({
  begrunnelse: values[begrunnelseFieldname],
  erVarigEndretNaering: values[varigEndringRadioname],
});

export default VurderVarigEndretEllerNyoppstartetSN2;
