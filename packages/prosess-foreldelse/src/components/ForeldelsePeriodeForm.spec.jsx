import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { RadioOption } from '@fpsak-frontend/form';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';

import { ForeldelsePeriodeFormImpl } from './ForeldelsePeriodeForm';

describe('<ForeldelsePeriodeForm>', () => {
  it('skal rendre komponent korrekt', () => {
    const periode = {};
    const wrapper = shallow(
      <ForeldelsePeriodeFormImpl
        periode={periode}
        behandlingFormPrefix="form"
        skjulPeriode={sinon.spy()}
        readOnly={false}
        foreldelseVurderingTyper={[{
          kode: foreldelseVurderingType.IKKE_VURDERT,
          navn: 'IKKE_VURDERT',
        }, {
          kode: foreldelseVurderingType.FORELDET,
          navn: 'FORELDET',
        }, {
          kode: foreldelseVurderingType.IKKE_FORELDET,
          navn: 'IKKE_FORELDET',
        }, {
          kode: foreldelseVurderingType.TILLEGGSFRIST,
          navn: 'TILLEGGSFRIST',
        }]}
        setNestePeriode={sinon.spy()}
        setForrigePeriode={sinon.spy()}
        oppdaterSplittedePerioder={sinon.spy()}
        behandlingId={1}
        behandlingVersjon={2}
        beregnBelop={sinon.spy()}
        {...reduxFormPropsMock}
      />,
    );

    const options = wrapper.find(RadioOption);
    expect(options).has.length(4);
    expect(options.first().prop('value')).is.eql(foreldelseVurderingType.IKKE_VURDERT);
    expect(options.at(1).prop('value')).is.eql(foreldelseVurderingType.FORELDET);
    expect(options.at(2).prop('value')).is.eql(foreldelseVurderingType.IKKE_FORELDET);
    expect(options.last().prop('value')).is.eql(foreldelseVurderingType.TILLEGGSFRIST);
  });
});
