import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import vilkarType from 'kodeverk/vilkarType';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import { ErSoknadsfristVilkaretOppfyltFormImpl as UnwrappedForm, buildInitialValues } from './ErSoknadsfristVilkaretOppfyltForm';

describe('<ErSoknadsfristVilkaretOppfyltForm>', () => {
  const behandlingspunkt = {
    name: 'test',
    status: vilkarUtfallType.OPPFYLT,
    aksjonspunkter: [{
      id: 1,
      definisjon: {
        navn: 'test',
        kode: 'test',
      },
      status: {
        kode: '',
        navn: '',
      },
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
        navn: 'test',
      },
      begrunnelse: 'begrunnelse',
      kanLoses: true,
    }],
    aksjonspunktCodes: [],
    vilkarType: vilkarType.SOKNADFRISTVILKARET,
    merknadParametere: { test: 'test' },
  };

  it('skal rendre form og vise søknadsfristdato som er lik mottatt dato minus antallDagerSoknadLevertForSent', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      soknad={{
        mottattDato: '2017-10-15',
        begrunnelseForSenInnsending: 'testbegrunnelse',
      }}
      antallDagerSoknadLevertForSent="9"
      textCode="ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato"
      dato="2017-10-10"
      behandlingspunkt={behandlingspunkt}
    />);

    const dateLabel = wrapper.find('DateLabel');
    expect(dateLabel).has.length(3);
    expect(dateLabel.first().prop('dateString')).to.eql('2017-10-06');
  });

  it('skal rendre form og vise mottatt dato og fødselsdato', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      mottattDato="2017-10-15"
      soknad={{
        mottattDato: '2017-10-15',
        begrunnelseForSenInnsending: 'testbegrunnelse',
      }}
      antallDagerSoknadLevertForSent="9"
      textCode="ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato"
      dato="2017-10-10"
      behandlingspunkt={behandlingspunkt}
    />);

    const dateLabel = wrapper.find('DateLabel');
    expect(dateLabel).has.length(3);
    expect(dateLabel.at(1).prop('dateString')).to.eql('2017-10-15');
    expect(dateLabel.last().prop('dateString')).to.eql('2017-10-10');
  });

  it('skal rendre form og vise begrunnelse for sen innsending', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      soknad={{
        mottattDato: '2017-10-15',
        begrunnelseForSenInnsending: 'testbegrunnelse',
      }}
      antallDagerSoknadLevertForSent="9"
      textCode="ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato"
      dato="2017-10-10"
      behandlingspunkt={behandlingspunkt}
    />);

    const dateLabel = wrapper.find('span');
    expect(dateLabel).has.length(5);
    expect(dateLabel.last().text()).to.eql('testbegrunnelse');
  });

  it('skal rendre form og vise en bindestrek når en ikke har begrunnelse for sen innsending', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      soknad={{
        mottattDato: '2017-10-15',
      }}
      antallDagerSoknadLevertForSent="9"
      textCode="ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato"
      dato="2017-10-10"
      behandlingspunkt={behandlingspunkt}
    />);

    const dateLabel = wrapper.find('span');
    expect(dateLabel).has.length(5);
    expect(dateLabel.last().text()).to.eql('-');
  });

  it('skal vise radioknapper og innsendingskomponent', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      soknad={{
        mottattDato: '2017-10-15',
      }}
      antallDagerSoknadLevertForSent="9"
      textCode="ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato"
      dato="2017-10-10"
      behandlingspunkt={behandlingspunkt}
    />);

    const radioButtons = wrapper.find('RadioOption');
    expect(radioButtons).has.length(2);
    expect(wrapper.find(BehandlingspunktBegrunnelseTextField)).has.length(1);
    expect(wrapper.find('InjectIntl(ConfirmInformationVilkarFormReadOnly)')).has.length(0);
  });

  it('skal ved readonly kun vise en radioknapp med valgt verdi', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      readOnlySubmitButton={false}
      soknad={{
        mottattDato: '2017-10-15',
        begrunnelseForSenInnsending: 'testbegrunnelse',
      }}
      antallDagerSoknadLevertForSent="9"
      textCode="ErSoknadsfristVilkaretOppfyltForm.Omsorgsovertakelsesdato"
      dato="2017-10-10"
      behandlingspunkt={behandlingspunkt}
    />);

    const confirm = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(confirm).has.length(1);
    expect(confirm.prop('readOnly')).is.true;
    expect(wrapper.find('RadioOption')).has.length(1);
  });

  it('skal bruke info fra søknad når avklart data ikke finnes og søknadstype er FODSEL', () => {
    const aksjonspunkter = [{
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
    }];

    const initialValues = buildInitialValues.resultFunc(aksjonspunkter, vilkarUtfallType.OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: undefined,
      begrunnelse: '',
    });
  });

  it('skal bruke info fra avklart data når dette finnes og søknadstype er FODSEL', () => {
    const aksjonspunkter = [{
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
    }];

    const initialValues = buildInitialValues.resultFunc(aksjonspunkter, vilkarUtfallType.OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: undefined,
      begrunnelse: '',
    });
  });

  it('skal håndtere søknadstype ADOPSJON', () => {
    const aksjonspunkter = [{
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
    }];

    const initialValues = buildInitialValues.resultFunc(aksjonspunkter, vilkarUtfallType.OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: undefined,
      begrunnelse: '',
    });
  });

  it('skal sette vilkår til godkjent når aksjonspunkt er lukket og vilkårsstatus er oppfylt', () => {
    const aksjonspunkter = [{
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
      },
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      begrunnelse: 'har lagret',
    }];

    const initialValues = buildInitialValues.resultFunc(aksjonspunkter, vilkarUtfallType.OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: true,
      begrunnelse: 'har lagret',
    });
  });

  it('skal sette vilkår til feilet når aksjonspunkt er lukket og vilkårsstatus ikke er oppfylt', () => {
    const aksjonspunkter = [{
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
      },
      definisjon: {
        kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
      },
      begrunnelse: 'har lagret',
    }];

    const initialValues = buildInitialValues.resultFunc(aksjonspunkter, vilkarUtfallType.IKKE_OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: false,
      begrunnelse: 'har lagret',
    });
  });
});
