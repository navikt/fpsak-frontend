import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Element, Normaltekst, Undertekst, EtikettLiten,
} from 'nav-frontend-typografi';

import { behandlingFormValueSelector, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import Panel from 'nav-frontend-paneler';
import { dateFormat, formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { Column, Row } from 'nav-frontend-grid';
import NaturalytelsePanel from './NaturalytelsePanel';
import { createVisningsnavnForAktivitet } from '../util/visningsnavnHelper';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const formName = 'BeregningForm';

const andelErIkkeTilkommetEllerLagtTilAvSBH = (andel) => {
  // Andelen er fastsatt før og må kunne fastsettes igjen
  if (andel.overstyrtPrAar !== null && andel.overstyrtPrAar !== undefined) {
    return true;
  }

  // Andeler som er lagt til av sbh eller tilkom før stp skal ikke kunne endres på
  return andel.erTilkommetAndel === false && andel.lagtTilAvSaksbehandler === false;
};

const finnAndelerSomSkalVises = (andeler) => {
  if (!andeler) {
    return [];
  }

  return andeler
    .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
    .filter((andel) => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};

const createTidsbegrensetText = (erTidsbegrensetArbeidsforhold) => {
  if (erTidsbegrensetArbeidsforhold) {
    return (<EtikettLiten className={beregningStyles.tekstOverflow}><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Tidsbegrenset" /></EtikettLiten>);
  }
  return ' ';
};
const createArbeidsPeriodeText = (arbeidsForhold) => {
  const periodeArr = [];

  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'startdato') && arbeidsForhold.startdato) {
    periodeArr.push(dateFormat(arbeidsForhold.startdato));
    periodeArr.push('-');
  }
  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'opphoersdato') && arbeidsForhold.opphoersdato) {
    periodeArr.push(dateFormat(arbeidsForhold.opphoersdato));
  }
  return periodeArr.join(' ');
};
const createArbeidsStillingsNavnOgProsent = (arbeidsForhold) => {
  // her må stillingsnavn og stillingsprosent hentest når vi får disse dataene
  const stillingArr = [];

  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'stillingsNavn') && arbeidsForhold.stillingsNavn) {
    stillingArr.push(arbeidsForhold.stillingsNavn);
  }
  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'stillingsProsent') && arbeidsForhold.stillingsProsent) {
    stillingArr.push(arbeidsForhold.stillingsProsent);
  }
  if (stillingArr.length !== 0) {
    return stillingArr.join(' ');
  }
  return ' ';
};

const createArbeidsIntektRows = (relevanteAndeler, bruttoFastsattInntekt, readOnly, getKodeverknavn) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const beregnetMaanedsinntekt = relevanteAndeler.reduce((acc, andel) => (acc + andel.beregnetPrAar) / 12, 0);
  const rows = relevanteAndeler.map((andel, index) => (
    <React.Fragment key={`ArbInntektWrapper${index + 1}`}>
      <Row key={`index${index + 1}`}>
        <Column xs="4" key={`ColLable${index + 1}`}>
          <Normaltekst key={`ColLableTxt${index + 1}`} className={beregningStyles.semiBoldText}>
            {createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn)}
          </Normaltekst>
        </Column>
        <Column xs="3" key={`ColSpc${index + 1}`}>
          {createTidsbegrensetText(andel.erTidsbegrensetArbeidsforhold)}
        </Column>
        <Column xs="2" key={`ColBrgMnd${index + 1}`} className={beregningStyles.rightAlignElement}>
          <Normaltekst key={`ColBrgMndTxt${index + 1}`}>
            {formatCurrencyNoKr(andel.beregnetPrAar / 12)}
          </Normaltekst>
        </Column>
        <Column xs="2" key={`ColBrgAar${index + 1}`} className={beregningStyles.rightAlignElement}>
          <Normaltekst key={`ColBrgAarTxt${index + 1}`}>
            {formatCurrencyNoKr(andel.beregnetPrAar)}
          </Normaltekst>
        </Column>
        <Column xs="1" key={`ColLink${index + 1}`} />
      </Row>
      <Row key={`indexD${index + 1}`}>
        <Column xs="4" key={`ColArbSt${index + 1}`}>
          <Normaltekst>
            {createArbeidsStillingsNavnOgProsent(andel.arbeidsforhold)}
          </Normaltekst>
        </Column>
        <Column xs="3" key={`ColArbPer${index + 1}`}>
          <Undertekst>
            {createArbeidsPeriodeText(andel.arbeidsforhold)}
          </Undertekst>
        </Column>
      </Row>
    </React.Fragment>
  ));
  if (relevanteAndeler.length > 1) {
    const summaryRow = (
      <React.Fragment key="bruttoBeregningsgrunnlag">
        <Row>
          <Column xs="12">
            <hr />
          </Column>
        </Row>
        <Row>
          <Column xs="7"><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotaltArbeidsinntekt" /></Column>
          <Column
            xs="2"
            key="ColBBgMnd"
            className={beregningStyles.rightAlignElement}
          >
            <Normaltekst>{formatCurrencyNoKr(beregnetMaanedsinntekt)}</Normaltekst>
          </Column>
          <Column
            xs="2"
            className={beregningStyles.rightAlignElementNoWrap}
          >
            <Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
          </Column>
          <Column xs="1" />
        </Row>
      </React.Fragment>
    );
    rows.push(summaryRow);
  }
  return rows;
};


/**
 * GrunnlagForAarsinntektPanelAT2
 *
 * Presentasjonskomponent. Viser beregningsgrunnlagstabellen for arbeidstakere.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer arbeidstaker.
 */
export const GrunnlagForAarsinntektPanelATImpl2 = ({
  readOnly,
  alleAndeler,
  allePerioder,
  bruttoFastsattInntekt,
  getKodeverknavn,
}) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  return (
    <>
      <Panel className={beregningStyles.panel}>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt" />
        </Element>
        <Row key="Header">
          <Column xs="4" key="ATempthy1" />
          <Column xs="3" key="ATempthy2" />
          <Column xs="2" key="ATMndHead" className={beregningStyles.rightAlignElement}>
            <Undertekst>
              <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
            </Undertekst>
          </Column>
          <Column xs="2" key="ATAarHead" className={beregningStyles.rightAlignElement}>
            <Undertekst>
              <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar" />
            </Undertekst>
          </Column>
          <Column xs="1" key="ATempthy3" />
        </Row>
        {createArbeidsIntektRows(relevanteAndeler, bruttoFastsattInntekt, readOnly, getKodeverknavn)}
      </Panel>
      <NaturalytelsePanel
        allePerioder={allePerioder}
      />
    </>
  );
};

GrunnlagForAarsinntektPanelATImpl2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bruttoFastsattInntekt: PropTypes.number,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
};

GrunnlagForAarsinntektPanelATImpl2.defaultProps = {
  bruttoFastsattInntekt: 0,
  allePerioder: undefined,
};

const mapStateToProps = (state, initialProps) => {
  const getKodeverknavn = getKodeverknavnFn(initialProps.alleKodeverk, kodeverkTyper);
  const {
    alleAndeler, behandlingId, behandlingVersjon, readOnlySubmitButton,
  } = initialProps;
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const overstyrteInntekter = relevanteAndeler.map((inntekt, index) => {
    const overstyrtInntekt = behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
      state, `inntekt${index}`,
    );
    return (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt);
  });
  const bruttoFastsattInntekt = overstyrteInntekter.reduce((a, b) => a + b);
  return {
    bruttoFastsattInntekt,
    getKodeverknavn,
    behandlingId,
    behandlingVersjon,
    readOnlySubmitButton,
  };
};

const GrunnlagForAarsinntektPanelAT2 = connect(mapStateToProps)(GrunnlagForAarsinntektPanelATImpl2);

GrunnlagForAarsinntektPanelAT2.buildInitialValues = (alleAndeler) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const initialValues = { };
  relevanteAndeler.forEach((inntekt, index) => {
    initialValues[`inntekt${index}`] = formatCurrencyNoKr(inntekt.overstyrtPrAar);
  });
  return initialValues;
};


export default injectIntl(GrunnlagForAarsinntektPanelAT2);
