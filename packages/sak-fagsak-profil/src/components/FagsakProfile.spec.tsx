import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Tooltip } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-fagsak-profil';
import { FagsakProfile } from './FagsakProfile';

describe('<FagsakProfile>', () => {
  const alleKodeverk = {
    [kodeverkTyper.FAGSAK_YTELSE]: [{
      kode: 'ES',
      navn: 'Engangsstønad',
      kodeverk: 'FAGSAK_YTELSE',
    }, {
      kode: 'FP',
      navn: 'Foreldrepenger',
      kodeverk: 'FAGSAK_YTELSE',
    }],
    [kodeverkTyper.FAGSAK_STATUS]: [{
      kode: 'OPPR',
      navn: 'Opprettet',
      kodeverk: 'FAGSAK_STATUS',
    }],
  };

  it('skal vise en fagsak med tilhørende informasjon', () => {
    const sakstype = {
      kode: 'ES',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      alleKodeverk={alleKodeverk as {[key: string]: [KodeverkMedNavn]}}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      dekningsgrad={100}
      intl={intlMock}
    />);

    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Engangsstønad');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');
  });

  it('skal vise dekningsgrad for foreldrepenger om den eksisterer', () => {
    const sakstype = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      alleKodeverk={alleKodeverk as {[key: string]: [KodeverkMedNavn]}}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      dekningsgrad={100}
      intl={intlMock}
    />);

    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Foreldrepenger');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    expect(wrapper.find(EtikettInfo)).to.have.length(1);
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).to.have.length(1);
    expect(tooltip.prop('content')).is.eql('Dekningsgraden er 100%');
  });

  it('skal ikke vise dekningsgrad for foreldrepenger om den ikke eksisterer', () => {
    const sakstype = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      alleKodeverk={alleKodeverk as {[key: string]: [KodeverkMedNavn]}}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      intl={intlMock}
    />);

    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Foreldrepenger');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    const etikettinfo = wrapper.find(EtikettInfo);
    expect(etikettinfo).to.have.length(0);
  });

  it('skal ikke vise ugyldig dekningsgrad for foreldrepenger', () => {
    const sakstype = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
    };
    const wrapper = shallowWithIntl(<FagsakProfile
      saksnummer={12345}
      sakstype={sakstype}
      fagsakStatus={status}
      alleKodeverk={alleKodeverk as {[key: string]: [KodeverkMedNavn]}}
      renderBehandlingMeny={sinon.spy()}
      renderBehandlingVelger={sinon.spy()}
      dekningsgrad={73}
      intl={intlMock}
    />);

    const systemtittel = wrapper.find(Systemtittel);
    expect(systemtittel).to.have.length(1);
    expect(systemtittel.childAt(0).text()).is.eql('Foreldrepenger');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).is.eql('12345 - Opprettet');

    const etikettinfo = wrapper.find(EtikettInfo);
    expect(etikettinfo).to.have.length(0);
  });
});
