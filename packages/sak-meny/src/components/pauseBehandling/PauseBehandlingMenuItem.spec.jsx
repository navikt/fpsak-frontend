import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import moment from 'moment';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier, SettBehandlingPaVentForm } from '@fpsak-frontend/fp-felles';

import MenuButton from '../MenuButton';
import PauseBehandlingMenuItem from './PauseBehandlingMenuItem';
import MenyKodeverk from '../../MenyKodeverk';

describe('<PauseBehandlingMenuItem>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(123, 1);
  const menyKodeverk = new MenyKodeverk({ kode: behandlingType.FORSTEGANGSSOKNAD })
    .medFpSakKodeverk({})
    .medFpTilbakeKodeverk({});

  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      settBehandlingPaVentEnabled
      menyKodeverk={menyKodeverk}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      erPapirsoknad={false}
    />);

    expect(wrapper.find(SettBehandlingPaVentForm)).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
      setBehandlingOnHold={sinon.spy()}
      settBehandlingPaVentEnabled
      menyKodeverk={menyKodeverk}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      erPapirsoknad={false}
    />);

    const button = wrapper.find(MenuButton);
    expect(button).has.length(1);
    expect(button.prop('onMouseDown')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('mousedown');

    expect(toggleBehandlingsmenyCallback.called).is.true;
    expect(wrapper.state('showModal')).is.true;
    const modal = wrapper.find(SettBehandlingPaVentForm);
    expect(modal).has.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal skjule modal ved trykk på avbryt', () => {
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      settBehandlingPaVentEnabled
      menyKodeverk={menyKodeverk}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      erPapirsoknad={false}
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find(SettBehandlingPaVentForm);
    expect(modal).has.length(1);

    modal.prop('cancelEvent')();
    wrapper.update();

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });

  it('skal sende data til server ved trykk på ok-knapp', () => {
    const behandlingOnHoldCallback = sinon.spy();
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      setBehandlingOnHold={behandlingOnHoldCallback}
      settBehandlingPaVentEnabled
      menyKodeverk={menyKodeverk}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
      }}
      erPapirsoknad={false}
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find(SettBehandlingPaVentForm);
    expect(modal).has.length(1);

    const frist = moment().toDate();
    modal.prop('onSubmit')({ frist });
    wrapper.update();

    expect(behandlingOnHoldCallback.called).is.true;
    expect(behandlingOnHoldCallback.getCalls()[0].args).has.length(4);
    expect(behandlingOnHoldCallback.getCalls()[0].args[0]).is.eql({
      behandlingId: 1,
      behandlingVersjon: 2,
      frist,
      ventearsak: undefined,
    });
    expect(behandlingOnHoldCallback.getCalls()[0].args[1]).is.eql(behandlingIdentifier);

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });
});
