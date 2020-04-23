import React from 'react';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@fpsak-frontend/types';

import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';

describe('<VedtakHelpTextPanel>', () => {
  it('skal vise hjelpetekst for vurdering av dokument når en har dette aksjonspunktet', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanel.WrappedComponent
      intl={intlMock}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDERE_DOKUMENT,
          kodeverk: '',
        },
      }] as Aksjonspunkt[]}
      readOnly={false}
    />);

    const helpTexts = wrapper.find('li');
    expect(helpTexts).to.have.length(1);
    expect(helpTexts.find(Normaltekst).childAt(0).text()).is.eql('Påvirker den åpne Gosys-oppgaven «Vurder dokument» behandlingen?');
  });


  it('skal vise hjelpetekst for vurdering av dokument og vurdering av annen ytelse når en har disse aksjonspunktetene', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanel.WrappedComponent
      intl={intlMock}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
          kodeverk: '',
        },
      }, {
        definisjon: {
          kode: aksjonspunktCodes.VURDERE_DOKUMENT,
          kodeverk: '',
        },
      }] as Aksjonspunkt[]}
      readOnly={false}
    />);

    const helpTexts = wrapper.find('li');
    expect(helpTexts).to.have.length(2);
    expect(helpTexts.at(0).find(Normaltekst).childAt(0).text()).is.eql('Påvirker den åpne Gosys-oppgaven «Vurder konsekvens for ytelse» behandlingen?');
    expect(helpTexts.at(1).find(Normaltekst).childAt(0).text()).is.eql('Påvirker den åpne Gosys-oppgaven «Vurder dokument» behandlingen?');
  });


  it('skal ikke vise hjelpetekst når en ikke har gitte aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<VedtakHelpTextPanel.WrappedComponent
      intl={intlMock}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.FORESLA_VEDTAK,
          kodeverk: '',
        },
      }] as Aksjonspunkt[]}
      readOnly={false}
    />);

    expect(wrapper.find('HelpText')).to.have.length(0);
  });
});
