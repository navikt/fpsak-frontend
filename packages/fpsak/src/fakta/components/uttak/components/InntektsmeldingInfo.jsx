import React from 'react';
import PropTypes from 'prop-types';
import { Undertekst, Normaltekst, Element } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { dateFormat, calcDaysAndWeeks, TIDENES_ENDE } from 'utils/dateUtils';
import { utsettelseArsakTexts } from 'kodeverk/utsettelseArsakCodes';
import classnames from 'classnames/bind';
import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import guid from 'utils/guidUtil';
import { flatten } from 'utils/arrayUtils';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Image from 'sharedComponents/Image';
import advarselIkonUrl from 'images/advarsel.svg';

import styles from '../uttakPeriode.less';

const classNames = classnames.bind(styles);

const ElementWrapper = ({ children }) => children;

const renderAvvikContentGraderingFraSøknad = () => (
  <ElementWrapper key={guid()}>
    <VerticalSpacer eightPx />
    <FlexRow>
      <FlexColumn>
        <Image src={advarselIkonUrl} altCode="HelpText.Aksjonspunkt" />
      </FlexColumn>
      <FlexColumn>
        <Normaltekst className={classNames('avvik', 'hasAvvik')}>
          <b><FormattedMessage id="UttakInfoPanel.Gradering" /></b>
          :
          {' '}
          <FormattedMessage id="UttakInfoPanel.IkkeOppgittGradering" />
        </Normaltekst>
      </FlexColumn>
    </FlexRow>
  </ElementWrapper>
);

const renderAvvikContent = (periode, fom, tom, isGradering, avvikArbeidsprosent, avvikPeriode) => {
  const numberOfDaysAndWeeks = calcDaysAndWeeks(fom, tom, 'YYYY-MM-DD');
  const tidenesEnde = tom === TIDENES_ENDE;
  return (
    <ElementWrapper key={guid()}>
      <VerticalSpacer eightPx />
      <FlexRow>
        <FlexColumn>
          <Image src={advarselIkonUrl} altCode="HelpText.Aksjonspunkt" />
        </FlexColumn>
        <FlexColumn>
          {!isGradering && (
          <Element>
            {utsettelseArsakTexts[periode.utsettelseArsak.kode]}
:
          </Element>
          )}
          {isGradering && (
          <Element>
            <FormattedMessage id="UttakInfoPanel.Gradering" />
:
          </Element>
          )}
        </FlexColumn>
        <FlexColumn>
          <Normaltekst className={classNames('avvik', { hasAvvik: avvikPeriode })}>
            {`${dateFormat(fom)} - ${tidenesEnde ? '' : dateFormat(tom)}`}
          </Normaltekst>
          <Undertekst>
            <FormattedMessage
              id={numberOfDaysAndWeeks.id}
              values={{
                weeks: numberOfDaysAndWeeks.weeks,
                days: numberOfDaysAndWeeks.days,
              }}
            />
          </Undertekst>
          {isGradering
          && (
          <ElementWrapper>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="UttakInfoPanel.AndelIArbeid" /></Normaltekst>
            <Undertekst className={classNames('avvik', { hasAvvik: avvikArbeidsprosent })}>
              {periode.arbeidsprosent}
%
            </Undertekst>
          </ElementWrapper>
          )
        }
        </FlexColumn>
      </FlexRow>
    </ElementWrapper>
  );
};

const renderAvvik = (innmldInfo, arbeidsprosentFraSøknad, fraDato, tilDato) => {
  const inntektsmeldingInfoPerioder = innmldInfo.graderingPerioder.concat(innmldInfo.utsettelsePerioder);

  return inntektsmeldingInfoPerioder.map((periode) => {
    const isGradering = periode.arbeidsprosent !== undefined && periode.arbeidsprosent !== null;
    const avvikArbeidsprosent = periode.arbeidsprosent !== arbeidsprosentFraSøknad;
    const avvikPeriode = periode.fom !== fraDato || periode.tom !== tilDato;

    return renderAvvikContent(periode, periode.fom, periode.tom, isGradering, avvikArbeidsprosent, avvikPeriode);
  });
};

const shouldRender = (inntektsmeldingInfo) => {
  const avvik = flatten(inntektsmeldingInfo.map(innmldInfo => (
    renderAvvik(innmldInfo)
  )));
  const filteredAvvik = avvik.filter(av => av);

  return filteredAvvik.length > 0;
};

export const InntektsmeldingInfo = ({
  inntektsmeldingInfo, orgnr, virksomhetNavn, arbeidsprosentFraSøknad, fraDato, tilDato, bekreftet,
}) => {
  const manglerGraderingFraInntektsmelding = arbeidsprosentFraSøknad !== undefined
    && arbeidsprosentFraSøknad !== null && !bekreftet;
  const shouldRenderAvvik = shouldRender(inntektsmeldingInfo);
  return (
    <div>
      {shouldRenderAvvik && (
      <ElementWrapper>
        <Undertekst><FormattedMessage id="UttakInfoPanel.AvvikiInntektsmelding" /></Undertekst>
        <VerticalSpacer eightPx />
        {inntektsmeldingInfo.map((innmldInfo) => {
          const renderContent = renderAvvik(innmldInfo, arbeidsprosentFraSøknad, fraDato, tilDato).filter(rc => rc);
          const avvikArbeidforhold = innmldInfo.arbeidsgiver !== virksomhetNavn || innmldInfo.arbeidsgiverOrgnr !== orgnr;
          return (
            renderContent.length > 0 && (
              <ElementWrapper key={guid()}>
                <Element className={classNames('avvik', { hasAvvik: avvikArbeidforhold })}>
                  {`${innmldInfo.arbeidsgiver} ${innmldInfo.arbeidsgiverOrgnr}`}
                </Element>
                {renderContent}
                <VerticalSpacer twentyPx />
              </ElementWrapper>
            ));
        })}
      </ElementWrapper>
      )}
      {!shouldRenderAvvik && manglerGraderingFraInntektsmelding && (
        <ElementWrapper>
          <Undertekst><FormattedMessage id="UttakInfoPanel.AvvikiInntektsmelding" /></Undertekst>
          <VerticalSpacer eightPx />
          {inntektsmeldingInfo.map((innmldInfo) => {
            const avvikArbeidforhold = innmldInfo.arbeidsgiver !== virksomhetNavn || innmldInfo.arbeidsgiverOrgnr !== orgnr;
            return (
              <ElementWrapper key={guid()}>
                <Element className={classNames('avvik', { hasAvvik: avvikArbeidforhold })}>
                  {`${innmldInfo.arbeidsgiver} ${innmldInfo.arbeidsgiverOrgnr}`}
                </Element>
                { renderAvvikContentGraderingFraSøknad() }
                <VerticalSpacer twentyPx />
              </ElementWrapper>
            );
          })}
        </ElementWrapper>
      )}
    </div>
  );
};

InntektsmeldingInfo.defaultProps = {
  virksomhetNavn: undefined,
  orgnr: undefined,
  arbeidsprosentFraSøknad: undefined,
};

InntektsmeldingInfo.propTypes = {
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  virksomhetNavn: PropTypes.string,
  orgnr: PropTypes.string,
  arbeidsprosentFraSøknad: PropTypes.number,
};

export default InntektsmeldingInfo;
