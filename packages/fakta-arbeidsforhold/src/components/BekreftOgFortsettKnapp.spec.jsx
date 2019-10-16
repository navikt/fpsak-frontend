import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { Hovedknapp } from 'nav-frontend-knapper';
import { BekreftOgForsettKnapp } from './BekreftOgForsettKnapp';

describe('<BekreftOgForsettKnapp>', () => {
  it('Skal vise en enablet hovedknapp hvis readOnly, isBekreftButtonReadOnly, og isSubmitting er false', () => {
    const wrapper = shallow(
      <BekreftOgForsettKnapp
        readOnly={false}
        isBekreftButtonReadOnly={false}
        isSubmitting={false}
      />,
    );
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(false);
  });
  it('Skal vise en disablet hovedknapp hvis readOnly er true', () => {
    const wrapper = shallow(
      <BekreftOgForsettKnapp
        readOnly
        isBekreftButtonReadOnly={false}
        isSubmitting={false}
      />,
    );
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(true);
  });
  it('Skal vise en disablet hovedknapp hvis isBekreftButtonReadOnly er true', () => {
    const wrapper = shallow(
      <BekreftOgForsettKnapp
        readOnly={false}
        isBekreftButtonReadOnly
        isSubmitting={false}
      />,
    );
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(true);
  });
  it('Skal vise en disablet hovedknapp hvis isSubmitting er true', () => {
    const wrapper = shallow(
      <BekreftOgForsettKnapp
        readOnly={false}
        isBekreftButtonReadOnly={false}
        isSubmitting
      />,
    );
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(true);
  });
});
