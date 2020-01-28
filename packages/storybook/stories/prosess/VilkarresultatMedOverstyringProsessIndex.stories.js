import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import withReduxProvider from '../../decorators/withRedux';

const avslagsarsaker = [{
  kode: 'AVSLAG_TEST_1',
  navn: 'Dette er en avslagsårsak',
}, {
  kode: 'AVSLAG_TEST_2',
  navn: 'Dette er en annen avslagsårsak',
}];

export default {
  title: 'prosess/prosess-vilkar-overstyring',
  component: VilkarresultatMedOverstyringProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visOverstyringspanelForFødsel = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={{
        id: 1,
        versjon: 1,
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
        },
      }}
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      status={vilkarUtfallType.OPPFYLT}
      panelTittelKode="Inngangsvilkar.Fodselsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYR_FODSELSVILKAR}
      erMedlemskapsPanel={false}
    />
  );
};

export const visOverstyringspanelForMedlemskap = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={{
        id: 1,
        versjon: 1,
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
        },
      }}
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      status={vilkarUtfallType.OPPFYLT}
      panelTittelKode="Inngangsvilkar.Medlemskapsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR}
      erMedlemskapsPanel
    />
  );
};

export const visOverstyrtAksjonspunktSomErBekreftet = () => (
  <VilkarresultatMedOverstyringProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      type: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      behandlingsresultat: {
        avslagsarsak: {
          kode: 'AVSLAG_TEST_1',
        },
      },
    }}
    medlemskap={{
      fom: '2019-01-01',
    }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCode.OVERSTYR_FODSELSVILKAR,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
      kanLoses: false,
      begrunnelse: 'Dette er en begrunnelse',
    }]}
    submitCallback={action('button-click')}
    overrideReadOnly={boolean('overrideReadOnly', false)}
    kanOverstyreAccess={object('kanOverstyreAccess', {
      isEnabled: true,
    })}
    toggleOverstyring={action('button-click')}
    erOverstyrt={boolean('erOverstyrt', false)}
    avslagsarsaker={avslagsarsaker}
    status={vilkarUtfallType.IKKE_OPPFYLT}
    panelTittelKode="Inngangsvilkar.Fodselsvilkaret"
    lovReferanse="§§ Dette er en lovreferanse"
    overstyringApKode={aksjonspunktCode.OVERSTYR_FODSELSVILKAR}
    erMedlemskapsPanel={false}
  />
);
