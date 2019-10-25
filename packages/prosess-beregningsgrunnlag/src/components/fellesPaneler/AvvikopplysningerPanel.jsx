import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import styles from './avviksopplysningerPanel.less';


const AvviksopplysningerPanel = ({
  beregnetAarsinntekt, sammenligningsgrunnlag, avvik,
}) => (
  <Panel className={styles.setBoxHeight}>
    <Element>
      <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.ApplicationInformation" />
    </Element>
    <VerticalSpacer sixteenPx />
    <Row>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.OmregnetAarsinntekt" />
        </Normaltekst>
      </Column>

      <Column xs="3" className={styles.rightAlignElement}>
        <Normaltekst>
          {beregnetAarsinntekt === undefined ? '-' : formatCurrencyNoKr(beregnetAarsinntekt)}
        </Normaltekst>
      </Column>
      <Column xs="3" />
    </Row>
    <Row>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.RapportertAarsinntekt" />
        </Normaltekst>
      </Column>

      <Column xs="3" className={styles.rightAlignElement}>
        <Normaltekst>
          {formatCurrencyNoKr(sammenligningsgrunnlag)}
        </Normaltekst>
      </Column>
      <Column xs="3" />

    </Row>
    <Row>
      <Column xs="9">
        <hr />
      </Column>
    </Row>
    <Row>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage id="Beregningsgrunnlag.Avikssopplysninger.BeregnetAvvik" />
        </Normaltekst>
      </Column>
      <Column xs="3" className={styles.rightAlignElement}>
        <Normaltekst>
          {formatCurrencyNoKr(beregnetAarsinntekt === undefined ? 0 : beregnetAarsinntekt - sammenligningsgrunnlag)}
        </Normaltekst>
      </Column>
      <Column xs="3">
        <Element>
          {`${avvik}%`}
        </Element>
      </Column>
    </Row>

  </Panel>
);

AvviksopplysningerPanel.propTypes = {
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  avvik: PropTypes.number,
};

AvviksopplysningerPanel.defaultProps = {
  sammenligningsgrunnlag: undefined,
  avvik: undefined,
  beregnetAarsinntekt: undefined,

};
export default AvviksopplysningerPanel;
