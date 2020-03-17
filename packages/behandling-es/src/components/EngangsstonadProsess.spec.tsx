import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { omit } from '@fpsak-frontend/utils';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import {
  ProsessStegPanel, FatterVedtakStatusModal, IverksetterVedtakStatusModal, ProsessStegContainer,
} from '@fpsak-frontend/behandling-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import EngangsstonadProsess from './EngangsstonadProsess';

describe('<EngangsstonadProsess>', () => {
  const fagsak = {
    saksnummer: 123456,
    fagsakYtelseType: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    fagsakStatus: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
    fagsakPerson: {
      alder: 30,
      personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
      erDod: false,
      erKvinne: true,
      navn: 'Espen Utvikler',
      personnummer: '12345',
    },
  };
  const behandling = {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'test' },
    type: { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };
  const rettigheter = {
    writeAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
    kanOverstyreAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
  };
  const aksjonspunkter = [{
    definisjon: { kode: aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, kodeverk: 'test' },
    status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
    kanLoses: true,
    erAktivt: true,
  }];
  const vilkar = [{
    vilkarType: { kode: vilkarType.ADOPSJONSVILKARET, kodeverk: 'test' },
    vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
    overstyrbar: true,
  }];
  const soknad = {
    fodselsdatoer: {
      0: '2019-01-01',
    },
    antallBarn: 1,
    soknadType: {
      kode: soknadType.FODSERL,
      kodeverk: 'test',
    },
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);
    expect(meny.prop('formaterteProsessStegPaneler')).is.eql([{
      isActive: true,
      isDisabled: false,
      isFinished: false,
      label: 'Inngangsvilkår',
      type: 'warning',
    }, {
      isActive: false,
      isDisabled: false,
      isFinished: false,
      label: 'Beregning',
      type: 'default',
    }, {
      isActive: false,
      isDisabled: false,
      isFinished: false,
      label: 'Simulering',
      type: 'default',
    }, {
      isActive: false,
      isDisabled: false,
      isFinished: false,
      label: 'Vedtak',
      type: 'default',
    }]);
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        featureToggles={{}}
        opneSokeside={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);

    meny.prop('velgProsessStegPanelCallback')(3);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql('vedtak');
    expect(opppdaterKall[0].args[1]).to.eql('default');
  });

  it('skal vise prosesspanel for inngangsvilkår siden det er et åpent aksjonspunkt for adopsjon', () => {
    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const panelData = {
      code: 'ADOPSJON',
      endpoints: [],
      aksjonspunkter,
      isAksjonspunktOpen: true,
      aksjonspunktHelpTextCodes: ['AdopsjonVilkarForm.VurderGjelderSammeBarn'],
      isReadOnly: false,
      status: vilkarUtfallType.IKKE_VURDERT,
      komponentData: {
        status: vilkarUtfallType.IKKE_VURDERT,
        isReadOnly: false,
        readOnlySubmitButton: false,
        aksjonspunkter,
        vilkar,
        isAksjonspunktOpen: true,
      },
    };

    const data = {
      urlCode: 'inngangsvilkar',
      erStegBehandlet: true,
      prosessStegTittelKode: 'Behandlingspunkt.Inngangsvilkar',
      isAksjonspunktOpen: true,
      isReadOnly: false,
      aksjonspunkter,
      status: vilkarUtfallType.IKKE_VURDERT,
    };

    const panel = wrapper.find(ProsessStegPanel);
    expect(omit(panel.prop('valgtProsessSteg').panelData[0], 'renderComponent')).is.eql(panelData);
    expect(omit(panel.prop('valgtProsessSteg'), 'panelData')).is.eql(data);
  });

  it('skal vise fatter vedtak modal etter lagring når aksjonspunkt er FORESLA_VEDTAK og så lukke denne og gå til søkeside', () => {
    const vedtakAksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.FORESLA_VEDTAK, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    }];
    const vedtakBehandling = {
      ...behandling,
      status: { kode: behandlingStatus.FATTER_VEDTAK, kodeverk: 'test' },
    };

    const opneSokeside = sinon.spy();

    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter: vedtakAksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={vedtakBehandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={opneSokeside}
        dispatch={sinon.spy()}
      />,
    );

    const modal = wrapper.find(FatterVedtakStatusModal);
    expect(modal.prop('visModal')).is.false;

    const panel = wrapper.find(ProsessStegPanel);
    panel.prop('lagringSideeffekterCallback')([{ kode: aksjonspunktCodes.FORESLA_VEDTAK, isVedtakSubmission: true }])();

    const oppdatertModal = wrapper.find(FatterVedtakStatusModal);
    expect(oppdatertModal.prop('visModal')).is.true;

    oppdatertModal.prop('lukkModal')();

    const opppdaterKall = opneSokeside.getCalls();
    expect(opppdaterKall).to.have.length(1);
  });

  it('skal vise iverksetter vedtak modal etter lagring når aksjonspunkt er FATTER_VEDTAK og så lukke denne og gå til søkeside', () => {
    const vedtakAksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.FATTER_VEDTAK, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    }];

    const opneSokeside = sinon.spy();

    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter: vedtakAksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={opneSokeside}
        dispatch={sinon.spy()}
      />,
    );

    const modal = wrapper.find(IverksetterVedtakStatusModal);
    expect(modal.prop('visModal')).is.false;

    const panel = wrapper.find(ProsessStegPanel);
    panel.prop('lagringSideeffekterCallback')([{ kode: aksjonspunktCodes.FATTER_VEDTAK, isVedtakSubmission: true }])();

    const oppdatertModal = wrapper.find(IverksetterVedtakStatusModal);
    expect(oppdatertModal.prop('visModal')).is.true;

    oppdatertModal.prop('lukkModal')();

    const opppdaterKall = opneSokeside.getCalls();
    expect(opppdaterKall).to.have.length(1);
  });

  it('skal gå til søkeside når en har revurderingsaksjonspunkt', () => {
    const vedtakAksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.VARSEL_REVURDERING_MANUELL, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    }];

    const opneSokeside = sinon.spy();

    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter: vedtakAksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={opneSokeside}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    panel.prop('lagringSideeffekterCallback')([{ kode: aksjonspunktCodes.VARSEL_REVURDERING_MANUELL, sendVarsel: true }])();

    const opppdaterKall = opneSokeside.getCalls();
    expect(opppdaterKall).to.have.length(1);
  });

  it('skal gå til neste panel i prosess etter løst aksjonspunkt', () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        featureToggles={{}}
        opneSokeside={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    panel.prop('lagringSideeffekterCallback')([{ kode: aksjonspunktCodes.SVANGERSKAPSVILKARET, sendVarsel: true }])();

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql('default');
    expect(opppdaterKall[0].args[1]).to.eql('default');
  });

  it('skal legge til forhåndsvisningsfunksjon i prosess-steget til vedtak', () => {
    const dispatch = sinon.spy();
    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="vedtak"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={sinon.spy()}
        dispatch={dispatch}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    expect(panel.prop('valgtProsessSteg').urlCode).is.eql('vedtak');
    const forhandsvisCallback = panel.prop('valgtProsessSteg').panelData[0].komponentData.previewCallback;
    expect(forhandsvisCallback).is.not.null;

    forhandsvisCallback({ param: 'test' });

    expect(dispatch.getCalls()).to.have.length(1);
  });

  it('skal legge til forhåndsvisningsfunksjon i prosess-steget til simulering', () => {
    const dispatch = sinon.spy();
    const wrapper = shallowWithIntl(
      <EngangsstonadProsess.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, soknad }}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="simulering"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        featureToggles={{}}
        opneSokeside={sinon.spy()}
        dispatch={dispatch}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    expect(panel.prop('valgtProsessSteg').urlCode).is.eql('simulering');
    const forhandsvisCallback = panel.prop('valgtProsessSteg').panelData[0].komponentData.previewFptilbakeCallback;
    expect(forhandsvisCallback).is.not.null;

    forhandsvisCallback({ param: 'test' });

    expect(dispatch.getCalls()).to.have.length(1);
  });
});
