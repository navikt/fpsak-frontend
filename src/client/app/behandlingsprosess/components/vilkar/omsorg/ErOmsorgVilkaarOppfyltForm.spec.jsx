import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import vilkarType from 'kodeverk/vilkarType';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import { ErOmsorgVilkaarOppfyltFormImpl as UnwrappedForm, buildInitialValues } from './ErOmsorgVilkaarOppfyltForm';

describe('<ErOmsorgVilkaarOppfyltForm>', () => {
  const aksjonspunkterList = [{
    id: 1,
    definisjon: {
      navn: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
      kode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
    },
    status: {
      kode: '',
      navn: '',
    },
    vilkarType: {
      kode: vilkarType.OMSORGSVILKARET,
      navn: 'Omsorgsvilkåret',
    },
    begrunnelse: 'begrunnelse',
    kanLoses: true,
    erAktivt: true,
  }];

  it('skal vise readonly-form med utgråete knapper når readonly og vilkåret ikke er vurdert', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      aksjonspunkter={aksjonspunkterList}
      readOnly
      readOnlySubmitButton
      erVilkarOk={false}
    />);

    const form = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(form).to.have.length(1);
    expect(form.prop('readOnly')).is.true;
  });

  it('skal vise radioknapper og nedtrekksliste for å velge om vilkåret skal godkjennes eller avvises med avslagsgrunn når ikke readonly', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      aksjonspunkter={aksjonspunkterList}
      readOnly={false}
      readOnlySubmitButton
      erVilkarOk={undefined}
    />);

    const selector = wrapper.find('InjectIntl(VilkarResultPickerImpl)');
    expect(selector).to.have.length(1);
    expect(selector.prop('avslagsarsaker')).to.eql([{
      kode: 'TEST_KODE',
      navn: 'testnavn',
    }]);
    expect(selector.prop('erVilkarOk')).is.undefined;

    expect(wrapper.find(BehandlingspunktBegrunnelseTextField)).to.have.length(1);
    expect(wrapper.find('ConfirmInformationVilkarFormReadOnly')).to.have.length(0);
  });

  it('skal vise readonly-form når status er readonly og status er ulik ikke vurdert', () => {
    const aksjonspunkter = [{
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
        kode: vilkarType.ADOPSJONSVILKARET,
        navn: 'Adopsjonvilkåret',
      },
      begrunnelse: 'begrunnelse',
      kanLoses: true,
      erAktivt: true,
    }];

    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      avslagsarsaker={[]}
      aksjonspunkter={aksjonspunkter}
      readOnly
      readOnlySubmitButton
      erVilkarOk
    />);

    const readonlyForm = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(readonlyForm).to.have.length(1);
    expect(readonlyForm.prop('readOnly')).is.true;
  });


  it('skal sette opp initielle verdier for form gitt behandling og behandlingspunkt', () => {
    const behandlingsresultat = {
      avslagsarsak: {
        kode: 'TEST',
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
      vilkarType: {
        kode: vilkarType.OMSORGSVILKARET,
      },
    }];

    const initialValues = buildInitialValues.resultFunc(behandlingsresultat, aksjonspunkter, vilkarUtfallType.IKKE_OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: undefined,
      avslagCode: undefined,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal sette vilkår til godkjent når aksjonspunkt er lukket og vilkår er oppfylt', () => {
    const behandlingsresultat = {
      avslagsarsak: {
        kode: 'TEST',
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
      vilkarType: {
        kode: vilkarType.OMSORGSVILKARET,
      },
    }];

    const initialValues = buildInitialValues.resultFunc(behandlingsresultat, aksjonspunkter, vilkarUtfallType.IKKE_OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: false,
      avslagCode: 'TEST',
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal sette vilkår til avslått når aksjonspunkt er lukket og vilkår ikke er oppfylt', () => {
    const behandlingsresultat = {
      avslagsarsak: {
        kode: 'TEST',
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
      vilkarType: {
        kode: vilkarType.OMSORGSVILKARET,
      },
    }];

    const initialValues = buildInitialValues.resultFunc(behandlingsresultat, aksjonspunkter, vilkarUtfallType.IKKE_OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: false,
      avslagCode: 'TEST',
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });
});
