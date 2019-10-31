import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PeriodeController from './PeriodeController';
import PeriodeInformasjon from './PeriodeInformasjon';

import TilbakekrevingTimelineData from './TilbakekrevingTimelineData';

describe('<TilbakekrevingTimelineData>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<TilbakekrevingTimelineData
      periode={{
        fom: '2019-10-10',
        tom: '2019-11-10',
        feilutbetaling: 12,
      }}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      readOnly={false}
      oppdaterSplittedePerioder={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={1}
      beregnBelop={() => undefined}
    />);

    expect(wrapper.find(PeriodeController)).to.have.length(1);
    expect(wrapper.find(PeriodeInformasjon)).to.have.length(1);
  });
});
