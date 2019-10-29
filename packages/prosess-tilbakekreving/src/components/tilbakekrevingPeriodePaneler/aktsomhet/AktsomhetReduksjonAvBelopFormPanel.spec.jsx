import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { InputField, RadioGroupField, SelectField } from '@fpsak-frontend/form';

import aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetReduksjonAvBelopFormPanel from './AktsomhetReduksjonAvBelopFormPanel';

describe('<AktsomhetReduksjonAvBelopFormPanel>', () => {
  it('skal måtte angi andel som skal tilbakekreves når en har grunner til reduksjon og færre enn to ytelser', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harMerEnnEnYtelse={false}
      feilutbetalingBelop={100}
    />);

    const select = wrapper.find(SelectField);
    expect(select).to.have.length(1);
    expect(select.prop('name')).to.eql('andelSomTilbakekreves');
    expect(select.prop('selectValues').map((v) => v.key)).to.eql(['30', '50', '70', 'Egendefinert']);

    expect(wrapper.find(InputField)).to.have.length(0);
  });

  it('skal få informasjon om at det ikke skal tillegges renter når en har grunner til reduksjon og grad grovt uaktsom', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harMerEnnEnYtelse={false}
      feilutbetalingBelop={100}
    />);

    const select = wrapper.find(FormattedMessage);
    expect(select).to.have.length(4);
    expect(select.at(2).prop('id')).to.eql('AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter');

    expect(wrapper.find(InputField)).to.have.length(0);
  });

  it('skal ikke få informasjon om at det ikke skal tillegges renter når en har grunner til reduksjon og grad simpel uaktsom', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.SIMPEL_UAKTSOM}
      harMerEnnEnYtelse={false}
      feilutbetalingBelop={100}
    />);

    expect(wrapper.find(FormattedMessage)).to.have.length(2);
    expect(wrapper.find(InputField)).to.have.length(0);
  });

  it('skal måtte angi beløp som skal tilbakekreves når en har grunner til reduksjon og mer enn en ytelse', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harMerEnnEnYtelse
      feilutbetalingBelop={100}
    />);

    expect(wrapper.find(InputField)).to.have.length(1);
    expect(wrapper.find(SelectField)).to.have.length(0);
  });

  it('skal vise andel som skal tilbakekreves når en ikke har grunner til reduksjon og færre enn to ytelser', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={false}
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harMerEnnEnYtelse={false}
      feilutbetalingBelop={100}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(2);
    expect(message.at(1).prop('id')).to.eql('AktsomhetReduksjonAvBelopFormPanel.andelSomTilbakekreves');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).to.eql('100%');

    expect(wrapper.find(InputField)).to.have.length(0);
    expect(wrapper.find(SelectField)).to.have.length(0);
  });

  it('skal vise andel som skal tilbakekreves når en ikke har grunner til reduksjon og mer enn en ytelser', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={false}
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harMerEnnEnYtelse
      feilutbetalingBelop={10023}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(2);
    expect(message.at(1).prop('id')).to.eql('AktsomhetReduksjonAvBelopFormPanel.BelopSomSkalTilbakekreves');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).to.eql('10 023');

    expect(wrapper.find(InputField)).to.have.length(0);
    expect(wrapper.find(SelectField)).to.have.length(0);
  });

  it('skal vise radioknapper for valg om det skal tillegges renter når en ikke har grunner til reduksjon og grad grovt uaktsomt', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={false}
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harMerEnnEnYtelse
      feilutbetalingBelop={10023}
    />);

    expect(wrapper.find(RadioGroupField)).to.have.length(2);
  });

  it('skal ikke vise radioknapper for valg om det skal tillegges renter når en ikke har grunner til reduksjon og grad simpelt uaktsomt', () => {
    const wrapper = shallow(<AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={false}
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.SIMPEL_UAKTSOM}
      harMerEnnEnYtelse
      feilutbetalingBelop={10023}
    />);

    expect(wrapper.find(RadioGroupField)).to.have.length(1);
  });
});
