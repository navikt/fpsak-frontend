import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import VilkarBegrunnelse from './VilkarBegrunnelse';
import OverstyrBegrunnelsePanel from './OverstyrBegrunnelsePanel';

describe('<OverstyrBegrunnelsePanel>', () => {
  it('skal rendre form for begrunnelse når en ikke er i readonly-modus', () => {
    const wrapper = shallowWithIntl(<OverstyrBegrunnelsePanel
      overrideReadOnly={false}
      isBeregningConfirmation
    />);

    const begrunnelseFelt = wrapper.find(VilkarBegrunnelse);
    expect(begrunnelseFelt).to.have.length(1);
  });
});
