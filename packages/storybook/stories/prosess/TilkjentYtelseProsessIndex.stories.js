import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import stonadskontoType from '@fpsak-frontend/kodeverk/src/stonadskontoType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const fagsak = {
  fagsakYtelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
  },
};

const behandling = {
  id: 1,
  versjon: 1,
};

const familiehendelse = {
  gjeldende: {
    fodselsdato: '2019-01-01',
    omsorgsovertakelseDato: '2019-01-01',
  },
};

const personopplysninger = {
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
  },
};

const beregningresultat = {
  perioder: [{
    andeler: [{
      fom: '2019-01-01',
      tom: '2019-01-10',
      uttak: {
        stonadskontoType: stonadskontoType.FELLESPERIODE,
      },
      aktivitetStatus: {
        kode: aktivitetStatus.ARBEIDSTAKER,
      },
      arbeidsforholdType: {
        kode: arbeidsforholdHandlingType.NYTT_ARBEIDSFORHOLD,
        kodeverk: kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE,
      },
    }],
    fom: '2019-01-01',
    tom: '2019-01-10',
    dagsats: 1000,
  }],
};

const soknad = {
  mottattDato: '2019-01-01',
  soknadType: {
    kode: soknadType.FODSEL,
  },
  omsorgsovertakelseDato: '2019-01-10',
  fodselsdatoer: {
    1: '2019-01-01',
  },
  adopsjonFodelsedatoer: {
    1: '2019-01-01',
  },
  termindato: '2019-02-01',
};

export default {
  title: 'prosess/prosess-tilkjent-ytelse',
  component: TilkjentYtelseProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visUtenAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={object('behandling', behandling)}
    beregningresultat={beregningresultat}
    familiehendelse={familiehendelse}
    personopplysninger={object('personopplysninger', personopplysninger)}
    soknad={soknad}
    fagsak={fagsak}
    aksjonspunkter={[]}
    alleKodeverk={alleKodeverk}
    isReadOnly={boolean('isReadOnly', false)}
    submitCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', true)}
  />
);

export const visÅpentAksjonspunkt = () => (
  <TilkjentYtelseProsessIndex
    behandling={object('behandling', behandling)}
    beregningresultat={beregningresultat}
    familiehendelse={familiehendelse}
    personopplysninger={object('personopplysninger', personopplysninger)}
    soknad={soknad}
    fagsak={fagsak}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    }]}
    alleKodeverk={alleKodeverk}
    isReadOnly={boolean('isReadOnly', false)}
    submitCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', true)}
  />
);
