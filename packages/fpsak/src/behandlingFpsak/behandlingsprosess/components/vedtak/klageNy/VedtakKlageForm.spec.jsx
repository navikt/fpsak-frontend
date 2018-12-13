import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import featureToggle from 'app/featureToggle';
import VedtakKlageSubmitPanel from './VedtakKlageSubmitPanel';
import { getAvvisningsAarsaker, VedtakKlageFormImpl, getIsAvvist } from './VedtakKlageForm';

const KLAGE_OMGJORT_TEKST = 'VedtakKlageForm.KlageOmgjort';


describe('<VedtakKlageForm>', () => {
  it('skal vise riktige avvisningsårsaker', () => {
    const avvistArsaker = [{ kode: 'KLAGET_FOR_SENT', navn: 'Bruker har klaget for sent', kodeverk: 'KLAGE_AVVIST_AARSAK' },
      { kode: 'KLAGER_IKKE_PART', navn: 'Klager er ikke part', kodeverk: 'KLAGE_AVVIST_AARSAK' }];
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const br = {
      id: 1,
      type: {
        kode: behandlingResultatType.KLAGE_AVVIST,
        navn: 'avvist',
      },
    };
    const wrapper = shallowWithIntl(<VedtakKlageFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      isAvvist
      isOmgjort={false}
      behandlingsResultatTekst={KLAGE_OMGJORT_TEKST}
      behandlingsresultatTypeKode=""
      isOpphevOgHjemsend={false}
      avvistArsaker={avvistArsaker}
      avvisningsAarsakerForFeature={[null]}
      behandlingPaaVent={false}
      behandlingStatusKode="UTRED"
      behandlingsresultat={br}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={[]}
      klageVurdering=""
      aksjonspunktKode=""
      isBehandlingReadOnly
    />);
    expect(wrapper.find(Undertekst).at(1).childAt(0).text()).equal('Årsak til avvisning');
    expect(wrapper.find(Normaltekst).at(1).childAt(0).text()).equal('Bruker har klaget for sent');
    expect(wrapper.find(Normaltekst).at(2).childAt(0).text()).equal('Klager er ikke part');
    expect(wrapper.find(VedtakKlageSubmitPanel)).to.have.length(1);
  });
  describe('Klage vedtak Selectors', () => {
    describe('getIsAvvist', () => {
      it('should return true', () => {
        const brt = { type: { kode: behandlingResultatType.KLAGE_AVVIST } };
        const selected = getIsAvvist.resultFunc(brt);
        expect(selected).equal(true);
      });
    });

    describe('getIsAvgetAvvisningsAarsakervist', () => {
      it('should return avvisningsAarsaker with length 2', () => {
        const toggle = {
          [featureToggle.FORMKRAV]: true,
        };
        const klageVurdering = {
          klageFormkravResultatNFP: { avvistArsaker: [{ navn: 'arsak1' }, { navn: 'arsak2' }] },
          klageVurderingResultatNFP: { klageAvvistArsakNavn: 'Klager er ikke part' },
        };
        const selected = getAvvisningsAarsaker.resultFunc(klageVurdering, toggle);
        expect(selected).to.have.length(2);
      });
    });
  });
});
