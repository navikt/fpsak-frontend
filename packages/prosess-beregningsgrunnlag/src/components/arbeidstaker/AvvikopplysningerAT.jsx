import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import styles from '../fellesPaneler/avvikopplysningerPanel.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const AvviksopplysningerAT = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, relevanteStatuser, aktivitetStatusKode,
}) => {
  if (aktivitetStatusKode === aktivitetStatus.KOMBINERT_AT_SN || aktivitetStatusKode === aktivitetStatus.KOMBINERT_AT_FL_SN) {
    return (
      <Row>
        <Column xs="12">
          <Normaltekst>
            {aktivitetStatusKode === aktivitetStatus.KOMBINERT_AT_SN && (
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATSN" />
            )}
            {aktivitetStatusKode === aktivitetStatus.KOMBINERT_AT_FL_SN && (
            <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATFLSN" />
            )}
          </Normaltekst>
        </Column>
      </Row>
    );
  }
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
      {sammenligningsgrunnlag && (
        <>
          <Row>
            <Column className={styles.colLable}>
              <Normaltekst>
                <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Arbeid" />
              </Normaltekst>
            </Column>

            <Column className={styles.colValue}>
              <Normaltekst>
                {formatCurrencyNoKr(sammenligningsgrunnlag)}
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
    </>
  );
};


AvviksopplysningerAT.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  relevanteStatuser: PropTypes.shape().isRequired,
  aktivitetStatusKode: PropTypes.string.isRequired,
};

AvviksopplysningerAT.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
};
export default AvviksopplysningerAT;
