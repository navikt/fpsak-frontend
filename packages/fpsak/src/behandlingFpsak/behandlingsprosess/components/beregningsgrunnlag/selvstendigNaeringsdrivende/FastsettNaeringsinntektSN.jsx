import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

import {
  required, minLength, maxLength, hasValidText,
  parseCurrencyInput, removeSpacesFromNumber, formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import {
  InputField, RadioGroupField, RadioOption, TextAreaField,
} from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import styles from './fastsettNaeringsinntektSN.less';

// ------------------------------------------------------------------------------------------ //
// Variables
// ------------------------------------------------------------------------------------------ //

const FORM_NAME = 'BeregningForm';
const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);
const {
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const finnAksjonspunktBruttoFastsatt = aksjonspunkter => aksjonspunkter && aksjonspunkter.find(
  ap => ap.definisjon.kode === FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
);

const finnAksjonspunktVarigEndretNaering = aksjonspunkter => aksjonspunkter && aksjonspunkter.find(
  ap => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
);

const finnAksjonspunktSnNyIArbeidslivet = aksjonspunkter => aksjonspunkter && aksjonspunkter.find(
  ap => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);

const finnSnAksjonspunkt = aksjonspunkter => aksjonspunkter && aksjonspunkter.find(
  ap => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
  || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);

const constructVarigEndringAPValue = (relevanteAndeler, aksjonspunkt, bruttoAP) => ({
  erVarigEndretNaering: isAksjonspunktOpen(aksjonspunkt.status.kode) ? undefined : relevanteAndeler[0].overstyrtPrAar !== null,
  fellesVurdering: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
  bruttoBeregningsgrunnlag: relevanteAndeler[0].overstyrtPrAar ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
  vurderFastsettBruttoBeregningsgrunnlag: bruttoAP ? bruttoAP.begrunnelse : '',
});

const constructNyIArbeidslivetAPValue = (relevanteAndeler, aksjonspunkt) => ({
  fellesVurdering: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
  bruttoBeregningsgrunnlag: relevanteAndeler[0].overstyrtPrAar ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
});

const harFlereAksjonspunkter = gjeldendeAksjonspunkter => !!gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 1;

const finnVurderingLabel = (gjeldendeAksjonspunkter) => {
  if (harFlereAksjonspunkter(gjeldendeAksjonspunkter)) {
    return <FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />;
  }
  return <FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />;
};

// ------------------------------------------------------------------------------------------ //
// Component : FastsettNaeringsinntektSNImpl
// ------------------------------------------------------------------------------------------ //
/**
 * FastsettGrunnlagSN
 *
 * Presentasjonskomponent. Viser inputfelter, begrunnelsesfelter og radioknapper for å avklare
 * aksjonspunkt relatert til å bestemme om selvstendig næringsdrivende har hatt varig endret næring.
 * Ved varig endret næring vil også denne komponenten håndtere input av beløpet som skal brukes videre i beregning.
 */
export const FastsettNaeringsinntektSNImpl = ({
  intl,
  readOnly,
  erVarigEndretNaering,
  isAksjonspunktClosed,
  gjeldendeAksjonspunkter,
}) => (
  <div>
    <Row>
      <Column xs="12">
        <TextAreaField
          name="fellesVurdering"
          label={finnVurderingLabel(gjeldendeAksjonspunkter)}
          validate={[required, maxLength1500, minLength3, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
        />
      </Column>
    </Row>
    { finnAksjonspunktSnNyIArbeidslivet(gjeldendeAksjonspunkter)
    && (
    <Row>
      <Column xs="12" className={styles.rightAlignInput}>
        <InputField
          name="bruttoBeregningsgrunnlag"
          label={{ id: 'Beregningsgrunnlag.FastsettSelvstendigNaeringForm.BruttoBerGr' }}
          bredde="S"
          validate={[required]}
          parse={parseCurrencyInput}
          isEdited={isAksjonspunktClosed}
          readOnly={readOnly}
        />
      </Column>
    </Row>
    )
    }
    { finnAksjonspunktVarigEndretNaering(gjeldendeAksjonspunkter)
      && (
      <div>
        <Row>
          <Column xs="12" className={styles.margin5}>
            <RadioGroupField
              name="erVarigEndretNaering"
              validate={[required]}
              direction="horizontal"
              readOnly={readOnly}
              isEdited={isAksjonspunktClosed}
            >
              <RadioOption
                label={intl.formatMessage({ id: 'Beregningsgrunnlag.FastsettSelvstendigNaeringForm.IngenEndring' })}
                value={false}
              />
              <RadioOption
                label={intl.formatMessage({ id: 'Beregningsgrunnlag.FastsettSelvstendigNaeringForm.EndretNaering' })}
                value
              />
            </RadioGroupField>
          </Column>
        </Row>
        { erVarigEndretNaering
        && (
        <Row>
          <Column xs="12">
            <div className={styles.arrowLineVarigEndretNaering}>
              <Row>
                <Element>
                  <FormattedMessage
                    id="Beregningsgrunnlag.FastsettSelvstendigNaeringForm.FastsettNaeringsinntekt"
                  />
                </Element>
              </Row>
              <Row>
                <Column xs="11" className={styles.marginTop}>
                  <TextAreaField
                    name="vurderFastsettBruttoBeregningsgrunnlag"
                    label={intl.formatMessage({ id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag' })}
                    validate={[required, maxLength1500, minLength3, hasValidText]}
                    maxLength={1500}
                    readOnly={readOnly}
                  />
                </Column>
              </Row>
              <Row>
                <Column xs="12" className={styles.rightAlignInput}>
                  <InputField
                    name="bruttoBeregningsgrunnlag"
                    label={{ id: 'Beregningsgrunnlag.FastsettSelvstendigNaeringForm.FastsattNaeringsinntekt' }}
                    bredde="S"
                    validate={[required]}
                    parse={parseCurrencyInput}
                    isEdited={isAksjonspunktClosed}
                    readOnly={readOnly}
                  />
                </Column>
              </Row>
            </div>
          </Column>
        </Row>
        )
        }
      </div>
      )
    }
  </div>
);

FastsettNaeringsinntektSNImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

FastsettNaeringsinntektSNImpl.defaultProps = {
  erVarigEndretNaering: undefined,
};

const mapStateToProps = (state, { gjeldendeAksjonspunkter }) => {
  const aksjonspunkt = finnSnAksjonspunkt(gjeldendeAksjonspunkter);
  return {
    isAksjonspunktClosed: !isAksjonspunktOpen(aksjonspunkt.status.kode),
    erVarigEndretNaering: behandlingFormValueSelector(FORM_NAME)(state, 'erVarigEndretNaering'),
  };
};

const FastsettNaeringsinntektSN = connect(mapStateToProps)(injectIntl(FastsettNaeringsinntektSNImpl));

FastsettNaeringsinntektSN.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkter) => {
  if (relevanteAndeler.length === 0 || !gjeldendeAksjonspunkter) {
    return undefined;
  }
  const varigEndretNaeringAP = finnAksjonspunktVarigEndretNaering(gjeldendeAksjonspunkter);
  const fastsattBruttoAP = finnAksjonspunktBruttoFastsatt(gjeldendeAksjonspunkter);
  if (varigEndretNaeringAP) {
    return constructVarigEndringAPValue(relevanteAndeler, varigEndretNaeringAP, fastsattBruttoAP);
  }
  const SnNyIArbeidslivet = finnAksjonspunktSnNyIArbeidslivet(gjeldendeAksjonspunkter);
  if (SnNyIArbeidslivet) {
    return constructNyIArbeidslivetAPValue(relevanteAndeler, SnNyIArbeidslivet);
  }
  return undefined;
};

FastsettNaeringsinntektSN.transformValues = (values, gjeldendeAksjonspunkter) => {
  if (finnAksjonspunktSnNyIArbeidslivet(gjeldendeAksjonspunkter)) {
    return [{
      kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      begrunnelse: values.fellesVurdering,
      bruttoBeregningsgrunnlag: removeSpacesFromNumber(values.bruttoBeregningsgrunnlag),
    }];
  }
  const aksjonspunkterMedValues = [{
    kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
    begrunnelse: values.fellesVurdering,
    erVarigEndretNaering: values.erVarigEndretNaering,
  }];
  if (values.erVarigEndretNaering) {
    aksjonspunkterMedValues.push({
      kode: FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
      begrunnelse: values.vurderFastsettBruttoBeregningsgrunnlag,
      bruttoBeregningsgrunnlag: removeSpacesFromNumber(values.bruttoBeregningsgrunnlag),
    });
  }
  return aksjonspunkterMedValues;
};

export default FastsettNaeringsinntektSN;
