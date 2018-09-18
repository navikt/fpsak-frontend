import React from 'react';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import Image from 'sharedComponents/Image';
import VilkarResultPanel from './VilkarResultPanel';

describe('<VilkarResultPanel>', () => {
  it('skal vise vilkår som Oppfylt', () => {
    const wrapper = shallowWithIntl(<VilkarResultPanel.WrappedComponent
      intl={intlMock}
      status={vilkarUtfallType.OPPFYLT}
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(1);
    const tekstForValgtTrue = wrapper.find(Normaltekst);
    expect(tekstForValgtTrue).to.have.length(1);
    expect(tekstForValgtTrue.childAt(0).prop('id')).to.eql('VilkarResultPanel.VilkarOppfylt');
  });

  it('skal vise vilkår som Ikke Oppfylt', () => {
    const wrapper = shallowWithIntl(<VilkarResultPanel.WrappedComponent
      intl={intlMock}
      status={vilkarUtfallType.IKKE_OPPFYLT}
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(1);
    const tekstForValgtTrue = wrapper.find(Normaltekst);
    expect(tekstForValgtTrue).to.have.length(1);
    expect(tekstForValgtTrue.childAt(0).prop('id')).to.eql('VilkarResultPanel.VilkarIkkeOppfylt');
  });
});
