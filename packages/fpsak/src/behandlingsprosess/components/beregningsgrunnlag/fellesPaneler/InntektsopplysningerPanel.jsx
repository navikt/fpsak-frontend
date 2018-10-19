import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Row, Column } from 'nav-frontend-grid';
import { Undertekst, Normaltekst, Element } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import BorderBox from 'sharedComponents/BorderBox';
import { formatCurrencyNoKr } from 'utils/currencyUtils';

import styles from './inntektsopplysningerPanel.less';

/**
 * InntektsopplysningerPanel
 *
 * Viser faktagruppe med beregnet årsinntekt, sammenligningsgrunnlaget og beregnet avvik i prosent.
 */
const InntektsopplysningerPanel = ({
  beregnetAarsinntekt,
  sammenligningsgrunnlag,
  avvik,
  sammenligningsgrunnlagTekst,
}) => (
  <BorderBox className={styles.setBoxHeight}>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.Inntektsopplysninger.ApplicationInformation" />
    </Element>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="6">
        <Undertekst>
          <FormattedMessage id="Beregningsgrunnlag.Inntektsopplysninger.BeregnetAarsinntekt" />
        </Undertekst>
      </Column>
      { sammenligningsgrunnlag
      && (
      <Column xs="6">
        {
              sammenligningsgrunnlagTekst.map(tekst => (
                <Undertekst key={tekst}>
                  <FormattedMessage id={tekst} />
                </Undertekst>
              ))
            }
      </Column>
      )
          }
    </Row>
    <Row>
      <Column xs="6">
        <Element>
          {beregnetAarsinntekt === undefined ? '-' : formatCurrencyNoKr(beregnetAarsinntekt)}
        </Element>
        <VerticalSpacer twentyPx />
      </Column>
      { sammenligningsgrunnlag
      && (
      <Column xs="6">
        <Element>
          {formatCurrencyNoKr(sammenligningsgrunnlag)}
        </Element>
      </Column>
      )
          }
    </Row>
    { avvik !== undefined
    && (
    <Row>
      <Column xs="12" className={styles.bottomText}>
        <Normaltekst>
          <FormattedMessage key="avvik" id="Beregningsgrunnlag.Inntektsopplysninger.Avvik" values={{ verdi: avvik }} />
        </Normaltekst>
      </Column>
    </Row>
    )
        }
  </BorderBox>
);

InntektsopplysningerPanel.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  sammenligningsgrunnlagTekst: PropTypes.arrayOf(PropTypes.string).isRequired,
  avvik: PropTypes.number,
};

InntektsopplysningerPanel.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,
};

export default InntektsopplysningerPanel;
