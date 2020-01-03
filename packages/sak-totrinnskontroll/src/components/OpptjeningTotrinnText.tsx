import React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

const mapAktivitetTextEndring = (arbeidsgiverNavn: string, orgnr: string, aktivitetType: string | null) => {
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
      <FormattedMessage id="ToTrinnsForm.Opptjening.EndringArbeidUtenNavn" values={{ a: aktivitetType, b: orgnr }} />
    );
  }
  return <FormattedMessage id="ToTrinnsForm.Opptjening.EndringAktivitet" values={{ a: aktivitetType }} />;
};

const mapAktivitetTextUnderkjenning = (arbeidsgiverNavn: string, orgnr: string, aktivitetType: string | null) => {
  if (arbeidsgiverNavn && orgnr) {
    return (
      <FormattedHTMLMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidMedNavn"
        values={{ a: aktivitetType, b: arbeidsgiverNavn, c: orgnr }}
      />
    );
  }
  if (orgnr) {
    return (
      <FormattedHTMLMessage
        id="ToTrinnsForm.Opptjening.UnderkjenningArbeidUtenNavn"
        values={{ a: aktivitetType, b: orgnr }}
      />
    );
  }
  return <FormattedHTMLMessage id="ToTrinnsForm.Opptjening.UnderkjenningAktivitet" values={{ a: aktivitetType }} />;
};

const mapAktivitetTextGodkjenning = (arbeidsgiverNavn: string, orgnr: string, aktivitetType: string | null) => {
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
  return <FormattedMessage id="ToTrinnsForm.Opptjening.GodkjenningAktivitet" values={{ a: aktivitetType }} />;
};

/*
 * OpptjeningTotrinnText
 *

 */
export const OpptjeningTotrinnText = ({ aktivitet }: OpptjeningTotrinnTextProps) => {
  if (aktivitet.erEndring) {
    return mapAktivitetTextEndring(
      aktivitet.arbeidsgiverNavn,
      aktivitet.orgnr,
      aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
    );
  }
  if (aktivitet.godkjent) {
    return mapAktivitetTextGodkjenning(
      aktivitet.arbeidsgiverNavn,
      aktivitet.orgnr,
      aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
    );
  }
  return mapAktivitetTextUnderkjenning(
    aktivitet.arbeidsgiverNavn,
    aktivitet.orgnr,
    aktivitet.aktivitetType ? aktivitet.aktivitetType.toLowerCase() : null,
  );
};

interface Aktivitet {
  erEndring: boolean;
  aktivitetType: string;
  arbeidsgiverNavn: string;
  orgnr: string;
  godkjent: boolean;
}

interface OpptjeningTotrinnTextProps {
  aktivitet: Aktivitet;
}

export default OpptjeningTotrinnText;
