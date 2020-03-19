import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import OpprettEllerFjernVergeMenuItem from './OpprettEllerFjernVergeMenuItem';
import MenuButton from '../MenuButton';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-sak-meny';

describe('<OpprettEllerFjernVergeMenuItem>', () => {
  it('skal rendre komponent når menyvalg er opprettet', () => {
    const wrapper = shallowWithIntl(<OpprettEllerFjernVergeMenuItem
      opprettVerge={sinon.spy()}
      saksnummer={123}
      behandlingId={1}
      behandlingVersjon={2}
      push={sinon.spy()}
    />);

    const button = wrapper.find(MenuButton);
    expect(button.find(FormattedMessage).prop('id')).is.eql('OpprettEllerFjernVergeMenuItem.OpprettVerge');
  });

  it('skal rendre komponent når menyvalg er fjern', () => {
    const wrapper = shallowWithIntl(<OpprettEllerFjernVergeMenuItem
      fjernVerge={sinon.spy()}
      saksnummer={123}
      behandlingId={1}
      behandlingVersjon={2}
      push={sinon.spy()}
    />);

    const button = wrapper.find(MenuButton);
    expect(button.find(FormattedMessage).prop('id')).is.eql('OpprettEllerFjernVergeMenuItem.FjernVerge');
  });


  it('skal ikke vise modal for om en vil opprette/fjerne som standard', () => {
    const wrapper = shallowWithIntl(<OpprettEllerFjernVergeMenuItem
      fjernVerge={sinon.spy()}
      saksnummer={123}
      behandlingId={1}
      behandlingVersjon={2}
      push={sinon.spy()}
    />);

    expect(wrapper.find(OkAvbrytModal)).has.length(0);
  });

  it('skal vise modal og opprette aksjonspunkt for verge ved trykk på opprett-knapp og bekrefte i modal', () => {
    const opprettVergeCallback = sinon.spy();
    const wrapper = shallowWithIntl(<OpprettEllerFjernVergeMenuItem
      opprettVerge={opprettVergeCallback}
      saksnummer={123}
      behandlingId={1}
      behandlingVersjon={2}
      push={sinon.spy()}
    />);

    wrapper.find(MenuButton).prop('onMouseDown')();

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).has.length(1);

    modal.prop('submit')();

    expect(opprettVergeCallback.called).is.true;
    expect(opprettVergeCallback.getCalls()[0].args).has.length(4);
    expect(opprettVergeCallback.getCalls()[0].args[1]).is.eql(123);
    expect(opprettVergeCallback.getCalls()[0].args[2]).is.eql(1);
    expect(opprettVergeCallback.getCalls()[0].args[3]).is.eql(2);
  });

  it('skal fjerne aksjonspunkt for verge ved trykk på slett-knapp', () => {
    const fjernVergeCallback = sinon.spy();
    const wrapper = shallowWithIntl(<OpprettEllerFjernVergeMenuItem
      fjernVerge={fjernVergeCallback}
      saksnummer={123}
      behandlingId={1}
      behandlingVersjon={2}
      push={sinon.spy()}
    />);

    wrapper.find(MenuButton).prop('onMouseDown')();

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).has.length(1);

    modal.prop('submit')();

    expect(fjernVergeCallback.called).is.true;
    expect(fjernVergeCallback.getCalls()[0].args).has.length(4);
    expect(fjernVergeCallback.getCalls()[0].args[1]).is.eql(123);
    expect(fjernVergeCallback.getCalls()[0].args[2]).is.eql(1);
    expect(fjernVergeCallback.getCalls()[0].args[3]).is.eql(2);
  });
});
