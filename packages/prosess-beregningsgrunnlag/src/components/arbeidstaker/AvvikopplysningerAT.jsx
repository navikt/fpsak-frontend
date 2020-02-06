import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { Column } from 'nav-frontend-grid';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';
import styles from '../fellesPaneler/avvikopplysningerPanel.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import AvviksopplysningerFL from '../frilanser/AvvikopplysningerFL';


const AvviksopplysningerAT = ({
  relevanteStatuser, sammenligningsgrunnlagPrStatus, beregnetAarsinntekt,
}) => {
  const sammenligningsGrunnlagAT = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === sammenligningType.AT
      || status.sammenligningsgrunnlagType.kode === sammenligningType.ATFLSN)
    : undefined;
  if (!sammenligningsGrunnlagAT) {
    return null;
  }
  const avvikAT = sammenligningsGrunnlagAT.avvikProsent;
  const avvikATRounded = avvikAT ? parseFloat((avvikAT.toFixed(1))) : 0;
  const sammenligningsgrunnlagSumAT = sammenligningsGrunnlagAT.rapportertPrAar;
  const { differanseBeregnet } = sammenligningsGrunnlagAT;
  const kombinasjonsstatusATSN = relevanteStatuser.isKombinasjonsstatus
    && relevanteStatuser.isArbeidstaker
    && relevanteStatuser.isSelvstendigNaeringsdrivende
    && !relevanteStatuser.isFrilanser;
  const kombinasjonsstatusATFLSN = relevanteStatuser.isKombinasjonsstatus
    && relevanteStatuser.isArbeidstaker
    && relevanteStatuser.isSelvstendigNaeringsdrivende
    && relevanteStatuser.isFrilanser;

  if (kombinasjonsstatusATSN || kombinasjonsstatusATFLSN) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            {kombinasjonsstatusATSN && (
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATSN" />
            )}
            {kombinasjonsstatusATFLSN && (
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATFLSN" />
            )}
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }


  if (sammenligningsgrunnlagSumAT) {
    return (
      <>
        <FlexRow>
          <FlexColumn className={styles.colLable}>
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid" />
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
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid" />
            </Normaltekst>
          </FlexColumn>

          <FlexColumn className={styles.colValue}>
            <Normaltekst>
              {formatCurrencyNoKr(sammenligningsgrunnlagSumAT)}
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
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.AT" />
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
            <Normaltekst className={`${avvikAT > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikATRounded }} />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
      </>
    );
  }
  return null;
};


AvviksopplysningerAT.propTypes = {
  relevanteStatuser: PropTypes.shape().isRequired,
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregnetAarsinntekt: PropTypes.number,
};
AvviksopplysningerFL.defaultProps = {
  beregnetAarsinntekt: undefined,
};

export default AvviksopplysningerAT;
