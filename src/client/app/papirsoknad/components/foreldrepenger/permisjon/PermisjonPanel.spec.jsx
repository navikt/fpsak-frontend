import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FieldArray } from 'redux-form';
import SoknadData from 'papirsoknad/SoknadData';
import soknadTypeTillegg from 'kodeverk/soknadTypeTillegg';
import PermisjonPanel from './PermisjonPanel';
import PermisjonRettigheterPanel from './PermisjonRettigheterPanel';
import PermisjonOverforingAvKvoterPanel from './PermisjonOverforingAvKvoterPanel';
import PermisjonUtsettelsePanel from './PermisjonUtsettelsePanel';
import PermisjonGraderingPanel from './PermisjonGraderingPanel';

const form = 'form';
const readOnly = false;

describe('<PermisjonPanel>', () => {
  it('skal render Rettigheter og PeriodeFieldArray når type ikkje er endring foreldrepenger', () => {
    const wrapper = shallow(<PermisjonPanel
      form={form}
      soknadData={new SoknadData('', '', '', [])}
      readOnly={readOnly}
    />);
    const permisjonRettigheterPanel = wrapper.find(PermisjonRettigheterPanel);
    expect(permisjonRettigheterPanel).to.have.length(1);

    const fieldArray = wrapper.find(FieldArray);
    expect(fieldArray).has.length(1);
  });


  it('skal vise alle paneler ved overføring av kvoter, utsettelse og gradering', () => {
    const wrapper = shallow(<PermisjonPanel
      soknadData={new SoknadData('', '', '', [soknadTypeTillegg.OVERFORING_AV_KVOTER, soknadTypeTillegg.GRADERING, soknadTypeTillegg.UTSETTELSE])}
      form={form}
      readOnly={readOnly}
    />);

    const permisjonOverforingAvKvoterPanel = wrapper.find(PermisjonOverforingAvKvoterPanel);
    expect(permisjonOverforingAvKvoterPanel).has.length(1);

    const permisjonUtsettelsePanel = wrapper.find(PermisjonUtsettelsePanel);
    expect(permisjonUtsettelsePanel).has.length(1);

    const permisjonGraderingPanel = wrapper.find(PermisjonGraderingPanel);
    expect(permisjonGraderingPanel).has.length(1);
  });
});
