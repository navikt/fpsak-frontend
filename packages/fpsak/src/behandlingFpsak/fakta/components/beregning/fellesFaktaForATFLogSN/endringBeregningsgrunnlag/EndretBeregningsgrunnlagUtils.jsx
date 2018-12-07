import React from 'react';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import { Element } from 'nav-frontend-typografi';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import moment from 'moment';
import {
  getAksjonspunkter,
  getEndringBeregningsgrunnlag,
  getFaktaOmBeregningTilfellerKoder,
} from 'behandlingFpsak/behandlingSelectors';
import { byggListeSomStreng } from '../tilstøtendeYtelse/YtelsePanel';


const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const tilfellerSomStøtterEndringBG = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG,
  faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
  faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];

export const harKunTilfellerSomStøtterEndringBG = aktivertePaneler => (aktivertePaneler && aktivertePaneler.length > 0
  && !aktivertePaneler.some(tilfelle => !tilfellerSomStøtterEndringBG.includes(tilfelle)));


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
    && (harKunTilfellerSomStøtterEndringBG(aktivertePaneler)
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

export const createEndringHeadingForDate = (state, periodeFom, periodeTom, dateHeading, harPeriodeaarsak) => {
  const heading = findGraderingOrRefusjonHeading(state, periodeFom, periodeTom);
  return (
    <ElementWrapper>
      <Element>
        {heading.map((text, index) => (
          <ElementWrapper key={index === 0 ? 'gradering' : 'refusjon'}>
            {text}
          </ElementWrapper>
        ))}
        {harPeriodeaarsak
      && (
        <FormattedMessage
          id="BeregningInfoPanel.FordelingBG.FastsettÅrsbeløp"
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
