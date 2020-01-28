import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import relatertYtelseTilstand from '@fpsak-frontend/kodeverk/src/relatertYtelseTilstand';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import relatertYtelseType from '@fpsak-frontend/kodeverk/src/relatertYtelseType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
};

const familieHendelse = {
  gjeldende: {
    termindato: '2019-01-01',
    utstedtdato: '2019-01-01',
    antallBarnTermin: 1,
    dokumentasjonForeligger: true,
  },
};

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  utstedtdato: '2019-01-02',
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
  farSokerType: {
    kode: 'ADOPTERER_ALENE',
    kodeverk: 'FAR_SOEKER_TYPE',
  },
};

const personopplysninger = {
  aktoerId: '1',
  navn: 'Espen Utvikler',
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
  },
  personstatus: {
    kode: personstatusType.BOSATT,
  },
  barnSoktFor: [],
};
const inntektArbeidYtelse = {
  innvilgetRelatertTilgrensendeYtelserForAnnenForelder: [{
    tilgrensendeYtelserListe: [{
      status: {
        kode: relatertYtelseTilstand.LOPENDE,
      },
      periodeFraDato: '2019-01-01',
    }],
    relatertYtelseType: relatertYtelseType.FORELDREPENGER,
  }],
};
const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-omsorg-og-foreldreansvar',
  component: OmsorgOgForeldreansvarFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunktForOmsorgovertakelse = () => (
  <OmsorgOgForeldreansvarFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    personopplysninger={object('personopplysninger', personopplysninger)}
    inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.OMSORGSOVERTAKELSE,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.OMSORGSOVERTAKELSE]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);

export const visÅpentAksjonspunktForAvklareVilkårForForeldreansvar = () => (
  <OmsorgOgForeldreansvarFaktaIndex
    behandling={behandling}
    soknad={object('soknad', soknad)}
    familiehendelse={object('familiehendelse', familieHendelse)}
    personopplysninger={object('personopplysninger', personopplysninger)}
    inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);
