import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { DataFetcher } from '@fpsak-frontend/rest-api-redux';

import ApprovalIndex from './ApprovalIndex';

describe('<ApprovalIndex>', () => {
  const getBehandling = () => ({
    id: 1234,
    versjon: 123,
    type: {
      kode: 'BT-001',
      navn: 'Endringssøknad',
    },
    fagsakId: 2,
    opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
    status: {
      kode: 'FVED',
      kodeverk: 'BEHANDLING_STATUS',
    },
    toTrinnsBehandling: true,
    ansvarligSaksbehandler: 'Espen Utvikler',
  });

  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  };

  const getKodeverkSkjemalenkeTyper = (aksjonspunkter) => aksjonspunkter.map((ap) => ({
    kode: ap.skjermlenkeType,
    navn: 'Dummy Tekst',
  }));

  const createAksjonspunkt = (aksjonspunktKode) => (
    {
      aksjonspunktKode,
      beregningDto: null,
      besluttersBegrunnelse: null,
      opptjeningAktiviteter: [],
      totrinnskontrollGodkjent: null,
      vurderPaNyttArsaker: [],
    }
  );

  const navAnsatt = {
    brukernavn: 'Test',
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
    kanBeslutte: true,
    kanOverstyre: false,
    kanSaksbehandle: true,
    kanVeilede: false,
    navn: 'Test',
  };

  const getTotrinnsaksjonspunkterFoedsel = () => ({
    skjermlenkeType: 'FAKTA_OM_FOEDSEL',
    totrinnskontrollAksjonspunkter: [createAksjonspunkt(aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL),
      createAksjonspunkt(aksjonspunktCodes.TERMINBEKREFTELSE),
      createAksjonspunkt(aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING)],
  });

  const getTotrinnsaksjonspunkterOmsorg = () => ({
    skjermlenkeType: 'FAKTA_FOR_OMSORG',
    totrinnskontrollAksjonspunkter: [createAksjonspunkt(aksjonspunktCodes.OMSORGSOVERTAKELSE),
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET)],
  });

  const getTotrinnsaksjonspunkterForeldreansvar = () => ({
    skjermlenkeType: 'PUNKT_FOR_FORELDREANSVAR',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD),
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD),
    ],
  });

  it('skal vise lightboks når approvalReceived', () => {
    const behandling = getBehandling();

    const totrinnskontrollAksjonspunkter = [
      getTotrinnsaksjonspunkterFoedsel(),
      getTotrinnsaksjonspunkterOmsorg(),
      getTotrinnsaksjonspunkterForeldreansvar(),
    ];

    const wrapper = shallow(<ApprovalIndex
      behandlingId={behandling.id}
      approve={sinon.spy()}
      selectedBehandlingVersjon={behandling.versjon}
      ansvarligSaksbehandler={behandling.ansvarligSaksbehandler}
      behandlingStatus={behandling.status}
      toTrinnsBehandling={behandling.toTrinnsBehandling}
      push={sinon.spy()}
      resetApproval={sinon.spy()}
      location={locationMock}
      navAnsatt={navAnsatt}
      totrinnskontrollSkjermlenkeContext={totrinnskontrollAksjonspunkter}
      skjemalenkeTyper={getKodeverkSkjemalenkeTyper(totrinnskontrollAksjonspunkter)}
      erTilbakekreving={false}
      behandlingUuid="1"
      previewMessage={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      alleKodeverk={{}}
      isForeldrepenger
      disableGodkjennKnapp={false}
      behandlingsresultat={{}}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
    />);

    wrapper.setState({ showBeslutterModal: true, allAksjonspunktApproved: true });

    const dataFetcher = wrapper.find(DataFetcher);
    const innerDataFetcher = dataFetcher.renderProp('render')({ }, true).find(DataFetcher);
    const vedtakStatusModal = innerDataFetcher.renderProp('render')({ }, true).find(FatterVedtakApprovalModalSakIndex);
    expect(vedtakStatusModal).to.have.length(1);
  });

  it('skal kalle resetApproval når unmount', () => {
    const resetApprovalFunction = sinon.spy();
    const behandling = getBehandling();
    const wrapper = shallow(<ApprovalIndex
      approve={sinon.spy()}
      selectedBehandlingVersjon={behandling.versjon}
      ansvarligSaksbehandler={behandling.ansvarligSaksbehandler}
      behandlingStatus={behandling.status}
      toTrinnsBehandling={behandling.toTrinnsBehandling}
      push={sinon.spy()}
      resetApproval={resetApprovalFunction}
      location={locationMock}
      navAnsatt={navAnsatt}
      totrinnskontrollSkjermlenkeContext={undefined}
      skjemalenkeTyper={[]}
      erTilbakekreving={false}
      behandlingUuid="1"
      previewMessage={sinon.spy()}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      }}
      alleKodeverk={{}}
      isForeldrepenger
      disableGodkjennKnapp={false}
    />);

    wrapper.unmount();
    expect(resetApprovalFunction).to.have.property('callCount', 1);
  });
});
