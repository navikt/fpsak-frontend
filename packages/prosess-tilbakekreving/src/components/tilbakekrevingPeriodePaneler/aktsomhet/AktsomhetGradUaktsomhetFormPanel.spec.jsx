import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form';

import sarligGrunn from '../../../kodeverk/sarligGrunn';
import aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';
import AktsomhetGradUaktsomhetFormPanel from './AktsomhetGradUaktsomhetFormPanel';

describe('<AktsomhetGradUaktsomhetFormPanel>', () => {
  const sarligGrunnTyper = [{
    kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
    navn: 'grad av uaktsomhet',
  }, {
    kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
    navn: 'navs feil',
  }];

  it('skal måtte velge om en skal tilbakekreve beløp når totalbeløpet er under 4 rettsgebyr når grad er simpel uaktsom', () => {
    const wrapper = shallow(<AktsomhetGradUaktsomhetFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.SIMPEL_UAKTSOM}
      erSerligGrunnAnnetValgt={false}
      sarligGrunnTyper={sarligGrunnTyper}
      harMerEnnEnYtelse
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr
    />);

    expect(wrapper.find(RadioGroupField)).to.have.length(1);
    expect(wrapper.find(AktsomhetSarligeGrunnerFormPanel)).to.have.length(1);
  });

  it('skal ikke måtte velge om en skal tilbakekreve beløp når totalbeløpet er under 4 rettsgebyr med grad er ulik simpel uaktsom', () => {
    const wrapper = shallow(<AktsomhetGradUaktsomhetFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      erSerligGrunnAnnetValgt={false}
      sarligGrunnTyper={sarligGrunnTyper}
      harMerEnnEnYtelse
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr
    />);

    expect(wrapper.find(RadioGroupField)).to.have.length(0);
    expect(wrapper.find(TextAreaField)).to.have.length(1);
    expect(wrapper.find(AktsomhetSarligeGrunnerFormPanel)).to.have.length(1);
  });

  it('skal ikke måtte velge om en skal tilbakekreve beløp når totalbeløpet er over 4 rettsgebyr med grad er lik simpel uaktsom', () => {
    const wrapper = shallow(<AktsomhetGradUaktsomhetFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad={aktsomhet.SIMPEL_UAKTSOM}
      erSerligGrunnAnnetValgt={false}
      sarligGrunnTyper={sarligGrunnTyper}
      harMerEnnEnYtelse
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr={false}
    />);

    expect(wrapper.find(RadioGroupField)).to.have.length(0);
    expect(wrapper.find(TextAreaField)).to.have.length(1);
    expect(wrapper.find(AktsomhetSarligeGrunnerFormPanel)).to.have.length(1);
  });
});
