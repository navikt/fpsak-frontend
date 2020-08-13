import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';

import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import IntegrationStatusPanel from './IntegrationStatusPanel';
import Dashboard from './Dashboard';

describe('<Dashboard>', () => {
  const integrationStatusList = [{
    systemNavn: 'Grensesnittavstemming',
    endepunkt: 'www.test.no',
    nedeFremTilTidspunkt: '2019-08-02T00:54:25.455',
    feilmelding: 'Dette er en feilmelding',
    stackTrace: 'eks. stacktrace',
  }];

  it('skal vise søkeskjermbildet, men ikke systemstatuser', () => {
    requestApi.mock(FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES, false);

    const fetchCallback = sinon.spy();
    const wrapper = shallow(<Dashboard />);

    expect(wrapper.find(IntegrationStatusPanel)).to.have.length(0);
    expect(wrapper.find(FagsakSearchIndex)).to.have.length(1);
    expect(fetchCallback.called).is.false;
  });

  it('skal vise søkeskjermbildet og systemstatuser', () => {
    requestApi.mock(FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES, true);

    const fetchCallback = sinon.spy();
    const wrapper = shallowWithIntl(<Dashboard />);

    const statusPanel = wrapper.find(IntegrationStatusPanel);
    expect(statusPanel).to.have.length(1);
    expect(statusPanel.prop('integrationStatusList')).is.eql(integrationStatusList);

    expect(wrapper.find(FagsakSearchIndex)).to.have.length(1);
    expect(fetchCallback.called).is.true;
  });
});
