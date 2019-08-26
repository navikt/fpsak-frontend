import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingsprosessForstegangOgRevIndex from './BehandlingsprosessForstegangOgRevIndex';
import { BehandlingsprosessForstegangOgRevContainer } from './BehandlingsprosessForstegangOgRevContainer';

describe('BehandlingsprosessForstegangOgRevContainer', () => {
  it('skal rendre komponent uten feil', () => {
    const props = {
      location: {},
      behandlingIdentifier: new BehandlingIdentifier(1, 1),
      behandlingVersjon: 1,
      fagsakYtelseType: { kode: fagsakYtelseType.FORELDREPENGER },
      isSelectedBehandlingHenlagt: true,
      behandlingspunkter: ['test'],
      selectedBehandlingspunkt: 'test',
      resolveProsessAksjonspunkterSuccess: true,
      behandlingStatus: { kode: behandlingStatus.OPPRETTET },
      behandlingsresultat: undefined,
      getBehandlingspunkterStatus: sinon.spy(),
      getBehandlingspunkterTitleCodes: sinon.spy(),
      getAksjonspunkterOpenStatus: sinon.spy(),
      fetchPreviewBrev: sinon.spy(),
      resolveProsessAksjonspunkter: sinon.spy(),
      resetBehandlingspunkter: sinon.spy(),
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      aksjonspunkter: [],
      overrideProsessAksjonspunkter: sinon.spy(),
    };

    const wrapper = shallow(<BehandlingsprosessForstegangOgRevContainer {...props} />);
    expect(wrapper.find(BehandlingsprosessForstegangOgRevIndex)).to.have.length(1);
  });
});
