import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';

import { overforingArsakTexts } from '@fpsak-frontend/kodeverk/src/overforingArsakCodes';
import oppholdArsakType from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import { Image } from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeks, dateFormat, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import editPeriodeIcon from '@fpsak-frontend/assets/images/endre.svg';
import editPeriodeDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { lagVisningsNavn } from '@fpsak-frontend/fp-felles';

import styles from './uttakPeriodeType.less';

const formatProsent = (prosent) => `${prosent}%`;

const getUttakTypeTitle = (utsettelseArsak, overforingArsak, arbeidstidprosent, oppholdArsak, getKodeverknavn) => {
  if (overforingArsak !== undefined) {
    return (
      <FormattedMessage
        id="UttakInfoPanel.OverføringMedÅrsak"
        values={{ årsak: overforingArsakTexts[overforingArsak.kode] }}
      />
    );
  }

  if (utsettelseArsak !== undefined) {
    return (
      <FormattedMessage
        id="UttakInfoPanel.UtsettelseMedÅrsak"
        values={{ årsak: getKodeverknavn(utsettelseArsak) }}
      />
    );
  }

  if (oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT) {
    return (
      <FormattedMessage id="UttakInfoPanel.OppholdMedÅrsak" />
    );
  }

  if (arbeidstidprosent !== null && arbeidstidprosent !== undefined) {
    return <FormattedMessage id="UttakInfoPanel.UttakMedGradering" />;
  }

  return <FormattedMessage id="UttakInfoPanel.Uttak" />;
};

const getUttakPeriode = (uttakPeriodeType, oppholdArsak, getKodeverknavn) => {
  if (oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT) {
    return getKodeverknavn(oppholdArsak);
  }

  return getKodeverknavn(uttakPeriodeType);
};

export const UttakPeriodeType = ({ // NOSONAR
  arbeidsgiver,
  arbeidstidprosent,
  editPeriode,
  erFrilanser,
  erSelvstendig,
  flerbarnsdager,
  fraDato,
  getKodeverknavn,
  id,
  intl,
  isAnyFormOpen,
  isFromSøknad,
  isNyPeriodeFormOpen,
  openSlettPeriodeModalCallback,
  oppholdArsak,
  overforingArsak,
  readOnly,
  samtidigUttak,
  samtidigUttaksprosent,
  tilDato,
  utsettelseArsak,
  uttakPeriodeType,
}) => {
  const isAnyFormOrNyPeriodeOpen = isAnyFormOpen() || isNyPeriodeFormOpen;
  const numberOfDaysAndWeeks = calcDaysAndWeeks(fraDato, tilDato, ISO_DATE_FORMAT);
  const isGradering = arbeidstidprosent !== null && arbeidstidprosent !== undefined;
  return (
    <div className={styles.periodeType}>
      <div className={styles.headerWrapper}>
        <div>
          {isFromSøknad && <Undertekst><FormattedMessage id="UttakInfoPanel.FraSøknad" /></Undertekst>}
          <Element>{getUttakTypeTitle(utsettelseArsak, overforingArsak, arbeidstidprosent, oppholdArsak, getKodeverknavn)}</Element>
          <Normaltekst>{getUttakPeriode(uttakPeriodeType, oppholdArsak, getKodeverknavn)}</Normaltekst>
        </div>
        {!readOnly
          && (
          <div className={styles.iconContainer}>
            <Image
              className={styles.editIcon}
              src={isAnyFormOrNyPeriodeOpen ? editPeriodeDisabledIcon : editPeriodeIcon}
              onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => editPeriode(id)}
              alt={intl.formatMessage({ id: 'UttakInfoPanel.EndrePerioden' })}
            />
            <Image
              className={styles.removeIcon}
              src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
              onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(id)}
              alt={intl.formatMessage({ id: 'UttakInfoPanel.SlettPerioden' })}
            />
          </div>
          )}
      </div>
      <div className={styles.textWrapper}>
        <Element>{`${dateFormat(fraDato)} - ${dateFormat(tilDato)}`}</Element>
        <Undertekst>
          <FormattedMessage
            id={numberOfDaysAndWeeks.id}
            values={{
              weeks: numberOfDaysAndWeeks.weeks,
              days: numberOfDaysAndWeeks.days,
            }}
          />
        </Undertekst>
      </div>

      {samtidigUttak && (
        <div className={styles.textWrapper}>
          <Undertekst><FormattedMessage id="UttakInfoPanel.SamtidigUttak" /></Undertekst>
          {samtidigUttaksprosent && (
            <Normaltekst>{formatProsent(samtidigUttaksprosent)}</Normaltekst>
          )}
        </div>
      )}

      {flerbarnsdager && (
        <div className={styles.textWrapper}>
          <Undertekst><FormattedMessage id="UttakInfoPanel.Flerbarnsdager" /></Undertekst>
        </div>
      )}

      {(arbeidstidprosent === 0 || arbeidstidprosent)
        && (
        <div className={styles.textWrapper}>
          <Undertekst><FormattedMessage id="UttakInfoPanel.AndelIArbeid" /></Undertekst>
          <Normaltekst>{formatProsent(arbeidstidprosent)}</Normaltekst>
        </div>
        )}
      {isGradering
      && (
        <>
          {erFrilanser
        && (
          <div className={styles.textWrapper}>
            <Element><FormattedMessage id="UttakInfoPanel.Frilans" /></Element>
          </div>
        )}
          {erSelvstendig
        && (
          <div className={styles.textWrapper}>
            <Element><FormattedMessage id="UttakInfoPanel.Selvstendignæringsdrivende" /></Element>
          </div>
        )}
          {arbeidsgiver && arbeidsgiver.navn && (arbeidsgiver.identifikator || arbeidsgiver.aktorId)
        && (
          <div className={styles.textWrapper}>
            <Element>{lagVisningsNavn(arbeidsgiver)}</Element>
          </div>
        )}
        </>
      )}
    </div>
  );
};

UttakPeriodeType.propTypes = {
  arbeidsgiver: PropTypes.shape(),
  arbeidstidprosent: PropTypes.number,
  editPeriode: PropTypes.func.isRequired,
  erFrilanser: PropTypes.bool,
  erSelvstendig: PropTypes.bool,
  flerbarnsdager: PropTypes.bool.isRequired,
  fraDato: PropTypes.string.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  isAnyFormOpen: PropTypes.func.isRequired,
  isFromSøknad: PropTypes.bool.isRequired,
  isNyPeriodeFormOpen: PropTypes.bool.isRequired,
  openSlettPeriodeModalCallback: PropTypes.func.isRequired,
  oppholdArsak: PropTypes.shape(),
  overforingArsak: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  samtidigUttak: PropTypes.bool.isRequired,
  samtidigUttaksprosent: PropTypes.string,
  tilDato: PropTypes.string.isRequired,
  utsettelseArsak: PropTypes.shape().isRequired,
  uttakPeriodeType: PropTypes.shape().isRequired,
};

UttakPeriodeType.defaultProps = {
  arbeidsgiver: {},
  arbeidstidprosent: null,
  erFrilanser: false,
  erSelvstendig: false,
  oppholdArsak: undefined,
  samtidigUttaksprosent: null,
};

export default injectIntl(UttakPeriodeType);
