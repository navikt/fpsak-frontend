import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import arbeidsforholdKilder from '@fpsak-frontend/fakta-arbeidsforhold/src/kodeverk/arbeidsforholdKilder';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
};

const arbeidsforhold = {
  navn: 'Vy',
  kilde: {
    navn: arbeidsforholdKilder.INNTEKTSMELDING,
  },
  id: '1',
  arbeidsgiverIdentifikator: '11212',
  tilVurdering: false,
  erEndret: false,
  mottattDatoInntektsmelding: '2019-01-01',
  fomDato: '2018-01-01',
  tomDato: '2019-01-01',
  stillingsprosent: 100,
  arbeidsforholdId: '1234',
  arbeidsgiverIdentifiktorGUI: '23232',
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-arbeidsforhold',
  component: ArbeidsforholdFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForAvklaringAvArbeidsforhold = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    inntektArbeidYtelse={object('inntektArbeidYtelse', {
      arbeidsforhold: [{
        ...arbeidsforhold,
        tilVurdering: true,
        mottattDatoInntektsmelding: undefined,
      }, {
        ...arbeidsforhold,
        navn: 'NSB',
        id: '2',
        tilVurdering: true,
        mottattDatoInntektsmelding: undefined,
      }],
      skalKunneLeggeTilNyeArbeidsforhold: false,
      skalKunneLageArbeidsforholdBasertPaInntektsmelding: false,
    })}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);

export const visAksjonspunktForIngenArbeidsforholdRegistrert = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    inntektArbeidYtelse={object('inntektArbeidYtelse', {
      arbeidsforhold: [],
      skalKunneLeggeTilNyeArbeidsforhold: true,
      skalKunneLageArbeidsforholdBasertPaInntektsmelding: false,
    })}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelUtenAksjonspunkter = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    inntektArbeidYtelse={object('inntektArbeidYtelse', {
      arbeidsforhold: [arbeidsforhold],
      skalKunneLeggeTilNyeArbeidsforhold: false,
      skalKunneLageArbeidsforholdBasertPaInntektsmelding: false,
    })}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{}}
    submitCallback={action('button-click')}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', false)}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelForPermisjon = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    inntektArbeidYtelse={object('inntektArbeidYtelse', {
      arbeidsforhold: [{
        ...arbeidsforhold,
        mottattDatoInntektsmelding: undefined,
        tilVurdering: true,
        permisjoner: [{
          type: {
            kode: 'PERMISJON',
          },
          permisjonFom: '2018-10-10',
          permisjonTom: '2019-10-10',
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        }],
      }],
      skalKunneLeggeTilNyeArbeidsforhold: false,
      skalKunneLageArbeidsforholdBasertPaInntektsmelding: false,
    })}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);

export const visPanelForFlerePermisjoner = () => (
  <ArbeidsforholdFaktaIndex
    behandling={behandling}
    inntektArbeidYtelse={object('inntektArbeidYtelse', {
      arbeidsforhold: [{
        ...arbeidsforhold,
        tilVurdering: true,
        permisjoner: [{
          type: {
            kode: 'PERMISJON',
          },
          permisjonFom: '2015-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        }, {
          type: {
            kode: 'PERMISJON',
          },
          permisjonFom: '2017-01-01',
          permisjonTom: '2019-01-01',
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        }],
      }],
      skalKunneLeggeTilNyeArbeidsforhold: false,
      skalKunneLageArbeidsforholdBasertPaInntektsmelding: false,
    })}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
  />
);
