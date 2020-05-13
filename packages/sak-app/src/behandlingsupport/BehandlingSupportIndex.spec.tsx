import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { supportTabs } from '@fpsak-frontend/sak-support-meny';

import ApprovalIndex from './approval/ApprovalIndex';
import { BehandlingSupportIndex } from './BehandlingSupportIndex';

describe('<BehandlingSupportIndex>', () => {
  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  };

  xit('skal vise godkjennings-panelet', () => {
    const wrapper = shallow(<BehandlingSupportIndex
      activeSupportPanel={supportTabs.APPROVAL}
      acccessibleSupportPanels={[supportTabs.HISTORY, supportTabs.APPROVAL, supportTabs.DOCUMENTS]}
      enabledSupportPanels={[supportTabs.HISTORY, supportTabs.APPROVAL, supportTabs.DOCUMENTS]}
      getSupportPanelLocation={() => locationMock}
    />);

    expect(wrapper.find(ApprovalIndex)).to.have.length(1);
  });
});
