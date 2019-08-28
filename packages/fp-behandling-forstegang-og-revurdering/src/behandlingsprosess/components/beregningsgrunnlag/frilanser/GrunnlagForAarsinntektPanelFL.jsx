import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { InputField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  required, formatCurrencyNoKr, parseCurrencyInput,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import styles from './grunnlagForAarsinntektPanelFL.less';

const finnFrilansAksjonspunkt = (aksjonspunkter) => !!aksjonspunkter && aksjonspunkter.find(
  (ap) => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS
  || ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
);

const isFrilansAksjonspunktClosed = (aksjonspunkter) => {
  const aksjonspunkt = finnFrilansAksjonspunkt(aksjonspunkter);
  return aksjonspunkt ? !isAksjonspunktOpen(aksjonspunkt.status.kode) : false;
};

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
  aksjonspunkter,
  isKombinasjonsstatus,
}) => {
  const relevanteAndeler = alleAndeler.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
  const beregnetAarsinntekt = relevanteAndeler[0].beregnetPrAar;
  return (
    <div className={styles.breddeFL}>
      { isKombinasjonsstatus
      && (
      <div>
        <Element><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Frilanser" /></Element>
        <VerticalSpacer eightPx />
      </div>
      )}
      <Row>
        <Column xs="4">
          <Normaltekst><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Frilansinntekt" /></Normaltekst>
        </Column>
        { finnFrilansAksjonspunkt(aksjonspunkter)
        && (
        <Column xs="4">
          <Normaltekst><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.FastsattFrilans" /></Normaltekst>
        </Column>
        )}
      </Row>
      <Row>
        <Column xs="4">
          <Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
        </Column>
        { finnFrilansAksjonspunkt(aksjonspunkter)
        && (
        <Column xs="4" className={styles.rightAlignInput}>
          <InputField
            name="inntektFrilanser"
            bredde="S"
            isEdited={isFrilansAksjonspunktClosed(aksjonspunkter)}
            validate={[required]}
            parse={parseCurrencyInput}
            readOnly={readOnly}
          />
        </Column>
        )}
      </Row>
    </div>
  );
};
GrunnlagForAarsinntektPanelFL.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
};

GrunnlagForAarsinntektPanelFL.defaultProps = {

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
