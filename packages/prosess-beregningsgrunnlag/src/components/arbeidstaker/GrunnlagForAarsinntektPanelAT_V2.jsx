import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Element, Normaltekst, Undertekst, EtikettLiten,
} from 'nav-frontend-typografi';

import { behandlingFormValueSelector, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { dateFormat, formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { Column, Row } from 'nav-frontend-grid';
import { FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';

import NaturalytelsePanel2 from './NaturalytelsePanel_V2';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import LinkTilEksterntSystem from '../redesign/LinkTilEksterntSystem';


const formName = 'BeregningForm';

export const andelErIkkeTilkommetEllerLagtTilAvSBH = (andel) => {
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

const beregnbruttoFastsattInntekt = (overstyrteInntekter) => {
  if (!overstyrteInntekter || overstyrteInntekter.length === 0) return null;
  return overstyrteInntekter.reduce((sum, andel) => sum + andel, 0);
};
const createArbeidsPeriodeText = (arbeidsforhold) => {
  const periodeArr = [];

  if (Object.prototype.hasOwnProperty.call(arbeidsforhold, 'startdato') && arbeidsforhold.startdato) {
    periodeArr.push(dateFormat(arbeidsforhold.startdato));
  }
  if (Object.prototype.hasOwnProperty.call(arbeidsforhold, 'opphoersdato') && arbeidsforhold.opphoersdato) {
    periodeArr.push('-');
    periodeArr.push(dateFormat(arbeidsforhold.opphoersdato));
  }
  return periodeArr.join(' ');
};
const getEndCharFromId = (id) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');
const harDuplikateArbeidsforholdFraSammeArbeidsgiver = (Andeler) => {
  const seen = new Set();
  return Andeler.some((currentObject) => seen.size === seen.add(currentObject.arbeidsforhold.arbeidsgiverNavn).size);
};
const createArbeidsGiverNavn = (arbeidsforhold, harAndelerFraSammeArbeidsgiver, getKodeverknavn) => {
  if (!arbeidsforhold.arbeidsgiverNavn) {
    return arbeidsforhold.arbeidsforholdType ? getKodeverknavn(arbeidsforhold.arbeidsforholdType) : '';
  }
  return harAndelerFraSammeArbeidsgiver ? `${arbeidsforhold.arbeidsgiverNavn} (${getEndCharFromId(arbeidsforhold.eksternArbeidsforholdId)})`
    : arbeidsforhold.arbeidsgiverNavn;
};
const createArbeidsStillingsNavnOgProsent = (arbeidsforhold) => {
  // TODO: her må stillingsnavn og stillingsprosent hentes når vi får disse dataene fra backend
  const stillingArr = [''];
  if (Object.prototype.hasOwnProperty.call(arbeidsforhold, 'stillingsNavn') && arbeidsforhold.stillingsNavn) {
    stillingArr.push(arbeidsforhold.stillingsNavn);
  }
  if (Object.prototype.hasOwnProperty.call(arbeidsforhold, 'stillingsProsent') && arbeidsforhold.stillingsProsent) {
    stillingArr.push(`${arbeidsforhold.stillingsProsent}%`);
  }
  if (stillingArr.length !== 0) {
    return stillingArr.join(' ');
  }
  return ' ';
};

const createArbeidsIntektRows = (relevanteAndeler, getKodeverknavn, userIdent) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const beregnetMaanedsinntekt = beregnetAarsinntekt ? beregnetAarsinntekt / 12 : 0;
  const skalViseArbeidsforholdIdOgOrgNr = harDuplikateArbeidsforholdFraSammeArbeidsgiver(relevanteAndeler);
  const harFlereArbeidsforhold = relevanteAndeler.length > 1;
  const rows = relevanteAndeler.map((andel, index) => (
    <React.Fragment
      key={`ArbInntektWrapper${andel.arbeidsforhold.arbeidsgiverId}${skalViseArbeidsforholdIdOgOrgNr ? andel.arbeidsforhold.eksternArbeidsforholdId : ''}`}
    >
      <Row key={`index${index + 1}`}>
        <Column xs="7" key={`ColLable${andel.arbeidsforhold.arbeidsgiverId}`}>
          <Normaltekst key={`ColLableTxt${index + 1}`} className={beregningStyles.semiBoldText}>
            {createArbeidsGiverNavn(andel.arbeidsforhold, skalViseArbeidsforholdIdOgOrgNr, getKodeverknavn)}
          </Normaltekst>
        </Column>

        <Column key={`ColBrgMnd${andel.arbeidsforhold.arbeidsgiverId}`} xs="2" className={beregningStyles.colMaanedText}>
          <Normaltekst key={`ColBrgMndTxt${andel.arbeidsforhold.arbeidsgiverId}`}>
            {formatCurrencyNoKr(andel.beregnetPrAar / 12)}
          </Normaltekst>
        </Column>
        <Column key={`ColBrgAar${andel.arbeidsforhold.arbeidsgiverId}`} xs="2" className={beregningStyles.colAarText}>
          <Normaltekst key={`ColBrgAarTxt${andel.arbeidsforhold.arbeidsgiverId}`} className={!harFlereArbeidsforhold ? beregningStyles.semiBoldText : ''}>
            {formatCurrencyNoKr(andel.beregnetPrAar)}
          </Normaltekst>
        </Column>
        <Column xs="1" key={`ColLink${andel.arbeidsforhold.arbeidsgiverId}`} className={beregningStyles.colLink}>
          {userIdent && (
          <LinkTilEksterntSystem linkText="IM" userIdent={userIdent} type="IM" />
          )}
        </Column>
      </Row>
      <Row key={`indexD${andel.arbeidsforhold.arbeidsgiverId}`}>
        <Column xs="4" key={`ColArbSt${andel.arbeidsforhold.arbeidsgiverId}`}>
          <Normaltekst>
            {createArbeidsStillingsNavnOgProsent(andel.arbeidsforhold)}
          </Normaltekst>
        </Column>
        <Column xs="4" key={`ColArbPer${andel.arbeidsforhold.arbeidsgiverId}`}>
          <Undertekst>
            {createArbeidsPeriodeText(andel.arbeidsforhold)}
          </Undertekst>
        </Column>
        {andel.erTidsbegrensetArbeidsforhold && (
          <Column xs="2" key={`ColSpc${andel.arbeidsforhold.arbeidsgiverId}`}>
            {andel.erTidsbegrensetArbeidsforhold && (
              <EtikettLiten>
                <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Tidsbegrenset" />
              </EtikettLiten>
            )}
          </Column>
        )}
      </Row>
      <Row key={`indexSp${andel.arbeidsforhold.arbeidsgiverId}`}>
        <VerticalSpacer eightPx />
      </Row>
    </React.Fragment>
  ));
  if (relevanteAndeler.length > 1) {
    const summaryRow = (
      <React.Fragment key="bruttoBeregningsgrunnlag">
        <Row>
          <Column xs="11" className={beregningStyles.noPaddingRight}>
            <div className={beregningStyles.colDevider} />
          </Column>
        </Row>
        <Row>
          <Column xs="7"><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotaltArbeidsinntekt" /></Column>
          <Column
            key="ColBBgMnd"
            xs="2"
            className={beregningStyles.colMaanedText}
          >
            <Normaltekst>{formatCurrencyNoKr(beregnetMaanedsinntekt)}</Normaltekst>
          </Column>
          <Column
            className={beregningStyles.colAarText}
            xs="2"
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
  getKodeverknavn,
}) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  if (!relevanteAndeler || relevanteAndeler.length === 0) return null;
  const userIdent = null; // TODO denne må hentes fra brukerID enten fra brukerObjectet eller på beregningsgrunnlag må avklares
  return (
    <>
      <FlexRow>
        <FlexColumn>
          <Element>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt" />
          </Element>
        </FlexColumn>
        <FlexColumn>
          {userIdent && (
            <LinkTilEksterntSystem linkText="Aa" userIdent={userIdent} type="Aa" />
          )}
        </FlexColumn>
      </FlexRow>
      <Row key="Header">
        <Column xs="7" key="ATempthy1" />
        <Column key="ATMndHead" className={beregningStyles.colMaanedText} xs="2">
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
          </Undertekst>
        </Column>
        <Column key="ATAarHead" className={beregningStyles.colAarText} xs="2">
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar" />
          </Undertekst>
        </Column>
        <Column className={beregningStyles.colLink} xs="1" />
      </Row>
      {createArbeidsIntektRows(relevanteAndeler, getKodeverknavn, userIdent)}

      <NaturalytelsePanel2
        allePerioder={allePerioder}
      />
    </>
  );
};

GrunnlagForAarsinntektPanelATImpl2.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
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
  const bruttoFastsattInntekt = beregnbruttoFastsattInntekt(overstyrteInntekter);
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
