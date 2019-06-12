import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import moment from 'moment';
import { connect } from 'react-redux';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';

import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import {
  getAksjonspunkter,
  getEndringBeregningsgrunnlag,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const getEndredeArbeidsforhold = createSelector(
  [getEndringBeregningsgrunnlag],
  (endringBG) => {
    if (endringBG) {
      return endringBG.endredeArbeidsforhold;
    }
    return [];
  },
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


const createEndretArbeidsforholdString = (listOfArbeidsforhold, gjelderGradering, getKodeverknavn) => {
  const listOfStrings = listOfArbeidsforhold.map((arbeidsforhold) => {
    const navnOgOrgnr = createVisningsnavnForAktivitet(arbeidsforhold, getKodeverknavn);
    const periodeStreng = gjelderGradering
      ? lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erGradering }) => erGradering))
      : lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erRefusjon }) => erRefusjon));
    return navnOgOrgnr + periodeStreng;
  });
  return byggListeSomStreng(listOfStrings);
};

const createGraderingOrRefusjonString = (graderingArbeidsforhold, refusjonArbeidsforhold, getKodeverknavn) => {
  const text = [];
  if (graderingArbeidsforhold.length > 0) {
    const arbeidsforholdString = createEndretArbeidsforholdString(graderingArbeidsforhold, true, getKodeverknavn);
    text.push(<FormattedMessage
      key="EndringBeregningsgrunnlagGradering"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Gradering"
      values={{ arbeidsforhold: arbeidsforholdString }}
    />);
  }
  if (refusjonArbeidsforhold.length > 0) {
    const arbeidsforholdString = createEndretArbeidsforholdString(refusjonArbeidsforhold, false, getKodeverknavn);
    text.push(<FormattedMessage
      key="EndringBeregningsgrunnlagRefusjon"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Refusjon"
      values={{ arbeidsforhold: arbeidsforholdString }}
    />);
  }
  if (text.length < 1) {
    return text;
  }
  text.push(<FormattedMessage
    key="EndringBeregningsgrunnlagRefusjon"
    id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.FastsetÅrsbeløp"
  />);
  return text;
};

const lagHelpTextsEndringBG = (endredeArbeidsforhold, getKodeverknavn) => {
  const gradering = endredeArbeidsforhold
    .filter(({ perioderMedGraderingEllerRefusjon }) => perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true));
  const refusjon = endredeArbeidsforhold
    .filter(({ perioderMedGraderingEllerRefusjon }) => perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true));
  const helpTexts = createGraderingOrRefusjonString(gradering, refusjon, getKodeverknavn);
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

const getHelpTextsEndringBG = createSelector(
  [getEndredeArbeidsforhold, getAksjonspunkter, getAlleKodeverk],
  (endredeArbeidsforhold, aksjonspunkter, alleKodeverk) => (hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)
      ? lagHelpTextsEndringBG(endredeArbeidsforhold, getKodeverknavnFn(alleKodeverk, kodeverkTyper)) : []),
);

export const FordelingHelpTextImpl = ({
  helpText,
  isAksjonspunktClosed,
}) => (
  <AksjonspunktHelpText isAksjonspunktOpen={!isAksjonspunktClosed}>{helpText}</AksjonspunktHelpText>
);

FordelingHelpTextImpl.propTypes = {
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = state => ({
    helpText: getHelpTextsEndringBG(state),
});

export default connect(mapStateToProps)(FordelingHelpTextImpl);
