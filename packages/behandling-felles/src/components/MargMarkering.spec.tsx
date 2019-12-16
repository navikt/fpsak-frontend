import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import MargMarkering from './MargMarkering';

describe('<MargMarkering>', () => {
  const elmt = <span>test</span>;

  it('skal rendre rendre children uten marg når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallow(
      <MargMarkering
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: 'BEHANDLING_STATUS',
        }}
        aksjonspunkter={[]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(wrapper.find('span')).has.length(1);
    expect(wrapper.find('div')).has.length(0);
  });

  it('skal rendre rendre children med gul marg når det finnes åpne og løsbare aksjonspunkter', () => {
    const wrapper = shallow(
      <MargMarkering
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: 'BEHANDLING_STATUS',
        }}
        aksjonspunkter={[{
          status: {
            kode: aksjonspunktStatus.OPPRETTET,
            kodeverk: 'AKSJONSPUNKT_STATUS',
          },
          definisjon: {
            kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
            kodeverk: 'AKSJONSPUNKT_KODE',
          },
          kanLoses: true,
          erAktivt: true,
        }]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(wrapper.find('span')).has.length(1);
    const div = wrapper.find('div');
    expect(div).has.length(1);
    expect(div.prop('className')).is.eql('prosesspunkt visAksjonspunkt');
  });

  it('skal rendre rendre children med rød marg når et aksjonspunkt er sendt tilbake fra beslutter', () => {
    const wrapper = shallow(
      <MargMarkering
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: 'BEHANDLING_STATUS',
        }}
        aksjonspunkter={[{
          status: {
            kode: aksjonspunktStatus.OPPRETTET,
            kodeverk: 'AKSJONSPUNKT_STATUS',
          },
          definisjon: {
            kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
            kodeverk: 'AKSJONSPUNKT_KODE',
          },
          kanLoses: true,
          erAktivt: true,
          toTrinnsBehandling: true,
          toTrinnsBehandlingGodkjent: false,
        }]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(wrapper.find('span')).has.length(1);
    const div = wrapper.find('div');
    expect(div).has.length(1);
    expect(div.prop('className')).is.eql('prosesspunkt ikkeAkseptertAvBeslutter visAksjonspunkt');
  });
});
