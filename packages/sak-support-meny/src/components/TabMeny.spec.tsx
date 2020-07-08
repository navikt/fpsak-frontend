import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { FlexColumn } from '@fpsak-frontend/shared-components';

import TabMeny from './TabMeny';

describe('<TabMeny>', () => {
  it('skal vise tabs der Historikk er valgt og Send melding ikke er valgbar', () => {
    const tabs = [{
      getSvg: (isActive, isDisabled, props) => <div isActive={isActive} isDisabled={isDisabled} {...props} />,
      tooltip: 'Historikk',
      isActive: true,
      isDisabled: false,
    }, {
      getSvg: (isActive, isDisabled, props) => <div isActive={isActive} isDisabled={isDisabled} {...props} />,
      tooltip: 'Send melding',
      isActive: false,
      isDisabled: true,
    }];

    const wrapper = shallow(<TabMeny
      tabs={tabs}
      onClick={() => undefined}
    />);

    const kolonne = wrapper.find(FlexColumn);
    expect(kolonne).has.length(2);

    const knapp1 = kolonne.first().find('button');
    expect(knapp1.prop('className')).is.eql('active');
    expect(knapp1.prop('data-tooltip')).is.eql('Historikk');
    expect(knapp1.prop('disabled')).is.false;

    const svgPlaceholder1 = knapp1.find('div');
    expect(svgPlaceholder1.prop('isActive')).is.true;
    expect(svgPlaceholder1.prop('isDisabled')).is.false;
    expect(svgPlaceholder1.prop('alt')).is.eql('Historikk');

    const knapp2 = kolonne.last().find('button');
    expect(knapp2.prop('className')).is.eql('');
    expect(knapp2.prop('data-tooltip')).is.eql('Send melding');
    expect(knapp2.prop('disabled')).is.true;

    const svgPlaceholder2 = knapp2.find('div');
    expect(svgPlaceholder2.prop('isActive')).is.false;
    expect(svgPlaceholder2.prop('isDisabled')).is.true;
    expect(svgPlaceholder2.prop('alt')).is.eql('Send melding');
  });

  it('skal velge Send melding ved trykk på knapp', () => {
    const tabs = [{
      getSvg: (isActive, isDisabled, props) => <div isActive={isActive} isDisabled={isDisabled} {...props} />,
      tooltip: 'Historikk',
      isActive: false,
      isDisabled: false,
    }, {
      getSvg: (isActive, isDisabled, props) => <div isActive={isActive} isDisabled={isDisabled} {...props} />,
      tooltip: 'Send melding',
      isActive: false,
      isDisabled: false,
    }];

    const onClick = sinon.spy();

    const wrapper = shallow(<TabMeny
      tabs={tabs}
      onClick={onClick}
    />);

    const kolonne = wrapper.find(FlexColumn);
    const knapp = kolonne.last().find('button');

    const knappFn = knapp.prop('onClick') as () => void;
    knappFn();

    expect(onClick.getCalls()).has.length(1);
    const { args } = onClick.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql(1);
  });
});
