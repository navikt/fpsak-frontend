import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { Column } from 'nav-frontend-grid';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Behandling } from '@fpsak-frontend/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';
import { DataFetcher } from '@fpsak-frontend/rest-api-redux';

import { ProsessStegDef, ProsessStegPanelDef } from '../util/prosessSteg/ProsessStegDef';
import { ProsessStegPanelUtledet } from '../util/prosessSteg/ProsessStegUtledet';
import InngangsvilkarPanel from './InngangsvilkarPanel';

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

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

  const aksjonspunkter = [{
    definisjon: { kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL, kodeverk: 'BEHANDLING_DEF' },
    status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
    kanLoses: true,
    erAktivt: true,
  }];

  const lagPanelDef = (id, aksjonspunktKoder, aksjonspunktTekstKoder) => {
    class PanelDef extends ProsessStegPanelDef {
      getId = () => ''

      getKomponent = (props) => <div {...props} />

      getAksjonspunktKoder = () => aksjonspunktKoder

      getAksjonspunktTekstkoder = () => aksjonspunktTekstKoder
    }
    return new PanelDef();
  };

  const lagStegDef = (urlKode, panelDef) => {
    class StegPanelDef extends ProsessStegDef {
      getUrlKode = () => urlKode

      getTekstKode = () => urlKode

      getPanelDefinisjoner = () => [panelDef]
    }
    return new StegPanelDef();
  };

  it('skal vise inngangsvilkår-panel med fødsel, medlemskap og opptjening', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;

    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL], ['FODSEL.TEKST']);
    const fodselStegDef = lagStegDef('FODSEL', fodselPanelDef);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(fodselStegDef, fodselPanelDef, isReadOnlyCheck, aksjonspunkter, [], {},
      toggleOverstyring, kanOverstyreAccess, []);

    const medlemskapPanelDef = lagPanelDef('MEDLSEMSKAP', [], ['MEDLSEMSKAP.TEKST']);
    const medlemskapStegDef = lagStegDef('MEDLSEMSKAP', medlemskapPanelDef);
    const utledetMedlemskapDelPanel = new ProsessStegPanelUtledet(medlemskapStegDef, medlemskapPanelDef, isReadOnlyCheck, [], [], {},
      toggleOverstyring, kanOverstyreAccess, []);

    const opptjeningPanelDef = lagPanelDef('OPPTJENING', [], ['OPPTJENING.TEKST']);
    const opptjeningStegDef = lagStegDef('OPPTJENING', opptjeningPanelDef);
    const utledetOpptjeningDelPanel = new ProsessStegPanelUtledet(opptjeningStegDef, opptjeningPanelDef, isReadOnlyCheck, [], [], {},
      toggleOverstyring, kanOverstyreAccess, []);

    const prosessStegData = [utledetFodselDelPanel, utledetMedlemskapDelPanel, utledetOpptjeningDelPanel];

    const wrapper = shallow(
      <InngangsvilkarPanel
        behandling={behandling as Behandling}
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
    expect(text.prop('id')).to.eql(['FODSEL.TEKST']);

    const columns = wrapper.find(Column);
    expect(columns).to.have.length(2);
    const column1 = columns.first().find(DataFetcher);
    expect(column1).to.have.length(2);
    const column2 = columns.last().find(DataFetcher);
    expect(column2).to.have.length(1);
  });

  it('skal vise aksjonspunkt-hjelpetekst med lenke for avventing av fakta-aksjonspunkt', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;

    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL], ['FODSEL.TEKST']);
    const fodselStegDef = lagStegDef('FODSEL', fodselPanelDef);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(fodselStegDef, fodselPanelDef, isReadOnlyCheck, aksjonspunkter, [], {},
      toggleOverstyring, kanOverstyreAccess, []);

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();

    const wrapper = shallow(
      <InngangsvilkarPanel
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        prosessStegData={[utledetFodselDelPanel]}
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
