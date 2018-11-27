import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Image from 'sharedComponents/Image';
import UttakTimeLineData from './UttakTimeLineData';
import DelOppPeriodeModal from './DelOppPeriodeModal';
import UttakActivity from './UttakActivity';

describe('<UttakTimeLineData>', () => {
  const selectedItem = {
    id: 1,
    fom: '',
    tom: '',
    periodeResultatType: {
      kode: '',
      navn: '',
      kodeverk: '',
    },
    periodeResultatÅrsak: {
      kode: '',
      navn: '',
      kodeverk: '',
    },
    aktiviteter: [{
      stønadskontoType: {
        kode: '',
        navn: '',
        kodeverk: '',
      },
    }],
  };
  it('skal rendre UttakTimeLineData, ikke deloppperiode, ikke readonly', () => {
    const wrapper = shallow(<UttakTimeLineData
      readOnly={false}
      periodeTyper={[]}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      callbackSetSelected={sinon.spy()}
      selectedItemData={selectedItem}
      callbackUpdateActivity={sinon.spy()}
      callbackCancelSelectedActivity={sinon.spy()}
      uttaksresultatActivity={[]}
      reduxFormChange={sinon.spy}
      behandlingFormPrefix=""
      formName=""
      activityPanelName=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
    />);
    wrapper.setState({ showDelPeriodeModal: false });
    const modal = wrapper.find(DelOppPeriodeModal);
    expect(modal).to.have.length(0);
    const message = wrapper.find('FormattedMessage');
    expect(message).to.have.length(2);
    expect(message.first().prop('id')).to.eql('UttakTimeLineData.PeriodeData.Detaljer');
    expect(message.at(1).prop('id')).to.eql('UttakTimeLineData.PeriodeData.DelOppPerioden');
    const uttakActivity = wrapper.find(UttakActivity);
    expect(uttakActivity).to.have.length(1);
    const image = wrapper.find(Image);
    expect(image).to.have.length(3);
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);
    const columns = wrapper.find('Column');
    expect(columns).to.have.length(4);
  });

  it('skal rendre UttakTimeLineData med modal og lukke modal', () => {
    const wrapper = shallow(<UttakTimeLineData
      readOnly={false}
      periodeTyper={[]}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      callbackSetSelected={sinon.spy()}
      selectedItemData={selectedItem}
      callbackUpdateActivity={sinon.spy()}
      callbackCancelSelectedActivity={sinon.spy()}
      reduxFormChange={sinon.spy}
      uttaksresultatActivity={[]}
      behandlingFormPrefix=""
      formName=""
      activityPanelName=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
    />);
    wrapper.setState({ showDelPeriodeModal: true });
    expect(wrapper.state('showDelPeriodeModal')).is.true;
    const modal = wrapper.find(DelOppPeriodeModal);
    expect(modal).to.have.length(1);
    expect(modal.first().prop('showModal')).to.eql(true);

    modal.prop('cancelEvent')();
    wrapper.update();
    expect(wrapper.state('showDelPeriodeModal')).is.false;
    expect(modal.prop('periodeData')).to.eql(selectedItem);
  });

  it('skal rendre UttakTimeLineData readOnly', () => {
    const wrapper = shallow(<UttakTimeLineData
      readOnly
      periodeTyper={[]}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      callbackSetSelected={sinon.spy()}
      selectedItemData={selectedItem}
      callbackUpdateActivity={sinon.spy()}
      callbackCancelSelectedActivity={sinon.spy()}
      reduxFormChange={sinon.spy}
      uttaksresultatActivity={[]}
      behandlingFormPrefix=""
      formName=""
      activityPanelName=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
    />);
    wrapper.setState({ showDelPeriodeModal: false });
    const modal = wrapper.find(DelOppPeriodeModal);
    expect(modal).to.have.length(0);
    const message = wrapper.find('FormattedMessage');
    expect(message).to.have.length(1);
    expect(message.first().prop('id')).to.eql('UttakTimeLineData.PeriodeData.Detaljer');
    const uttakActivity = wrapper.find(UttakActivity);
    expect(uttakActivity).to.have.length(1);
    const image = wrapper.find(Image);
    expect(image).to.have.length(2);
  });

  it('skal rendre naviagtion', () => {
    const callbackForward = sinon.spy();
    const callbackBackward = sinon.spy();
    const wrapper = shallow(<UttakTimeLineData
      readOnly={false}
      periodeTyper={[]}
      callbackForward={callbackForward}
      callbackBackward={callbackBackward}
      callbackSetSelected={sinon.spy()}
      selectedItemData={selectedItem}
      callbackUpdateActivity={sinon.spy()}
      callbackCancelSelectedActivity={sinon.spy()}
      uttaksresultatActivity={[]}
      reduxFormChange={sinon.spy}
      behandlingFormPrefix=""
      formName=""
      activityPanelName=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
    />);
    const image = wrapper.find(Image);
    expect(image).to.have.length(3);
    expect(image.at(1).prop('onMouseDown')).to.eql(callbackBackward);
    expect(image.at(1).prop('onKeyDown')).to.eql(callbackBackward);
    expect(image.at(1).prop('altCode')).to.eql('Timeline.prevPeriod');
    expect(image.at(2).prop('onMouseDown')).to.eql(callbackForward);
    expect(image.at(2).prop('onKeyDown')).to.eql(callbackForward);
    expect(image.at(2).prop('altCode')).to.eql('Timeline.nextPeriod');
  });

  it('skal rendre UttakActivity i UttakTimeLineData', () => {
    const callbackCancelSelectedActivity = sinon.spy();
    const callbackUpdateActivity = sinon.spy();
    const wrapper = shallow(<UttakTimeLineData
      isApOpen
      readOnly={false}
      periodeTyper={[]}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      callbackSetSelected={sinon.spy()}
      selectedItemData={selectedItem}
      callbackUpdateActivity={callbackUpdateActivity}
      callbackCancelSelectedActivity={callbackCancelSelectedActivity}
      uttaksresultatActivity={[]}
      reduxFormChange={sinon.spy}
      behandlingFormPrefix=""
      formName=""
      activityPanelName=""
      stonadskontoer={{}}
      harSoktOmFlerbarnsdager={false}
    />);
    const uttakActivity = wrapper.find(UttakActivity);
    expect(uttakActivity).to.have.length(1);
    expect(uttakActivity.first().prop('cancelSelectedActivity')).to.eql(callbackCancelSelectedActivity);
    expect(uttakActivity.first().prop('updateActivity')).to.eql(callbackUpdateActivity);
    expect(uttakActivity.first().prop('selectedItemData')).to.eql(selectedItem);
    expect(uttakActivity.first().prop('readOnly')).to.eql(false);
    expect(uttakActivity.first().prop('isApOpen')).to.eql(true);
    // expect(uttakActivity.first().prop('stonadskontoer')).to.eql({});
  });
});
