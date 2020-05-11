import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import EndreBehandlendeEnhetModal from './components/EndreBehandlendeEnhetModal';
import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import MenyEndreBehandlendeEnhetIndex from './MenyEndreBehandlendeEnhetIndex';

describe('<MenyEndreBehandlendeEnhetIndex>', () => {
  it('skal vise modal og så lagre ny enhet', () => {
    const nyBehandlendeEnhetCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyEndreBehandlendeEnhetIndex
      behandlingId={3}
      behandlingVersjon={1}
      behandlendeEnhetId="NAVV"
      behandlendeEnhetNavn="NAV Viken"
      nyBehandlendeEnhet={nyBehandlendeEnhetCallback}
      behandlendeEnheter={[{
        enhetId: 'NAVV',
        enhetNavn: 'NAV Viken',
      }, {
        enhetId: 'TEST',
        enhetNavn: 'TEST ENHET',
      }]}
      lukkModal={lukkModalCallback}
    />);

    const modal = wrapper.find(EndreBehandlendeEnhetModal);
    expect(modal).to.have.length(1);

    modal.prop('onSubmit')({
      nyEnhet: '0',
      begrunnelse: 'Dette er en begrunnelse',
    });

    const kall = nyBehandlendeEnhetCallback.getCalls();
    expect(kall).to.have.length(1);
    expect(kall[0].args).to.have.length(1);
    expect(kall[0].args[0]).to.eql({
      behandlingId: 3,
      behandlingVersjon: 1,
      enhetNavn: 'TEST ENHET',
      enhetId: 'TEST',
      begrunnelse: 'Dette er en begrunnelse',
    });

    const lukkKall = lukkModalCallback.getCalls();
    expect(lukkKall).to.have.length(1);
  });
});
