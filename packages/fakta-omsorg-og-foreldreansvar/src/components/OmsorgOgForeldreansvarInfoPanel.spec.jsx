import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import relatertYtelseType from '@fpsak-frontend/kodeverk/src/relatertYtelseType';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-felles';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import OmsorgOgForeldreansvarFaktaForm from './OmsorgOgForeldreansvarFaktaForm';
import { OmsorgOgForeldreansvarInfoPanelImpl } from './OmsorgOgForeldreansvarInfoPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-omsorg-og-foreldreansvar';


describe('<OmsorgOgForeldreansvarInfoPanel>', () => {
  const aksjonspunkt = {
    id: 1,
    definisjon: {
      kode: 'ap1',
      navn: 'ap1',
    },
    status: {
      kode: 's1',
      navn: 's1',
    },
    kanLoses: true,
    erAktivt: true,
  };

  it('skal vise faktapanel og form for omsorgsvilkåret', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);

    const form = wrapper.find('Connect(injectIntl(OmsorgOgForeldreansvarFaktaFormImpl))');
    expect(form).to.have.length(1);
    expect(form.prop('readOnly')).is.false;

    const begrunnelseForm = wrapper.find(FaktaBegrunnelseTextField);
    expect(begrunnelseForm).to.have.length(1);
    expect(begrunnelseForm.prop('isReadOnly')).is.false;
  });

  it('skal vise readonly form', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);

    const form = wrapper.find('Connect(injectIntl(OmsorgOgForeldreansvarFaktaFormImpl))');
    expect(form.prop('readOnly')).is.true;
  });

  it('skal vise readonly submit-knapp når det ikke er åpne aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);

    const begrunnelseForm = wrapper.find(FaktaBegrunnelseTextField);
    expect(begrunnelseForm.prop('isReadOnly')).is.false;
  });


  it('skal gi foreldreansvar lik true når aksjonspunkt er foreldreansvar', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
      behandlingId={1}
      behandlingVersjon={1}
      alleMerknaderFraBeslutter={{}}
    />);
    const omsorgOgForeldreAnsvarFaktaForm = wrapper.find(OmsorgOgForeldreansvarFaktaForm);
    expect(omsorgOgForeldreAnsvarFaktaForm.prop('erAksjonspunktForeldreansvar')).is.true;
  });
});
