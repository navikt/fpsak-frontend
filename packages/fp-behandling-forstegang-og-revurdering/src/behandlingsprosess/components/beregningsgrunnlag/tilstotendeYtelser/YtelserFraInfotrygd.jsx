import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';


/**
 * YtelserFraInfotrygd
 *
 * Presentasjonskomponent. Viser navn og sum på alle andeler som er tilstøttende ytelser fra infotrygd
 */
const YtelserFraInfotrygd = ({
  bruttoPrAar,
}) => (
  <div>
    <Row>
      <Column xs="12">
        <Normaltekst>
          <FormattedMessage
            id="Beregningsgrunnlag.YtelserFraInfotrygd.Ytelse"
          />
        </Normaltekst>
      </Column>
    </Row>
    <Row>
      <Column xs="12">
        <Element>{formatCurrencyNoKr(bruttoPrAar)}</Element>
      </Column>
    </Row>
  </div>
);

YtelserFraInfotrygd.propTypes = {
  bruttoPrAar: PropTypes.number.isRequired,
};

export default YtelserFraInfotrygd;
