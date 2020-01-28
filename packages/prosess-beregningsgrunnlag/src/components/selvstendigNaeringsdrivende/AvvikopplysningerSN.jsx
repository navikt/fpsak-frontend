import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import styles from '../fellesPaneler/avvikopplysningerPanel.less';

const AvviksopplysningerSN = ({
  sammenligningsgrunnlagPrStatus, alleAndelerIForstePeriode, harAksjonspunkter,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const { pgiSnitt } = snAndel;
  const erNyArbLivet = snAndel.erNyIArbeidslivet;
  const erVarigEndring = snAndel.næringer && snAndel.næringer.some((naring) => naring.erVarigEndret === true);
  const sammenligningsGrunnlagSN = sammenligningsgrunnlagPrStatus
    ? sammenligningsgrunnlagPrStatus.find((status) => status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_SN'
      || status.sammenligningsgrunnlagType.kode === 'SAMMENLIGNING_ATFL_SN')
    : undefined;
  let avvikSN;
  let avvikRoundedSN;
  let sammenligningsgrunnlagSumSN;
  let differanseBeregnet;
  if (sammenligningsGrunnlagSN) {
    avvikSN = sammenligningsGrunnlagSN.avvikProsent;
    avvikRoundedSN = avvikSN ? parseFloat((avvikSN.toFixed(1))) : 0;
    sammenligningsgrunnlagSumSN = sammenligningsGrunnlagSN.rapportertPrAar;
    differanseBeregnet = sammenligningsGrunnlagSN.differanseBeregnet;
  }
  if (erNyArbLivet) {
    return (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.NyIArbeidslivet" />
          </Normaltekst>
        </Column>
      </Row>
    );
  }
  if (!erVarigEndring && !harAksjonspunkter) {
    return (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.IkkeVarigEndring" />
          </Normaltekst>
        </Column>
      </Row>
    );
  }
  if (!harAksjonspunkter) {
    return (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.IngenEndring" />
          </Normaltekst>
        </Column>
      </Row>
    );
  }
  return (
    <div>
      <Row>
        <Column className={styles.colLable}>
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.PensjonsgivendeInntekt" />
          </Normaltekst>
        </Column>

        <Column className={styles.colValue}>
          <Normaltekst>
            {!pgiSnitt || pgiSnitt === 0 ? '-' : formatCurrencyNoKr(pgiSnitt)}
          </Normaltekst>
        </Column>

      </Row>
      {sammenligningsgrunnlagSumSN && (
        <>
          <Row>
            <Column className={styles.colLable}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt" />
              </Normaltekst>
            </Column>

            <Column className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(sammenligningsgrunnlagSumSN)}
              </Normaltekst>
            </Column>
            <Column xs="5" />

          </Row>
          <Row>
            <Column className={styles.colLine} />
          </Row>
          <Row>
            <Column className={styles.colLable}>
              <Normaltekst className={beregningStyles.semiBoldText}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
              </Normaltekst>
            </Column>
            <Column className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(differanseBeregnet === undefined ? 0
                  : differanseBeregnet)}
              </Normaltekst>
            </Column>
            <Column className={styles.colAvvik}>
              <Normaltekst className={`${avvikSN > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikRoundedSN }} />
              </Normaltekst>
            </Column>
          </Row>
        </>
      )}
    </div>
  );
};


AvviksopplysningerSN.propTypes = {
  harAksjonspunkter: PropTypes.bool,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
  sammenligningsgrunnlagPrStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

AvviksopplysningerSN.defaultProps = {
  harAksjonspunkter: false,
};
export default AvviksopplysningerSN;
