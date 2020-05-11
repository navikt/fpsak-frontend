import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import SettBehandlingPaVentModal from './components/SettBehandlingPaVentModal';
import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import MenySettPaVentIndex from './MenySettPaVentIndex';

describe('<MenySettPaVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', () => {
    const setBehandlingOnHoldCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenySettPaVentIndex
      behandlingId={3}
      behandlingVersjon={1}
      settBehandlingPaVent={setBehandlingOnHoldCallback}
      ventearsaker={[]}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(SettBehandlingPaVentModal);
    expect(modal).to.have.length(1);

    modal.prop('onSubmit')({
      frist: '20-12-2020',
      ventearsak: 'test',
    });

    const kall = setBehandlingOnHoldCallback.getCalls();
    expect(kall).to.have.length(1);
    expect(kall[0].args).to.have.length(1);
    expect(kall[0].args[0]).to.eql({
      behandlingId: 3,
      behandlingVersjon: 1,
      frist: '20-12-2020',
      ventearsak: 'test',
    });
  });
});
