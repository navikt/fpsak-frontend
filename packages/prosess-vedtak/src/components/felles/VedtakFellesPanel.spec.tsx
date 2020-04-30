import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Lenke from 'nav-frontend-lenker';
import { FormattedMessage } from 'react-intl';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Behandling } from '@fpsak-frontend/types';

import ManueltVedtaksbrevPanel from './ManueltVedtaksbrevPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';
import VedtakFellesPanel from './VedtakFellesPanel';

describe('<VedtakFellesPanel>', () => {
  const behandling = {
    behandlingsresultat: {
      type: {
        kode: behandlingResultatType.INNVILGET,
        kodeverk: '',
      },
    },
    behandlingPaaVent: false,
    sprakkode: {
      kode: 'EN',
      kodeverk: '',
    },
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      kodeverk: '',
    },
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: '',
    },
  };

  it('skal vise lenker for automatisk vedtaksbrev og for overstyring av vedtaksbrev når saksbehandler kan overstyre', () => {
    const wrapper = shallowWithIntl(<VedtakFellesPanel.WrappedComponent
      intl={intlMock}
      behandling={behandling as Behandling}
      aksjonspunkter={[]}
      readOnly={false}
      renderPanel={() => <div>test</div>}
      kanOverstyre
      previewAutomatiskBrev={sinon.spy()}
      previewOverstyrtBrev={sinon.spy()}
      clearFormField={sinon.spy()}
      erBehandlingEtterKlage={false}
      handleSubmit={sinon.spy()}
      submitting={false}
    />);

    const lenker = wrapper.find(Lenke);
    expect(lenker).to.have.length(2);

    const message1 = lenker.first().find(FormattedMessage);
    expect(message1).to.have.length(1);
    expect(message1.prop('id')).to.eql('VedtakFellesPanel.AutomatiskVedtaksbrev');

    const message2 = lenker.last().find(FormattedMessage);
    expect(message2).to.have.length(1);
    expect(message2.prop('id')).to.eql('VedtakFellesPanel.RedigerVedtaksbrev');
  });

  it('skal vise panel for editering av vedtaksbrevet etter at saksbehandler har trykket på lenke', () => {
    const wrapper = shallowWithIntl(<VedtakFellesPanel.WrappedComponent
      intl={intlMock}
      behandling={behandling as Behandling}
      aksjonspunkter={[]}
      readOnly={false}
      renderPanel={() => <div>test</div>}
      kanOverstyre
      previewAutomatiskBrev={sinon.spy()}
      previewOverstyrtBrev={sinon.spy()}
      clearFormField={sinon.spy()}
      erBehandlingEtterKlage={false}
      handleSubmit={sinon.spy()}
      submitting={false}
    />);

    expect(wrapper.find(ManueltVedtaksbrevPanel)).to.have.length(0);

    const lenker = wrapper.find(Lenke);
    expect(lenker).to.have.length(2);

    lenker.last().prop('onClick')();

    expect(wrapper.find(ManueltVedtaksbrevPanel)).to.have.length(1);
  });

  it('skal rendre input-panel', () => {
    const wrapper = shallowWithIntl(<VedtakFellesPanel.WrappedComponent
      intl={intlMock}
      behandling={behandling as Behandling}
      aksjonspunkter={[]}
      readOnly={false}
      renderPanel={() => <span>test</span>}
      kanOverstyre
      previewAutomatiskBrev={sinon.spy()}
      previewOverstyrtBrev={sinon.spy()}
      clearFormField={sinon.spy()}
      erBehandlingEtterKlage={false}
      handleSubmit={sinon.spy()}
      submitting={false}
    />);

    expect(wrapper.find('span')).to.have.length(1);
  });
});
