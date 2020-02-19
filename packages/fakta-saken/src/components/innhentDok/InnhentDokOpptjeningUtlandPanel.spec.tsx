import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { AksjonspunktBox } from '@fpsak-frontend/shared-components';

import { InnhentDokOpptjeningUtlandPanel } from './InnhentDokOpptjeningUtlandPanel';

describe('<InnhentDokOpptjeningUtlandPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<InnhentDokOpptjeningUtlandPanel
      behandlingId={1}
      behandlingVersjon={1}
      harApneAksjonspunkter
      handleSubmit={() => undefined}
      readOnly={false}
      submittable
      dirty
      initialValues={{ begrunnelse: undefined }}
      form="FORM_NAVN"
    />);
    expect(wrapper.find(AksjonspunktBox)).to.have.length(1);
  });
});
