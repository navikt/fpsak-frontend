import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TimeLineSokerEnsamSoker from 'behandlingsprosess/components/tilkjentYtelse/timeline/TimeLineSokerEnsamSoker';
import TimeLineControl from 'behandlingsprosess/components/tilkjentYtelse/timeline/TimeLineControl';
import { intlMock } from 'testHelpers/intl-enzyme-test-helper';

import { TilkjentYtelse } from './TilkjentYtelse';


describe('<TilkjentYtelse>', () => {
  it('skall innehålla korrekt antal felter', () => {
    const wrapper = shallow(<TilkjentYtelse
      items={[{
        id: 1,
        tom: '2018-10-01',
        fom: '2018-02-02',
        andeler: [{
          arbeidsgiver: '973861778',
          refusjon: 0,
          sisteUtbetalingsdato: '2018-03-31',
          tilSoker: 1846,
          uttak: {
            trekkdager: 10,
            stonadskontoType: 'FORELDREPENGER_FØR_FØDSEL',
            periodeType: 'Foreldrepenger før fødsel',
            periodeResultatType: 'INNVILGET',
          },
          uttaksgrad: 100,
        }],
        group: 1,
      }]}
      groups={[]}
      soknadDate="2018-04-05"
      familiehendelseDate={new Date('2018-05-10')}
      hovedsokerKjonnKode="K"
      intl={intlMock}
    />);
    expect(wrapper.find(TimeLineSokerEnsamSoker)).to.have.length(1);
    expect(wrapper.find(TimeLineSokerEnsamSoker).props().hovedsokerKjonnKode).to.equal('K');
    expect(wrapper.find(TimeLineControl)).to.have.length(1);
  });
});
