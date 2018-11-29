import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { expect } from 'chai';
import { PermisjonRettigheterPanel } from './PermisjonRettigheterPanel';

const readOnly = false;

describe('<PermisjonRettigheterPanel>', () => {
  it('skal kun vise aleneomsrog radioknapper hvis søker velger har aleneomsorg', () => {
    const wrapper = shallowWithIntl(<PermisjonRettigheterPanel
      readOnly={readOnly}
      intl={intlMock}
      sokerHarAleneomsorg
    />);
    expect(wrapper.find({ name: 'sokerHarAleneomsorg' })).to.have.length(1);
    expect(wrapper.find({ name: 'denAndreForelderenHarRettPaForeldrepenger' })).to.have.length(0);
  });

  it('skal vise radioknapper for "andre forelder har rett på foreldrepenger" hvis søker velger har ikke aleneomsorg', () => {
    const wrapper = shallowWithIntl(<PermisjonRettigheterPanel
      readOnly={readOnly}
      intl={intlMock}
      sokerHarAleneomsorg={false}
    />);
    expect(wrapper.find({ name: 'sokerHarAleneomsorg' })).to.have.length(1);
    expect(wrapper.find({ name: 'denAndreForelderenHarRettPaForeldrepenger' })).to.have.length(1);
  });
});
