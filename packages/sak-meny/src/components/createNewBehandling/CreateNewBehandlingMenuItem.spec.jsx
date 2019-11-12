import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import MenyKodeverk from '../../MenyKodeverk';
import CreateNewBehandlingMenuItem from './CreateNewBehandlingMenuItem';

describe('<CreateNewBehandlingMenuItem>', () => {
  const menyKodeverk = new MenyKodeverk({ kode: behandlingType.FORSTEGANGSSOKNAD })
    .medFpSakKodeverk({})
    .medFpTilbakeKodeverk({});

  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<CreateNewBehandlingMenuItem
      saksnummer={23}
      submitNyBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      opprettNyForstegangsBehandlingEnabled
      push={sinon.spy()}
      menyKodeverk={menyKodeverk}
      opprettRevurderingEnabled
      ikkeVisOpprettNyBehandling
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
    />);

    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const wrapper = shallow(<CreateNewBehandlingMenuItem
      saksnummer={23}
      submitNyBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      opprettNyForstegangsBehandlingEnabled
      push={sinon.spy()}
      menyKodeverk={menyKodeverk}
      erTilbakekrevingAktivert
      opprettRevurderingEnabled
      ikkeVisOpprettNyBehandling
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
    />);

    const button = wrapper.find('MenuButton');
    expect(button).has.length(1);
    expect(button.prop('onMouseDown')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('mousedown');

    expect(wrapper.state('showModal')).is.true;
  });
});
