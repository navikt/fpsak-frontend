import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import SettBehandlingPaVentForm from 'behandling/components/SettBehandlingPaVentForm';
import MessagesModal from './components/MessagesModal';
import { MessagesIndex } from './MessagesIndex';
import Messages from './components/Messages';

describe('<MessagesIndex>', () => {
  const recipients = ['Søker', 'Annen person'];
  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
  ];
  const behandlingIdentifier = new BehandlingIdentifier(1234, 1);

  it('skal vise messages når mottakere og brevmaler har blitt hentet fra server', () => {
    const templates2 = [
      { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
      { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
      { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
    ];

    const wrapper = shallow(<MessagesIndex
      submitFinished={false}
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates2}
      fetchPreview={sinon.spy()}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
    />);

    const messages = wrapper.find(Messages);
    expect(messages).to.have.length(1);
    expect(messages.prop('recipients')).to.eql(recipients);
    expect(messages.prop('templates')).to.eql(templates2);
  });

  it('skal sette default tom streng ved forhåndsvisning dersom fritekst ikke er fylt ut', () => {
    const fetchPreviewFunction = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished={false}
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates}
      fetchPreview={fetchPreviewFunction}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
    />);

    const previewCallback = wrapper.find(Messages).prop('previewCallback');
    previewCallback({ mottaker: 'Søker', brevmalkode: 'Mal1' });

    expect(fetchPreviewFunction).to.have.property('callCount', 1);
    expect(fetchPreviewFunction.getCall(0).args[0].fritekst).to.equal(' ');
  });

  it('skal resette fritekst ved lukking av modal', () => {
    const resetSubmitMessageFunction = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates}
      fetchPreview={sinon.spy()}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={resetSubmitMessageFunction}
      push={sinon.spy()}
    />);
    wrapper.setState({ showMessagesModal: true });

    wrapper.find(MessagesModal).prop('closeEvent')();

    expect(resetSubmitMessageFunction).to.have.property('callCount', 1);
    const { args } = resetSubmitMessageFunction.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql(behandlingIdentifier);

    expect(wrapper.state().showMessagesModal).is.false;
  });

  it('skal sende melding', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
    />);

    const message = {
      mottaker: 'Espen Utvikler',
      brevmalkode: 'testkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };
    wrapper.find(Messages).prop('submitCallback')(message);

    expect(submitMessageCallback).to.have.property('callCount', 1);
    const { args } = submitMessageCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og ikke sette saken på vent hvis ikke INNHENT_DOK', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'testbrevkode',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    wrapper.find(Messages).prop('submitCallback')(message);

    expect(wrapper.state().showMessagesModal).is.true;
    expect(wrapper.state().showSettPaVentModal).is.false;

    expect(submitMessageCallback).to.have.property('callCount', 1);
    const { args } = submitMessageCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal sende melding og sette saken på vent hvis INNHENT_DOK', () => {
    const submitMessageCallback = sinon.stub().returns(Promise.resolve());
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates}
      fetchPreview={sinon.spy()}
      submitMessage={submitMessageCallback}
      setBehandlingOnHold={sinon.spy()}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={sinon.spy()}
    />);

    const message = {
      mottaker: 'Michal Utvikler',
      brevmalkode: 'INNHEN',
      fritekst: 'Dette er en tekst',
      arsakskode: undefined,
    };

    wrapper.find(Messages).prop('submitCallback')(message);

    expect(wrapper.state().showMessagesModal).is.false;
    expect(wrapper.state().showSettPaVentModal).is.true;

    expect(submitMessageCallback).to.have.property('callCount', 1);
    const { args } = submitMessageCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      behandlingId: 1,
      mottaker: message.mottaker,
      brevmalkode: message.brevmalkode,
      fritekst: message.fritekst,
      arsakskode: undefined,
    });
  });

  it('skal håndtere melding fra modal', () => {
    const setBehandlingOnHoldCallback = sinon.stub().returns(Promise.resolve());
    const pushCallback = sinon.spy();
    const wrapper = shallow(<MessagesIndex
      submitFinished
      behandlingIdentifier={behandlingIdentifier}
      selectedBehandlingVersjon={123}
      selectedBehandlingSprak={{}}
      recipients={recipients}
      templates={templates}
      fetchPreview={sinon.spy()}
      submitMessage={sinon.spy()}
      setBehandlingOnHold={setBehandlingOnHoldCallback}
      resetReduxForm={sinon.spy()}
      resetSubmitMessage={sinon.spy()}
      push={pushCallback}
    />);
    wrapper.setState({ showSettPaVentModal: true });

    const formValues = {
      frist: '2017-10-10',
      ventearsak: 'TEST',
    };
    wrapper.find(SettBehandlingPaVentForm).prop('onSubmit')(formValues);

    expect(setBehandlingOnHoldCallback).to.have.property('callCount', 1);
    const { args } = setBehandlingOnHoldCallback.getCalls()[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql({
      behandlingId: 1,
      behandlingVersjon: 123,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    });
    expect(args[1]).to.eql(behandlingIdentifier);

    expect(pushCallback).to.have.property('callCount', 1);
    expect(pushCallback.getCalls()[0].args).to.have.length(1);
    expect(pushCallback.getCalls()[0].args[0]).to.eql('/');

    expect(wrapper.state().showSettPaVentModal).is.false;
  });
});
