import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import styles from '../fellesPaneler/avvikopplysningerPanel.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const AvviksopplysningerAT = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik, relevanteStatuser,
}) => {
  const kobinasjonsstatusATSN = relevanteStatuser.isArbeidstaker && relevanteStatuser.isSelvstendigNaeringsdrivende && !relevanteStatuser.isFrilanser;
  const kobinasjonsstatusATFLSN = relevanteStatuser.isArbeidstaker && relevanteStatuser.isSelvstendigNaeringsdrivende && relevanteStatuser.isFrilanser;
  if (kobinasjonsstatusATSN || kobinasjonsstatusATFLSN) {
    return (
      <Row>
        <Column xs="12">
          <Normaltekst>
            {kobinasjonsstatusATSN && (
              <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.AT.KobinasjonsStatusATSN" />
            )}
            {kobinasjonsstatusATFLSN && (
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
            {beregnetAarsinntekt === undefined ? '-' : formatCurrencyNoKr(beregnetAarsinntekt)}
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
        <Column className={styles.colLine}>
          <hr />
        </Column>
      </Row>
      <Row>
        <Column className={styles.colLable}>
          <Normaltekst className={beregningStyles.semiBoldText}>
            {!relevanteStatuser.isKombinasjonsstatus && (<FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
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
                {`${avvik}%`}
              </Normaltekst>
            </Column>
          </Row>
        </>
      )}
    </>
  );
};
};
};

AvviksopplysningerAT.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  relevanteStatuser: PropTypes.shape().isRequired,
};

AvviksopplysningerAT.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
};
export default AvviksopplysningerAT;
