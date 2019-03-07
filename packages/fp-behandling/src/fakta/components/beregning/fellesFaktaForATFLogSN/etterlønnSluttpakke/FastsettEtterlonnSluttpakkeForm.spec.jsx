import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FastsettEtterlonnSluttpakkeForm from './FastsettEtterlonnSluttpakkeForm';

describe('<FastsettEtterlonnSluttpakkeForm>', () => {
  it('Skal teste at komponenten vises korrekt', () => {
    const wrapper = shallowWithIntl(<FastsettEtterlonnSluttpakkeForm
      readOnly={false}
      isAksjonspunktClosed={false}
    />);
    const tekst = wrapper.find('Normaltekst');
    const inputfield = wrapper.find('InputField');
    expect(tekst).to.have.length(1);
    expect(inputfield).to.have.length(1);
  });

  it('Skal teste at komponenten bygger initialvalues korrekt', () => {
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
    const initialValues = {
      inntektEtterlønnSluttpakke: '10 000',
    };
    const values = FastsettEtterlonnSluttpakkeForm.buildInitialValues(bg);
    expect(values).to.deep.equal(initialValues);
  });
});
