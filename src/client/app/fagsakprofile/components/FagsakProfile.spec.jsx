import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Systemtittel } from 'nav-frontend-typografi';

import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import BehandlingMenuIndex from 'behandlingmenu/BehandlingMenuIndex';

import FagsakProfile from './FagsakProfile';

describe('<FagsakProfile>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    type: {
      kode: 'BT-001',
      navn: 'Endringssøknad',
    },
    fagsakId: 2,
    opprettet: '2017-06-07T10:36:29.845',
    avsluttet: '2017-06-07T10:36:29.845',
    endret: '2017-06-07T10:36:29.845',
    aksjonspunkter: [
      {
        id: 1,
        definisjon: {
          navn: 'Registrer papirsøknad',
          kode: '5012',
        },
        status: {
          kode: 'OPPR',
          navn: 'test',
        },
        kanLoses: true,
      },
    ],
    status: {
      kode: 'OPPR',
      navn: 'Opprettet',
    },
    behandlingPaaVent: false,
  };

  it('skal vise en fagsak med tilhørende informasjon', () => {
    const sakstype = {
      kode: 'kode',
      navn: 'Engangsstønad',
    };
    const status = {
      kode: 'kode',
      navn: 'Opprettet',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      behandlinger={[]}
      selectedBehandlingId={behandling.id}
      showAll
      toggleShowAll={sinon.spy()}
      noExistingBehandlinger
      push={sinon.spy()}
    />);

    const h2 = wrapper.find(Systemtittel);
    expect(h2).to.have.length(1);
    expect(h2.childAt(0).text()).is.eql('Engangsstønad');

    const p = wrapper.find('Normaltekst');
    expect(p).to.have.length(1);
    expect(p.childAt(0).text()).is.eql('12345 - Opprettet');

    expect(wrapper.find(BehandlingMenuIndex)).to.have.length(1);
  });
});
