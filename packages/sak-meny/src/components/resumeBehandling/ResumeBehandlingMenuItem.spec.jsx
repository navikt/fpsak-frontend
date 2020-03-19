import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import ResumeBehandlingMenuItem from './ResumeBehandlingMenuItem';

describe('<ResumeBehandlingMenuItem>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<ResumeBehandlingMenuItem
      behandlingId={1}
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
      behandlingId={1}
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
    expect(resumeBehandlingCallback.getCalls()[0].args).has.length(1);
    expect(resumeBehandlingCallback.getCalls()[0].args[0]).is.eql({ behandlingId: 1, behandlingVersjon: 2 });
  });
});
