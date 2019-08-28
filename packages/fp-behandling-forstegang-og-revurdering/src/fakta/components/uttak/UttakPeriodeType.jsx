import React from 'react';
import PropTypes from 'prop-types';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import utsettelseArsakCodes from '@fpsak-frontend/kodeverk/src/utsettelseArsakCodes';
import overforingArsakCodes, { overforingArsakTexts } from '@fpsak-frontend/kodeverk/src/overforingArsakCodes';
import oppholdArsakType from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import { Image } from '@fpsak-frontend/shared-components';
import {
  ISO_DATE_FORMAT, dateFormat, calcDaysAndWeeks,
} from '@fpsak-frontend/utils';
import editPeriodeIcon from '@fpsak-frontend/assets/images/endre.svg';
import editPeriodeDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { lagVisningsNavn } from 'behandlingForstegangOgRevurdering/src/util/visningsnavnHelper';
import styles from './uttakPeriodeType.less';

const formatProsent = (prosent) => `${prosent}%`;

const getUttakTypeTitle = (utsettelseArsak, overforingArsak, arbeidstidprosent, oppholdArsak, getKodeverknavn) => {
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
  erFrilanser,
  erSelvstendig,
  samtidigUttak,
  samtidigUttaksprosent,
  flerbarnsdager,
  oppholdArsak,
  getKodeverknavn,
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
              altCode="UttakInfoPanel.EndrePerioden"
            />
            <Image
              className={styles.removeIcon}
              src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
              onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(id)}
              altCode="UttakInfoPanel.SlettPerioden"
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
  erFrilanser: PropTypes.bool,
  erSelvstendig: PropTypes.bool,
  oppholdArsak: PropTypes.shape(),
  getKodeverknavn: PropTypes.func.isRequired,
};

UttakPeriodeType.defaultProps = {
  arbeidstidprosent: null,
  samtidigUttaksprosent: null,
  arbeidsgiver: {},
  erFrilanser: false,
  erSelvstendig: false,
  oppholdArsak: undefined,
};

export default injectKodeverk(getAlleKodeverk)(UttakPeriodeType);
