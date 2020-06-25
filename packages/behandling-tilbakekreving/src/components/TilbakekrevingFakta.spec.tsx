import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SideMenuWrapper } from '@fpsak-frontend/behandling-felles';
import { Behandling } from '@fpsak-frontend/types';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import TilbakekrevingFakta from './TilbakekrevingFakta';
import vedtakResultatType from '../kodeverk/vedtakResultatType';

describe('<TilbakekrevingFakta>', () => {
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
  const behandling: Partial<Behandling> = {
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
    definisjon: { kode: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING, kodeverk: 'test' },
    status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
    kanLoses: true,
    erAktivt: true,
  }];
  const perioderForeldelse = {
    perioder: {
      fom: '2019-01-01',
      tom: '2019-04-01',
      belop: 1212,
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.FORELDET,
        kodeverk: 'FORELDRE_VURDERING_TYPE',
      },
    },
  };
  const beregningsresultat = {
    beregningResultatPerioder: [],
    vedtakResultatType: {
      kode: vedtakResultatType.INGEN_TILBAKEBETALING,
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
    },
  };
  const feilutbetalingFakta = {
    behandlingFakta: {
      aktuellFeilUtbetaltBeløp: 122,
      datoForRevurderingsvedtak: '2020-01-01',
      totalPeriodeFom: '2020-01-01',
      totalPeriodeTom: '2020-02-01',
      perioder: [{
        fom: '2020-01-01',
        tom: '2020-02-01',
        belop: 1212,
      }],
      behandlingsresultat: {
        type: {
          kode: 'TEST',
          kodeverk: 'BEHANDLINGSRESULTAT',
        },
        konsekvenserForYtelsen: [],
      },
      behandlingÅrsaker: {
        behandlingArsakType: [],
      },
    },
  };

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    const wrapper = shallowWithIntl(
      <TilbakekrevingFakta.WrappedComponent
        intl={intlMock}
        data={{
          aksjonspunkter, perioderForeldelse, beregningsresultat, feilutbetalingFakta,
        }}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        fpsakKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        hasFetchError={false}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')).is.eql([{
      erAktiv: true,
      harAksjonspunkt: true,
      tekst: 'Feilutbetaling',
    }]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallowWithIntl(
      <TilbakekrevingFakta.WrappedComponent
        intl={intlMock}
        data={{
          aksjonspunkter, perioderForeldelse, beregningsresultat, feilutbetalingFakta,
        }}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        fpsakKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        hasFetchError={false}
        dispatch={sinon.spy()}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);

    panel.prop('onClick')(0);

    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(2);
    expect(args[0]).to.eql('default');
    expect(args[1]).to.eql('feilutbetaling');
  });
});
