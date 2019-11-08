import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { behandlingFormValueSelector, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import Panel from 'nav-frontend-paneler';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { Column, Row } from 'nav-frontend-grid';
import NaturalytelsePanel from './NaturalytelsePanel';
import createExternalLink from '../redesign/LinkTilEksterntSystem';
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


const createArbeidsPeriodeText = (arbeidsForhold) => {
  const periodeArr = [];
  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'startdato') && arbeidsForhold.startdato) {
    periodeArr.push(arbeidsForhold.startdato);
  }
  if (Object.prototype.hasOwnProperty.call(arbeidsForhold, 'opphoersdato') && arbeidsForhold.opphoersdato) {
    periodeArr.push('-');
    periodeArr.push(arbeidsForhold.opphoersdato);
  }
  return periodeArr.join(' ');
};

const createArbeidsIntektRows = (relevanteAndeler, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed, getKodeverknavn) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const beregnetMaanedsinntekt = relevanteAndeler.reduce((acc, andel) => (acc + andel.beregnetPrAar) / 12, 0);
  const rows = relevanteAndeler.map((andel, index) => (
    <Row key={`index${index + 1}`}>
      <Column xs="4" key={`ColLable${index + 1}`}>
        <Normaltekst key={`ColLableTxt${index + 1}`}>
          {createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn)}
        </Normaltekst>
      </Column>
      <Column xs="2" key={`ColSpc${index + 1}`}>
        <Normaltekst key={`ColSpcTxt${index + 1}`}>
          {createArbeidsPeriodeText(andel.arbeidsforhold)}
        </Normaltekst>
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
      <Column xs="2" key={`ColLink${index + 1}`}>
        {createExternalLink('IM', `Link${index + 1}`)}
      </Column>
    </Row>
  ));
  if (relevanteAndeler.length > 1) {
    const summaryRow = (
      <>
        <Row key="bruttoBeregningsgrunnlagLine">
          <Column xs="11" key="Colline">
            <hr key="hrLine" />
          </Column>
        </Row>
        <Row key="bruttoBeregningsgrunnlag">
          <Column key="ColBBTitle" xs="6"><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.TotaltArbeidsinntekt" key="BBTitle" /></Column>
          <Column
            xs="2"
            key="ColBBgMnd"
            className={beregningStyles.rightAlignElement}
          >
            <Normaltekst key="BBMndValue">{formatCurrencyNoKr(beregnetMaanedsinntekt)}</Normaltekst>
          </Column>
          <Column
            xs="2"
            key="ColBBgAar"
            className={beregningStyles.rightAlignElementNoWrap}
          >
            <Element key="BBAarValue">{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
          </Column>
          <Column xs="2" key="BBEmpty2" />
        </Row>
      </>
    );
    rows.push(summaryRow);
  }
  return rows;
};


/**
 * GrunnlagForAarsinntektPanelAT
 *
 * Presentasjonskomponent. Viser beregningsgrunnlagstabellen for arbeidstakere.
 * Ved aksjonspunkt vil tabellen ha en kolonne med input felter med en rad per arbeidsgiver.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer arbeidstaker.
 */
export const GrunnlagForAarsinntektPanelATImpl = ({
  readOnly,
  alleAndeler,
  allePerioder,
  bruttoFastsattInntekt,
  isAksjonspunktClosed,
  getKodeverknavn,
}) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  return (
    <>
      <Panel>
        <Normaltekst className={beregningStyles.semiBoldText}>
          <FormattedHTMLMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt" />
          {createExternalLink('Aa')}
        </Normaltekst>

        <Row key="Header">
          <Column xs="4" key="ATempthy1" />
          <Column xs="2" key="ATempthy2" />
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
          <Column xs="2" key="ATempthy3" />
        </Row>
        {createArbeidsIntektRows(relevanteAndeler, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed, getKodeverknavn)}

      </Panel>
      <NaturalytelsePanel
        allePerioder={allePerioder}
      />
    </>
  );
};

GrunnlagForAarsinntektPanelATImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bruttoFastsattInntekt: PropTypes.number,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
};

GrunnlagForAarsinntektPanelATImpl.defaultProps = {
  bruttoFastsattInntekt: 0,
  allePerioder: undefined,
};

const mapStateToProps = (state, initialProps) => {
  const getKodeverknavn = getKodeverknavnFn(initialProps.alleKodeverk, kodeverkTyper);
  const {
    alleAndeler, aksjonspunkter, behandlingId, behandlingVersjon, readOnlySubmitButton,
  } = initialProps;
  const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  const closedAps = aksjonspunkt ? !isAksjonspunktOpen(aksjonspunkt.status.kode) : false;
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const overstyrteInntekter = relevanteAndeler.map((inntekt, index) => {
    const overstyrtInntekt = behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
      state, `inntekt${index}`,
    );
    return (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt);
  });
  const bruttoFastsattInntekt = overstyrteInntekter.reduce((a, b) => a + b);
  return {
    isAksjonspunktClosed: closedAps,
    bruttoFastsattInntekt,
    getKodeverknavn,
    behandlingId,
    behandlingVersjon,
    readOnlySubmitButton,
  };
};

const GrunnlagForAarsinntektPanelAT = connect(mapStateToProps)(GrunnlagForAarsinntektPanelATImpl);

GrunnlagForAarsinntektPanelAT.buildInitialValues = (alleAndeler) => {
  const relevanteAndeler = finnAndelerSomSkalVises(alleAndeler);
  const initialValues = { };
  relevanteAndeler.forEach((inntekt, index) => {
    initialValues[`inntekt${index}`] = formatCurrencyNoKr(inntekt.overstyrtPrAar);
  });
  return initialValues;
};

GrunnlagForAarsinntektPanelAT.transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode) => {
  let inntektPrAndelList = null;
  let frilansInntekt = null;
  if (relevanteStatuser.isArbeidstaker) {
    inntektPrAndelList = finnAndelerSomSkalVises(alleAndelerIForstePeriode)
      .map(({ andelsnr }, index) => {
        const overstyrtInntekt = values[`inntekt${index}`];
        return {
          inntekt: (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt),
          andelsnr,
        };
      });
  }
  if (relevanteStatuser.isFrilanser) {
    frilansInntekt = removeSpacesFromNumber(values.inntektFrilanser);
  }
  return {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: values.ATFLVurdering,
    inntektFrilanser: frilansInntekt,
    inntektPrAndelList,
  };
};

export default injectIntl(GrunnlagForAarsinntektPanelAT);
