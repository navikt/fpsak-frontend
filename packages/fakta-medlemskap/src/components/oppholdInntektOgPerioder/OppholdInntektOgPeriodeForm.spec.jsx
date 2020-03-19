import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fakta-felles';
import { OppholdInntektOgPeriodeForm } from './OppholdInntektOgPeriodeForm';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import InntektOgYtelserFaktaPanel from './InntektOgYtelserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-medlemskap';

const valgtPeriode = {
  aksjonspunkter: [],
  id: '123',
};

describe('<OppholdInntektOgPeriodeForm>', () => {
  it('skal vise informasjon uten editeringsmuligheter når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<OppholdInntektOgPeriodeForm
      {...reduxFormPropsMock}
      initialValues={{}}
      intl={intlMock}
      aksjonspunkter={[]}
      updateOppholdInntektPeriode={sinon.spy()}
      periodeResetCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      valgtPeriode={valgtPeriode}
      submittable
      readOnly
      isRevurdering={false}
      alleKodeverk={{}}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(OppholdINorgeOgAdresserFaktaPanel)).has.length(1);
    expect(wrapper.find(InntektOgYtelserFaktaPanel)).has.length(1);
    expect(wrapper.find(PerioderMedMedlemskapFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(0);
    expect(wrapper.find(Hovedknapp).prop('disabled')).is.false;
  });

  it('skal avklare bosatt data når en har dette aksjonspunktet', () => {
    const bosattAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
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

    const valgtPeriodeMedBosattAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT],
      id: '123',
    };

    const wrapper = shallowWithIntl(<OppholdInntektOgPeriodeForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[bosattAksjonspunkt]}
      updateOppholdInntektPeriode={sinon.spy()}
      periodeResetCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      valgtPeriode={valgtPeriodeMedBosattAksjonspunkt}
      isRevurdering={false}
      alleKodeverk={{}}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(Hovedknapp).prop('disabled')).is.false;
  });

  it('skal avklare perioder når en har dette aksjonspunktet', () => {
    const periodeAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
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

    const valgtPeriodeMedAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE],
      id: '123',
    };

    const wrapper = shallowWithIntl(<OppholdInntektOgPeriodeForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[periodeAksjonspunkt]}
      updateOppholdInntektPeriode={sinon.spy()}
      periodeResetCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      valgtPeriode={valgtPeriodeMedAksjonspunkt}
      isRevurdering={false}
      alleKodeverk={{}}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(PerioderMedMedlemskapFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(Hovedknapp).prop('disabled')).is.false;
  });

  it('skal avklare oppholdsrett når en har dette aksjonspunktet', () => {
    const oppholdsrettAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
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

    const valgtPeriodeMedOppholdsrettAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      id: '123',
    };

    const wrapper = shallowWithIntl(<OppholdInntektOgPeriodeForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[oppholdsrettAksjonspunkt]}
      updateOppholdInntektPeriode={sinon.spy()}
      periodeResetCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      valgtPeriode={valgtPeriodeMedOppholdsrettAksjonspunkt}
      isRevurdering={false}
      alleKodeverk={{}}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(StatusForBorgerFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(Hovedknapp).prop('disabled')).is.false;
  });

  it('skal avklare lovlig opphold når en har dette aksjonspunktet', () => {
    const lovligOppholdAksjonspunkt = {
      id: 1,
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
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

    const valgtPeriodeMedLovligoppholdAksjonspunkt = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD],
      id: '123',
    };

    const wrapper = shallowWithIntl(<OppholdInntektOgPeriodeForm
      {...reduxFormPropsMock}
      initialValues={{ [`punkt${aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}`]: 'test', begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkter={[lovligOppholdAksjonspunkt]}
      updateOppholdInntektPeriode={sinon.spy()}
      periodeResetCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      valgtPeriode={valgtPeriodeMedLovligoppholdAksjonspunkt}
      isRevurdering={false}
      alleKodeverk={{}}
      alleMerknaderFraBeslutter={{}}
      behandlingId={1}
      behandlingVersjon={1}
    />);

    expect(wrapper.find(StatusForBorgerFaktaPanel)).has.length(1);
    expect(wrapper.find(FaktaBegrunnelseTextField)).has.length(1);
    expect(wrapper.find(Hovedknapp).prop('disabled')).is.false;
  });
});
