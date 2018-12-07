import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import aktivitetStatus from 'kodeverk/aktivitetStatus';

import FastsettATFLInntektForm from './FastsettATFLInntektForm';

const forholdMedAtOgFl = {
  andelsnr: 2,
  inntektskategori: {
    navn: 'Arbeidstaker',
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'bedrift',
    arbeidsgiverId: '123',
    arbeidsforholdId: 'abc',
    startdato: '2018-01-01',
  },
};

const forholdMedLonnsendringUtenIM = {
  andelsnr: 2,
  inntektskategori: {
    navn: 'Arbeidstaker',
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'bedrift',
    arbeidsgiverId: '123',
    arbeidsforholdId: 'abc',
    startdato: '2018-01-01',
  },
};

const forholdUtenOrgNavnMedInntekt = {
  andelsnr: 3,
  inntektPrMnd: 15000,
  inntektskategori: {
    navn: 'Arbeidstaker',
  },
  arbeidsforhold: {
    startdato: '2018-01-01',
    arbeidsforholdType: {
      navn: 'Arbeidstaker',
    },
  },
};

const beregningsgrunnlag = {
  faktaOmBeregning: {
    arbeidsforholdMedLønnsendringUtenIM: [forholdMedLonnsendringUtenIM],
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [forholdMedAtOgFl],
    frilansAndel: {
      inntektskategori: {
        navn: 'Frilans',
      },
      arbeidsforhold: {
        startdato: '2018-01-01',
        opphoersdato: '2018-06-01',
      },
      andelsnr: 1,
      arbeidsforholdType: {
        navn: 'Frilans',
      },
    },
  },
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: [
        {
          andelsnr: 1,
          aktivitetStatus: {
            kode: aktivitetStatus.FRILANSER,
          },
          beregnetPrAar: 120000,
        },
        {
          andelsnr: 2,
          aktivitetStatus: {
            kode: aktivitetStatus.ARBEIDSTAKER,
          },
          beregnetPrAar: 120000,
        },
      ],
    },
  ],
};

describe('<FastsettATFLInntektForm>', () => {
  it('Skal vise ekstra intruksjon dersom tabell vises uten vurdering på forhånd når det mangler inntektsmelding', () => {
    const wrapper = shallow(<FastsettATFLInntektForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfellerSomSkalFastsettes={[faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON]}
      tabellVisesUtenVurdering
      manglerInntektsmelding
      arbeidsforholdSomSkalFastsettes={null}
      frilansAndel={undefined}
    />);
    const messages = wrapper.find('FormattedMessage');
    expect(messages.first().prop('id')).to.eql('BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM');
    expect(messages.at(1).prop('id')).to.eql('BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag');
  });

  it('Skal vise ekstra intruksjon dersom tabell vises uten vurdering på forhånd når det ikke mangler inntektsmelding', () => {
    const wrapper = shallow(<FastsettATFLInntektForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfellerSomSkalFastsettes={[faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON]}
      tabellVisesUtenVurdering
      manglerInntektsmelding={false}
      arbeidsforholdSomSkalFastsettes={null}
      frilansAndel={undefined}
    />);
    const messages = wrapper.find('FormattedMessage');
    expect(messages.first().prop('id')).to.eql('BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrg');
    expect(messages.at(1).prop('id')).to.eql('BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag');
  });

  it('Skal populere tabell med korrekte verdier fra frilansandel og arbeidsforhold', () => {
    const arbeidsforhold = [forholdMedAtOgFl, forholdMedLonnsendringUtenIM, forholdUtenOrgNavnMedInntekt];
    const wrapper = shallow(<FastsettATFLInntektForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      tilfellerSomSkalFastsettes={[faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON]}
      tabellVisesUtenVurdering
      manglerInntektsmelding={false}
      arbeidsforholdSomSkalFastsettes={arbeidsforhold}
      frilansAndel={beregningsgrunnlag.faktaOmBeregning.frilansAndel}
    />);
    const allRows = wrapper.find('TableRow');
    expect(allRows).to.have.length(4);

    // Første rad
    const firstRow = allRows.at(0).find('TableColumn');
    expect(firstRow).to.have.length(4);
    expect(firstRow.find('Normaltekst').at(0).childAt(0).text()).to.equal('Frilans');
    expect(firstRow.find('FormattedMessage').prop('values').fom).to.equal('01.01.2018');
    expect(firstRow.find('FormattedMessage').prop('values').tom).to.equal('01.06.2018');
    expect(firstRow.find('InputField').prop('name')).to.equal('fastsattInntekt_FL');
    expect(firstRow.find('Normaltekst').at(2).childAt(0).text()).to.equal('Frilans');

    // Andre rad
    const secondRow = allRows.at(1).find('TableColumn');
    expect(secondRow).to.have.length(4);
    expect(secondRow.find('Normaltekst').at(0).childAt(0).text()).to.equal('bedrift (123) ...abc');
    expect(secondRow.find('FormattedMessage').prop('values').fom).to.equal('01.01.2018');
    expect(secondRow.find('InputField').prop('name')).to.equal('fastsattInntekt_bedrift_2018-01-01_abc');
    expect(secondRow.find('Normaltekst').at(2).childAt(0).text()).to.equal('Arbeidstaker');

    // Tredje rad
    const thirdRow = allRows.at(2).find('TableColumn');
    expect(thirdRow).to.have.length(4);
    expect(thirdRow.find('Normaltekst').at(0).childAt(0).text()).to.equal('bedrift (123) ...abc');
    expect(thirdRow.find('FormattedMessage').prop('values').fom).to.equal('01.01.2018');
    expect(thirdRow.find('InputField').prop('name')).to.equal('fastsattInntekt_bedrift_2018-01-01_abc');
    expect(thirdRow.find('Normaltekst').at(2).childAt(0).text()).to.equal('Arbeidstaker');

    // Fjerde rad
    const fourthRow = allRows.at(3).find('TableColumn');
    expect(fourthRow).to.have.length(4);
    expect(fourthRow.find('Normaltekst').at(0).childAt(0).text()).to.equal('Arbeidstaker');
    expect(fourthRow.find('FormattedMessage').prop('values').fom).to.equal('01.01.2018');
    expect(fourthRow.find('Normaltekst').at(2).childAt(0).text()).to.equal('15 000');
    expect(fourthRow.find('Normaltekst').at(3).childAt(0).text()).to.equal('Arbeidstaker');
  });


  it('Skal teste at buildInitialValues lager korrekt dataobjekt for initalValues', () => {
    const initialValues = FastsettATFLInntektForm.buildInitialValues(beregningsgrunnlag);
    const expectedATKey = 'fastsattInntekt_bedrift_2018-01-01_abc';
    const expectedFLKey = 'fastsattInntekt_FL';
    expect(initialValues[expectedATKey]).to.eql('10 000');
    expect(initialValues[expectedFLKey]).to.eql('10 000');
  });

  it('Skal teste at transformValues gir korrekt dataobjekt for alle tilfeller', () => {
    const expectedATKey = 'fastsattInntekt_bedrift_2018-01-01_abc';
    const expectedFLKey = 'fastsattInntekt_FL';
    const values = {};
    values[expectedFLKey] = '10 000';
    values[expectedATKey] = '15 000';
    const transformedValuesATFLSammeOrg = FastsettATFLInntektForm.transformValues(
      values,
      beregningsgrunnlag.faktaOmBeregning,
      faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
    );
    const transformedValuesLonnsendring = FastsettATFLInntektForm.transformValues(
      values,
      beregningsgrunnlag.faktaOmBeregning,
      faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_VED_LONNSENDRING,
    );
    const transformedValuesFL = FastsettATFLInntektForm.transformValues(
      values,
      beregningsgrunnlag.faktaOmBeregning,
      faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
    );
    const expectedTransformedValuesATFLSammeOrg = {
      vurderATogFLiSammeOrganisasjon: {
        vurderATogFLiSammeOrganisasjonAndelListe: [
          {
            andelsnr: 2,
            arbeidsinntekt: 15000,
          },
          {
            andelsnr: 1,
            arbeidsinntekt: 10000,
          },
        ],
      },
    };
    const expectedTransformedValuesLonnsendring = {
      fastsatteLonnsendringer: {
        vurderLønnsendringAndelListe: [
          {
            andelsnr: 2,
            arbeidsinntekt: 15000,
          },
        ],
      },
    };
    const expectedTransformedValuesFL = {
      fastsettMaanedsinntektFL: {
        maanedsinntekt: 10000,
      },
    };
    expect(transformedValuesATFLSammeOrg).to.deep.eql(expectedTransformedValuesATFLSammeOrg);
    expect(transformedValuesLonnsendring).to.deep.eql(expectedTransformedValuesLonnsendring);
    expect(transformedValuesFL).to.deep.eql(expectedTransformedValuesFL);
  });
});
