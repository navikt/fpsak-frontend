import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { NyoppstartetFLFormImpl, erNyoppstartetFLField, utledOverskriftForNyoppstartetFLForm } from './NyoppstartetFLForm';
import FastsettATFLInntektForm from './FastsettATFLInntektForm';

describe('<NyoppstartetFLForm>', () => {
  it('skal teste at korrekt antall radioknapper vises med korrekte props', () => {
    const wrapper = shallow(<NyoppstartetFLFormImpl
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
    const wrapper = shallow(<NyoppstartetFLFormImpl
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
    const transformedObject = NyoppstartetFLFormImpl.transformValues(values);
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
    const initialValues = NyoppstartetFLFormImpl.buildInitialValues(gyldigBG);
    expect(initialValues[erNyoppstartetFLField]).to.equal(true);
  });

  it('Skal teste at underkomponenter mottar korrekt prop for radioknapp overskrift når ikke det er spesialtilfelle', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const overskriftNyoppstartteFL = ['BeregningInfoPanel.VurderOgFastsettATFL.ErSokerNyoppstartetFL'];
    const nyoppstartetFormOverskrift = utledOverskriftForNyoppstartetFLForm(tilfeller, true);
    expect(nyoppstartetFormOverskrift).to.deep.eql(overskriftNyoppstartteFL);
  });


  it('Skal teste at underkomponenter mottar korrekt prop for radioknapp overskrift når det er spesialtilfelle', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const overskriftNyoppstartteFL = [
      'BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM',
      'BeregningInfoPanel.VurderOgFastsettATFL.OgsaNyoppstartetFL'];
    const nyoppstartetFormOverskrift = utledOverskriftForNyoppstartetFLForm(tilfeller, true);
    expect(nyoppstartetFormOverskrift).to.deep.eql(overskriftNyoppstartteFL);
  });

  it('Skal ikkje submitte inntekt ved endring beregningsgrunnlag', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const values = {};
    values[erNyoppstartetFLField] = true;
    const tv = NyoppstartetFLFormImpl.nyOppstartetFLInntekt(values, tilfeller,
      { faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL] });
    expect(tv.fastsettMaanedsinntektFL).to.equal(null);
  });

  it('Skal ikkje submitte inntekt ved tilstøtende ytelse', () => {
    const tilfeller = [faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
      faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE, faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const values = {};
    values[erNyoppstartetFLField] = true;
    const tv = NyoppstartetFLFormImpl.nyOppstartetFLInntekt(values, tilfeller,
      { faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL] });
    expect(tv.fastsettMaanedsinntektFL).to.equal(null);
  });
});
