import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingResultatType from 'kodeverk/behandlingResultatType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';

import { VedtakInnvilgetKlagePanelImpl } from './VedtakInnvilgetKlagePanel';

const engangsstonad = fagsakYtelseType.ENGANGSSTONAD;
const foreldrepenger = fagsakYtelseType.FORELDREPENGER;


describe('<VedtakInnvilgetKlagePanel>', () => {
  it('skal rendre innvilget panel for klage ytelsesvedtak stadfestet', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetKlagePanelImpl
      intl={intlMock}
      behandlingsresultatTypeKode={behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET}
      ytelseType={engangsstonad}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');


    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Vedtaket er stadfestet');
  });


  it('skal rendre innvilget panel for medhold', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetKlagePanelImpl
      intl={intlMock}
      behandlingsresultatTypeKode={behandlingResultatType.KLAGE_MEDHOLD}
      ytelseType={engangsstonad}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');


    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Vedtaket er omgjort');
  });


  it('skal rendre innvilget panel', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetKlagePanelImpl
      intl={intlMock}
      behandlingsresultatTypeKode="test"
      ytelseType={engangsstonad}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');


    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Engangsstønad er innvilget');
  });


  it('skal rendre innvilget foreldrepenger panel', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetKlagePanelImpl
      intl={intlMock}
      behandlingsresultatTypeKode="test"
      ytelseType={foreldrepenger}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');


    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Foreldrepenger er innvilget');
  });
});
