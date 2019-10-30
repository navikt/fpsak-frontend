import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import sinon from 'sinon';

import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';

import { ForeldelseForm } from './ForeldelseForm';
import TilbakekrevingTimelinePanel from './timeline/TilbakekrevingTimelinePanel';
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
    const wrapper = shallow(<ForeldelseForm
      foreldelsesresultatActivity={perioder}
      behandlingFormPrefix="form"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      navBrukerKjonn="MANN"
      readOnly={false}
      readOnlySubmitButton={false}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      alleKodeverk={{}}
      beregnBelop={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(TilbakekrevingTimelinePanel)).has.length(0);
    const messages = wrapper.find(FormattedMessage);
    expect(messages).has.length(3);
    expect(messages.at(1).prop('id')).is.eql('ForeldelseForm.Foreldelsesloven');
  });

  it('skal ikke vise informasjon om foreldelsesloven og vise tidslinje når en har aksjonspunkt', () => {
    const perioder = [{
      fom: '2019-10-10',
      tom: '2019-11-10',
      foreldelseVurderingType: {
        kode: foreldelseVurderingType.UDEFINERT,
      },
    }];
    const wrapper = shallow(<ForeldelseForm
      foreldelsesresultatActivity={perioder}
      behandlingFormPrefix="form"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      navBrukerKjonn="MANN"
      readOnly={false}
      readOnlySubmitButton={false}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      apCodes={['5003']}
      alleKodeverk={{}}
      beregnBelop={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={1}
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
    const wrapper = shallow(<ForeldelseForm
      foreldelsesresultatActivity={perioder}
      behandlingFormPrefix="form"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      navBrukerKjonn="MANN"
      readOnly={false}
      readOnlySubmitButton={false}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      apCodes={['5003']}
      alleKodeverk={{}}
      beregnBelop={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(ForeldelsePeriodeForm)).has.length(0);
  });
});
