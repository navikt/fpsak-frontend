import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';

import {
  required, minLength, maxLength, hasValidText,
} from 'utils/validation/validators';
import {
  InputField, RadioGroupField, RadioOption, TextAreaField,
} from 'form/Fields';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { parseCurrencyInput, removeSpacesFromNumber, formatCurrencyNoKr } from 'utils/currencyUtils';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';

import styles from './fastsettNaeringsinntektSN.less';

const {
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const erAksjonspunktVarigEndretNaering = ap => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE;

const erAksjonspunktSnNyIArbeidslivet = ap => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET;


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
  gjeldendeAksjonspunkt,
}) => (
  <div>
    <Row>
      <Column xs="12">
        <TextAreaField
          name="fellesVurdering"
          label={intl.formatMessage({ id: 'Beregningsgrunnlag.Forms.Vurdering' })}
          validate={[required, maxLength1500, minLength3, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
        />
      </Column>
    </Row>
    { erAksjonspunktSnNyIArbeidslivet(gjeldendeAksjonspunkt)
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
    { erAksjonspunktVarigEndretNaering(gjeldendeAksjonspunkt)
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
                    label={intl.formatMessage({ id: 'Beregningsgrunnlag.Forms.Vurdering' })}
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
  gjeldendeAksjonspunkt: aksjonspunktPropType,
};

FastsettNaeringsinntektSNImpl.defaultProps = {
  erVarigEndretNaering: undefined,
  gjeldendeAksjonspunkt: undefined,
};

const mapStateToProps = (state, { gjeldendeAksjonspunkt }) => ({
  isAksjonspunktClosed: !isAksjonspunktOpen(gjeldendeAksjonspunkt.status.kode),
  erVarigEndretNaering: behandlingFormValueSelector('BeregningsgrunnlagForm')(state, 'erVarigEndretNaering'),
});

const FastsettNaeringsinntektSN = connect(mapStateToProps)(injectIntl(FastsettNaeringsinntektSNImpl));

const constructVarigEndringAPValue = (relevanteAndeler, gjeldendeAksjonspunkt, bruttoAP) => ({
  erVarigEndretNaering: isAksjonspunktOpen(gjeldendeAksjonspunkt.status.kode)
    ? undefined : relevanteAndeler[0].overstyrtPrAar !== null,
  fellesVurdering: gjeldendeAksjonspunkt.begrunnelse ? gjeldendeAksjonspunkt.begrunnelse : '',
  bruttoBeregningsgrunnlag: relevanteAndeler[0].overstyrtPrAar ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
  vurderFastsettBruttoBeregningsgrunnlag: bruttoAP ? bruttoAP.begrunnelse : '',
});

const constructNyIArbeidslivetAPValue = (relevanteAndeler, gjeldendeAksjonspunkt) => ({
  fellesVurdering: gjeldendeAksjonspunkt.begrunnelse ? gjeldendeAksjonspunkt.begrunnelse : '',
  bruttoBeregningsgrunnlag: relevanteAndeler[0].overstyrtPrAar ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
});

FastsettNaeringsinntektSN.buildInitialValues = (relevanteAndeler, gjeldendeAksjonspunkt, bruttoAP) => {
  if (relevanteAndeler.length === 0 || !gjeldendeAksjonspunkt) {
    return undefined;
  }
  if (erAksjonspunktVarigEndretNaering(gjeldendeAksjonspunkt)) {
    return constructVarigEndringAPValue(relevanteAndeler, gjeldendeAksjonspunkt, bruttoAP);
  } if (erAksjonspunktSnNyIArbeidslivet(gjeldendeAksjonspunkt)) {
    return constructNyIArbeidslivetAPValue(relevanteAndeler, gjeldendeAksjonspunkt);
  }
  return undefined;
};

FastsettNaeringsinntektSN.transformValues = (values, gjeldendeAksjonspunkt) => {
  if (erAksjonspunktSnNyIArbeidslivet(gjeldendeAksjonspunkt)) {
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
