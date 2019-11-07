import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { BehovForTilretteleggingPanelImpl } from './BehovForTilretteleggingPanel';

describe('<BehovForTilretteleggingPanel>', () => {
  it('skal vise felt for kun selvstendig næringsdrivende når dette er valgt i radioknapp', () => {
    const wrapper = shallowWithIntl(<BehovForTilretteleggingPanelImpl
      intl={intlMock}
      sokForSelvstendigNaringsdrivende
      sokForFrilans={false}
      sokForArbeidsgiver={false}
      readOnly={false}
    />);


    expect(wrapper.find('[name="behovsdatoSN"]')).has.length(1);
    expect(wrapper.find('[name="behovsdatoFrilans"]')).has.length(0);
    expect(wrapper.find('[name="tilretteleggingForArbeidsgiver"]')).has.length(0);
  });

  it('skal vise felt for kun frilans når dette er valgt i radioknapp', () => {
    const wrapper = shallowWithIntl(<BehovForTilretteleggingPanelImpl
      intl={intlMock}
      sokForSelvstendigNaringsdrivende={false}
      sokForFrilans
      sokForArbeidsgiver={false}
      readOnly={false}
    />);


    expect(wrapper.find('[name="behovsdatoSN"]')).has.length(0);
    expect(wrapper.find('[name="behovsdatoFrilans"]')).has.length(1);
    expect(wrapper.find('[name="tilretteleggingForArbeidsgiver"]')).has.length(0);
  });

  it('skal vise felt for kun arbeidsgiver når dette er valgt i radioknapp', () => {
    const wrapper = shallowWithIntl(<BehovForTilretteleggingPanelImpl
      intl={intlMock}
      sokForSelvstendigNaringsdrivende={false}
      sokForFrilans={false}
      sokForArbeidsgiver
      readOnly={false}
    />);


    expect(wrapper.find('[name="behovsdatoSN"]')).has.length(0);
    expect(wrapper.find('[name="behovsdatoFrilans"]')).has.length(0);
    expect(wrapper.find('[name="tilretteleggingForArbeidsgiver"]')).has.length(1);
  });
});
