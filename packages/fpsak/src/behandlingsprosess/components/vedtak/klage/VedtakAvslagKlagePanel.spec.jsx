import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import klageVurdering from 'kodeverk/klageVurdering';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import { VedtakAvslagKlagePanelImpl, getAvslagArsak } from './VedtakAvslagKlagePanel';

describe('<VedtakAvslagKlagePanel>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };

  const engangsstonad = fagsakYtelseType.ENGANGSSTONAD;
  const foreldrepenger = fagsakYtelseType.FORELDREPENGER;

  it('skal gi riktig avslagArsak', () => {
    const klageVurderingResultatNK = { klageVurdering: klageVurdering.AVVIS_KLAGE, klageAvvistArsakNavn: 'TEST' };

    const arsak = getAvslagArsak(klageVurderingResultatNK, undefined);

    expect(arsak).to.eql('TEST');
  });

  it('skal rendre avslagspanel uten textfield når klagevurdering er avvis', () => {
    const behandlingResultat = { avslagsarsakFritekst: 'FRITEKST' };
    const klageVurderingResultatNK = { klageVurdering: klageVurdering.AVVIS_KLAGE, klageAvvistArsakNavn: 'klageAvvistArsak', begrunnelse: 'BEGRUNNELSETEST' };

    const wrapper = shallowWithIntl(<VedtakAvslagKlagePanelImpl
      intl={intlMock}
      readOnly={false}
      behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultatTypeKode="TEST"
      klageVurderingResultatNK={klageVurderingResultatNK}
      behandlingsresultat={behandlingResultat}
      sprakkode={sprakkode}
      vilkar={[]}
      ytelseType={engangsstonad}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(3);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.at(1).childAt(0).text()).to.eql('Årsak til avslag');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Begrunnelse');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(3);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Engangsstønad er avslått');
    expect(normaltekstFields.at(1).childAt(0).text()).to.eql('klageAvvistArsak');
    expect(normaltekstFields.last().childAt(0).text()).to.eql('BEGRUNNELSETEST');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(0);
  });


  it('skal rendre avslagspanel med textfield når klagevurdering ikke er avvis', () => {
    const behandlingResultat = { avslagsarsakFritekst: 'FRITEKST' };
    const klageVurderingResultatNK = { klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK, begrunnelse: 'BEGRUNNELSETEST' };

    const wrapper = shallowWithIntl(<VedtakAvslagKlagePanelImpl
      intl={intlMock}
      readOnly
      behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultatTypeKode="TEST"
      klageVurderingResultatNK={klageVurderingResultatNK}
      behandlingsresultat={behandlingResultat}
      sprakkode={sprakkode}
      vilkar={[]}
      ytelseType={engangsstonad}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(3);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.at(1).childAt(0).text()).to.eql('Begrunnelse');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Fritekst i brev til søker');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Engangsstønad er avslått');
    expect(normaltekstFields.last().childAt(0).text()).to.eql('BEGRUNNELSETEST');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('name')).is.eql('begrunnelse');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });


  it('skal vise tekst for foreldrepenger avslått', () => {
    const behandlingResultat = { avslagsarsakFritekst: 'FRITEKST' };
    const klageVurderingResultatNK = { klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK, begrunnelse: 'BEGRUNNELSETEST' };

    const wrapper = shallowWithIntl(<VedtakAvslagKlagePanelImpl
      intl={intlMock}
      readOnly
      behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultatTypeKode="TEST"
      klageVurderingResultatNK={klageVurderingResultatNK}
      behandlingsresultat={behandlingResultat}
      sprakkode={sprakkode}
      vilkar={[]}
      ytelseType={foreldrepenger}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(3);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.at(1).childAt(0).text()).to.eql('Begrunnelse');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Fritekst i brev til søker');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Foreldrepenger er avslått');
    expect(normaltekstFields.last().childAt(0).text()).to.eql('BEGRUNNELSETEST');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('name')).is.eql('begrunnelse');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });
});
