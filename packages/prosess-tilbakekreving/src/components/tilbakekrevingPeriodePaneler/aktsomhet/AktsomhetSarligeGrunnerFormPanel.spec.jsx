import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { CheckboxField, TextAreaField } from '@fpsak-frontend/form';

import sarligGrunn from '../../../kodeverk/sarligGrunn';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

describe('<AktsomhetSarligeGrunnerFormPanel>', () => {
  it('skal vise alle særlige grunner', () => {
    const sarligGrunnTyper = [{
      kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
      navn: 'grad av uaktsomhet',
    }, {
      kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
      navn: 'navs feil',
    }];
    const wrapper = shallow(<AktsomhetSarligeGrunnerFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad=""
      erSerligGrunnAnnetValgt={false}
      sarligGrunnTyper={sarligGrunnTyper}
      harMerEnnEnYtelse
      feilutbetalingBelop={10}
    />);

    expect(wrapper.find(CheckboxField)).to.have.length(2);
  });

  it('skal vise tekstfelt for annet-begrunnelse når annet er valgt som særlig grunn', () => {
    const sarligGrunnTyper = [{
      kode: sarligGrunn.ANNET,
      navn: 'annet',
    }, {
      kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
      navn: 'navs feil',
    }];
    const wrapper = shallow(<AktsomhetSarligeGrunnerFormPanel
      harGrunnerTilReduksjon
      readOnly={false}
      handletUaktsomhetGrad=""
      erSerligGrunnAnnetValgt
      sarligGrunnTyper={sarligGrunnTyper}
      harMerEnnEnYtelse
      feilutbetalingBelop={10}
    />);

    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });
});
