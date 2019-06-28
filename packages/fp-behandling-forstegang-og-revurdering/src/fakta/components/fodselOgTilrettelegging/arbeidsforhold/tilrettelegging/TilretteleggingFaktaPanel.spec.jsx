import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Knapp } from 'nav-frontend-knapper';

import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import TilretteleggingTable from './TilretteleggingTable';
import TilretteleggingDetailForm from './TilretteleggingDetailForm';
import { TilretteleggingFaktaPanel } from './TilretteleggingFaktaPanel';

describe('<TilretteleggingDetailForm>', () => {
  it('skal vise detail-form for tilretteleggingsdatoer når det er valgt en tilretteleggingsdato', () => {
    const selectedTilrettelegging = {
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [selectedTilrettelegging];
    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    wrapper.setState({ selectedTilrettelegging });

    expect(wrapper.find(TilretteleggingDetailForm)).has.length(1);
  });

  it('skal ikke vise detail-form for tilretteleggingsdatoer når det ikke er valgt en tilretteleggingsdato og det finnes minst en slik dato', () => {
    const selectedTilrettelegging = {
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [selectedTilrettelegging];
    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    expect(wrapper.find(TilretteleggingDetailForm)).has.length(0);
  });

  it('skal vise detail-form for tilretteleggingsdatoer når det ikke finnes tilretteleggingsdatoer', () => {
    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={[]}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    expect(wrapper.find(TilretteleggingDetailForm)).has.length(1);
  });

  it('skal vise knapp for å lage ny tilretteleggingsdato når det ikke er valgt tilrettelegging og det finnes datoer fra før', () => {
    const selectedTilrettelegging = {
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [selectedTilrettelegging];
    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    expect(wrapper.find(Knapp)).has.length(1);
  });

  it('skal vise knapp for å lage ny tilretteleggingsdato når det ikke er valgt tilrettelegging og det finnes datoer fra før', () => {
    const selectedTilrettelegging = {
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [selectedTilrettelegging];
    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    expect(wrapper.find(Knapp)).has.length(1);
  });

  it('skal ikke vise knapp for å lage ny tilretteleggingsdato når det er valgt en tilrettelegging', () => {
    const selectedTilrettelegging = {
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [selectedTilrettelegging];
    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    wrapper.setState({ selectedTilrettelegging });

    expect(wrapper.find(Knapp)).has.length(0);
  });

  it('skal oppdatere tilrettelegging', () => {
    const selectedTilrettelegging = {
      id: 1,
      fom: '2019-02-02',
      type: {
        kode: tilretteleggingType.DELVIS_TILRETTELEGGING,
      },
      stillingsprosent: 10,
    };
    const annenTilrettelegging = {
      id: 2,
      fom: '2019-03-03',
      type: {
        kode: tilretteleggingType.HEL_TILRETTELEGGING,
      },
    };
    const tilretteleggingDatoer = [selectedTilrettelegging, annenTilrettelegging];
    const formChange = sinon.spy();

    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={formChange}
      reduxFormInitialize={sinon.spy()}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    wrapper.setState({ selectedTilrettelegging });

    const oppdatertValgtTilrettelegging = {
      id: 1,
      fom: '2019-10-10',
      type: {
        kode: tilretteleggingType.HEL_TILRETTELEGGING,
      },
      stillingsprosent: 10,
    };

    wrapper.find(TilretteleggingDetailForm).prop('onSubmit')(oppdatertValgtTilrettelegging);

    expect(formChange.called).is.true;
    expect(formChange.getCalls()[0].args).has.length(3);
    expect(formChange.getCalls()[0].args[0]).is.eql('behandling.formName');
    expect(formChange.getCalls()[0].args[1]).is.eql('tilretteleggingDatoer');
    expect(formChange.getCalls()[0].args[2]).is.eql([annenTilrettelegging, {
      id: 1,
      fom: '2019-10-10',
      type: {
        kode: tilretteleggingType.HEL_TILRETTELEGGING,
      },
    }]);
  });

  it('skal lage ny tilrettelegging', () => {
    const annenTilrettelegging = {
      id: 1,
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [annenTilrettelegging];
    const formInitialize = sinon.spy();

    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={formInitialize}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    wrapper.find(Knapp).prop('onClick')();

    expect(formInitialize.called).is.true;
    expect(formInitialize.getCalls()[0].args).has.length(2);
    expect(formInitialize.getCalls()[0].args[0]).is.eql('behandling.TilretteleggingDetailForm');
    expect(formInitialize.getCalls()[0].args[1]).is.eql({
      id: 2,
      fom: undefined,
      type: undefined,
      stillingsprosent: undefined,
    });
  });

  it('skal slette tilrettelegging og lage ny når det ikke finnes flere', () => {
    const selectedTilrettelegging = {
      id: 1,
      fom: '2019-02-02',
    };
    const tilretteleggingDatoer = [selectedTilrettelegging];
    const formInitialize = sinon.spy();

    const wrapper = shallow(<TilretteleggingFaktaPanel
      tilretteleggingDatoer={tilretteleggingDatoer}
      behandlingFormPrefix="behandling"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={formInitialize}
      readOnly={false}
      parentFormName="formName"
      settValgtTilrettelegging={sinon.spy()}
      submittable
      jordmorTilretteleggingFraDato="2019-01-01"
    />);

    wrapper.setState({ selectedTilrettelegging });

    wrapper.find(TilretteleggingTable).prop('slettTilrettelegging')(selectedTilrettelegging);

    expect(formInitialize.called).is.true;
    expect(formInitialize.getCalls()[0].args).has.length(2);
    expect(formInitialize.getCalls()[0].args[0]).is.eql('behandling.TilretteleggingDetailForm');
    expect(formInitialize.getCalls()[0].args[1]).is.eql({
      id: 2,
      fom: undefined,
      type: undefined,
      stillingsprosent: undefined,
    });
  });
});
