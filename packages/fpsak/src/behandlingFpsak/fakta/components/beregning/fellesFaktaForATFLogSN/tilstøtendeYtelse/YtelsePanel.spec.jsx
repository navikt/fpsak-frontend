import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { expect } from 'chai';
import { YtelsePanel, byggListeSomStreng } from './YtelsePanel';

const inntektskategorier = [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' }, { kode: 'FRILANSER', navn: 'Frilanser' }];

const sykepenger = { kode: 'SYKEPENGER', navn: 'Sykepenger' };

const inntektskategoriString = 'Arbeidstaker og Frilanser';

const sykepengerTY = {
  inntektskategorier,
  bruttoBG: 1000000,
  dekningsgrad: 100,
  ytelseType: sykepenger,
};


describe('<YtelsePanel>', () => {
  it('skal lage streng fra liste med 2 elementer', () => {
    const inntektskategoriliste = [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' }, { kode: 'FRILANSER', navn: 'Frilanser' }];
    const message = byggListeSomStreng(inntektskategoriliste.map(({ navn }) => (navn)));
    expect(message).to.equal('Arbeidstaker og Frilanser');
  });

  it('skal lage streng fra liste med 3 elementer', () => {
    const inntektskategoriliste = [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
      { kode: 'FRILANSER', navn: 'Frilanser' }, { kode: 'SJØMANN', navn: 'Sjømann' }];
    const message = byggListeSomStreng(inntektskategoriliste.map(({ navn }) => (navn)));
    expect(message).to.equal('Arbeidstaker, Frilanser og Sjømann');
  });

  it('skal vise ytelsepanel for sykepenger', () => {
    const wrapper = shallowWithIntl(<YtelsePanel
      tilstøtendeYtelse={sykepengerTY}
      inntektskategoriString={inntektskategoriString}
      ytelseType={sykepenger}
    />);

    const formattedMessages = wrapper.find('FormattedMessage');

    expect(formattedMessages).to.have.length(4);

    expect(formattedMessages.get(0).props.values.ytelse).to.equal('Sykepenger');
    expect(formattedMessages.get(0).props.id).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.TilstøtendeYtelse');

    expect(formattedMessages.get(2).props.values.dekningsgrad).to.equal(100);
    expect(formattedMessages.get(2).props.id).to.equal('BeregningInfoPanel.TilstøtendeYtelseForm.Sykepengerdekning');
  });
});
