import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';


const mapAktivitetTextEndring = (arbeidsgiverNavn, orgnr, aktivitetType) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedMessage
        id="ToTrinnsForm.Opptjening.EndringArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  } if (orgnr) {
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
      <FormattedHTMLMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  } if (orgnr) {
    return (
      <FormattedHTMLMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidUtenNavn"
        values={{ a: aktivitetType, b: orgnr }}
      />
    );
  }
  return (
    <FormattedHTMLMessage
      id="ToTrinnsForm.Opptjening.UnderkjenningAktivitet"
      values={{ a: aktivitetType }}
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
  } if (orgnr) {
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
    return mapAktivitetTextEndring(aktivitet.arbeidsgiverNavn, aktivitet.orgnr, aktivitet.aktivitetType);
  }
  if (aktivitet.godkjent) {
    return mapAktivitetTextGodkjenning(aktivitet.arbeidsgiverNavn, aktivitet.orgnr, aktivitet.aktivitetType);
  }
  return mapAktivitetTextUnderkjenning(aktivitet.arbeidsgiverNavn, aktivitet.orgnr, aktivitet.aktivitetType);
};


OpptjeningTotrinnText.propTypes = {
  aktivitet: PropTypes.shape(),
};

export default OpptjeningTotrinnText;
