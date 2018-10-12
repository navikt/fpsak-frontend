import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MessagesIndex from './messages/MessagesIndex';
import DocumentIndex from './documents/DocumentIndex';
import HistoryIndex from './history/HistoryIndex';
import ApprovalIndex from './approval/ApprovalIndex';
import LinkRow from './components/LinkRow';
import SupportPanelLink from './components/SupportPanelLink';
import SupportPanel from './supportPanels';
import { BehandlingSupportIndex } from './BehandlingSupportIndex';

describe('<BehandlingSupportIndex>', () => {
  it('skal lage lenker for alle gitte support-paneler og vise godkjennings-panelet', () => {
    const wrapper = shallow(<BehandlingSupportIndex
      activeSupportPanel={SupportPanel.APPROVAL}
      acccessibleSupportPanels={[SupportPanel.HISTORY, SupportPanel.APPROVAL, SupportPanel.DOCUMENTS]}
      enabledSupportPanels={[SupportPanel.HISTORY, SupportPanel.APPROVAL, SupportPanel.DOCUMENTS]}
      getSupportPanelLocation={() => ({ test: 'location-mock' })}
    />);

    expect(wrapper.find(LinkRow)).to.have.length(1);
    const links = wrapper.find(SupportPanelLink);
    expect(links).to.have.length(3);
    expect(links.first().prop('supportPanel')).to.eql('historikk');
    expect(links.at(1).prop('supportPanel')).to.eql('godkjenning');
    expect(links.last().prop('supportPanel')).to.eql('dokumenter');

    expect(wrapper.find(ApprovalIndex)).to.have.length(1);
  });

  it('skal vise historiepanelet', () => {
    const wrapper = shallow(<BehandlingSupportIndex
      activeSupportPanel={SupportPanel.HISTORY}
      acccessibleSupportPanels={[SupportPanel.HISTORY, SupportPanel.APPROVAL, SupportPanel.DOCUMENTS]}
      enabledSupportPanels={[SupportPanel.HISTORY, SupportPanel.APPROVAL, SupportPanel.DOCUMENTS]}
      getSupportPanelLocation={() => ({ test: 'location-mock' })}
    />);

    expect(wrapper.find(HistoryIndex)).to.have.length(1);
  });

  it('skal vise dokumentpanelet', () => {
    const wrapper = shallow(<BehandlingSupportIndex
      activeSupportPanel={SupportPanel.DOCUMENTS}
      acccessibleSupportPanels={[SupportPanel.HISTORY, SupportPanel.APPROVAL, SupportPanel.DOCUMENTS]}
      enabledSupportPanels={[SupportPanel.HISTORY, SupportPanel.APPROVAL, SupportPanel.DOCUMENTS]}
      getSupportPanelLocation={() => ({ test: 'location-mock' })}
    />);

    expect(wrapper.find(DocumentIndex)).to.have.length(1);
  });

  it('skal vise meldingspanelet', () => {
    const wrapper = shallow(<BehandlingSupportIndex
      activeSupportPanel={SupportPanel.MESSAGES}
      acccessibleSupportPanels={[SupportPanel.HISTORY, SupportPanel.MESSAGES, SupportPanel.DOCUMENTS]}
      enabledSupportPanels={[SupportPanel.HISTORY, SupportPanel.MESSAGES, SupportPanel.DOCUMENTS]}
      getSupportPanelLocation={() => ({ test: 'location-mock' })}
    />);

    expect(wrapper.find(MessagesIndex)).to.have.length(1);
  });
});
