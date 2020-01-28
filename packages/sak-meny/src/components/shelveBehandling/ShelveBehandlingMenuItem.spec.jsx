import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import MenyKodeverk from '../../MenyKodeverk';
import ShelveBehandlingMenuItem from './ShelveBehandlingMenuItem';

describe('<ShelveBehandlingMenuItem>', () => {
  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<ShelveBehandlingMenuItem
      behandlingIdentifier={new BehandlingIdentifier(1, 2)}
      behandlingUuid="1"
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      shelveBehandling={sinon.spy()}
      push={sinon.spy()}
      henleggBehandlingEnabled
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      menyKodeverk={new MenyKodeverk()}
      erPapirsoknad={false}
    />);

    expect(wrapper.find('Connect(injectIntl(ReduxForm))')).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<ShelveBehandlingMenuItem
      behandlingIdentifier={new BehandlingIdentifier(1, 2)}
      behandlingUuid="1"
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
      shelveBehandling={sinon.spy()}
      push={sinon.spy()}
      henleggBehandlingEnabled
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      menyKodeverk={new MenyKodeverk()}
      erPapirsoknad={false}
    />);

    const button = wrapper.find('MenuButton');
    expect(button).has.length(1);
    expect(button.prop('onMouseDown')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('mousedown');

    expect(wrapper.state('showModal')).is.true;
    expect(toggleBehandlingsmenyCallback.called).is.true;

    const modal = wrapper.find('Connect(injectIntl(ReduxForm))');
    expect(modal).has.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal skjule modal ved trykk på avbryt', () => {
    const wrapper = shallow(<ShelveBehandlingMenuItem
      behandlingIdentifier={new BehandlingIdentifier(1, 2)}
      behandlingUuid="1"
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      shelveBehandling={sinon.spy()}
      push={sinon.spy()}
      henleggBehandlingEnabled
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      menyKodeverk={new MenyKodeverk()}
      erPapirsoknad={false}
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find('Connect(injectIntl(ReduxForm))');
    expect(modal).has.length(1);

    modal.prop('cancelEvent')();
    wrapper.update();

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(injectIntl(ReduxForm))')).has.length(0);
  });

  it('skal sende data til server og vise "behandling er henlagt"-modal ved trykk på ok-knapp', () => {
    const shelveBehandlingCallback = sinon.stub();
    const wrapper = shallow(<ShelveBehandlingMenuItem
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingUuid="1"
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      push={sinon.spy()}
      henleggBehandlingEnabled
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      menyKodeverk={new MenyKodeverk()}
      erPapirsoknad={false}
    />);
    shelveBehandlingCallback.returns({ then: () => { wrapper.setState({ showBehandlingErHenlagtModal: true }); } });

    wrapper.setState({ showBehandlingErHenlagtModal: false });
    wrapper.setState({ showModal: true });
    expect(wrapper.find('injectIntl(BehandlingenShelvedModal)')).has.length(0);
    const modal = wrapper.find('Connect(injectIntl(ReduxForm))');
    expect(modal).has.length(1);

    modal.prop('onSubmit')({
      årsakKode: 'KODE',
      begrunnelse: 'Dette er en begrunnelse',
    });
    wrapper.update();

    expect(shelveBehandlingCallback.called).is.true;
    expect(shelveBehandlingCallback.getCalls()[0].args).has.length(1);
    expect(shelveBehandlingCallback.getCalls()[0].args[0]).is.eql({
      behandlingId: 1,
      behandlingVersjon: 2,
      årsakKode: 'KODE',
      begrunnelse: 'Dette er en begrunnelse',
    });

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(injectIntl(ReduxForm))')).has.length(0);

    expect(wrapper.state('showBehandlingErHenlagtModal')).is.true;
    expect(wrapper.find('injectIntl(BehandlingenShelvedModal)')).has.length(1);
  });
});
