import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Timeline from 'react-visjs-timeline';
import UttakTimeLine from './UttakTimeLine';
import TimeLineControl from '../tilkjentYtelse/timeline/TimeLineControl';
import TimeLineSokerEnsamSoker from '../tilkjentYtelse/timeline/TimeLineSokerEnsamSoker';
import TimeLineSoker from '../tilkjentYtelse/timeline/TimeLineSoker';

describe('<UttakTimeLine>', () => {
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
    perioder: [{
      stønadskontoType: {
        kode: '',
        navn: '',
        kodeverk: '',
        fom: '',
      },
      uttakPeriodeType: {
        kode: '',
        navn: '',
        kodeverk: '',
      },
    }],
  };

  it('skal rendre UttakTimeLine', () => {
    const openPeriodInfo = sinon.spy();
    const selectPeriodCallback = sinon.spy();
    const wrapper = shallow(<UttakTimeLine
      selectedPeriod={selectedItem}
      customTimes={{}}
      uttakPerioder={[{ fom: '2018-01-01', name: 'notEmpty period' }]}
      selectPeriodCallback={selectPeriodCallback}
      openPeriodInfo={openPeriodInfo}
      hovedsokerKjonnKode="M"
    />);
    const timelineEnsomSoker = wrapper.find(TimeLineSokerEnsamSoker);
    expect(timelineEnsomSoker).to.have.length(1);
    expect(timelineEnsomSoker.first().prop('hovedsokerKjonnKode')).to.eql('M');

    const timeline = wrapper.find(Timeline);
    expect(timeline).to.have.length(1);
    expect(timeline.first().prop('selection')).to.eql([1]);
    expect(timeline.first().prop('selectHandler')).to.eql(selectPeriodCallback);

    const timeLineControl = wrapper.find(TimeLineControl);
    expect(timeLineControl).to.have.length(1);
    expect(timeLineControl.first().prop('openPeriodInfo')).to.eql(openPeriodInfo);
  });

  it('skal rendre UttakTimeLine med medsokere', () => {
    const openPeriodInfo = sinon.spy();
    const selectPeriodCallback = sinon.spy();
    const wrapper = shallow(<UttakTimeLine
      selectedPeriod={selectedItem}
      customTimes={{}}
      uttakPerioder={[{ fom: '2018-01-01', name: 'notEmpty period' }]}
      selectPeriodCallback={selectPeriodCallback}
      openPeriodInfo={openPeriodInfo}
      hovedsokerKjonnKode="M"
      medsokerKjonnKode="K"
    />);

    const timelineSoker = wrapper.find(TimeLineSoker);
    expect(timelineSoker).to.have.length(1);
    expect(timelineSoker.first().prop('hovedsokerKjonnKode')).to.eql('M');
    const timelineEnsomSoker = wrapper.find(TimeLineSokerEnsamSoker);
    expect(timelineEnsomSoker).to.have.length(0);
  });
});
