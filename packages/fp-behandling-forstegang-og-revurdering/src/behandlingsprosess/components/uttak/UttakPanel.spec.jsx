import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { transformValues, buildInitialValues, UttakPanelImpl as UttakPanel } from './UttakPanel';
import Uttak from './Uttak';

describe('<UttakPanel>', () => {
  const uttaksresultat = {
    perioderSøker: [{
      fom: '',
      tom: '',
      periodeResultatType: {
        kode: 'MANUELL_BEHANDLING',
        kodeverk: '',
        navn: '',
      },
      manuellBehandlingÅrsak: {
        navn: 'test',
      },
      aktiviteter: [{
      }],
    }, {
      fom: '',
      tom: '',
      periodeResultatType: {
        kode: 'MANUELL_BEHANDLING',
        kodeverk: '',
        navn: '',
      },
      manuellBehandlingÅrsak: {
        navn: 'test',
      },
      aktiviteter: [{
      }],
    }],
  };

  const stonadskonto = {
    stonadskontoer: {
      MØDREKVOTE: {
        aktivitetSaldoDtoList: [{
          aktivitetIdentifikator: {
            arbeidsgiver: {
              navn: 'UNIVERSITETET I OSLO',
            },
          },
          saldo: 0,
        },
        {
          aktivitetIdentifikator: {
            arbeidsgiver: {
              navn: 'STATOIL',
            },
          },
          saldo: 4,
        }],
      },
    },
  };

  it('skal rendre uttakpanel uten aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UttakPanel
      {...reduxFormPropsMock}
      aksjonspunkter={[]}
      readOnly={false}
      uttaksresultat={uttaksresultat}
      manuellOverstyring={false}
      isApOpen={false}
      submitCallback={sinon.spy()}
    />);
    const uttak = wrapper.find(Uttak);
    expect(uttak).has.length(1);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).has.length(1);
    const aksjonspunktHelpText = wrapper.find('AksjonspunktHelpText');
    expect(aksjonspunktHelpText).has.length(0);
  });

  it('skal rendre uttakpanel med aksjonspunkt', () => {
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        kode: '',
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
    }];
    const wrapper = shallowWithIntl(<UttakPanel
      {...reduxFormPropsMock}
      aksjonspunkter={aksjonspunkter}
      readOnly={false}
      uttaksresultat={uttaksresultat}
      manuellOverstyring={false}
      isApOpen
      submitCallback={sinon.spy()}
    />);
    const uttak = wrapper.find(Uttak);
    expect(uttak).has.length(1);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).has.length(3);
    const aksjonspunktHelpText = wrapper.find('AksjonspunktHelpText');
    expect(aksjonspunktHelpText).has.length(1);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });
    expect(reduxFormPropsMock.handleSubmit).to.have.property('callCount', 1);
  });


  it('transformValues gir korrekt trekkdager og aksjonspunkt 5071', () => {
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        kode: '',
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
    }];

    const ownProps = {
      apCodes: [
        aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
      ],
    };

    const values = {
      manuellOverstyring: false,
      uttaksresultatActivity: [{
        oppholdÅrsak: {
          kode: '-',
        },
        aktiviteter: [{
          days: 4,
          weeks: 5,
        }],
      }],
    };

    const transformedValues = transformValues(values, ownProps.apCodes, aksjonspunkter);
    expect(transformedValues.filter(ap => ap.kode === aksjonspunktCodes.FASTSETT_UTTAKPERIODER)).has.length(1);
    expect(transformedValues.filter(ap => ap.perioder[0].aktiviteter[0].trekkdagerDesimaler === '29.0')).has.length(1);
  });

  it('transformValues gir korrekt trekkdager og manuell overstyring', () => {
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        kode: '',
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
    }];

    const ownProps = {
      apCodes: [
        aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
      ],
    };

    const values = {
      manuellOverstyring: true,
      uttaksresultatActivity: [{
        oppholdÅrsak: {
          kode: '-',
        },
        aktiviteter: [{
          days: 4,
          weeks: 6,
        }],
      }],
    };

    const transformedValues = transformValues(values, ownProps.apCodes, aksjonspunkter);
    expect(transformedValues.filter(ap => ap.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER)).has.length(1);
    expect(transformedValues.filter(ap => ap.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && ap.perioder[0].aktiviteter[0].trekkdagerDesimaler === '34.0')).has.length(1);
  });

  it('skal sette initielle verdier for uttaksperioder', () => {
    const initialValues = buildInitialValues.resultFunc(uttaksresultat, stonadskonto);
    expect(initialValues).to.eql({
      uttaksresultatActivity: [{
        fom: '',
        tom: '',
        id: 1,
        periodeResultatType: {
          kode: 'MANUELL_BEHANDLING',
          kodeverk: '',
          navn: '',
        },
        manuellBehandlingÅrsak: {
          navn: 'test',
        },
        aktiviteter: [{
        }],
      }, {
        fom: '',
        tom: '',
        id: 2,
        periodeResultatType: {
          kode: 'MANUELL_BEHANDLING',
          kodeverk: '',
          navn: '',
        },
        manuellBehandlingÅrsak: {
          navn: 'test',
        },
        aktiviteter: [{
        }],
      }],
      stonadskonto: {
        stonadskontoer: {
          MØDREKVOTE: {
            aktivitetSaldoDtoList: [{
              aktivitetIdentifikator: {
                arbeidsgiver: {
                  navn: 'UNIVERSITETET I OSLO',
                },
              },
              saldo: 0,
            },
            {
              aktivitetIdentifikator: {
                arbeidsgiver: {
                  navn: 'STATOIL',
                },
              },
              saldo: 4,
            }],
          },
        },
      },
    });
  });
});
