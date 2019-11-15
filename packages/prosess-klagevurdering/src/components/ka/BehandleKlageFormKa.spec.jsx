import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { BehandleKlageFormKaImpl } from './BehandleKlageFormKa';
import PreviewKlageLink from '../felles/PreviewKlageLink';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-klagevurdering';

describe('<BehandleKlageFormKaImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const formValues1 = {
    fritekstTilBrev: '123',
    klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK,
  };

  it('skal vise lenke til forhåndsvis brev når fritekst er fylt, og klagevurdering valgt', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormKaImpl
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      formValues={formValues1}
      previewCallback={sinon.spy()}
      saveKlage={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
      alleKodeverk={{}}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find('PreviewKlageLink')).to.have.length(1);
  });
  const formValues2 = {
    fritekstTilBrev: '123',
  };

  it('skal ikke vise lenke til forhåndsvis brev når fritekst fylt, og klagevurdering ikke valgt', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormKaImpl
      readOnly={false}
      readOnlySubmitButton
      formValues={formValues2}
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      previewCallback={sinon.spy()}
      saveKlage={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
      alleKodeverk={{}}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find(PreviewKlageLink)).to.have.length(0);
  });
  const formValues3 = {
    klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK,
  };

  it('skal ikke vise lenke til forhåndsvis brev når fritekst ikke fylt, og klagevurdering valgt', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormKaImpl
      readOnly={false}
      readOnlySubmitButton
      formValues={formValues3}
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      previewCallback={sinon.spy()}
      saveKlage={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
      alleKodeverk={{}}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find(PreviewKlageLink)).to.have.length(0);
  });
});
