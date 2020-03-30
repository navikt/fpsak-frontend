import React from 'react';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import IntegrationStatusPanel from './IntegrationStatusPanel';

describe('<IntegrationStatusPanel>', () => {
  const integrationStatusList = [{
    systemNavn: 'Grensesnittavstemming',
    endepunkt: 'www.test.no',
    nedeFremTilTidspunkt: '2019-08-02T00:54:25.455',
    feilmelding: 'Dette er en feilmelding',
    stackTrace: 'eks. stacktrace',
  }, {
    systemNavn: 'Arena',
    endepunkt: 'www.arena.no',
    nedeFremTilTidspunkt: '2019-02-02T00:54:25.455',
    feilmelding: 'Dette er en feilmelding 2',
    stackTrace: 'eks. stacktrace 2',
  }];

  it('skal vise oversikt over tjenester som har nedetid', () => {
    const wrapper = shallowWithIntl(<IntegrationStatusPanel.WrappedComponent
      integrationStatusList={integrationStatusList}
    />);

    const label = wrapper.find(Normaltekst);
    expect(label).to.have.length(2);
    expect(label.first().childAt(0).prop('id')).to.eql('IntegrationStatusPanel.DowntimeUntil');
    expect(label.first().childAt(0).prop('values')).to.eql({
      system: integrationStatusList[0].systemNavn,
      datetime: '02.08.2019 00:54',
    });
    expect(label.last().childAt(0).prop('id')).to.eql('IntegrationStatusPanel.DowntimeUntil');
    expect(label.last().childAt(0).prop('values')).to.eql({
      system: integrationStatusList[1].systemNavn,
      datetime: '02.02.2019 00:54',
    });
  });

  it('skal vise detaljer for tjenester som har nedetid', () => {
    const wrapper = shallowWithIntl(<IntegrationStatusPanel.WrappedComponent
      integrationStatusList={integrationStatusList}
    />);

    wrapper.setState({ toggleOpen: true });

    const label = wrapper.find(Normaltekst);
    expect(label).to.have.length(8);
    expect(label.first().childAt(0).prop('id')).to.eql('IntegrationStatusPanel.DowntimeUntil');
    expect(label.first().childAt(0).prop('values')).to.eql({
      system: integrationStatusList[0].systemNavn,
      datetime: '02.08.2019 00:54',
    });
    expect(label.at(1).childAt(0).text()).to.eql('www.test.no');
    expect(label.at(2).childAt(0).text()).to.eql('Dette er en feilmelding');
    expect(label.at(3).childAt(0).text()).to.eql('eks. stacktrace');

    expect(label.at(4).childAt(0).prop('id')).to.eql('IntegrationStatusPanel.DowntimeUntil');
    expect(label.at(4).childAt(0).prop('values')).to.eql({
      system: integrationStatusList[1].systemNavn,
      datetime: '02.02.2019 00:54',
    });
    expect(label.at(5).childAt(0).text()).to.eql('www.arena.no');
    expect(label.at(6).childAt(0).text()).to.eql('Dette er en feilmelding 2');
    expect(label.at(7).childAt(0).text()).to.eql('eks. stacktrace 2');
  });
});
