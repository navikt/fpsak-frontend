import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';

import { FodselInfoPanelImpl } from './FodselInfoPanel';
import SjekkFodselDokForm from './SjekkFodselDokForm';
import TermindatoFaktaForm from './TermindatoFaktaForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-fodsel';

const soknad = {
  fodselsdatoer: { 1: '2019-01-01' },
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
};
const alleMerknaderFraBeslutter = {};
const familiehendelse = {};
const personopplysninger = {
  barnSoktFor: [],
};

describe('<FodselInfoPanel>', () => {
  it('skal vise sjekkFodselDok-form når en har dette aksjonspunktet', () => {
    const antallBarnAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FodselInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[antallBarnAksjonspunkt]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      formPrefix="test"
      submitCallback={sinon.spy()}
      isFormSubmitting={false}
      isDirty={false}
      dispatch={sinon.spy}
      behandlingType={{ kode: behandlingType.FORSTEGANGSSOKNAD }}
      soknad={soknad}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      familiehendelse={familiehendelse}
      behandlingId={1}
      behandlingVersjon={1}
      personopplysninger={personopplysninger}
    />);

    expect(wrapper.find(SjekkFodselDokForm)).has.length(1);
  });

  it('skal vise termindato-form når en har dette aksjonspunktet', () => {
    const terminbekreftelseAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.TERMINBEKREFTELSE,
        navn: 'ap1',
      },
      status: {
        kode: 's1',
        navn: 's1',
      },
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: false,
      kanLoses: true,
      erAktivt: true,
    };

    const wrapper = shallowWithIntl(<FodselInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[terminbekreftelseAksjonspunkt]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      formPrefix="test"
      submitCallback={sinon.spy()}
      isFormSubmitting={false}
      isDirty={false}
      dispatch={sinon.spy}
      behandlingType={{ kode: behandlingType.FORSTEGANGSSOKNAD }}
      soknad={soknad}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      familiehendelse={familiehendelse}
      behandlingId={1}
      behandlingVersjon={1}
      personopplysninger={personopplysninger}
    />);

    expect(wrapper.find(TermindatoFaktaForm)).has.length(1);
  });

  it('skal vise infoview når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<FodselInfoPanelImpl
      intl={intlMock}
      aksjonspunkter={[]}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      formPrefix="test"
      submitCallback={sinon.spy()}
      isFormSubmitting={false}
      isDirty={false}
      dispatch={sinon.spy}
      behandlingType={{ kode: behandlingType.FORSTEGANGSSOKNAD }}
      soknad={soknad}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      familiehendelse={familiehendelse}
      behandlingId={1}
      behandlingVersjon={1}
      personopplysninger={personopplysninger}
    />);

    expect(wrapper.find(FodselSammenligningIndex)).has.length(1);
    expect(wrapper.find(SjekkFodselDokForm)).has.length(0);
    expect(wrapper.find(TermindatoFaktaForm)).has.length(0);
  });
});
