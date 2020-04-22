import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Vilkar, Behandlingsresultat } from '@fpsak-frontend/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';

const engangsstonad = fagsakYtelseType.ENGANGSSTONAD;
const foreldrepenger = fagsakYtelseType.FORELDREPENGER;

describe('<VedtakAvslagPanel>', () => {
  const sprakkode = {
    kode: 'NO',
    kodeverk: '',
  };

  const vilkarUtenSoknadsfrist = [{
    vilkarType: {
      kode: vilkarType.MEDLEMSKAPSVILKARET,
      kodeverk: '',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.IKKE_OPPFYLT,
      kodeverk: '',
    },
    lovReferanse: '§ 22-13, 2. ledd',
  }];

  const behandlingsresultat = {
    id: 1,
    type: {
      kode: 'test',
      kodeverk: '',
    },
    avslagsarsak: {
      kode: '1019',
      kodeverk: '',
    },
    avslagsarsakFritekst: null,
  };

  const soknadVilkar = {
    vilkarType: {
      kode: vilkarType.SOKNADFRISTVILKARET,
      kodeverk: '',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.IKKE_OPPFYLT,
      kodeverk: '',
    },
    lovReferanse: '§ 13-37, 2. ledd',
  };

  it('skal rendre avslagspanel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanel.WrappedComponent
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={[soknadVilkar] as Vilkar[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      ytelseTypeKode={engangsstonad}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Engangsstønad er avslått');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(1);
  });

  it('skal rendre avslagspanel uten fritekstpanel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanel.WrappedComponent
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist as Vilkar[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      ytelseTypeKode={engangsstonad}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Engangsstønad er avslått');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(0);
  });

  it('skal rendre avslagspanel uten fritekstpanel for foreldrepenger', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanel.WrappedComponent
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist as Vilkar[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      ytelseTypeKode={foreldrepenger}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Foreldrepenger er avslått');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(0);
  });

  it('skal rendre avslagspanel med fritekstpanel for foreldrepenger', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanel.WrappedComponent
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist as Vilkar[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      ytelseTypeKode={foreldrepenger}
      alleKodeverk={{}}
      beregningErManueltFastsatt
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Foreldrepenger er avslått');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(1);
  });
});
