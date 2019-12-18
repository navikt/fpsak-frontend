import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import ResumeBehandlingMenuItem from './ResumeBehandlingMenuItem';

describe('<ResumeBehandlingMenuItem>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(123, 1);

  it('skal rendre komponent', () => {
    const wrapper = shallow(<ResumeBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      resumeBehandling={sinon.spy()}
      gjenopptaBehandlingEnabled
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      erPapirsoknad={false}
    />);
    expect(wrapper.find('MenuButton')).has.length(1);
  });

  it('skal sende data til server ved trykk på ok-knapp', () => {
    const resumeBehandlingCallback = sinon.spy();
    const wrapper = shallow(<ResumeBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      resumeBehandling={resumeBehandlingCallback}
      gjenopptaBehandlingEnabled
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      erPapirsoknad={false}
    />);

    wrapper.find('MenuButton').prop('onMouseDown')();
    expect(resumeBehandlingCallback.called).is.true;
    expect(resumeBehandlingCallback.getCalls()[0].args).has.length(4);
    expect(resumeBehandlingCallback.getCalls()[0].args[0]).is.eql(behandlingIdentifier);
    expect(resumeBehandlingCallback.getCalls()[0].args[1]).is.eql({ behandlingId: 1, behandlingVersjon: 2 });
    expect(resumeBehandlingCallback.getCalls()[0].args[2]).is.eql({
      kode: behandlingType.FORSTEGANGSSOKNAD,
    });
  });
});
