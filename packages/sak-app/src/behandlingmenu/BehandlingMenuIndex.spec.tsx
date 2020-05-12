import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import MenySakIndex from '@fpsak-frontend/sak-meny';

import { BehandlingMenuIndex } from './BehandlingMenuIndex';
import MenyKodeverk from './MenyKodeverk';

const rettigheter = {
  settBehandlingPaVentAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  henleggBehandlingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  byttBehandlendeEnhetAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  opprettRevurderingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  opprettNyForstegangsBehandlingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  gjenopptaBehandlingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  opneBehandlingForEndringerAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  ikkeVisOpprettNyBehandling: {
    employeeHasAccess: false,
    isEnabled: false,
  },
};

describe('BehandlingMenuIndex', () => {
  it('skal vise meny der alle menyhandlinger er synlige', () => {
    const wrapper = shallow(<BehandlingMenuIndex
      saksnummer={123}
      behandlingId={1}
      behandlingVersion={2}
      uuid="423223"
      erKoet={false}
      erPaVent={false}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: 'BEHANDLING_TYPE',
      }}
      kanHenlegge
      kanVeilede={false}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'BEHANDLING_TYPE',
      }}
      opprettVerge={sinon.spy()}
      fjernVerge={sinon.spy()}
      behandlendeEnheter={[]}
      behandlendeEnhetId="2323"
      behandlendeEnhetNavn="NAV Viken"
      menyKodeverk={new MenyKodeverk(behandlingType.FORSTEGANGSSOKNAD)}
      previewHenleggBehandling={sinon.spy()}
      lagNyBehandling={sinon.spy()}
      kanTilbakekrevingOpprettes={{
        kanBehandlingOpprettes: false,
        kanRevurderingOpprettes: false,
      }}
      erTilbakekrevingAktivert={false}
      sjekkTilbakeKanOpprettes={sinon.spy()}
      sjekkTilbakeRevurdKanOpprettes={sinon.spy()}
      pushLocation={sinon.spy()}
      rettigheter={rettigheter}
    />);


    const meny = wrapper.find(MenySakIndex);
    expect(meny).to.have.length(1);
    const data = meny.prop('data');
    expect(data).to.have.length(7);
    expect(data[0].erSynlig).is.false;
    expect(data[0].tekst).is.eql('Fortsett behandlingen');
    expect(data[1].erSynlig).is.true;
    expect(data[1].tekst).is.eql('Sett behandlingen på vent');
    expect(data[2].erSynlig).is.true;
    expect(data[2].tekst).is.eql('Henlegg behandlingen og avslutt');
    expect(data[3].erSynlig).is.true;
    expect(data[3].tekst).is.eql('Endre behandlende enhet');
    expect(data[4].erSynlig).is.true;
    expect(data[4].tekst).is.eql('Åpne behandling for endringer');
    expect(data[5].erSynlig).is.true;
    expect(data[5].tekst).is.eql('Opprett ny behandling');
    expect(data[6].erSynlig).is.true;
    expect(data[6].tekst).is.eql('Opprett verge/fullmektig');
  });
});
