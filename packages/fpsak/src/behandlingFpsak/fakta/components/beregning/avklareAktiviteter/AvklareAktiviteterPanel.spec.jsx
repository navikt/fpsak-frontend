import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { ApiStateBuilder } from '@fpsak-frontend/assets/testHelpers/data-test-helper';
import fpsakBehandlingApi from 'behandlingFpsak/data/fpsakBehandlingApi';
import {
  AvklareAktiviteterPanelImpl, buildInitialValuesAvklarAktiviteter,
  transformValuesAvklarAktiviteter, getValidationAvklarAktiviteter, erAktivitetAvklartOgIkkeEndret,
} from './AvklareAktiviteterPanel';
import VentelonnVartpengerPanel, { AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME } from './VentelonnVartpengerPanel';
import { formName } from '../BeregningInfoPanel';

const {
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;

const behandlingFormName = 'behandling_1000051_v1';


const lagStateMedAvklarAktitiveter = (avklarAktiviteter, values = {}) => {
  const faktaOmBeregning = {
    avklarAktiviteter,
  };
  const data = {
    id: 1000051,
    versjon: 1,
    beregningsgrunnlag: {
      faktaOmBeregning,
      bg: 'beregningsgrunnlag',
    },
    aksjonspunkter: [{ definisjon: { kode: AVKLAR_AKTIVITETER } }],
  };
  const dataState = new ApiStateBuilder()
    .withData(fpsakBehandlingApi.BEHANDLING.name, data, 'dataContextFpsakBehandling')
    .withData(fpsakBehandlingApi.ORIGINAL_BEHANDLING.name, {}, 'dataContextFpsakBehandling')
    .build();
  const state = {
    default: {
      ...dataState.default,
      fpsakBehandling: {
        behandlingId: 1000051,
      },
    },
    form: {},
  };
  state.form[behandlingFormName] = {};
  state.form[behandlingFormName][formName] = {
    values,
  };
  return state;
};

describe('<AvklareAktiviteterPanel>', () => {
  it('skal vise Ventelønn/vartpenger panel', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const wrapper = shallow(<AvklareAktiviteterPanelImpl
      readOnly={false}
      isAksjonspunktClosed={false}
      avklarAktiviteter={avklarAktiviteter}
    />);
    const radio = wrapper.find(VentelonnVartpengerPanel);
    expect(radio).has.length(1);
  });

  it('skal ikkje vise Ventelønn/vartpenger panel', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: null,
    };
    const wrapper = shallow(<AvklareAktiviteterPanelImpl
      readOnly={false}
      isAksjonspunktClosed={false}
      avklarAktiviteter={avklarAktiviteter}
    />);
    const radio = wrapper.find(VentelonnVartpengerPanel);
    expect(radio).has.length(0);
  });

  it('skal teste at initial values blir bygget for ventelønn/vartpenger med verdi satt til null', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };

    const initialValues = buildInitialValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter));
    expect(initialValues[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(null);
  });

  it('skal teste at initial values blir bygget for ventelønn/vartpenger med verdi satt til true', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: true,
      },
    };

    const initialValues = buildInitialValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter));
    expect(initialValues[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(true);
  });

  it('skal teste at initial values blir bygget for ventelønn/vartpenger med verdi satt til false', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };

    const initialValues = buildInitialValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter));
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
    const transformed = transformValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
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
    const transformed = transformValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
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
    const transformed = transformValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
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
    const transformed = transformValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
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
    const transformed = transformValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
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
    const transformed = transformValuesAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
    expect(transformed).to.equal(null);
  });

  it('skal gi required error', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = null;
    const errors = getValidationAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
    expect(errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME][0].id).to.equal(isRequiredMessage()[0].id);
  });


  it('skal gi ikke implementert error', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const errors = getValidationAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
    expect(errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME][0].id).to.equal('AvklareAktiviteter.IkkeImplementert');
  });


  it('skal ikkje gi error', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const errors = getValidationAvklarAktiviteter(lagStateMedAvklarAktitiveter(avklarAktiviteter))(values);
    expect(errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]).to.equal(undefined);
  });


  it('skal returnere true når verdi er avklart og ikke var satt før', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values);
    const erAvklartOgIkkeEndret = erAktivitetAvklartOgIkkeEndret(formName)(state);
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });

  it('skal returnere true når verdi er avklart og satt før og ikke endret', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = false;
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values);
    const erAvklartOgIkkeEndret = erAktivitetAvklartOgIkkeEndret(formName)(state);
    expect(erAvklartOgIkkeEndret).to.equal(true);
  });


  it('skal returnere false når verdi er avklart og satt før og endret', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: false,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = true;
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values);
    const erAvklartOgIkkeEndret = erAktivitetAvklartOgIkkeEndret(formName)(state);
    expect(erAvklartOgIkkeEndret).to.equal(false);
  });

  it('skal returnere false når verdi ikke er avklart', () => {
    const avklarAktiviteter = {
      ventelonnVartpenger: {
        inkludert: null,
      },
    };
    const values = {};
    values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = null;
    const state = lagStateMedAvklarAktitiveter(avklarAktiviteter, values);
    const erAvklartOgIkkeEndret = erAktivitetAvklartOgIkkeEndret(formName)(state);
    expect(erAvklartOgIkkeEndret).to.equal(false);
  });
});
