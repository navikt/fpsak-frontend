import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
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
    expect(formattedMessage).has.length(4);
    const aksjonspunktHelpText = wrapper.find('AksjonspunktHelpText');
    expect(aksjonspunktHelpText).has.length(1);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });
    expect(reduxFormPropsMock.handleSubmit).to.have.property('callCount', 1);
  });

  it('transformValues gir korrekt trekkdager og aksjonspunkt 5071', () => {
    const ownProps = {
      apCodes: [
        aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
      ],
    };

    const values = {
      manuellOverstyring: false,
      uttaksresultatActivity: [{
        aktiviteter: [{
          days: 4,
          weeks: 5,
        }],
      }],
    };

    const transformedValues = transformValues(values, ownProps.apCodes);
    expect(transformedValues.filter(ap => ap.kode === aksjonspunktCodes.FASTSETT_UTTAKPERIODER)).has.length(1);
    expect(transformedValues.filter(ap => ap.perioder[0].aktiviteter[0].trekkdager === 29)).has.length(1);
  });

  it('transformValues gir korrekt trekkdager og manuell overstyring', () => {
    const ownProps = {
      apCodes: [
        aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
      ],
    };

    const values = {
      manuellOverstyring: true,
      uttaksresultatActivity: [{
        aktiviteter: [{
          days: 4,
          weeks: 6,
        }],
      }],
    };

    const transformedValues = transformValues(values, ownProps.apCodes);
    expect(transformedValues.filter(ap => ap.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER)).has.length(1);
    expect(transformedValues.filter(ap => ap.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && ap.perioder[0].aktiviteter[0].trekkdager === 34)).has.length(1);
  });

  it('skal sette initielle verdier for uttaksperioder', () => {
    const initialValues = buildInitialValues.resultFunc(uttaksresultat);
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
    });
  });
});
