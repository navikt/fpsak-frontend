import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import aktivitetStatus from 'kodeverk/aktivitetStatus';

import NyoppstartetFLForm, { erNyoppstartetFLField } from './NyoppstartetFLForm';
import FastsettATFLInntektForm from './FastsettATFLInntektForm';

describe('<NyoppstartetFLForm>', () => {
  it('skal teste at korrekt antall radioknapper vises med korrekte props', () => {
    const wrapper = shallow(<NyoppstartetFLForm
      readOnly={false}
      isAksjonspunktClosed={false}
      erNyoppstartetFL={false}
      tilfeller={[]}
      radioknappOverskrift={['test1', 'test2']}
      manglerIM={false}
    />);
    const radios = wrapper.find('RadioOption');
    const flInntkt = wrapper.find(FastsettATFLInntektForm);
    expect(flInntkt).to.have.length(0);
    expect(radios).to.have.length(2);
    expect(radios.last().prop('disabled')).is.eql(false);
  });
  it('skal teste at komponent for å fastsette inntekt vises hvis vi skal vise den', () => {
    const wrapper = shallow(<NyoppstartetFLForm
      readOnly={false}
      isAksjonspunktClosed={false}
      erNyoppstartetFL
      tilfeller={[]}
      radioknappOverskrift={['test1', 'test2']}
      manglerIM={false}
      skalViseInntektstabell
    />);
    const flInntkt = wrapper.find(FastsettATFLInntektForm);
    expect(flInntkt).to.have.length(1);
  });
  it('skal teste at transformValues gir korrekt output', () => {
    const values = { };
    values[erNyoppstartetFLField] = true;
    values.dummyField = 'tilfeldig verdi';
    const transformedObject = NyoppstartetFLForm.transformValues(values);
    expect(transformedObject.vurderNyoppstartetFL.erNyoppstartetFL).to.equal(true);
    expect(transformedObject.vurderNyoppstartetFL.dummyField).to.equal(undefined);
  });
  it('skal teste at buildInitialValues gir korrekt output med gyldig beregningsgrunnlag', () => {
    const gyldigBG = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              aktivitetStatus: {
                kode: aktivitetStatus.FRILANSER,
              },
              erNyoppstartetEllerSammeOrganisasjon: true,
            },
          ],
        },
      ],
    };
    const initialValues = NyoppstartetFLForm.buildInitialValues(gyldigBG);
    expect(initialValues[erNyoppstartetFLField]).to.equal(true);
  });
});
