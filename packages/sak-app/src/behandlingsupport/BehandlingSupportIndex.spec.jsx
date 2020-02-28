import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { supportTabs } from '@fpsak-frontend/sak-support-meny';

import ApprovalIndex from './approval/ApprovalIndex';
import { BehandlingSupportIndex } from './BehandlingSupportIndex';

describe('<BehandlingSupportIndex>', () => {
  xit('skal vise godkjennings-panelet', () => {
    const wrapper = shallow(<BehandlingSupportIndex
      activeSupportPanel={supportTabs.APPROVAL}
      acccessibleSupportPanels={[supportTabs.HISTORY, supportTabs.APPROVAL, supportTabs.DOCUMENTS]}
      enabledSupportPanels={[supportTabs.HISTORY, supportTabs.APPROVAL, supportTabs.DOCUMENTS]}
      getSupportPanelLocation={() => ({ test: 'location-mock' })}
    />);

    expect(wrapper.find(ApprovalIndex)).to.have.length(1);
  });
});
