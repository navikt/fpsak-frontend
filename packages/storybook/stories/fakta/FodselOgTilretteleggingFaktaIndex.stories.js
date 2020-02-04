import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import FodselOgTilretteleggingFaktaIndex from '@fpsak-frontend/fakta-fodsel-og-tilrettelegging';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const svangerskapspengerTilretteleggingForArbeidsgiver = {
  termindato: '2020-01-13',
  arbeidsforholdListe: [{
    tilretteleggingId: 1315951,
    tilretteleggingBehovFom: '2019-09-16',
    tilretteleggingDatoer: [{
      fom: '2019-09-16',
      type: {
        kode: tilretteleggingType.INGEN_TILRETTELEGGING,
      },
    }],
    arbeidsgiverNavn: 'WWW.EIENDOMSDRIFT.CC SA',
    arbeidsgiverIdent: '555864629',
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-09-12T18:15:52.655168',
    internArbeidsforholdReferanse: 'c5534-6e55-4112-9645-fe52ee4950c2',
    eksternArbeidsforholdReferanse: 'T555864629R5021761S1103L5555',
    skalBrukes: true,
  }, {
    tilretteleggingId: 1315919,
    tilretteleggingBehovFom: '2019-09-16',
    tilretteleggingDatoer: [{
      fom: '2019-09-16',
      type: {
        kode: tilretteleggingType.INGEN_TILRETTELEGGING,
      },
    }],
    arbeidsgiverNavn: 'WWW.EIENDOMSDRIFT.CC SA',
    arbeidsgiverIdent: '555864629',
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-09-12T18:15:52.655168',
    internArbeidsforholdReferanse: '5gb912b7-4187-45a0-8c44-02322887d0ad',
    eksternArbeidsforholdReferanse: 'H555864629R5021761S1100L5555',
    skalBrukes: true,
  }],
};

const svangerskapspengerTilretteleggingForFrilanser = {
  termindato: '2020-02-27',
  arbeidsforholdListe: [{
    tilretteleggingId: 1008653,
    tilretteleggingBehovFom: '2019-10-01',
    tilretteleggingDatoer: [{
      fom: '2019-10-01',
      type: {
        kode: tilretteleggingType.INGEN_TILRETTELEGGING,
      },
    }],
    arbeidsgiverNavn: 'Frilanser, samlet aktivitet',
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-10-24T12:06:36.548',
    skalBrukes: true,
  }, {
    tilretteleggingId: 1008654,
    tilretteleggingBehovFom: '2019-10-01',
    tilretteleggingDatoer: [{
      fom: '2019-10-01',
      type: {
        kode: tilretteleggingType.INGEN_TILRETTELEGGING,
      },
    }],
    arbeidsgiverNavn: 'Selvstendig næringsdrivende',
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-10-24T12:06:36.548',
    skalBrukes: true,
  }],
};

const inntektArbeidYtelse = {
  arbeidsforhold: [{
    id: '555864629-null',
    navn: 'WWW.EIENDOMSDRIFT.CC SA',
    arbeidsgiverIdentifikator: '555864629',
    arbeidsgiverIdentifiktorGUI: '555864629',
    kilde: {
      navn: 'AA-Registeret',
    },
    stillingsprosent: 100.00,
    skjaeringstidspunkt: '2020-01-30',
    mottattDatoInntektsmelding: '2020-01-28',
    fomDato: '2016-01-28',
    harErstattetEttEllerFlere: true,
    ikkeRegistrertIAaRegister: false,
    tilVurdering: false,
    vurderOmSkalErstattes: false,
    brukArbeidsforholdet: true,
    fortsettBehandlingUtenInntektsmelding: false,
    erNyttArbeidsforhold: false,
    erEndret: false,
    brukMedJustertPeriode: false,
    lagtTilAvSaksbehandler: false,
    basertPaInntektsmelding: false,
    permisjoner: [],
  }],
};

export default {
  title: 'fakta/fakta-fodsel-og-tilrettelegging',
  component: FodselOgTilretteleggingFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForFødselstilretteleggingForArbeidsgiver = () => (
  <FodselOgTilretteleggingFaktaIndex
    behandling={behandling}
    svangerskapspengerTilrettelegging={object('Tilrettelegging', svangerskapspengerTilretteleggingForArbeidsgiver)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
    inntektArbeidYtelse={inntektArbeidYtelse}
  />
);

export const visAksjonspunktForFødselstilretteleggingForFrilanserOgSelvstendigNæringsdrivende = () => (
  <FodselOgTilretteleggingFaktaIndex
    behandling={behandling}
    svangerskapspengerTilrettelegging={object('Tilrettelegging', svangerskapspengerTilretteleggingForFrilanser)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
    inntektArbeidYtelse={inntektArbeidYtelse}
  />
);

export const visInfoDialogForVarIkkeAnsattDaBehovetForTilretteleggingOppstod = () => {
  const inntektArbeidYtelseForAnnenArbeidsgiver = {
    arbeidsforhold: [{
      ...inntektArbeidYtelse.arbeidsforhold,
      id: '1111111-null',
      navn: 'STATOIL',
      arbeidsgiverIdentifikator: '1111111',
      arbeidsgiverIdentifiktorGUI: '1111111',
    }],
  };

  return (
    <FodselOgTilretteleggingFaktaIndex
      behandling={behandling}
      svangerskapspengerTilrettelegging={object('Tilrettelegging', svangerskapspengerTilretteleggingForArbeidsgiver)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
      inntektArbeidYtelse={inntektArbeidYtelseForAnnenArbeidsgiver}
    />
  );
};
