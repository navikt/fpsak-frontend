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
export const VurderVarigEndretEllerNyoppstartetSN = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <>
    <Row>
      <Column xs="12">
        <TextAreaField
          name={begrunnelseFieldname}
          label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
          validate={[required, maxLength1500, minLength3, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
        />
      </Column>
    </Row>
    <Row>
      <Column xs="12">
        <RadioGroupField
          name={varigEndringRadioname}
          validate={[required]}
          direction="horizontal"
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        >
          <RadioOption
            label={<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IngenEndring" />}
            value={false}
          />
          <RadioOption
            label={<FormattedMessage id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.EndretNaering" />}
            value
          />
        </RadioGroupField>
      </Column>
    </Row>
  </>
);

VurderVarigEndretEllerNyoppstartetSN.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

VurderVarigEndretEllerNyoppstartetSN.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => {
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

VurderVarigEndretEllerNyoppstartetSN.transformValues = (values) => ({
  begrunnelse: values[begrunnelseFieldname],
  erVarigEndretNaering: values[varigEndringRadioname],
});

export default VurderVarigEndretEllerNyoppstartetSN;
