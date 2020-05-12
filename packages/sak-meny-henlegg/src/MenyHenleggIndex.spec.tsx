import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import HenleggBehandlingModal from './components/HenleggBehandlingModal';
import HenlagtBehandlingModal from './components/HenlagtBehandlingModal';
import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import MenyHenleggIndex from './MenyHenleggIndex';

describe('<MenyHenleggIndex>', () => {
  it('skal vise modal og så henlegge behandling', () => {
    const henleggBehandlingCallback = sinon.stub().resolves();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyHenleggIndex
      behandlingId={3}
      behandlingVersjon={1}
      henleggBehandling={henleggBehandlingCallback}
      forhandsvisHenleggBehandling={sinon.spy()}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: 'BEHANDLING_TYPE',
      }}
      behandlingUuid="2323"
      behandlingResultatTyper={[]}
      gaaTilSokeside={sinon.spy()}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(HenleggBehandlingModal);
    expect(modal).to.have.length(1);
    expect(wrapper.find(HenlagtBehandlingModal)).to.have.length(0);
    modal.prop('onSubmit')({
      årsakKode: 'test',
      begrunnelse: 'Dette er en begrunnelse',
    });

    const kall = henleggBehandlingCallback.getCalls();
    expect(kall).to.have.length(1);
    expect(kall[0].args).to.have.length(1);
    expect(kall[0].args[0]).to.eql({
      behandlingId: 3,
      behandlingVersjon: 1,
      årsakKode: 'test',
      begrunnelse: 'Dette er en begrunnelse',
    });
  });
});
