import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { MockFields } from 'testHelpers/redux-form-test-helper';


import { RegistrerVirksomhetPanel } from './RegistrerVirksomhetPanel';

describe('<RegistrerVirksomhetPanel>', () => {
  it('skal rendre korrekt når antall virksomheter er 0', () => {
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 0)}
      dispatchArrayPush={sinon.spy}
      dispatchArraySplice={sinon.spy}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      form="form"
    />);

    const image = wrapper.find('InjectIntl(Image)');
    expect(image).to.have.length(1);

    const undertekst = wrapper.find('Undertekst');
    expect(undertekst).to.have.length(1);
  });

  it('skal rendre korrekt når antall virksomheter er større enn 0', () => {
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 2)}
      dispatchArrayPush={sinon.spy}
      dispatchArraySplice={sinon.spy}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      form="form"
    />);

    const fields = wrapper.find('Field');
    expect(fields).to.have.length(2);
  });

  it('skal vise korrekt virksomhet når virksomhet blir valgt', () => {
    const virksomheter = [{ virksomhet: 'virksomhet1' }, { virksomhet: 'virksomhet2' }];
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 2)}
      dispatchArrayPush={sinon.spy}
      dispatchArraySplice={sinon.spy}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      virksomheter={virksomheter}
      form="form"
    />);

    wrapper.instance().showRegistrerVirksomhetModal(0);
    expect(wrapper.state().editVirksomhet).to.equal(virksomheter[0]);
  });

  it('skal sette valgt virksomhet til null når modal skjules', () => {
    const virksomheter = [{ virksomhet: 'virksomhet1' }, { virksomhet: 'virksomhet2' }];
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 2)}
      dispatchArrayPush={sinon.spy}
      dispatchArraySplice={sinon.spy}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      virksomheter={virksomheter}
      form="form"
    />);

    wrapper.instance().showRegistrerVirksomhetModal(0);
    expect(wrapper.state().editVirksomhet).to.equal(virksomheter[0]);

    wrapper.instance().hideRegistrerVirksomhetModal(0);
    expect(wrapper.state().editVirksomhet).to.equal(null);
    expect(wrapper.state().editIndex).to.equal(-1);
  });

  it('skal sette valgt virksomhet til null når modal skjules', () => {
    const virksomheter = [{ virksomhet: 'virksomhet1' }, { virksomhet: 'virksomhet2' }];
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 2)}
      dispatchArrayPush={sinon.spy}
      dispatchArraySplice={sinon.spy}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      virksomheter={virksomheter}
      form="form"
    />);

    wrapper.instance().showRegistrerVirksomhetModal(0);
    expect(wrapper.state().editVirksomhet).to.equal(virksomheter[0]);

    wrapper.instance().hideRegistrerVirksomhetModal(0);
    expect(wrapper.state().editVirksomhet).to.equal(null);
    expect(wrapper.state().editIndex).to.equal(-1);
  });

  it('skal legge til ny virksomhet dersom editIndex ikke er satt', () => {
    const virksomheter = [{ virksomhet: 'virksomhet1' }, { virksomhet: 'virksomhet2' }];
    const dispatchPush = sinon.spy();
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 2)}
      dispatchArrayPush={dispatchPush}
      dispatchArraySplice={sinon.spy}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      virksomheter={virksomheter}
      form="form"
    />);

    wrapper.instance().addVirksomhet({}, sinon.spy(), {
      valuesForRegisteredFieldsOnly: {
        stillingsprosent: 50,
      },
    });
    expect(dispatchPush.called).is.true;
  });

  it('skal endre eksisterende virksomhet dersom editIndex er satt', () => {
    const virksomheter = [{ virksomhet: 'virksomhet1' }, { virksomhet: 'virksomhet2' }];
    const dispatchPush = sinon.spy();
    const dispatchSplice = sinon.spy();
    const wrapper = shallow(<RegistrerVirksomhetPanel
      fields={new MockFields('virksomhet', 2)}
      dispatchArrayPush={dispatchPush}
      dispatchArraySplice={dispatchSplice}
      meta={{}}
      namePrefix="regvirk"
      formatMessage={sinon.spy()}
      virksomheter={virksomheter}
      form="form"
    />);

    wrapper.instance().showRegistrerVirksomhetModal(1);
    wrapper.instance().addVirksomhet({}, sinon.spy(), {
      valuesForRegisteredFieldsOnly: {
        stillingsprosent: 50,
      },
    });
    expect(dispatchSplice.called).is.true;
  });
});
