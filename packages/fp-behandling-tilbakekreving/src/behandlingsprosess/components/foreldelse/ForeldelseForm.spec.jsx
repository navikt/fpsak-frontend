import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import sinon from 'sinon';

import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';
import { ForeldelseFormImpl } from './ForeldelseForm';
import TilbakekrevingTimelinePanel from '../felles/timeline/TilbakekrevingTimelinePanel';
import ForeldelsePeriodeForm from './ForeldelsePeriodeForm';

describe('<ForeldelseForm>', () => {
  it('skal vise informasjon om foreldelsesloven og ikke vise tidslinje når en ikke har aksjonspunkt', () => {
    const perioder = [{
      fom: '2019-10-10',
      tom: '2019-11-10',
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.UDEFINERT,
      },
    }];
    const wrapper = shallow(<ForeldelseFormImpl
      foreldelsesresultatActivity={perioder}
      behandlingFormPrefix="form"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      kjonn="MANN"
      readOnly={false}
      readOnlySubmitButton={false}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
    />);

    expect(wrapper.find(TilbakekrevingTimelinePanel)).has.length(0);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).has.length(3);
    expect(messages.at(1).prop('id')).is.eql('Foreldelse.Foreldelsesloven');
  });

  it('skal ikke vise informasjon om foreldelsesloven og vise tidslinje når en har aksjonspunkt', () => {
    const perioder = [{
      fom: '2019-10-10',
      tom: '2019-11-10',
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.UDEFINERT,
      },
    }];
    const wrapper = shallow(<ForeldelseFormImpl
      foreldelsesresultatActivity={perioder}
      behandlingFormPrefix="form"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      kjonn="MANN"
      readOnly={false}
      readOnlySubmitButton={false}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      apCodes={['5003']}
    />);

    expect(wrapper.find(TilbakekrevingTimelinePanel)).has.length(1);
    expect(wrapper.find(FormattedMessage)).has.length(2);
  });

  it('skal ikke vise default periode når periode er foreldet', () => {
    const perioder = [{
      fom: '2019-10-10',
      tom: '2019-11-10',
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.FORELDET,
      },
    }];
    const wrapper = shallow(<ForeldelseFormImpl
      foreldelsesresultatActivity={perioder}
      behandlingFormPrefix="form"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      kjonn="MANN"
      readOnly={false}
      readOnlySubmitButton={false}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      apCodes={['5003']}
    />);

    expect(wrapper.find(ForeldelsePeriodeForm)).has.length(0);
  });
});
