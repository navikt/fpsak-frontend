import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import personstatusType from 'kodeverk/personstatusType';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import behandlingStatus from 'kodeverk/behandlingStatus';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import { CheckPersonStatusFormImpl as UnwrappedForm, buildInitialValues } from './CheckPersonStatusForm';

describe('<CheckPersonStatusForm>', () => {
  it('skal vise hjelpetekst med original personstatus og begrunnelse/submit', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton
      fortsettBehandling="false"
      originalPersonstatusName="Ukjent"
      personstatusName=""
      personStatuser={[]}
      gjeldeneFom="2018-10-10"
    />);

    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText).to.have.length(1);
    expect(helpText.childAt(0).text()).is.eql('Søker har personstatus: Ukjent');

    const submit = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(submit).to.have.length(1);
  });

  it('skal vise radioknapper for å velge om behandlingen skal fortsette eller henlegges', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton
      fortsettBehandling="false"
      originalPersonstatusName="Ukjent"
      personstatusName=""
      personStatuser={[]}
      gjeldeneFom="2018-10-10"
    />);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
    expect(radios.first().prop('label').id).is.eql('CheckPersonStatusForm.HaltBehandling');
    expect(radios.last().prop('label').id).is.eql('CheckPersonStatusForm.ContinueBehandling');
  });

  it('skal vise en radioknapp for alle personstatuser', () => {
    const personstatuser = [{
      kode: 'BOSATT',
      navn: 'Bosatt',
    }, {
      kode: 'ANNEN',
      navn: 'Annen',
    }];
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton
      fortsettBehandling
      originalPersonstatusName="Ukjent"
      personstatusName=""
      personStatuser={personstatuser}
      gjeldeneFom="2018-10-10"
    />);

    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(4);
    expect(radios.at(2).prop('value')).is.eql('BOSATT');
    expect(radios.at(2).prop('label')).is.eql('Bosatt');
    expect(radios.at(3).prop('value')).is.eql('ANNEN');
    expect(radios.at(3).prop('label')).is.eql('Annen');
  });

  it('skal vise readonly-form når status er readonly', () => {
    const initialValues = {
      fortsettBehandling: 'false',
      begrunnelse: 'Dette er en begrunnelse',
    };
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      readOnlySubmitButton
      fortsettBehandling="false"
      originalPersonstatusName="Ukjent"
      personstatusName="Bosatt"
      initialValues={initialValues}
      personStatuser={[{}]}
      gjeldeneFom="2018-10-10"
    />);

    const radioGroupField = wrapper.find('RadioGroupField');
    expect(radioGroupField).to.have.length(1);
    expect(radioGroupField.prop('readOnly')).is.true;

    const info = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(info).to.have.length(1);
    expect(info.prop('readOnly')).is.true;
    const button = wrapper.find(BehandlingspunktSubmitButton);
    expect(button).to.have.length(1);
    expect(button.prop('isReadOnly')).is.true;
  });

  it('skal sette opp initielle verdier gitt behandling og behandlingspunkt', () => {
    const status = {
      kode: behandlingStatus.AVSLUTTET,
    };
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        navn: 'Ukjent',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'UKJENT',
          navn: 'Ukjent',
        },
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          navn: 'Bosatt',
        },
      },
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: 'test',
      },
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
      },
      begrunnelse: 'Dette er en begrunnelse',
    }];

    const initialValues = buildInitialValues.resultFunc(status, aksjonspunkter, personopplysning);

    expect(initialValues).to.eql({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: false,
      personstatus: personstatusType.BOSATT,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal fortsette behandlingen når aksjonspunkt er lukket og behandlingsstatus er ulik avsluttet', () => {
    const status = {
      kode: behandlingStatus.BEHANDLING_UTREDES,
    };
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        navn: 'Ukjent',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'UKJENT',
          navn: 'Ukjent',
        },
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          navn: 'Bosatt',
        },
      },
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: 'test',
      },
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
      },
      begrunnelse: 'Dette er en begrunnelse',
    }];

    const initialValues = buildInitialValues.resultFunc(status, aksjonspunkter, personopplysning);

    expect(initialValues).to.eql({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: true,
      personstatus: personstatusType.BOSATT,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal ikke ha satt verdi for om behandlingen skal fortsette om aksjonspunktet er åpent', () => {
    const status = {
      kode: behandlingStatus.BEHANDLING_UTREDES,
    };
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        navn: 'Ukjent',
      },
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: 'test',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: 'Dette er en begrunnelse',
    }];

    const initialValues = buildInitialValues.resultFunc(status, aksjonspunkter, personopplysning);

    expect(initialValues).to.eql({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: undefined,
      personstatus: undefined,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });
});
