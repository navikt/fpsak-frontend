import React from 'react';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import ApprovalField from './ApprovalField';
import getAksjonspunktText from './ApprovalTextUtils';


describe('<ApprovalField>', () => {
  it('skal kunne vise fleire oppjeningstekster for fleire aktiviteter', () => {
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING,
      opptjeningAktiviteter: [
        {
          erEndring: true, aktivitetType: 'Arbeid', arbeidsgiverNavn: 'Andersen Transport AS', orgnr: '1234567890',
        },
        {
          erEndring: false, aktivitetType: 'Arbeid', arbeidsgiverNavn: 'Bislett Kebab', orgnr: '1234567800',
        },
        {
          erEndring: true, aktivitetType: 'Arbeid', arbeidsgiverNavn: null, orgnr: '1234567789',
        },
        {
          erEndring: false, aktivitetType: 'Militærtjeneste',
        },
      ],
    };


    const readOnly = false;
    const isForeldrepenger = false;
    const currentValue = { totrinnskontrollGodkjent: true };
    const approvalIndex = 1;
    const wrapper = shallowWithIntl(<ApprovalField.WrappedComponent
      getAksjonspunktText={getAksjonspunktText.resultFunc(isForeldrepenger, null, null, null, null)}
      readOnly={readOnly}
      aksjonspunkt={aksjonspunkt}
      approvalIndex={approvalIndex}
      currentValue={currentValue}
    />);

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(4);
  });


  it('skal vise korrekt antall element', () => {
    const readOnly = false;
    const isForeldrepenger = false;
    const currentValue = { totrinnskontrollGodkjent: true };
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING,
    };
    const approvalIndex = 1;
    const wrapper = shallowWithIntl(<ApprovalField.WrappedComponent
      getAksjonspunktText={getAksjonspunktText.resultFunc(isForeldrepenger, null, null, null, null)}
      readOnly={readOnly}
      aksjonspunkt={aksjonspunkt}
      approvalIndex={approvalIndex}
      currentValue={currentValue}
    />);

    const navFieldGroup = wrapper.find('NavFieldGroup');
    expect(navFieldGroup).to.have.length(1);

    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).to.have.length(1);

    const reasonsField = wrapper.find('ReasonsField');
    expect(reasonsField).to.have.length(0);
  });


  it('skal vise begrunnelsefelt om godkjent er false', () => {
    const isForeldrepenger = false;
    const readOnly = false;
    const aksjonspunkt = {
      aksjonspunktKode: aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING,
    };

    const approvalIndex = 1;
    const currentValue = { totrinnskontrollGodkjent: false };
    const wrapper = shallowWithIntl(<ApprovalField.WrappedComponent
      getAksjonspunktText={getAksjonspunktText.resultFunc(isForeldrepenger, null, null, null, null)}
      readOnly={readOnly}
      aksjonspunkt={aksjonspunkt}
      approvalIndex={approvalIndex}
      currentValue={currentValue}
    />);
    const reasonsField = wrapper.find('InjectIntl(ReasonsField)');
    expect(reasonsField).to.have.length(1);
  });
});
