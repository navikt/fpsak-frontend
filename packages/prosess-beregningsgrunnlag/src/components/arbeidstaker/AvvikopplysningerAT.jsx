import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

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
      <Row>
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
      </Row>
    );
  }


  if (sammenligningsgrunnlagSumAT) {
    return (
      <>
        <Row>
          <Column className={styles.colLable}>
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Arbeid" />
            </Normaltekst>
          </Column>

          <Column className={styles.colValue}>
            <Normaltekst>
              {beregnetAarsinntekt || beregnetAarsinntekt === 0 ? formatCurrencyNoKr(beregnetAarsinntekt) : '-'}
            </Normaltekst>
          </Column>
        </Row>

        <Row>
          <Column className={styles.colLable}>
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid" />
            </Normaltekst>
          </Column>

          <Column className={styles.colValue}>
            <Normaltekst>
              {formatCurrencyNoKr(sammenligningsgrunnlagSumAT)}
            </Normaltekst>
          </Column>
        </Row>
        <Row>
          <Column className={styles.colLine} />
        </Row>
        <Row>
          <Column className={styles.colLable}>
            <Normaltekst className={beregningStyles.semiBoldText}>
              {!relevanteStatuser.isKombinasjonsstatus && (
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
              )}
              {relevanteStatuser.isKombinasjonsstatus && (
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.AT" />
              )}
            </Normaltekst>
          </Column>
          <Column className={styles.colValue}>
            <Normaltekst>
              {formatCurrencyNoKr(differanseBeregnet === undefined ? 0
                : differanseBeregnet)}
            </Normaltekst>
          </Column>
          <Column className={styles.colAvvik}>
            <Normaltekst className={`${avvikAT > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikAT }} />
            </Normaltekst>
          </Column>
        </Row>
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
