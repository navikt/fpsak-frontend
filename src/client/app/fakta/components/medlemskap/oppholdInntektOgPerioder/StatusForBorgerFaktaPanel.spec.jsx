import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';

describe('<StatusForBorgerFaktaPanel>', () => {
  it('skal vise radioknapper for vurdering av oppholdsrett', () => {
    const wrapper = shallowWithIntl(<StatusForBorgerFaktaPanel.WrappedComponent
      apKode={aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}
      intl={intlMock}
      erEosBorger
      readOnly={false}
      isBorgerAksjonspunktClosed={false}
    />);
    const groups = wrapper.find('RadioGroupField');
    expect(groups).to.have.length(2);

    const radioFieldsGroup1 = groups.first().find('RadioOption');
    expect(radioFieldsGroup1).to.have.length(2);
    expect(radioFieldsGroup1.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenEEA');
    expect(radioFieldsGroup1.last().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenOutsideEEA');
    const radioFieldsGroup2 = groups.last().find('RadioOption');
    expect(radioFieldsGroup2).to.have.length(2);
    expect(radioFieldsGroup2.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.HarOppholdsrett');
    expect(radioFieldsGroup2.last().prop('label').props.id).to.eql('StatusForBorgerFaktaPanel.HarIkkeOppholdsrett');
  });

  it('skal vise radioknapper for vurdering av lovlig opphold', () => {
    const wrapper = shallowWithIntl(<StatusForBorgerFaktaPanel.WrappedComponent
      apKode={aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}
      intl={intlMock}
      erEosBorger={false}
      readOnly={false}
      isBorgerAksjonspunktClosed={false}
    />);

    const groups = wrapper.find('RadioGroupField');
    expect(groups).to.have.length(2);
    const radioFieldsGroup1 = groups.first().find('RadioOption');
    expect(radioFieldsGroup1).to.have.length(2);
    expect(radioFieldsGroup1.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenEEA');
    expect(radioFieldsGroup1.last().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenOutsideEEA');
    const radioFieldsGroup2 = groups.last().find('RadioOption');
    expect(radioFieldsGroup2).to.have.length(2);
    expect(radioFieldsGroup2.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.HarLovligOpphold');
  });

  it('skal sette initielle verdi når det er EØS borger og ingen vurdering er lagret', () => {
    const medlem = {};
    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      },
      status: {
        kode: 'UTFO',
      },
    },
    ];
    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(medlem, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det er EØS borger og vurdering er lagret', () => {
    const medlem = {
      erEosBorger: true,
      oppholdsrettVurdering: true,
    };

    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(medlem, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: undefined,
      erEosBorger: true,
      oppholdsrettVurdering: true,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: false,
    });
  });

  it('skal sette initielle verdi når regionkode ikke finnes men en har oppholdsrett-aksjonspunkt', () => {
    const medlem = { };
    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      },
      status: {
        kode: 'UTFO',
      },
    }];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(medlem, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det ikke er EØS borger', () => {
    const medlem = {
      erEosBorger: false,
      lovligOppholdVurdering: false,
    };
    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(medlem, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: undefined,
      erEosBorger: false,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: false,
      isBorgerAksjonspunktClosed: false,
    });
  });
});
