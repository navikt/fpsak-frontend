import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { Column } from 'nav-frontend-grid';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';

import InngangsvilkarPanel from './InngangsvilkarPanel';
import DataFetcherBehandlingData from '../DataFetcherBehandlingData';

describe('<InngangsvilkarPanel>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      kodeverk: 'BEHANDLING_STATUS',
    },
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    },
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const fellesProsessStegPanelData = {
    aksjonspunkter: [],
    isReadOnly: false,
    status: vilkarUtfallType.IKKE_OPPFYLT,
    komponentData: {
      isReadOnly: false,
      readOnlySubmitButton: false,
      aksjonspunkter: [],
      vilkar: [],
      isAksjonspunktOpen: false,
      overrideReadOnly: false,
      kanOverstyreAccess: false,
      toggleOverstyring: () => {},
    },
  };

  it('skal vise inngangsvilkår-panel med fødsel, medlemskap og opptjening', () => {
    const prosessStegData = [{
      ...fellesProsessStegPanelData,
      code: 'FODSEL',
      renderComponent: () => undefined,
      endpoints: [],
      isAksjonspunktOpen: true,
      aksjonspunktHelpTextCodes: ['TEST'],
    }, {
      ...fellesProsessStegPanelData,
      code: 'MEDLSEMSKAP',
      renderComponent: () => undefined,
      endpoints: [],
      isAksjonspunktOpen: false,
      aksjonspunktHelpTextCodes: [],
    }, {
      ...fellesProsessStegPanelData,
      code: 'OPPTJENING',
      renderComponent: () => undefined,
      endpoints: [],
      isAksjonspunktOpen: false,
      aksjonspunktHelpTextCodes: [],
    }];

    const wrapper = shallow(
      <InngangsvilkarPanel
        behandling={behandling}
        alleKodeverk={{}}
        prosessStegData={prosessStegData}
        submitCallback={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
      />,
    );

    const helpText = wrapper.find(AksjonspunktHelpTextHTML);
    expect(helpText).to.have.length(1);
    const text = wrapper.find(FormattedMessage);
    expect(text).to.have.length(1);
    expect(text.prop('id')).to.eql(['TEST']);

    const columns = wrapper.find(Column);
    expect(columns).to.have.length(2);
    const column1 = columns.first().find(DataFetcherBehandlingData);
    expect(column1).to.have.length(2);
    const column2 = columns.last().find(DataFetcherBehandlingData);
    expect(column2).to.have.length(1);
  });

  it('skal vise aksjonspunkt-hjelpetekst med lenke for avventing av fakta-aksjonspunkt', () => {
    const prosessStegPanelData = {
      ...fellesProsessStegPanelData,
      status: vilkarUtfallType.IKKE_VURDERT,
    };
    const prosessStegData = [{
      ...prosessStegPanelData,
      code: 'FODSEL',
      renderComponent: () => undefined,
      endpoints: [],
      isAksjonspunktOpen: true,
      aksjonspunktHelpTextCodes: ['TEST'],
    }];

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();

    const wrapper = shallow(
      <InngangsvilkarPanel
        behandling={behandling}
        alleKodeverk={{}}
        prosessStegData={prosessStegData}
        submitCallback={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        apentFaktaPanelInfo={{
          urlCode: 'MEDLEMSKAP',
          textCode: 'FAKTA_APENT',
        }}
      />,
    );

    const helpText = wrapper.find(AksjonspunktHelpTextHTML);
    expect(helpText).to.have.length(1);
    const text = wrapper.find(FormattedMessage);
    expect(text).to.have.length(2);
    expect(text.first().prop('id')).to.eql('InngangsvilkarPanel.AvventerAvklaringAv');
    expect(text.last().prop('id')).to.eql('FAKTA_APENT');

    const lenke = wrapper.find('a');
    lenke.simulate('click', { preventDefault: () => undefined });

    const oppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(oppdaterKall).to.have.length(1);
    expect(oppdaterKall[0].args).to.have.length(2);
    expect(oppdaterKall[0].args[0]).is.undefined;
    expect(oppdaterKall[0].args[1]).to.eql('MEDLEMSKAP');
  });
});
