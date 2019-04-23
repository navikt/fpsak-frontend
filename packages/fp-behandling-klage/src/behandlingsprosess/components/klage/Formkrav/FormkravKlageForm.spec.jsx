import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormkravKlageForm } from './FormkravKlageForm';

describe('<FormkravKlageForm>', () => {
  const behandlinger = [{
    id: 1,
    type: {
      kode: 'FS',
    },
    avsluttet: '2018-10-25T14:14:15',
  }, {
    id: 2,
    type: {
      kode: 'R',
    },
    avsluttet: '2018-10-25T14:14:15',
  }];


  const getKodeverknavn = ({ kode }) => {
    if (kode === 'FS') {
      return 'Førstegangssøknad';
    }
    if (kode === 'R') {
      return 'Revurdering';
    }
    return '';
  };

  it('skal vise tre options når to mulige klagbare vedtak', () => {
    const wrapper = shallowWithIntl(<FormkravKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      avsluttedeBehandlinger={behandlinger}
      intl={intlMock}
      formProps={{}}
      getKodeverknavn={getKodeverknavn}
    />);
    const vedtakSelect = wrapper.find('SelectField');
    expect(vedtakSelect).to.have.length(1);
    expect(vedtakSelect.prop('selectValues')).to.have.length(3);
    expect(vedtakSelect.prop('selectValues')[0].props.children).to.equal('Ikke påklagd et vedtak');
    expect(vedtakSelect.prop('selectValues')[1].props.children).to.equal('Førstegangssøknad 25.10.2018');
  });
});
