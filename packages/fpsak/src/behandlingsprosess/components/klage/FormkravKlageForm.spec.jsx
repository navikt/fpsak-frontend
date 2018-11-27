import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import behandlingStatus from 'kodeverk/behandlingStatus';
import { FormkravKlageForm } from './FormkravKlageForm';

describe('<FormkravKlageForm>', () => {
  const behandlingTemplate = {
    versjon: 123,
    aksjonspunkter: [],
    behandlingsresultat: {
      id: 1,
      type: {
        navn: 'test',
        kode: '1',
      },
    },
    fagsakId: 1,
    opprettet: '15.10.2017',
    avsluttet: '2018-10-25T14:14:15',
    vilkar: [],
  };
  const behandlinger = [{
    ...behandlingTemplate,
    id: 1,
    type: {
      kode: '',
      navn: 'Førstegangssøknad',
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      navn: 'Avsluttet',
    },
  }, {
    ...behandlingTemplate,
    id: 2,
    type: {
      kode: '',
      navn: 'Revurdering',
    },
    status: {
      kode: behandlingStatus.AVSLUTTET,
      navn: 'Avsluttet',
    },
  }, {
    ...behandlingTemplate,
    id: 3,
    type: {
      kode: '',
      navn: 'Innsyn',
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      navn: 'Opprettet',
    },
  }];

  it('skal vise tre options når to mulige klagbare vedtak', () => {
    const wrapper = shallowWithIntl(<FormkravKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      behandlinger={behandlinger}
      intl={intlMock}
      formProps={{}}
    />);
    const vedtakSelect = wrapper.find('SelectField');
    expect(vedtakSelect).to.have.length(1);
    expect(vedtakSelect.prop('selectValues')).to.have.length(3);
    expect(vedtakSelect.prop('selectValues')[0].props.children).to.equal('Ikke påklagd et vedtak');
    expect(vedtakSelect.prop('selectValues')[1].props.children).to.equal('Førstegangssøknad 25.10.2018');
  });
});
