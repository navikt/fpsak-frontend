import React from 'react';
import PropTypes from 'prop-types';
import { Undertekst, Normaltekst, Element } from 'nav-frontend-typografi';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { utsettelseArsakTexts } from '@fpsak-frontend/kodeverk/src/utsettelseArsakCodes';
import classnames from 'classnames/bind';
import {
  flatten, guid, dateFormat, calcDaysAndWeeks, TIDENES_ENDE,
} from '@fpsak-frontend/utils';
import {
  FlexRow, FlexColumn, VerticalSpacer, Image,
} from '@fpsak-frontend/shared-components';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import styles from '../uttakPeriode.less';

const classNames = classnames.bind(styles);

const renderAvvikContentGraderingFraSøknad = () => (
  <React.Fragment key={guid()}>
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
  </React.Fragment>
);

const renderAvvikContentUtsettelseFraSøknad = utsettelseArsak => (
  <React.Fragment key={guid()}>
    <VerticalSpacer eightPx />
    <FlexRow>
      <FlexColumn>
        <Image src={advarselIkonUrl} altCode="HelpText.Aksjonspunkt" />
      </FlexColumn>
      <FlexColumn>
        <Normaltekst className={classNames('avvik', 'hasAvvik')}>
          <FormattedHTMLMessage
            id="UttakInfoPanel.IkkeOppgittUtsettelse"
            values={{
              årsak: utsettelseArsakTexts[utsettelseArsak.kode],
              årsakLowerCase: utsettelseArsakTexts[utsettelseArsak.kode].toLowerCase(),
            }}
          />
        </Normaltekst>
      </FlexColumn>
    </FlexRow>
  </React.Fragment>
);

const renderAvvikContent = (periode, fom, tom, isGradering, avvikArbeidsprosent, avvikPeriode) => {
  const numberOfDaysAndWeeks = calcDaysAndWeeks(fom, tom, 'YYYY-MM-DD');
  const tidenesEnde = tom === TIDENES_ENDE;
  return (
    <React.Fragment key={guid()}>
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
          <React.Fragment>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="UttakInfoPanel.AndelIArbeid" /></Normaltekst>
            <Undertekst className={classNames('avvik', { hasAvvik: avvikArbeidsprosent })}>
              {periode.arbeidsprosent}
%
            </Undertekst>
          </React.Fragment>
          )
        }
        </FlexColumn>
      </FlexRow>
    </React.Fragment>
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
  inntektsmeldingInfo, arbeidsgiver, arbeidsprosentFraSøknad, fraDato, tilDato, bekreftet, utsettelseArsak,
}) => {
  const manglerGraderingFraInntektsmelding = arbeidsprosentFraSøknad !== undefined
    && arbeidsprosentFraSøknad !== null && !bekreftet;
  const manglerUtsettelseFraInntektsmelding = utsettelseArsak && utsettelseArsak.kode !== '-' && !bekreftet;
  const shouldRenderAvvik = shouldRender(inntektsmeldingInfo);
  return (
    <div>
      {shouldRenderAvvik && (
      <React.Fragment>
        <Undertekst><FormattedMessage id="UttakInfoPanel.AvvikiInntektsmelding" /></Undertekst>
        <VerticalSpacer eightPx />
        {inntektsmeldingInfo.map((innmldInfo) => {
          const renderContent = renderAvvik(innmldInfo, arbeidsprosentFraSøknad, fraDato, tilDato).filter(rc => rc);
          const avvikArbeidforhold = innmldInfo.arbeidsgiver !== arbeidsgiver || {}.navn || innmldInfo.arbeidsgiverOrgnr !== arbeidsgiver || {}.identifikator;
          return (
            renderContent.length > 0 && (
              <React.Fragment key={guid()}>
                <Element className={classNames('avvik', { hasAvvik: avvikArbeidforhold })}>
                  {`${innmldInfo.arbeidsgiver} ${innmldInfo.arbeidsgiverOrgnr}`}
                </Element>
                {renderContent}
                <VerticalSpacer twentyPx />
              </React.Fragment>
            ));
        })}
      </React.Fragment>
      )}
      {!shouldRenderAvvik && (manglerGraderingFraInntektsmelding || manglerUtsettelseFraInntektsmelding) && (
        <React.Fragment>
          <Undertekst><FormattedMessage id="UttakInfoPanel.AvvikiInntektsmelding" /></Undertekst>
          <VerticalSpacer eightPx />
          {inntektsmeldingInfo.map((innmldInfo) => {
            const avvikArbeidforhold = innmldInfo.arbeidsgiver !== (arbeidsgiver || {}).navn
              || innmldInfo.arbeidsgiverOrgnr !== (arbeidsgiver || {}).identifikator;
            const arbeidsProsentFraInnteksmelding = innmldInfo.arbeidsProsentFraInntektsmelding !== arbeidsprosentFraSøknad;
            if (avvikArbeidforhold || arbeidsProsentFraInnteksmelding || manglerUtsettelseFraInntektsmelding) {
              return (
                <React.Fragment key={guid()}>
                  <Element className={classNames('avvik', { hasAvvik: avvikArbeidforhold })}>
                    {`${innmldInfo.arbeidsgiver} ${innmldInfo.arbeidsgiverOrgnr}`}
                  </Element>
                  {manglerGraderingFraInntektsmelding && renderAvvikContentGraderingFraSøknad()}
                  {manglerUtsettelseFraInntektsmelding && renderAvvikContentUtsettelseFraSøknad(utsettelseArsak)}
                  <VerticalSpacer twentyPx />
                </React.Fragment>
              );
            }
            return null;
          })}
        </React.Fragment>
      )}
    </div>
  );
};

InntektsmeldingInfo.defaultProps = {
  arbeidsgiver: {},
  arbeidsprosentFraSøknad: undefined,
  utsettelseArsak: undefined,
};

InntektsmeldingInfo.propTypes = {
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  arbeidsgiver: PropTypes.shape(),
  arbeidsprosentFraSøknad: PropTypes.number,
  utsettelseArsak: PropTypes.shape(),
};

export default InntektsmeldingInfo;
