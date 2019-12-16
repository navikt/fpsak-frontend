import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import SideMenu from '@navikt/nap-side-menu';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FaktaPanel from './FaktaPanel';

describe('<FaktaPanel>', () => {
  it('skal rendre komponent med sidemeny med ett menyinnslag med aktivt aksjonspunkt', () => {
    const velgPanelCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <FaktaPanel.WrappedComponent
        intl={intlMock}
        paneler={[{
          tekst: 'test',
          erAktiv: true,
          harAksjonspunkt: true,
        }]}
        velgPanel={velgPanelCallback}
      >
        <div>test</div>
      </FaktaPanel.WrappedComponent>,
    );

    const meny = wrapper.find(SideMenu);
    expect(meny).to.have.length(1);
    expect(meny.prop('heading')).to.eql('Fakta om');
    expect(meny.prop('links')).to.eql([{
      label: 'test',
      active: true,
      iconSrc: advarselIkonUrl,
      iconAltText: 'Aksjonspunkt',
    }]);
  });

  it('skal rendre komponent med sidemeny med ett menyinnslag med inaktivt aksjonspunkt', () => {
    const velgPanelCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <FaktaPanel.WrappedComponent
        intl={intlMock}
        paneler={[{
          tekst: 'test',
          erAktiv: true,
          harAksjonspunkt: false,
        }]}
        velgPanel={velgPanelCallback}
      >
        <div>test</div>
      </FaktaPanel.WrappedComponent>,
    );

    const meny = wrapper.find(SideMenu);
    expect(meny.prop('links')).to.eql([{
      label: 'test',
      active: true,
      iconSrc: undefined,
      iconAltText: undefined,
    }]);
  });
});
