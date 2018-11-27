import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import relatertYtelseTypeTextCodes from '../fellesPaneler/relatertYtelseTypeTextCodes';

const getAndelTextId = tilstøtendeYtelseType => relatertYtelseTypeTextCodes[tilstøtendeYtelseType];

/**
 * YtelserFraInfotrygd
 *
 * Presentasjonskomponent. Viser navn og sum på alle andeler som er tilstøttende ytelser fra infotrygd
 */
const YtelserFraInfotrygd = ({
  tilstøtendeYtelseType,
  bruttoPrAar,
}) => (
  <div>
    <Row>
      <Column xs="12">
        <Normaltekst>
          <FormattedMessage
            id={getAndelTextId(tilstøtendeYtelseType)}
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
  tilstøtendeYtelseType: PropTypes.string.isRequired,
  bruttoPrAar: PropTypes.number.isRequired,
};

export default YtelserFraInfotrygd;
