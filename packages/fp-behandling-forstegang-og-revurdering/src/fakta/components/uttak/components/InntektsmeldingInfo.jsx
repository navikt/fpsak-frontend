import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { Undertekst, Normaltekst, Element } from 'nav-frontend-typografi';

import {
  flatten, guid, dateFormat, calcDaysAndWeeks, TIDENES_ENDE,
} from '@fpsak-frontend/utils';
import {
  FlexRow, FlexColumn, VerticalSpacer, Image,
} from '@fpsak-frontend/shared-components';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel.svg';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';

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

const renderAvvikContentUtsettelseFraSøknad = (utsettelseArsak, getKodeverknavn) => (
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
              årsak: getKodeverknavn(utsettelseArsak),
              årsakLowerCase: getKodeverknavn(utsettelseArsak).toLowerCase(),
            }}
          />
        </Normaltekst>
      </FlexColumn>
    </FlexRow>
  </React.Fragment>
);

const renderAvvikContent = (periode, avvik, getKodeverknavn) => {
  const {
    fom, tom, arbeidsprosent,
  } = periode;
  const { isAvvikPeriode, isAvvikArbeidsprosent, isAvvikUtsettelse } = avvik;
  const numberOfDaysAndWeeks = calcDaysAndWeeks(fom, tom, 'YYYY-MM-DD');
  const isGradering = arbeidsprosent !== undefined && arbeidsprosent !== null;
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
            <Normaltekst className={classNames('avvik', { hasAvvik: isAvvikUtsettelse })}>
              {getKodeverknavn(periode.utsettelseArsak)}
:
            </Normaltekst>
          )}
          {isGradering && (
          <Element>
            <FormattedMessage id="UttakInfoPanel.Gradering" />
:
          </Element>
          )}
        </FlexColumn>
        <FlexColumn>
          <Normaltekst className={classNames('avvik', { hasAvvik: isAvvikPeriode })}>
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
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="UttakInfoPanel.AndelIArbeid" /></Normaltekst>
            <Undertekst className={classNames('avvik', { hasAvvik: isAvvikArbeidsprosent })}>
              {periode.arbeidsprosent}
%
            </Undertekst>
          </>
          )}
        </FlexColumn>
      </FlexRow>
    </React.Fragment>
  );
};

const renderAvvik = (innmldInfo, getKodeverknavn) => {
  const {
    isManglendeInntektsmelding, avvik, graderingPerioder, utsettelsePerioder,
  } = innmldInfo;
  const inntektsmeldingInfoPerioder = graderingPerioder.concat(utsettelsePerioder);

  if (isManglendeInntektsmelding) {
    if (avvik.utsettelseÅrsak) {
      return [renderAvvikContentUtsettelseFraSøknad(avvik.utsettelseÅrsak, getKodeverknavn)];
    }
    return [renderAvvikContentGraderingFraSøknad()];
  }

  return inntektsmeldingInfoPerioder.map((periode) => renderAvvikContent(periode, avvik, getKodeverknavn));
};

const shouldRender = (inntektsmeldingInfo, getKodeverknavn) => {
  const avvik = flatten(inntektsmeldingInfo.map((innmldInfo) => (
    renderAvvik(innmldInfo, getKodeverknavn)
  )));
  const filteredAvvik = avvik.filter((av) => av);

  return filteredAvvik.length > 0;
};

export const InntektsmeldingInfo = ({
  inntektsmeldingInfo,
  arbeidsgiver,
  getKodeverknavn,
}) => {
  const shouldRenderAvvik = shouldRender(inntektsmeldingInfo, getKodeverknavn);
  return (
    <>
      {shouldRenderAvvik && (
      <>
        <Undertekst><FormattedMessage id="UttakInfoPanel.AvvikiInntektsmelding" /></Undertekst>
        <VerticalSpacer eightPx />
        {inntektsmeldingInfo.map((innmldInfo) => {
          const renderContent = renderAvvik(innmldInfo, getKodeverknavn).filter((rc) => rc);
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
      </>
      )}
    </>
  );
};


InntektsmeldingInfo.propTypes = {
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  arbeidsgiver: PropTypes.shape(),
  getKodeverknavn: PropTypes.func.isRequired,
};

InntektsmeldingInfo.defaultProps = {
  arbeidsgiver: {},
};

export default injectKodeverk(getAlleKodeverk)(InntektsmeldingInfo);
