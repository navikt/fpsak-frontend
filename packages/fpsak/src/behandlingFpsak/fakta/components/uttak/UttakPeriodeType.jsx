import React from 'react';
import PropTypes from 'prop-types';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { dateFormat, calcDaysAndWeeks } from 'utils/dateUtils';
import utsettelseArsakCodes, { utsettelseArsakTexts } from 'kodeverk/utsettelseArsakCodes';
import overforingArsakCodes, { overforingArsakTexts } from 'kodeverk/overforingArsakCodes';
import oppholdArsakType, { oppholdArsakKontoNavn } from 'kodeverk/oppholdArsakType';
import Image from 'sharedComponents/Image';
import { ISO_DATE_FORMAT } from 'utils/formats';
import editPeriodeIcon from '@fpsak-frontend/assets/images/endre.svg';
import editPeriodeDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import styles from './uttakPeriodeType.less';

const formatProsent = prosent => `${prosent}%`;

const getUttakTypeTitle = (utsettelseArsak, overforingArsak, arbeidstidprosent, oppholdArsak) => {
  if (overforingArsak.kode !== overforingArsakCodes.UDEFINERT) {
    return (
      <FormattedMessage
        id="UttakInfoPanel.OverføringMedÅrsak"
        values={{ årsak: overforingArsakTexts[overforingArsak.kode] }}
      />
    );
  }

  if (utsettelseArsak.kode !== utsettelseArsakCodes.UDEFINERT) {
    return (
      <FormattedMessage
        id="UttakInfoPanel.UtsettelseMedÅrsak"
        values={{ årsak: utsettelseArsakTexts[utsettelseArsak.kode] }}
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

const getUttakPeriode = (uttakPeriodeType, oppholdArsak) => {
  if (oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT) {
    return oppholdArsakKontoNavn[oppholdArsak.kode];
  }

  return uttakPeriodeType;
};

const UttakPeriodeType = ({ // NOSONAR
  tilDato,
  fraDato,
  openSlettPeriodeModalCallback,
  id,
  editPeriode,
  isAnyFormOpen,
  isNyPeriodeFormOpen,
  readOnly,
  arbeidstidprosent,
  utsettelseArsak,
  overforingArsak,
  uttakPeriodeType,
  isFromSøknad,
  arbeidsgiver,
  erArbeidstaker,
  samtidigUttak,
  samtidigUttaksprosent,
  flerbarnsdager,
  oppholdArsak,
}) => {
  const isAnyFormOrNyPeriodeOpen = isAnyFormOpen() || isNyPeriodeFormOpen;
  const numberOfDaysAndWeeks = calcDaysAndWeeks(fraDato, tilDato, ISO_DATE_FORMAT);
  const isGradering = arbeidstidprosent !== null && arbeidstidprosent !== undefined;
  return (
    <div className={styles.periodeType}>
      <div className={styles.headerWrapper}>
        <div>
          {isFromSøknad && <Undertekst><FormattedMessage id="UttakInfoPanel.FraSøknad" /></Undertekst>}
          <Element>{getUttakTypeTitle(utsettelseArsak, overforingArsak, arbeidstidprosent, oppholdArsak)}</Element>
          <Normaltekst>{getUttakPeriode(uttakPeriodeType.navn, oppholdArsak)}</Normaltekst>
        </div>
        {!readOnly
          && (
          <div className={styles.iconContainer}>
            <Image
              className={styles.editIcon}
              src={isAnyFormOrNyPeriodeOpen ? editPeriodeDisabledIcon : editPeriodeIcon}
              onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => editPeriode(id)}
              altCode="UttakInfoPanel.EndrePerioden"
            />
            <Image
              className={styles.removeIcon}
              src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
              onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(id)}
              altCode="UttakInfoPanel.SlettPerioden"
            />
          </div>
          )
        }
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
        )
      }
      {isGradering && !erArbeidstaker
      && (
        <div className={styles.textWrapper}>
          <Element><FormattedMessage id="UttakInfoPanel.FrilansSelvstendignæringsdrivende" /></Element>
        </div>
      )
      }
      {isGradering && arbeidsgiver && arbeidsgiver.navn && arbeidsgiver.identifikator
      && (
      <div className={styles.textWrapper}>
        <Element>{`${arbeidsgiver.navn} ${arbeidsgiver.identifikator}`}</Element>
      </div>
      )
      }
    </div>
  );
};

UttakPeriodeType.propTypes = {
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  uttakPeriodeType: PropTypes.shape().isRequired,
  openSlettPeriodeModalCallback: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  editPeriode: PropTypes.func.isRequired,
  isAnyFormOpen: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  arbeidstidprosent: PropTypes.number,
  arbeidsgiver: PropTypes.shape(),
  isNyPeriodeFormOpen: PropTypes.bool.isRequired,
  utsettelseArsak: PropTypes.shape().isRequired,
  overforingArsak: PropTypes.shape().isRequired,
  isFromSøknad: PropTypes.bool.isRequired,
  flerbarnsdager: PropTypes.bool.isRequired,
  samtidigUttak: PropTypes.bool.isRequired,
  samtidigUttaksprosent: PropTypes.string,
  erArbeidstaker: PropTypes.bool,
  oppholdArsak: PropTypes.shape(),
};

UttakPeriodeType.defaultProps = {
  arbeidstidprosent: null,
  samtidigUttaksprosent: null,
  arbeidsgiver: {},
  erArbeidstaker: false,
  oppholdArsak: undefined,
};

export default UttakPeriodeType;
