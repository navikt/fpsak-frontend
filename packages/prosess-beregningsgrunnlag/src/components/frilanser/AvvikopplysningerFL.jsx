import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { Column } from 'nav-frontend-grid';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import styles from '../fellesPaneler/avvikopplysningerPanel.less';

const AvviksopplysningerFL = ({
  relevanteStatuser, sammenligningsgrunnlagPrStatus, beregnetAarsinntekt,
}) => {
  const kombinasjonsstatusFNSN = relevanteStatuser.isKombinasjonsstatus
    && !relevanteStatuser.isArbeidstaker
    && relevanteStatuser.isSelvstendigNaeringsdrivende
    && relevanteStatuser.isFrilanser;
  if (kombinasjonsstatusFNSN) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.FL.KobinasjonsStatusFLSN" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  const sammenligningsGrunnlagFL = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_FL')
    : undefined;
  if (!sammenligningsGrunnlagFL) {
    return null;
  }
  const avvikFL = sammenligningsGrunnlagFL.avvikProsent !== undefined ? sammenligningsGrunnlagFL.avvikProsent : '';
  const avvikRoundedFL = avvikFL ? parseFloat((avvikFL.toFixed(1))) : 0;
  const sammenligningsgrunnlagSumFL = sammenligningsGrunnlagFL.rapportertPrAar;
  const { differanseBeregnet } = sammenligningsGrunnlagFL;
  return (
    <>
      <FlexRow>
        <FlexColumn className={styles.colLable}>
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Frilans" />
          </Normaltekst>
        </FlexColumn>

        <FlexColumn className={styles.colValue}>
          <Normaltekst>
            {beregnetAarsinntekt || beregnetAarsinntekt === 0 ? formatCurrencyNoKr(beregnetAarsinntekt) : '-'}
          </Normaltekst>
        </FlexColumn>
        <FlexColumn className={styles.colAvvik} />
      </FlexRow>
      {sammenligningsgrunnlagSumFL && (
        <>
          <FlexRow>
            <FlexColumn className={styles.colLable}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Frilans" />
              </Normaltekst>
            </FlexColumn>

            <FlexColumn className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(sammenligningsgrunnlagSumFL)}
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
                {!relevanteStatuser.isKombinasjonsstatus && (
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
                )}
                {relevanteStatuser.isKombinasjonsstatus && (
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

              <Normaltekst className={`${avvikFL > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikRoundedFL }} />
              </Normaltekst>
            </FlexColumn>
          </FlexRow>
        </>
      )}
    </>
  );
};


AvviksopplysningerFL.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()),
  relevanteStatuser: PropTypes.shape().isRequired,
};

AvviksopplysningerFL.defaultProps = {
  beregnetAarsinntekt: undefined,
  sammenligningsgrunnlagPrStatus: undefined,
};
export default AvviksopplysningerFL;
