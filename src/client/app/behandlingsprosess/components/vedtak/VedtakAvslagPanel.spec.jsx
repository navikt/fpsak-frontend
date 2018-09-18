import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import vilkarType from 'kodeverk/vilkarType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import VedtakFritekstPanel from './VedtakFritekstPanel';
import { VedtakAvslagPanelImpl } from './VedtakAvslagPanel';

const engangsstonad = fagsakYtelseType.ENGANGSSTONAD;
const foreldrepenger = fagsakYtelseType.FORELDREPENGER;

describe('<VedtakAvslagPanel>', () => {
  const behandling = ({
    id: 1,
    versjon: 1,
    fagsakId: 1,
    aksjonspunkter: [],
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    sprakkode: {
      kode: 'NO',
      navn: 'norsk',
    },
    behandlingsresultat: {
      id: 1,
      type: {
        kode: 'test',
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
    },
    vilkar: [{
      vilkarType: {
        kode: vilkarType.MEDLEMSKAPSVILKARET,
        navn: 'Medlemskapsvilkåret',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        navn: 'test',
      },
      lovReferanse: '§ 22-13, 2. ledd',
    }],
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      navn: 'test',
    },
    type: {
      kode: 'test',
      navn: 'test',
    },
    opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
  });

  const sprakkode = {
    kode: 'NO',
    navn: 'norsk',
  };

  const vilkarUtenSoknadsfrist = [
    {
      vilkarType: {
        kode: vilkarType.MEDLEMSKAPSVILKARET,
        navn: 'Medlemskapsvilkåret',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        navn: 'test',
      },
      lovReferanse: '§ 22-13, 2. ledd',
    }];

  const behandlingsresultat = {
    id: 1,
    type: {
      kode: 'test',
      navn: 'test',
    },
    avslagsarsak: {
      kode: '1019',
      navn: 'Manglende dokumentasjon',
    },
    avslagsarsakFritekst: null,
  };

  const soknadVilkar = {
    vilkarType: {
      kode: vilkarType.SOKNADFRISTVILKARET,
      navn: 'Søknadsfristvilkåret',
    },
    vilkarStatus: {
      kode: vilkarUtfallType.IKKE_OPPFYLT,
      navn: 'Ikke oppfylt',
    },
    lovReferanse: '§ 13-37, 2. ledd',
  };

  const aksjonspunktForBeregning = [{
    definisjon: {
      kode: aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
    },
    status: {
      kode: aksjonspunktStatus.UTFORT,
    },
  }];

  it('skal rendre avslagspanel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={[soknadVilkar]}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      behandlinger={[behandling]}
      ytelseType={engangsstonad}
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
    const wrapper = shallowWithIntl(<VedtakAvslagPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      behandlinger={[behandling]}
      ytelseType={engangsstonad}
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
    const wrapper = shallowWithIntl(<VedtakAvslagPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      behandlinger={[behandling]}
      ytelseType={foreldrepenger}
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
    const wrapper = shallowWithIntl(<VedtakAvslagPanelImpl
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist}
      aksjonspunkter={aksjonspunktForBeregning}
      behandlingsresultat={behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      behandlinger={[behandling]}
      ytelseType={foreldrepenger}
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
