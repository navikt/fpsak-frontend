import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

import VurderEtterlonnSluttpakkeForm from './VurderEtterlonnSluttpakkeForm';

describe('<VurderEtterlonnSluttpakkeForm>', () => {
  it('Skal teste at komponenten vises korrekt når det ikke er valgt at bruker har etterlønn eller sluttpakke', () => {
    const wrapper = shallowWithIntl(<VurderEtterlonnSluttpakkeForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      harEtterlonnSluttpakke={false}
    />);
    const radios = wrapper.find('RadioOption');
    const fastsettKomponent = wrapper.find('FastsettEtterlonnSluttpakkeForm');
    expect(radios).to.have.length(2);
    expect(fastsettKomponent).to.have.length(0);
  });
  it('Skal teste at komponenten vises korrekt når det er valgt at bruker har etterlønn eller sluttpakke', () => {
    const wrapper = shallowWithIntl(<VurderEtterlonnSluttpakkeForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      harEtterlonnSluttpakke
    />);
    const radios = wrapper.find('RadioOption');
    const fastsettKomponent = wrapper.find('FastsettEtterlonnSluttpakkeForm');
    expect(radios).to.have.length(2);
    expect(fastsettKomponent).to.have.length(1);
  });
  it('Skal teste at buildInitialvalues bygges korrekt når det er tidligere fastsatt etterlønn eller sluttpakke', () => {
    const ap = {
      status: {
        kode: 'OPPRETTET',
      },
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              arbeidsforhold: {
                arbeidsforholdType: {
                  kode: 'ETTERLØNN_SLUTTPAKKE',
                },
              },
              beregnetPrAar: 120000,
            },
          ],
        },
      ],
    };
    const values = VurderEtterlonnSluttpakkeForm.buildInitialValues(bg, ap);
    const testobj = {
      vurderEtterlønnSluttpakke: true,
    };
    expect(values).to.deep.equal(testobj);
  });

  it('Skal teste at buildInitialvalues bygges korrekt når det ikke er tidligere fastsatt etterlønn eller sluttpakke', () => {
    const ap = {
      status: {
        kode: 'OPPRETTET',
      },
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              arbeidsforhold: {
                arbeidsforholdType: {
                  kode: 'ETTERLØNN_SLUTTPAKKE',
                },
              },
              beregnetPrAar: null,
            },
          ],
        },
      ],
    };
    const values = VurderEtterlonnSluttpakkeForm.buildInitialValues(bg, ap);
    const testobj = {
      vurderEtterlønnSluttpakke: false,
    };
    expect(values).to.deep.equal(testobj);
  });

  it('Skal kunne fastsette om vi må slette tidligere tilfelle', () => {
    const values = {
      vurderEtterlønnSluttpakke: true,
      inntektEtterlønnSluttpakke: '20 000',
    };
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_ETTERLONN_SLUTTPAKKE];
    const fakta = {
      faktaOmBeregningTilfeller: tilfeller,
    };
    const result = VurderEtterlonnSluttpakkeForm.etterlonnSluttpakkeInntekt(values, tilfeller, fakta);
    const testobj = {
      faktaOmBeregningTilfeller: ['VURDER_ETTERLØNN_SLUTTPAKKE', 'FASTSETT_ETTERLØNN_SLUTTPAKKE'],
      fastsettEtterlønnSluttpakke: {
        fastsattPrMnd: 20000,
      },
    };
    expect(result).to.deep.equal(testobj);
  });
});
