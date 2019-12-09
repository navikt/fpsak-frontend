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
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, alleAndelerIForstePeriode, harAksjonspunkter,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const { pgiSnitt } = snAndel;
  const erVarigEndring = snAndel.næringer && snAndel.næringer.some((naring) => naring.erVarigEndret === true);
  const erNyArbLivet = snAndel.erNyIArbeidslivet;
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
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.SN.VarigEndring" />
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
      {sammenligningsgrunnlag && (
        <>
          <Row>
            <Column className={styles.colLable}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OppgittAarsinntekt" />
              </Normaltekst>
            </Column>

            <Column className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(sammenligningsgrunnlag)}
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
                {formatCurrencyNoKr(beregnetAarsinntekt === undefined ? 0 : beregnetAarsinntekt - sammenligningsgrunnlag)}
              </Normaltekst>
            </Column>
            <Column className={styles.colAvvik}>
              <Normaltekst className={`${avvik > 25 ? beregningStyles.redError : ''} ${beregningStyles.semiBoldText}`}>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AvvikProsent" values={{ avvik }} />
              </Normaltekst>
            </Column>
          </Row>
        </>
      )}
    </div>
  );
};


AvviksopplysningerSN.propTypes = {
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  beregnetAarsinntekt: PropTypes.number,
  harAksjonspunkter: PropTypes.bool,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
};

AvviksopplysningerSN.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: '',
  beregnetAarsinntekt: undefined,
  harAksjonspunkter: false,
};
export default AvviksopplysningerSN;
