import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { RadioGroupField } from '@fpsak-frontend/form';
import VentelonnVartpengerPanel, {
  erVerdiForVentelonnVartpengerEndret,
  harVerdiBlittSattTidligere,
  erInkludertverdiForVentelonnVartpengerSatt,
  AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME,
} from './VentelonnVartpengerPanel';


describe('<VentelonnVartpengerPanel>', () => {
  it('skal vise Ventelønn/vartpenger radioknapp', () => {
    const wrapper = shallow(<VentelonnVartpengerPanel
      readOnly={false}
      isAksjonspunktClosed={false}
    />);
    const radio = wrapper.find(RadioGroupField);
    expect(radio).has.length(1);
  });

  it('skal gi ingen endring for false', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const erEndret = erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter);
    expect(erEndret).to.equal(false);
  });

  it('skal gi ingen endring for true', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: true,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const erEndret = erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter);
    expect(erEndret).to.equal(false);
  });

  it('skal gi ingen endring for null', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = null;
    const erEndret = erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter);
    expect(erEndret).to.equal(false);
  });

  it('skal gi endring for null og true', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const erEndret = erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter);
    expect(erEndret).to.equal(true);
  });


  it('skal gi endring for null og false', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const erEndret = erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter);
    expect(erEndret).to.equal(true);
  });

  it('skal returnere true når inkludert er satt til false', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };
    const sattTidligere = harVerdiBlittSattTidligere(avklarAktiviteter);
    expect(sattTidligere).to.equal(true);
  });

  it('skal returnere true når inkludert er satt til true', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: true,
      },
    };
    const sattTidligere = harVerdiBlittSattTidligere(avklarAktiviteter);
    expect(sattTidligere).to.equal(true);
  });

  it('skal returnere false når inkludert er satt til null', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const sattTidligere = harVerdiBlittSattTidligere(avklarAktiviteter);
    expect(sattTidligere).to.equal(false);
  });

  it('skal returnere false når inkludert er satt til undefined', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: undefined,
      },
    };
    const sattTidligere = harVerdiBlittSattTidligere(avklarAktiviteter);
    expect(sattTidligere).to.equal(false);
  });

  it('skal returnere undefined når ventelonnVartpenger ikkje er definert', () => {
    const avklarAktiviteter = {};
    const sattTidligere = harVerdiBlittSattTidligere(avklarAktiviteter);
    expect(sattTidligere).to.equal(undefined);
  });

  it('skal returnere false når value er satt til null', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = null;
    const verdiErSatt = erInkludertverdiForVentelonnVartpengerSatt(values);
    expect(verdiErSatt).to.equal(false);
  });

  it('skal returnere false når value er satt til undefined', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = undefined;
    const verdiErSatt = erInkludertverdiForVentelonnVartpengerSatt(values);
    expect(verdiErSatt).to.equal(false);
  });

  it('skal returnere true når value er satt til true', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const verdiErSatt = erInkludertverdiForVentelonnVartpengerSatt(values);
    expect(verdiErSatt).to.equal(true);
  });

  it('skal returnere true når value er satt til false', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const verdiErSatt = erInkludertverdiForVentelonnVartpengerSatt(values);
    expect(verdiErSatt).to.equal(true);
  });


  it('skal teste at initial values blir bygget for ventelønn/vartpenger med verdi satt til null', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const initialValues = VentelonnVartpengerPanel.buildInitialValues(avklarAktiviteter);
    expect(initialValues[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(null);
  });

  it('skal teste at initial values blir bygget for ventelønn/vartpenger med verdi satt til true', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: true,
      },
    };

    const initialValues = VentelonnVartpengerPanel.buildInitialValues(avklarAktiviteter);
    expect(initialValues[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(true);
  });

  it('skal teste at initial values blir bygget for ventelønn/vartpenger med verdi satt til false', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };

    const initialValues = VentelonnVartpengerPanel.buildInitialValues(avklarAktiviteter);
    expect(initialValues[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(false);
  });

  it('skal transform values om satt til true og ikkje submittet før', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const transformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
    expect(transformed.ventelonnVartpenger.inkludert).to.equal(true);
  });

  it('skal transform values om satt til true og submittet false på forrige', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const transformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
    expect(transformed.ventelonnVartpenger.inkludert).to.equal(true);
  });

  it('skal transform values om satt til false og submittet true på forrige', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: true,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const transformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
    expect(transformed.ventelonnVartpenger.inkludert).to.equal(false);
  });

  it('skal transform values om satt til false og ikkje submittet før', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const transformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
    expect(transformed.ventelonnVartpenger.inkludert).to.equal(false);
  });


  it('skal ikkje transform values om satt til false og satt til false på forrige', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const transformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
    expect(transformed).to.equal(null);
  });

  it('skal ikkje transform values om satt til true og satt til true på forrige', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: true,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const transformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
    expect(transformed).to.equal(null);
  });

  it('skal gi required error', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = null;
    const errors = VentelonnVartpengerPanel.validate(values);
    expect(errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME][0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi ikke implementert error', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const errors = VentelonnVartpengerPanel.validate(values);
    expect(errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME][0].id).to.equal('AvklareAktiviteter.IkkeImplementert');
  });

  it('skal ikkje gi error', () => {
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const errors = VentelonnVartpengerPanel.validate(values);
    expect(errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(undefined);
  });
});
