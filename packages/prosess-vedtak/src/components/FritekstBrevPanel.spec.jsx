import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import FritekstBrevPanel from './FritekstBrevPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-vedtak';

describe('<FritekstBrevPanel>', () => {
  const eventCallback = sinon.spy();
  const sprakkode = {
    kode: 'EN',
  };
  it('skal vise alle felter i readonly modus', () => {
    const wrapper = shallowWithIntl(<FritekstBrevPanel.WrappedComponent
      intl={intlMock}
      previewBrev={eventCallback}
      readOnly
      sprakkode={sprakkode}
    />);

    const overskrift = wrapper.find('TextAreaField');
    expect(overskrift).to.have.length(2);
    expect(overskrift.at(0).prop('readOnly')).to.equal(true);
    expect(overskrift.at(1).prop('readOnly')).to.equal(true);
  });
});
