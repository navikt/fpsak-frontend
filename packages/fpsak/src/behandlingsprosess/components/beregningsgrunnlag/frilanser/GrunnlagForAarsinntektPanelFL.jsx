import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { InputField } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required } from 'utils/validation/validators';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { formatCurrencyNoKr, parseCurrencyInput } from 'utils/currencyUtils';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';

import styles from './grunnlagForAarsinntektPanelFL.less';

const hasFrilansAksjonspunkt = aksjonspunkt => (aksjonspunkt
    && (aksjonspunkt.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS
    || aksjonspunkt.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD));

const isFrilansAksjonspunktClosed = aksjonspunkt => (hasFrilansAksjonspunkt(aksjonspunkt)
  ? !isAksjonspunktOpen(aksjonspunkt.status.kode)
  : false);

/**
 * GrunnlagForAarsinntektPanelFL
 *
 * Presentasjonskomponent. Viser beregningsgrunnlag for frilansere.
 * Viser kun én frilanserinntekt og et inputfelt for å oversyre det ved aksjonspunkt.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer frilanser.
 */
export const GrunnlagForAarsinntektPanelFL = ({
  readOnly,
  alleAndeler,
  aksjonspunkt,
  isKombinasjonsstatus,
}) => {
  const relevanteAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
  const beregnetAarsinntekt = relevanteAndeler[0].beregnetPrAar;
  return (
    <div className={styles.breddeFL}>
      { isKombinasjonsstatus
      && (
      <div>
        <Element><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Frilanser" /></Element>
        <VerticalSpacer eightPx />
      </div>
      )
    }
      <Row>
        <Column xs="4">
          <Normaltekst><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Frilansinntekt" /></Normaltekst>
        </Column>
        { hasFrilansAksjonspunkt(aksjonspunkt)
        && (
        <Column xs="4">
          <Normaltekst><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.FastsattFrilans" /></Normaltekst>
        </Column>
        )
        }
      </Row>
      <Row>
        <Column xs="4">
          <Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
        </Column>
        { hasFrilansAksjonspunkt(aksjonspunkt)
        && (
        <Column xs="4" className={styles.rightAlignInput}>
          <InputField
            name="inntektFrilanser"
            bredde="S"
            isEdited={isFrilansAksjonspunktClosed(aksjonspunkt)}
            validate={[required]}
            parse={parseCurrencyInput}
            readOnly={readOnly}
          />
        </Column>
        )
        }
      </Row>
    </div>
  );
};
GrunnlagForAarsinntektPanelFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: aksjonspunktPropType,
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
};

GrunnlagForAarsinntektPanelFL.defaultProps = {
  aksjonspunkt: undefined,
};

GrunnlagForAarsinntektPanelFL.buildInitialValues = (relevanteAndeler) => {
  if (relevanteAndeler.length === 0) {
    return undefined;
  }
  return {
    inntektFrilanser: relevanteAndeler[0].overstyrtPrAar ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
  };
};

export default GrunnlagForAarsinntektPanelFL;
