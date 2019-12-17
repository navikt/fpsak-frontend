import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
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
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.FL.KobinasjonsStatusFLSN" />
          </Normaltekst>
        </Column>
      </Row>
    );
  }
  const sammenligningsGrunnlagFL = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_FL')
    : undefined;
  if (!sammenligningsGrunnlagFL) {
    return null;
  }
  const avvikFL = sammenligningsGrunnlagFL.avvikProsent !== undefined ? sammenligningsGrunnlagFL.avvikProsent : '';
  const sammenligningsgrunnlagSumFL = sammenligningsGrunnlagFL.rapportertPrAar;
  const { differanseBeregnet } = sammenligningsGrunnlagFL;
  return (
    <>
      <Row>
        <Column className={styles.colLable}>
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt.Frilans" />
          </Normaltekst>
        </Column>

        <Column className={styles.colValue}>
          <Normaltekst>
            {beregnetAarsinntekt || beregnetAarsinntekt === 0 ? formatCurrencyNoKr(beregnetAarsinntekt) : '-'}
          </Normaltekst>
        </Column>
      </Row>
      {sammenligningsgrunnlagSumFL && (
        <>
          <Row>
            <Column className={styles.colLable}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Frilans" />
              </Normaltekst>
            </Column>

            <Column className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(sammenligningsgrunnlagSumFL)}
              </Normaltekst>
            </Column>
            <Column xs="5" />

          </Row>
          <Row>
            <Column xs="7" className={styles.colLine} />
          </Row>
          <Row>
            <Column className={styles.colLable}>
              <Normaltekst className={beregningStyles.semiBoldText}>
                {!relevanteStatuser.isKombinasjonsstatus && (
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
                )}
                {relevanteStatuser.isKombinasjonsstatus && (
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik.FL" />
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

              <Normaltekst className={`${avvikFL > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikFL }} />
              </Normaltekst>
            </Column>
          </Row>
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
