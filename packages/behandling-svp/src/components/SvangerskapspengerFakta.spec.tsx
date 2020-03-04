import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { FaktaPanel, DataFetcherBehandlingData } from '@fpsak-frontend/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import SvangerskapspengerFakta from './SvangerskapspengerFakta';

describe('<SvangerskapspengerFakta>', () => {
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
  const navAnsatt = {
    brukernavn: 'Espen Utvikler',
    navn: 'Espen Utvikler',
    kanVeilede: false,
    kanSaksbehandle: true,
    kanOverstyre: false,
    kanBeslutte: false,
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
  };
  const aksjonspunkter = [{
    definisjon: { kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, kodeverk: 'test' },
    status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
    kanLoses: true,
    erAktivt: true,
  }];
  const vilkar = [];
  const inntektArbeidYtelse = {
    skalKunneLeggeTilNyeArbeidsforhold: true,
    skalKunneLageArbeidsforholdBasertPaInntektsmelding: true,
    relatertTilgrensendeYtelserForAnnenForelder: [],
  };

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    const wrapper = shallowWithIntl(
      <SvangerskapspengerFakta.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar }}
        behandling={behandling}
        fagsak={fagsak}
        navAnsatt={navAnsatt}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(FaktaPanel);
    expect(panel.prop('paneler')).is.eql([{
      erAktiv: false,
      harAksjonspunkt: false,
      tekst: 'Saken',
    }, {
      erAktiv: true,
      harAksjonspunkt: true,
      tekst: 'Arbeidsforhold',
    }]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallowWithIntl(
      <SvangerskapspengerFakta.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar }}
        behandling={behandling}
        fagsak={fagsak}
        navAnsatt={navAnsatt}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(FaktaPanel);

    panel.prop('onClick')(0);

    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql('default');
    expect(args[1]).to.eql('saken');
  });

  it('skal rendre faktapanel korrekt', () => {
    const wrapper = shallowWithIntl(
      <SvangerskapspengerFakta.WrappedComponent
        intl={intlMock}
        data={{ aksjonspunkter, vilkar, inntektArbeidYtelse }}
        behandling={behandling}
        fagsak={fagsak}
        navAnsatt={navAnsatt}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        dispatch={sinon.spy()}
      />,
    );

    const dataFetcher = wrapper.find(DataFetcherBehandlingData);
    expect(dataFetcher.prop('behandlingVersion')).is.eql(behandling.versjon);
    expect(dataFetcher.prop('endpoints')).is.eql([]);

    const arbeidsforholdPanel = dataFetcher.renderProp('render')({}).find(ArbeidsforholdFaktaIndex);
    expect(arbeidsforholdPanel.prop('readOnly')).is.false;
    expect(arbeidsforholdPanel.prop('submittable')).is.true;
    expect(arbeidsforholdPanel.prop('harApneAksjonspunkter')).is.true;
  });
});
