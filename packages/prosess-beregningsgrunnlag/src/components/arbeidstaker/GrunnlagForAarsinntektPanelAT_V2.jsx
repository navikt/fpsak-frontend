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
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import NaturalytelsePanel from './NaturalytelsePanel';
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


const createArbeidsPeriodeText = (arbeidsForhold) => {
  const periodeArr = [];

  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'startdato') && arbeidsForhold.startdato) {
    periodeArr.push(dateFormat(arbeidsForhold.startdato));
  }
  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'opphoersdato') && arbeidsForhold.opphoersdato) {
    periodeArr.push('-');
    periodeArr.push(dateFormat(arbeidsForhold.opphoersdato));
  }
  return periodeArr.join(' ');
};
const getEndCharFromId = (id) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');
const harDuplikateArbeidsforholdFraSammeArbeidsgiver = (Andeler) => {
  const seen = new Set();
  return Andeler.some((currentObject) => seen.size === seen.add(currentObject.arbeidsforhold.arbeidsgiverNavn).size);
};
const createArbeidsGiverNavn = (arbeidsForhold, harAndelerFraSammeArbeidsgiver) => {
  if (!arbeidsForhold.arbeidsgiverNavn) {
    return arbeidsForhold.arbeidsforholdType ? getKodeverknavn(arbeidsForhold.arbeidsforholdType) : '';
  }
  return harAndelerFraSammeArbeidsgiver ? `${arbeidsForhold.arbeidsgiverNavn} (${getEndCharFromId(arbeidsForhold.eksternArbeidsforholdId)})`
    : arbeidsForhold.arbeidsgiverNavn;
};
const createArbeidsStillingsNavnOgProsent = (arbeidsForhold) => {
  // her må stillingsnavn og stillingsprosent hentest når vi får disse dataene
  const stillingArr = [''];

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

const createArbeidsIntektRows = (relevanteAndeler, erTidsbegrensetArbeidsforhold) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const beregnetMaanedsinntekt = relevanteAndeler.reduce((acc, andel) => (acc + andel.beregnetPrAar) / 12, 0);
  const harAndelerFraSammeArbeidsgiver = harDuplikateArbeidsforholdFraSammeArbeidsgiver(relevanteAndeler);
  // TODO: Denne må refaktorres så den viser korrekt tekst for arbeidsforhold, sjekk med cecilie
  const rows = relevanteAndeler.map((andel, index) => (
    <React.Fragment key={`ArbInntektWrapper${index + 1}`}>
      <Row key={`index${index + 1}`}>
        <Column xs={erTidsbegrensetArbeidsforhold ? '5' : '7'} key={`ColLable${index + 1}`}>
          <Normaltekst key={`ColLableTxt${index + 1}`} className={beregningStyles.semiBoldText}>
            {createArbeidsGiverNavn(andel.arbeidsforhold, harAndelerFraSammeArbeidsgiver)}
          </Normaltekst>
        </Column>
        {erTidsbegrensetArbeidsforhold && (
        <Column className={beregningStyles.colTidsbegrenset} key={`ColSpc${index + 1}`}>
          {andel.erTidsbegrensetArbeidsforhold && (
          <EtikettLiten className={beregningStyles.tekstOverflow}><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Tidsbegrenset" /></EtikettLiten>
          )}
        </Column>
        )}
        <Column key={`ColBrgMnd${index + 1}`} className={beregningStyles.colMaanedText}>
          <Normaltekst key={`ColBrgMndTxt${index + 1}`}>
            {formatCurrencyNoKr(andel.beregnetPrAar / 12)}
          </Normaltekst>
        </Column>
        <Column key={`ColBrgAar${index + 1}`} className={beregningStyles.colAarText}>
          <Normaltekst key={`ColBrgAarTxt${index + 1}`}>
            {formatCurrencyNoKr(andel.beregnetPrAar)}
          </Normaltekst>
        </Column>
        <Column className={beregningStyles.colLink} key={`ColLink${index + 1}`} />
      </Row>
      <Row key={`indexD${index + 1}`}>
        <Column xs={erTidsbegrensetArbeidsforhold ? '3' : '4'} key={`ColArbSt${index + 1}`}>
          <Normaltekst>
            {createArbeidsStillingsNavnOgProsent(andel.arbeidsforhold)}
          </Normaltekst>
        </Column>
        <Column xs="2" key={`ColArbPer${index + 1}`}>
          <Undertekst>
            {createArbeidsPeriodeText(andel.arbeidsforhold)}
          </Undertekst>
        </Column>
      </Row>
      <Row key={`indexSp${index + 1}`}>
        {' '}
        <VerticalSpacer fourPx />
      </Row>
    </React.Fragment>
  ));
  if (relevanteAndeler.length > 1) {
    const summaryRow = (
      <React.Fragment key="bruttoBeregningsgrunnlag">
        <Row>
          <Column className={beregningStyles.colDevider}>
            <hr />
          </Column>
        </Row>
        <Row>
          <Column xs={erTidsbegrensetArbeidsforhold ? '5' : '7'}><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotaltArbeidsinntekt" /></Column>
          {erTidsbegrensetArbeidsforhold && (
            <Column className={beregningStyles.colTidsbegrenset} />
          )}
          <Column
            key="ColBBgMnd"
            className={beregningStyles.colMaanedText}
          >
            <Normaltekst>{formatCurrencyNoKr(beregnetMaanedsinntekt)}</Normaltekst>
          </Column>
          <Column
            className={beregningStyles.colAarText}
          >
            <Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
          </Column>
          <Column className={beregningStyles.colLink} />
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
  alleAndeler,
  allePerioder,
}) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const erTidsbegrensetArbeidsforhold = relevanteAndeler.some((andel) => andel.erTidsbegrensetArbeidsforhold);
  return (
    <>
      <Panel className={beregningStyles.panel}>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt" />
        </Element>
        <Row key="Header">
          <Column xs={erTidsbegrensetArbeidsforhold ? '5' : '7'} key="ATempthy1" />
          {erTidsbegrensetArbeidsforhold && (
            <Column className={beregningStyles.colTidsbegrenset} key="ATempthy1" />
          )}
          <Column key="ATMndHead" className={beregningStyles.colMaanedText}>
            <Undertekst>
              <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
            </Undertekst>
          </Column>
          <Column key="ATAarHead" className={beregningStyles.colAarText}>
            <Undertekst>
              <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar" />
            </Undertekst>
          </Column>
          <Column className={beregningStyles.colLink} />
        </Row>
        {createArbeidsIntektRows(relevanteAndeler, erTidsbegrensetArbeidsforhold)}
      </Panel>
      <NaturalytelsePanel
        allePerioder={allePerioder}
      />
    </>
  );
};

GrunnlagForAarsinntektPanelATImpl2.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
};

GrunnlagForAarsinntektPanelATImpl2.defaultProps = {
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
