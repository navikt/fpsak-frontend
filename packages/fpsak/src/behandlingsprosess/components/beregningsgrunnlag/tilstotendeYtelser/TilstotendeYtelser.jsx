import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import aktivitetStatus, { isStatusDagpengerOrAAP } from 'kodeverk/aktivitetStatus';
import relatertYtelseTypeTextCodes from '../fellesPaneler/relatertYtelseTypeTextCodes';


const getAndelTextId = (andel, tilstøtendeYtelseType) => {
  const dagpengerString = 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
  const AAPString = 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
  if (tilstøtendeYtelseType !== undefined) {
    return relatertYtelseTypeTextCodes[tilstøtendeYtelseType];
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    return dagpengerString;
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
    return AAPString;
  }
  return '';
};

/**
 * TilstotendeYtelser
 *
 * Presentasjonskomponent. Viser navn og sum på alle andeler som er tilstøttende ytelser
 * tilstøtendeYtelseType: Brukes for andre verdier enn dagpenger og arbeidsavklaringspenger.
 */
const TilstotendeYtelser = ({
  alleAndeler,
  isKombinasjonsstatus,
  tilstøtendeYtelseType,
  bruttoPrAar,
}) => {
  if (tilstøtendeYtelseType !== undefined && bruttoPrAar !== undefined) {
    return (
      <div>
        <Row>
          <Column xs="12">
            <Normaltekst>
              <FormattedMessage
                id={getAndelTextId(undefined, tilstøtendeYtelseType)}
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
  }
  const relevanteAndeler = alleAndeler.filter(andel => isStatusDagpengerOrAAP(andel.aktivitetStatus.kode));
  return (
    <div>
      {isKombinasjonsstatus
      && (
      <div>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.TilstottendeYtelse.Tittel" />
        </Element>
        <VerticalSpacer fourPx />
      </div>
      )
      }
      {relevanteAndeler.map((andel, index) => (
        <div key={andel.aktivitetStatus.kode.concat('_'.concat(index))}>
          <Row>
            <Column xs="12">
              <Normaltekst>
                <FormattedMessage
                  id={getAndelTextId(andel, tilstøtendeYtelseType)}
                />
              </Normaltekst>
            </Column>
          </Row>
          <Row>
            <Column xs="12">
              <Element>{formatCurrencyNoKr(andel.beregnetPrAar)}</Element>
            </Column>
          </Row>
          <VerticalSpacer eightPx />
        </div>
      ))}
    </div>
  );
};

TilstotendeYtelser.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
  tilstøtendeYtelseType: PropTypes.string,
  bruttoPrAar: PropTypes.number,
};

TilstotendeYtelser.defaultProps = {
  bruttoPrAar: undefined,
  tilstøtendeYtelseType: undefined,
};

export default TilstotendeYtelser;
