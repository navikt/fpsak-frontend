import React from 'react';
import { expect } from 'chai';
import { FieldArray } from 'redux-form';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';

import { PermisjonOverforingAvKvoterPanelImpl as PermisjonOverforingAvKvoterPanel } from './PermisjonOverforingAvKvoterPanel';

const overforingAvKvoterArsaker = [{ navn: 'Den andre forelderen er innlagt i helseinstitusjon', kode: 'INSTITUSJONSOPPHOLD_ANNEN_FORELDER' },
  { navn: 'Den andre forelderen er pga sykdom avhengig av hjelp for å ta seg av barnet/barna', kode: 'SYKDOM_ANNEN_FORELDER' },
];

const readOnly = false;

describe('<PermisjonOverforingAvKvoterPanel>', () => {
  it('skal vise årsaker for overføring i nedtrekksliste når søker ikke er mor', () => {
    const wrapper = shallowWithIntl(<PermisjonOverforingAvKvoterPanel
      overtaKvoteReasons={overforingAvKvoterArsaker}
      soknadData={new SoknadData('', '', 'FAR', [])}
      intl={intlMock}
      skalOvertaKvote
      readOnly={readOnly}
      visFeilMelding={false}
    />);

    const fieldArray = wrapper.find(FieldArray);
    expect(fieldArray).has.length(1);

    const values = fieldArray.prop('selectValues');

    expect(values).has.length(overforingAvKvoterArsaker.length);
    expect(values[0].props.value).is.eql('INSTITUSJONSOPPHOLD_ANNEN_FORELDER');
    expect(values[1].props.value).is.eql('SYKDOM_ANNEN_FORELDER');
  });

  it('skal ikke vise select når checkbox ikke er krysset av', () => {
    const wrapper = shallowWithIntl(<PermisjonOverforingAvKvoterPanel
      overtaKvoteReasons={overforingAvKvoterArsaker}
      soknadData={new SoknadData('', '', 'FAR', [])}
      intl={intlMock}
      skalOvertaKvote={false}
      readOnly={readOnly}
      visFeilMelding={false}
    />);

    const selectField = wrapper.find(SelectField);
    expect(selectField).has.length(0);
  });
});
