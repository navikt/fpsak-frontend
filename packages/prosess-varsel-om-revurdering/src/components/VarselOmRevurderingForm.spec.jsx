import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { VarselOmRevurderingFormImpl as UnwrappedForm } from './VarselOmRevurderingForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-varsel-om-revurdering';

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
};

const originalBehandling = {
  soknad,
  familiehendelse: {
    termindato: '2019-01-01',
    fodselsdato: '2019-01-10',
    antallBarnTermin: 1,
    antallBarnFodsel: 1,
  },
};

describe('<VarselOmRevurderingFormImpl>', () => {
  it('skal vise fodselsammenligningpanel når automatisk revurdering', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering
      languageCode="NN"
      readOnly={false}
      sendVarsel
      frist="2017-05-15"
      aksjonspunktStatus="OPPR"
      begrunnelse="Begrunnelse"
      avklartBarn={[]}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      soknad={soknad}
      termindato="2019-01-01"
      soknadOriginalBehandling={originalBehandling.soknad}
      familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
      vedtaksDatoSomSvangerskapsuke="2019-01-01"
    />);
    const fodselPanel = wrapper.find(FodselSammenligningIndex);
    expect(fodselPanel).to.have.length(1);
  });

  it('skal vise fritekst og forhåndsvis av brev når varsel skal sendes', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering={false}
      languageCode="NN"
      readOnly={false}
      sendVarsel
      frist="2017-05-15"
      aksjonspunktStatus="OPPR"
      begrunnelse="Begrunnelse"
      avklartBarn={[]}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      soknad={soknad}
      termindato="2019-01-01"
      soknadOriginalBehandling={originalBehandling.soknad}
      familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
      vedtaksDatoSomSvangerskapsuke="2019-01-01"
    />);
    const fodselPanel = wrapper.find(FodselSammenligningIndex);
    expect(fodselPanel).to.have.length(0);

    const textarea = wrapper.find('TextAreaField');
    const forhandsvis = wrapper.find('a');
    expect(textarea).to.have.length(2);
    expect(forhandsvis).to.have.length(1);
  });

  it('skal ikke vise fritekst og forhåndsvis av brev når varsel ikke skal sendes', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering={false}
      languageCode="NN"
      readOnly={false}
      sendVarsel={false}
      frist="2017-05-15"
      aksjonspunktStatus="OPPR"
      begrunnelse="Begrunnelse"
      avklartBarn={[]}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      soknad={soknad}
      termindato="2019-01-01"
      soknadOriginalBehandling={originalBehandling.soknad}
      familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
      vedtaksDatoSomSvangerskapsuke="2019-01-01"
    />);

    const textarea = wrapper.find('TextAreaField');
    const forhandsvis = wrapper.find('a');
    expect(textarea).to.have.length(1);
    expect(forhandsvis).to.have.length(0);
  });

  it('skal vises i readonly visning', () => {
    const begrunnelse = 'Begrunnelse';
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering={false}
      languageCode="NN"
      readOnly={false}
      sendVarsel={false}
      frist="2017-05-15"
      aksjonspunktStatus="UTFRT"
      begrunnelse={begrunnelse}
      avklartBarn={[]}
      behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
      soknad={soknad}
      termindato="2019-01-01"
      soknadOriginalBehandling={originalBehandling.soknad}
      familiehendelseOriginalBehandling={originalBehandling.familiehendelse}
      vedtaksDatoSomSvangerskapsuke="2019-01-01"
    />);

    expect(wrapper.find('Undertekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').children().text()).to.equal(begrunnelse);
  });
});
