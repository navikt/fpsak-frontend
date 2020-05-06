import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import NyBehandlingModal from './components/NyBehandlingModal';
import MenyNyBehandlingIndex from './MenyNyBehandlingIndex';

describe('<MenyNyBehandlingIndex>', () => {
  it('skal vise modal og så henlegge behandling', () => {
    const lagNyBehandlingCallback = sinon.stub().resolves();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyNyBehandlingIndex
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      saksnummer={123}
      behandlingId={3}
      behandlingVersjon={1}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: 'BEHANDLING_TYPE',
      }}
      lagNyBehandling={lagNyBehandlingCallback}
      push={sinon.spy()}
      menyKodeverk={{}}
      opprettNyForstegangsBehandlingEnabled
      opprettRevurderingEnabled
      kanTilbakekrevingOpprettes
      uuidForSistLukkede="2323"
      erTilbakekrevingAktivert
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(NyBehandlingModal);
    expect(modal).to.have.length(1);
    modal.prop('submitCallback')({
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
    });

    const kall = lagNyBehandlingCallback.getCalls();
    expect(kall).to.have.length(1);
    expect(kall[0].args).to.have.length(6);
    expect(kall[0].args[1]).to.eql(123);
    expect(kall[0].args[2]).to.eql(3);
    expect(kall[0].args[3]).to.eql(1);
    expect(kall[0].args[4]).is.false;
    expect(kall[0].args[5]).to.eql({
      saksnummer: '123',
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
    });

    expect(lukkModalCallback.getCalls()).to.have.length(1);
  });
});
