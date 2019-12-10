import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import styles from '../fellesPaneler/avvikopplysningerPanel.less';

const AvviksopplysningerFL = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik,
}) => (
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
    <Row>
      <Column className={styles.colLable}>
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt.Frilans" />
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
);


AvviksopplysningerFL.propTypes = {
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
  beregnetAarsinntekt: PropTypes.number,
};

AvviksopplysningerFL.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
};
export default AvviksopplysningerFL;
