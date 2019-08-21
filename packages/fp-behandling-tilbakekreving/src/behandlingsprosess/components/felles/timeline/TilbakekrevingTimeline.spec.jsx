import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Timeline from 'react-visjs-timeline';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

import TilbakekrevingTimeline from './TilbakekrevingTimeline';
import TilbakekrevingTimelineController from './TilbakekrevingTimelineController';

describe('<TilbakekrevingTimeline>', () => {
  it('skal rendre tidslinje korrekt', () => {
    const perioder = [{
      id: 1,
      fom: '2019-10-10',
      tom: '2019-11-10',
      isAksjonspunktOpen: true,
      isGodkjent: true,
    }, {
      id: 2,
      fom: '2019-11-11',
      tom: '2019-12-10',
      isAksjonspunktOpen: false,
      isGodkjent: true,
    }];
    const valgtPeriode = {
      id: 1,
      fom: '2019-10-10',
      tom: '2019-11-10',
      isAksjonspunktOpen: true,
      isGodkjent: true,
    };

    const wrapper = shallow(
      <TilbakekrevingTimeline
        perioder={perioder}
        selectedPeriod={valgtPeriode}
        toggleDetaljevindu={sinon.spy()}
        selectPeriodCallback={sinon.spy()}
        hjelpetekstKomponent={<div>test</div>}
        kjonn="MANN"
      />,
    );

    expect(wrapper.find(TilbakekrevingTimelineController)).has.length(1);

    const tidslinje = wrapper.find(Timeline);
    expect(tidslinje.prop('options').min.format(ISO_DATE_FORMAT)).is.eql('2019-09-12');
    expect(tidslinje.prop('options').max.format(ISO_DATE_FORMAT)).is.eql('2023-10-10');

    expect(tidslinje.prop('groups')).is.eql([{ id: 1, content: '' }]);
  });
});
