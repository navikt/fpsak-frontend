import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components';
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
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.NyIArbeidslivet" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  if (!erVarigEndring && !harAksjonspunkter) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.IkkeVarigEndring" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  if (!harAksjonspunkter) {
    return (
      <FlexRow>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.IngenEndring" />
          </Normaltekst>
        </Column>
      </FlexRow>
    );
  }
  return (
    <div>
      <FlexRow>
        <FlexColumn className={styles.colLable}>
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.PensjonsgivendeInntekt" />
          </Normaltekst>
        </FlexColumn>

        <FlexColumn className={styles.colValue}>
          <Normaltekst>
            {!pgiSnitt || pgiSnitt === 0 ? '-' : formatCurrencyNoKr(pgiSnitt)}
          </Normaltekst>
        </FlexColumn>
        <FlexColumn className={styles.colAvvik} />

      </FlexRow>
      {sammenligningsgrunnlagSumSN && (
        <>
          <FlexRow>
            <FlexColumn className={styles.colLable}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt" />
              </Normaltekst>
            </FlexColumn>

            <FlexColumn className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(sammenligningsgrunnlagSumSN)}
              </Normaltekst>
            </FlexColumn>
            <FlexColumn className={styles.colAvvik} />
          </FlexRow>
          <FlexRow className={styles.avvikLinjeRad}>
            <FlexColumn className={`${styles.colLine} ${styles.colBorderTop}`} />
          </FlexRow>
          <FlexRow>
            <FlexColumn className={styles.colLable}>
              <Normaltekst className={`${beregningStyles.semiBoldText} ${styles.beregnetLuftOver}`}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
              </Normaltekst>
            </FlexColumn>
            <FlexColumn className={styles.colValue}>
              <Normaltekst className={styles.beregnetLuftOver}>
                {formatCurrencyNoKr(differanseBeregnet === undefined ? 0
                  : differanseBeregnet)}
              </Normaltekst>
            </FlexColumn>
            <FlexColumn className={styles.colAvvik}>
              <Normaltekst className={`${avvikSN > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText} ${styles.beregnetLuftOver}`}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik: avvikRoundedSN }} />
              </Normaltekst>
            </FlexColumn>
          </FlexRow>
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
