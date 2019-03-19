import React from 'react';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import {
  DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, createVisningsnavnForAktivitet,
} from '@fpsak-frontend/utils';
import { Element } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import faktaOmBeregningTilfelle, { harFastsettATFLInntektTilfelle } from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import moment from 'moment';
import {
  getAksjonspunkter,
  getEndringBeregningsgrunnlag,
  getFaktaOmBeregningTilfellerKoder,
  getFaktaOmBeregning,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { byggListeSomStreng } from '../tilstøtendeYtelse/YtelsePanel';
import { skalFastsetteForATUavhengigAvATFLSammeOrg, skalFastsetteForFLUavhengigAvATFLSammeOrg } from '../BgFordelingUtils';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const tilfellerSomStøtterEndringBG = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG,
  faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
  faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
  faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE,
  faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
  faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
  faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING,
  faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING,
  faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL];

export const harKunTilfellerSomStøtterEndringBG = aktivertePaneler => (aktivertePaneler && aktivertePaneler.length > 0
  && !aktivertePaneler.some(tilfelle => !tilfellerSomStøtterEndringBG.includes(tilfelle)));

export const skalViseHelptextForEndretBg = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)
&& !(!harKunTilfellerSomStøtterEndringBG(tilfeller) || harFastsettATFLInntektTilfelle(tilfeller));

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

export const getEndredeArbeidsforhold = createSelector(
  [getEndringBeregningsgrunnlag],
  (endringBG) => {
    if (endringBG) {
      return endringBG.endredeArbeidsforhold;
    }
    return [];
  },
);

const lagPeriodeStreng = (perioder) => {
  const listeMedPeriodeStrenger = perioder.map((periode) => {
    let periodeStreng = ` f.o.m. ${formatDate(periode.fom)}`;
    if (periode.tom && periode.tom !== null) {
      periodeStreng = periodeStreng.concat(` - t.o.m. ${formatDate(periode.tom)}`);
    }
    return periodeStreng;
  });
  return byggListeSomStreng(listeMedPeriodeStrenger);
};


export const createEndretArbeidsforholdString = (listOfArbeidsforhold, gjelderGradering) => {
  const listOfStrings = listOfArbeidsforhold.map((arbeidsforhold) => {
    const navnOgOrgnr = createVisningsnavnForAktivitet(arbeidsforhold);
    const periodeStreng = gjelderGradering
      ? lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erGradering }) => erGradering))
      : lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erRefusjon }) => erRefusjon));
    return navnOgOrgnr + periodeStreng;
  });
  return byggListeSomStreng(listOfStrings);
};

export const createGraderingOrRefusjonString = (graderingArbeidsforhold, refusjonArbeidsforhold) => {
  const text = [];
  if (graderingArbeidsforhold.length > 0) {
    const arbeidsforholdString = createEndretArbeidsforholdString(graderingArbeidsforhold, true);
    text.push(<FormattedMessage
      key="EndringBeregningsgrunnlagGradering"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Gradering"
      values={{ arbeidsforhold: arbeidsforholdString }}
    />);
  }
  if (refusjonArbeidsforhold.length > 0) {
    const arbeidsforholdString = createEndretArbeidsforholdString(refusjonArbeidsforhold, false);
    text.push(<FormattedMessage
      key="EndringBeregningsgrunnlagRefusjon"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Refusjon"
      values={{ arbeidsforhold: arbeidsforholdString }}
    />);
  }
  return text;
};

export const lagHelpTextsEndringBG = (endredeArbeidsforhold) => {
  const gradering = endredeArbeidsforhold
    .filter(({ perioderMedGraderingEllerRefusjon }) => perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true));
  const refusjon = endredeArbeidsforhold
    .filter(({ perioderMedGraderingEllerRefusjon }) => perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true));
  const helpTexts = createGraderingOrRefusjonString(gradering, refusjon);
  if (helpTexts.length === 2) {
    return [
      <ElementWrapper>
        {helpTexts[0]}
        <VerticalSpacer eightPx />
        {helpTexts[1]}
      </ElementWrapper>];
  }
  return helpTexts;
};

export const getHelpTextsEndringBG = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getEndredeArbeidsforhold, getAksjonspunkter],
  (aktivertePaneler, endredeArbeidsforhold, aksjonspunkter) => (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter))
    && (skalViseHelptextForEndretBg(aktivertePaneler)
      ? lagHelpTextsEndringBG(endredeArbeidsforhold) : []),
);


const erPeriodeOverlappende = (fom1, tom1, fom2, tom2) => ((tom2 === null || !moment(fom1).isAfter(moment(tom2)))
  && (tom1 === null || !moment(tom1).isBefore(moment(fom2))));


const findGraderingOrRefusjonHeading = (state, periodeFom, periodeTom) => {
  const endredeArbeidsforhold = getEndredeArbeidsforhold(state);
  const gradering = endredeArbeidsforhold
    .filter(arbeidsforhold => arbeidsforhold.perioderMedGraderingEllerRefusjon
      .filter(({ erGradering, fom, tom }) => erGradering && erPeriodeOverlappende(fom, tom, periodeFom, periodeTom)).length > 0);
  const refusjon = endredeArbeidsforhold
    .filter(arbeidsforhold => arbeidsforhold.perioderMedGraderingEllerRefusjon
      .filter(({ erRefusjon, fom, tom }) => erRefusjon && erPeriodeOverlappende(fom, tom, periodeFom, periodeTom)).length > 0);
  return createGraderingOrRefusjonString(gradering, refusjon);
};

const skalViseFastsettATFLInntektHeader = (heading, harPeriodeaarsak) => ((heading.length === 0) && !harPeriodeaarsak);

const skalViseATFLISammeOrgIHeader = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);

export const lagFastsetteATFLInntektHeader = (values, faktaOmBeregning) => {
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode);
  if (skalViseATFLISammeOrgIHeader(tilfeller)) {
    return (
      <FormattedMessage
        id="BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgFastsettATFLAlleOppdrag"
      />
    );
  }
  const skalFastsetteFL = skalFastsetteForFLUavhengigAvATFLSammeOrg(values);
  const skalFastsetteAT = skalFastsetteForATUavhengigAvATFLSammeOrg(values, faktaOmBeregning);
  if (skalFastsetteAT && skalFastsetteFL) {
    return (
      <FormattedMessage
        id="BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag"
      />
    );
  }
  if (skalFastsetteAT) {
    return (
      <FormattedMessage
        id="BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt"
      />
    );
  }
  if (skalFastsetteFL) {
    return (
      <FormattedMessage
        id="BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag"
      />
    );
  }
  return null;
};


export const createEndringHeadingForDate = (state, periodeFom, periodeTom, dateHeading, harPeriodeaarsak) => {
  const heading = findGraderingOrRefusjonHeading(state, periodeFom, periodeTom);
  const values = getFormValuesForBeregning(state);
  const faktaOmBeregning = getFaktaOmBeregning(state);
  return (
    <ElementWrapper>
      <Element>
        {heading.map((text, index) => (
          <ElementWrapper key={index === 0 ? 'gradering' : 'refusjon'}>
            {text}
          </ElementWrapper>
        ))}
        {skalViseFastsettATFLInntektHeader(heading, harPeriodeaarsak) && values && lagFastsetteATFLInntektHeader(values, faktaOmBeregning)}
        {harPeriodeaarsak
      && (
        <FormattedMessage
          id="BeregningInfoPanel.FordelingBG.FastsettMånedsbeløp"
        />
      )}
      </Element>
      <VerticalSpacer eightPx />
      {dateHeading}
    </ElementWrapper>
  );
};

export const renderDateHeading = (fom, tom) => {
  if (!tom) {
    return (
      <Element>
        <FormattedMessage
          id="BeregningInfoPanel.EndringBG.PeriodeFom"
          values={{ fom: formatDate(fom) }}
        />
      </Element>
    );
  }
  return (
    <Element>
      <FormattedMessage
        id="BeregningInfoPanel.EndringBG.PeriodeFomOgTom"
        values={{ fom: formatDate(fom), tom: formatDate(tom) }}
      />
    </Element>
  );
};

export const renderDateHeadingWithPretext = (fom, tom) => {
  if (!tom) {
    return (
      <Element>
        <FormattedMessage
          id="BeregningInfoPanel.FordelingBG.FordelingAvBruttoBGGjeldendeFom"
          values={{ fom: formatDate(fom) }}
        />
      </Element>
    );
  }
  return (
    <Element>
      <FormattedMessage
        id="BeregningInfoPanel.FordelingBG.FordelingAvBruttoBGGjeldendeFomOgTom"
        values={{ fom: formatDate(fom), tom: formatDate(tom) }}
      />
    </Element>
  );
};
