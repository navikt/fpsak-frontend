import React from 'react';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import PropTypes from 'prop-types';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import styles from './avvikopplysningerPanel.less';


const AvvikopplysningerATFL = ({
  relevanteStatuser,
  beregnetAarsinntekt,
  sammenligningsgrunnlagSum,
  visPanel,
  avvikProsentAvrundet,
  differanseBeregnet,
}) => (
  <>
    <FlexRow>
      <FlexColumn className={styles.colLable}>
        <Normaltekst>
          {visPanel && visPanel.visAT && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid" />
          )}
          {visPanel && visPanel.visFL && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Frilans" />
          )}
          {visPanel && visPanel.visSN && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.PensjonsgivendeInntekt" />
          )}
        </Normaltekst>
      </FlexColumn>

      <FlexColumn className={styles.colValue}>
        <Normaltekst>
          {beregnetAarsinntekt || beregnetAarsinntekt === 0 ? formatCurrencyNoKr(beregnetAarsinntekt) : '-'}
        </Normaltekst>
      </FlexColumn>
      <FlexColumn className={styles.colAvvik} />
    </FlexRow>

    <FlexRow>
      <FlexColumn className={styles.colLable}>
        <Normaltekst>
          {visPanel && visPanel.visAT && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid" />
          )}
          {visPanel && visPanel.visFL && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Frilans" />
          )}
          {visPanel && visPanel.visSN && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt" />
          )}
        </Normaltekst>
      </FlexColumn>

      <FlexColumn className={styles.colValue}>
        <Normaltekst>
          {formatCurrencyNoKr(sammenligningsgrunnlagSum)}
        </Normaltekst>
      </FlexColumn>
      <FlexColumn className={styles.colAvvik} />
    </FlexRow>
    <FlexRow className={styles.avvikLinjeRad}>
      <FlexColumn className={`${styles.colLine} ${styles.colBorderTop}`} />
    </FlexRow>
    <FlexRow>
      <FlexColumn className={styles.colLable}>
        <Normaltekst className={beregningStyles.semiBoldText}>
          {!relevanteStatuser.isKombinasjonsstatus && ((visPanel && visPanel.visAT) || (visPanel && visPanel.visSN)) && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
          )}
          {relevanteStatuser.isKombinasjonsstatus && visPanel && visPanel.visAT && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.AT" />
          )}
          {!relevanteStatuser.isKombinasjonsstatus && visPanel && visPanel.visFL && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
          )}
          {relevanteStatuser.isKombinasjonsstatus && visPanel && visPanel.visFL && (
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.FL" />
          )}
        </Normaltekst>
      </FlexColumn>
      <FlexColumn className={styles.colValue}>
        <Normaltekst>
          {formatCurrencyNoKr(differanseBeregnet === undefined ? 0
            : differanseBeregnet)}
        </Normaltekst>
      </FlexColumn>
      <FlexColumn className={styles.colAvvik}>
        <Normaltekst className={`${avvikProsentAvrundet > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikProsentAvrundet }} />
        </Normaltekst>
      </FlexColumn>
    </FlexRow>
  </>
);
AvvikopplysningerATFL.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  relevanteStatuser: PropTypes.shape().isRequired,
  differanseBeregnet: PropTypes.number.isRequired,
  sammenligningsgrunnlagSum: PropTypes.number.isRequired,
  avvikProsentAvrundet: PropTypes.number.isRequired,
  visPanel: PropTypes.shape().isRequired,
};

AvvikopplysningerATFL.defaultProps = {
  beregnetAarsinntekt: undefined,
};
export default AvvikopplysningerATFL;
