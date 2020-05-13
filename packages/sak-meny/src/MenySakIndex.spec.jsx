import React from 'react';
import { expect } from 'chai';
import Popover from '@navikt/nap-popover';
import { Knapp } from 'nav-frontend-knapper';

import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-meny';
import MenySakIndex from './MenySakIndex';
import MenyData from './MenyData';

describe('<MenySakIndex>', () => {
  it('skal toggle menyvisning ved trykk på knapp', () => {
    const wrapper = shallowWithIntl(<MenySakIndex
      data={[new MenyData(true, 'Lag ny behandling')
        .medModal((lukkModal) => <button type="button" onClick={lukkModal} />)]}
    />);

    const popover = wrapper.find(Popover);
    expect(popover).to.have.length(1);

    expect(popover.prop('popperIsVisible')).is.false;

    const wrapper2 = shallowWithIntl(popover.prop('referenceProps').children('ref'));

    const knapp = wrapper2.find(Knapp);
    expect(knapp).to.have.length(1);
    knapp.prop('onClick')();

    expect(wrapper.find(Popover).prop('popperIsVisible')).is.true;
  });

  it('skal åpne modal ved trykk på menyinnslag og så lukke den ved å bruke funksjon for lukking', () => {
    const wrapper = shallowWithIntl(<MenySakIndex
      data={[new MenyData(true, 'Lag ny behandling')
        .medModal((lukkModal) => <button type="button" onClick={lukkModal} />)]}
    />);

    expect(wrapper.find('button')).to.have.length(0);

    const popover = wrapper.find(Popover);
    const wrapper2 = shallowWithIntl(popover.prop('popperProps').children());

    const button = wrapper2.find('button');
    expect(button).to.have.length(1);
    button.prop('onClick')(0);

    const span = wrapper.find('button');
    expect(span).to.have.length(1);

    span.prop('onClick')();

    expect(wrapper.find('button')).to.have.length(0);
  });
});
