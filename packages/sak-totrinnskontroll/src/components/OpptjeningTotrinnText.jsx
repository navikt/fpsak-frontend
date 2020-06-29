import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const mapAktivitetTextEndring = (arbeidsgiverNavn, orgnr, aktivitetType) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.EndringArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.EndringArbeidUtenNavn"
        values={{ a: aktivitetType, b: orgnr }}
      />
    );
  }
  return (
    <FormattedMessage
      id="ToTrinnsForm.Opptjening.EndringAktivitet"
      values={{ a: aktivitetType }}
    />
  );
};

const mapAktivitetTextUnderkjenning = (arbeidsgiverNavn, orgnr, aktivitetType) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidMedNavn"
        values={{
          a: aktivitetType, bb: arbeidsgiverNavn, c: orgnr, b: (...chunks) => <b>{chunks}</b>,
        }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidUtenNavn"
        values={{ a: aktivitetType, bb: orgnr, b: (...chunks) => <b>{chunks}</b> }}
      />
    );
  }
  return (
    <FormattedMessage
      id="ToTrinnsForm.Opptjening.UnderkjenningAktivitet"
      values={{ a: aktivitetType, b: (...chunks) => <b>{chunks}</b> }}
    />
  );
};

const mapAktivitetTextGodkjenning = (arbeidsgiverNavn, orgnr, aktivitetType) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.GodkjenningArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.GodkjenningArbeidUtenNavn"
        values={{ a: aktivitetType, b: orgnr }}
      />
    );
  }
  return (
    <FormattedMessage
      id="ToTrinnsForm.Opptjening.GodkjenningAktivitet"
      values={{ a: aktivitetType }}
    />
  );
};

/*
 * OpptjeningTotrinnText
 *

 */
export const OpptjeningTotrinnText = ({ aktivitet }) => {
  if (aktivitet.erEndring) {
    return mapAktivitetTextEndring(aktivitet.arbeidsgiverNavn, aktivitet.orgnr, aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null);
  }
  if (aktivitet.godkjent) {
    return mapAktivitetTextGodkjenning(aktivitet.arbeidsgiverNavn, aktivitet.orgnr, aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null);
  }
  return mapAktivitetTextUnderkjenning(aktivitet.arbeidsgiverNavn, aktivitet.orgnr, aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null);
};

OpptjeningTotrinnText.propTypes = {
  aktivitet: PropTypes.shape(),
};

export default OpptjeningTotrinnText;
