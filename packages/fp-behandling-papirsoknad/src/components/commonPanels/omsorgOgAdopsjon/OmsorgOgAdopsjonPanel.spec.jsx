import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';

import { FodselsDatoFields, OmsorgOgAdopsjonPanelImpl } from './OmsorgOgAdopsjonPanel';

chai.use(sinonChai);

describe('<OmsorgOgAdopsjonPanel>', () => {
  it('skal vise komponent med to datepickers når årsakstype er adopsjon', () => {
    const wrapper = shallowWithIntl(<OmsorgOgAdopsjonPanelImpl
      form="form"
      intl={intlMock}
      familieHendelseType={familieHendelseType.ADOPSJON}
      isForeldrepenger
    />);
    const overtakelseDatepicker = wrapper.find('DatepickerField');
    const fodselsDatepickers = wrapper.find({ component: FodselsDatoFields });
    expect(overtakelseDatepicker).to.have.length(2);
    expect(fodselsDatepickers).to.have.length(1);
  });

  it('skal vise komponent med en datepicker når årsakstype er omsorg', () => {
    const wrapper = shallowWithIntl(<OmsorgOgAdopsjonPanelImpl
      form="form"
      intl={intlMock}
      familieHendelseType={familieHendelseType.OMSORG}
      isForeldrepenger
    />);
    const overtakelseDatepicker = wrapper.find('DatepickerField');
    expect(overtakelseDatepicker).to.have.length(1);
  });

  describe('<FodselsDatoFields>', () => {
    it('skal vise to fødselsdato-datepickers hvis antall barn er to', () => {
      const wrapper = shallow(<FodselsDatoFields
        fields={new MockFields('barn', 2)}
        antallBarn={2}
        familieHendelseType={familieHendelseType.ADOPSJON}
      />);

      const datepicker = wrapper.find('DatepickerField');
      expect(datepicker).to.have.length(2);
    });

    it('skal legge til korrekt antall fields utifra input fra antallBarn', () => {
      const props = {
        fields: new MockFields('name', 0),
        antallBarn: 2,
        familieHendelseType: familieHendelseType.ADOPSJON,
      };
      const pushSpy = sinon.spy(props.fields, 'push');
      const wrapper = shallow(<FodselsDatoFields {...props} />);

      expect(pushSpy).to.have.been.calledOnce;
      expect(props.fields.length).to.eql(1);

      wrapper.instance().UNSAFE_componentWillReceiveProps(props);
      wrapper.update();

      expect(pushSpy).to.have.been.calledTwice;
      expect(props.fields.length).to.eql(2);

      wrapper.instance().UNSAFE_componentWillReceiveProps(props);
      wrapper.update();

      expect(pushSpy).to.have.been.calledTwice;
      expect(props.fields.length).to.eql(2);
    });
  });
});
