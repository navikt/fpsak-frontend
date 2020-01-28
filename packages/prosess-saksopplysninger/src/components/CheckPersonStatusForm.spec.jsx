import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-felles';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { RadioOption } from '@fpsak-frontend/form';
import { buildInitialValues, CheckPersonStatusFormImpl as UnwrappedForm } from './CheckPersonStatusForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-saksopplysninger';

describe('<CheckPersonStatusForm>', () => {
  const alleKodeverk = {
    [kodeverkTyper.PERSONSTATUS_TYPE]: [{
      kode: 'UKJENT',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Ukjent',
    }, {
      kode: 'BOSATT',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Bosatt',
    }],
  };

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
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText).to.have.length(1);
    expect(helpText.childAt(0).text())
      .is.eql('Søker har personstatus: Ukjent. Vurder om behandlingen skal henlegges eller kan fortsette med endret personstatus');

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
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const radios = wrapper.find(RadioOption);
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
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const radios = wrapper.find(RadioOption);
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
      behandlingId={1}
      behandlingVersjon={1}
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
    const behandlingHenlagt = true;
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'UKJENT',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: 'PERSONSTATUS_TYPE',
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

    const initialValues = buildInitialValues.resultFunc(behandlingHenlagt, aksjonspunkter, personopplysning, alleKodeverk);

    expect(initialValues).to.eql({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: false,
      personstatus: personstatusType.BOSATT,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal fortsette behandlingen når aksjonspunkt er lukket og behandlingsstatus er ulik avsluttet', () => {
    const behandlingHenlagt = false;
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'UKJENT',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: 'PERSONSTATUS_TYPE',
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

    const initialValues = buildInitialValues.resultFunc(behandlingHenlagt, aksjonspunkter, personopplysning, alleKodeverk);

    expect(initialValues).to.eql({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: true,
      personstatus: personstatusType.BOSATT,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal ikke ha satt verdi for om behandlingen skal fortsette om aksjonspunktet er åpent', () => {
    const behandlingHenlagt = false;
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
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

    const initialValues = buildInitialValues.resultFunc(behandlingHenlagt, aksjonspunkter, personopplysning, alleKodeverk);

    expect(initialValues).to.eql({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: undefined,
      personstatus: undefined,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });
});
