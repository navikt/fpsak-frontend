import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/kodeverkTyper';
import { getKodeverk } from '@fpsak-frontend/kodeverk/duck';
import relatertYtelseType from '@fpsak-frontend/kodeverk/relatertYtelseType';
import BorderBox from '@fpsak-frontend/shared-components/BorderBox';

import { Column, Row } from 'nav-frontend-grid';

const getKodeverkKodeOgNavn = (kodeverkType, kode) => createSelector(
  [getKodeverk(kodeverkType)],
  inntektskategoriKoder => (inntektskategoriKoder.filter(ik => ik.kode === kode)[0]),
);

export const byggListeSomStreng = (listeMedStrenger) => {
  if (listeMedStrenger.length === 0) {
    return '';
  }
  if (listeMedStrenger.length === 1) {
    return listeMedStrenger[0];
  }
  if (listeMedStrenger.length === 2) {
    return `${listeMedStrenger[0]} og ${listeMedStrenger[1]}`;
  }
  if (listeMedStrenger.length > 2) {
    return `${listeMedStrenger.splice(0, listeMedStrenger.length - 1).join(', ')} og ${listeMedStrenger[listeMedStrenger.length - 1]}`;
  }
  return '';
};

const getInntektskategori = (tilstotendeYtelse, state) => {
  if (tilstotendeYtelse.arbeidskategori === null) {
    return '';
  }
  return getKodeverkKodeOgNavn(kodeverkTyper.ARBEIDSKATEGORI, tilstotendeYtelse.arbeidskategori.kode)(state).navn;
};

const getProsentandelTextId = ytelsetype => (ytelsetype === relatertYtelseType.SYKEPENGER || ytelsetype === relatertYtelseType.SVANGERSKAPSPENGER
  ? 'BeregningInfoPanel.TilstøtendeYtelseForm.Sykepengerdekning' : 'BeregningInfoPanel.TilstøtendeYtelseForm.Dekningsgrad');

export const YtelsePanel = ({
  tilstøtendeYtelse,
  inntektskategoriString,
  ytelseType,
}) => (
  <BorderBox>
    <Row>
      <Column xs="12">
        <Element>
          <FormattedMessage id="BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelse" />
        </Element>
      </Column>
    </Row>
    <Row>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage
            id="BeregningInfoPanel.TilstøtendeYtelseForm.Ytelse"
            values={{ ytelse: ytelseType.navn }}
          />
        </Normaltekst>
      </Column>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage
            id="BeregningInfoPanel.TilstøtendeYtelseForm.BruttoBeregningsgrunnlag"
            values={{ bruttoBG: formatCurrencyNoKr(tilstøtendeYtelse.bruttoBG) }}
          />
        </Normaltekst>
      </Column>
    </Row>
    <Row>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage
            id={getProsentandelTextId(ytelseType.kode)}
            values={{ dekningsgrad: tilstøtendeYtelse.dekningsgrad }}
          />
        </Normaltekst>
      </Column>
      <Column xs="6">
        <Normaltekst>
          <FormattedMessage
            id="BeregningInfoPanel.TilstøtendeYtelseForm.Inntektskategori"
            values={{ inntektskategori: inntektskategoriString }}
          />
        </Normaltekst>
      </Column>
    </Row>
  </BorderBox>
);

YtelsePanel.propTypes = {
  tilstøtendeYtelse: PropTypes.shape().isRequired,
  inntektskategoriString: PropTypes.string.isRequired,
  ytelseType: PropTypes.shape().isRequired,
};


const mapStateToProps = (state) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  const tilstøtendeYtelse = faktaOmBeregning ? faktaOmBeregning.tilstøtendeYtelse : undefined;
  const inntektskategoriString = tilstøtendeYtelse ? getInntektskategori(tilstøtendeYtelse, state) : '';
  const ytelseType = tilstøtendeYtelse ? getKodeverkKodeOgNavn(kodeverkTyper.RELATERT_YTELSE_TYPE, tilstøtendeYtelse.ytelseType.kode)(state) : '';
  return {
    tilstøtendeYtelse: faktaOmBeregning ? faktaOmBeregning.tilstøtendeYtelse : undefined,
    inntektskategoriString,
    ytelseType,
  };
};


export default connect(mapStateToProps)(YtelsePanel);
