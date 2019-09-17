import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import VurderEtterlonnSluttpakkeForm from './VurderEtterlonnSluttpakkeForm';

describe('<VurderEtterlonnSluttpakkeForm>', () => {
  it('Skal teste at komponenten vises korrekt', () => {
    const wrapper = shallowWithIntl(<VurderEtterlonnSluttpakkeForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      harEtterlonnSluttpakke={false}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
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
});
