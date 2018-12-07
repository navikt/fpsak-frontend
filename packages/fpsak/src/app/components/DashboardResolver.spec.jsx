import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import Dashboard from './Dashboard';
import { DashboardResolver } from './DashboardResolver';

describe('<DashboardResolver>', () => {
  it('skal vise fremsiden til fpsak når fplos er slått av', () => {
    const wrapper = shallow(<DashboardResolver
      shouldOpenFplos={false}
    />);

    expect(wrapper.find(Dashboard)).to.have.length(1);
    expect(wrapper.find(LoadingPanel)).to.have.length(0);
  });
});
