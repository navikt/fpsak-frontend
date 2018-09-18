import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import PersonArbeidsforholdTable from './PersonArbeidsforholdTable';
import PersonAksjonspunktText from './PersonAksjonspunktText';
import PersonArbeidsforholdDetailForm from './PersonArbeidsforholdDetailForm';
import PersonArbeidsforholdPanel, { PersonArbeidsforholdPanelImpl, sortArbeidsforhold } from './PersonArbeidsforholdPanel';

describe('<PersonArbeidsforholdPanel>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforholdId: '1231-2345',
    navn: 'Svendsen Eksos',
    arbeidsgiverIdentifikator: '1234567',
    arbeidsgiverIdentifiktorGUI: '1234567',
    fomDato: '2018-01-01',
    tomDato: '2018-10-10',
    kilde: {
      kode: 'INNTEKT',
      navn: '',
    },
    mottattDatoInntektsmelding: undefined,
    brukArbeidsforholdet: true,
    erNyttArbeidsforhold: undefined,
    erstatterArbeidsforholdId: undefined,
    tilVurdering: true,
  };

  const fagsystemer = [{
    kode: 'AA',
    navn: 'aa',
  }, {
    kode: 'INNTEKT',
    navn: 'inntekt',
  }];

  it('skal rendre komponent', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);
    expect(wrapper.find(PersonArbeidsforholdTable)).has.length(1);
    expect(wrapper.find(PersonAksjonspunktText)).has.length(1);
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(1);
  });

  it('skal ikke gi arbeidsforhold som er erstattet til tabell', () => {
    const arbeidsforhold2 = {
      ...arbeidsforhold,
      id: '2',
      erSlettet: true,
    };
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const table = wrapper.find(PersonArbeidsforholdTable);
    expect(table.prop('alleArbeidsforhold')).is.eql([arbeidsforhold]);
  });

  it('skal ikke vise arbeidsforhold-detaljer når ingen er valgt i tabell', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    wrapper.setState({ selectedArbeidsforhold: undefined });

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal automatisk vise arbeidsforhold når det er til vurdering og ikke allerede er endret av saksbehandler', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(1);
  });

  it('skal ikke vise arbeidsforhold automatisk når det er endret', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[{
        ...arbeidsforhold,
        tilVurdering: true,
        erEndret: true,
      }]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal ikke vise arbeidsforhold automatisk når saksbehandler har det ikke er aksjonspunkt på det', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[{
        ...arbeidsforhold,
        tilVurdering: false,
      }]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal fjerne detaljepanel ved avbryt', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);


    expect(wrapper.state().selectedArbeidsforhold).is.eql(arbeidsforhold);
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    expect(detailForm).has.length(1);

    detailForm.prop('cancelArbeidsforhold')();
    wrapper.update();

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal rulle tilbake markering av nytt arbeidsforhold når det ikke lenger skal brukes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      erNyttArbeidsforhold: true,
    };
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[newArbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const editedArbeidsforhold = {
      ...newArbeidsforhold,
      brukArbeidsforholdet: false,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.PersonInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...newArbeidsforhold,
      erNyttArbeidsforhold: undefined,
      brukArbeidsforholdet: false,
      erEndret: true,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal rulle tilbake arbeidsforholdet som skal erstattes ved valg av nytt arbeidsforhold', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      erSlettet: true,
      mottattDatoInntektsmelding: '2018-01-01',
      tilVurdering: false,
      id: '2',
    };
    const newArbeidsforhold = {
      ...arbeidsforhold,
      erNyttArbeidsforhold: false,
      erstatterArbeidsforholdId: oldArbeidsforhold.id,
      mottattDatoInntektsmelding: '2018-10-01',
    };
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[newArbeidsforhold, oldArbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
    />);

    const editedArbeidsforhold = {
      ...newArbeidsforhold,
      erNyttArbeidsforhold: true,
    };
    wrapper.setState({ selectedArbeidsforhold: editedArbeidsforhold });

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.PersonInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');

    // FIXME (TOR) fomDato skal ikkje vera undefined her
    expect(args[2]).to.eql([{
      ...oldArbeidsforhold,
      erSlettet: false,
    }, {
      ...newArbeidsforhold,
      erNyttArbeidsforhold: true,
      erstatterArbeidsforholdId: undefined,
      erEndret: true,
      fomDato: undefined,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal sortere arbeidsforhold etter navn og mottakstidspunkt for inntektsmelding', () => {
    const arbeidsforhold2 = {
      ...arbeidsforhold,
      navn: 'Svendsen Eksos',
      mottattDatoInntektsmelding: '2018-01-01',
    };
    const arbeidsforhold3 = {
      ...arbeidsforhold,
      navn: 'Svendsen Eksos',
      mottattDatoInntektsmelding: '2017-01-01',
    };
    const arbeidsforhold4 = {
      ...arbeidsforhold,
      navn: 'Svendsen Eksos',
      mottattDatoInntektsmelding: '2019-01-01',
    };
    const arbeidsforhold5 = {
      ...arbeidsforhold,
      navn: 'Nav',
      mottattDatoInntektsmelding: '2018-01-01',
    };

    const arbeidsforholdListe = [arbeidsforhold, arbeidsforhold2, arbeidsforhold3, arbeidsforhold4, arbeidsforhold5];
    const sorterteArbeidsforhol = sortArbeidsforhold(arbeidsforholdListe);

    expect(sorterteArbeidsforhol).is.eql([arbeidsforhold5, arbeidsforhold4, arbeidsforhold2, arbeidsforhold3, arbeidsforhold]);
  });

  it('skal legge gamle arbeidsforhold med samme orgnr på nytt arbeidsforhold', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      mottattDatoInntektsmelding: '2018-01-01',
    };
    const newArbeidsforhold = {
      id: 2,
      ...arbeidsforhold,
      arbeidsforholdId: '1231-9876',
      mottattDatoInntektsmelding: '2018-10-01',
    };

    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold, oldArbeidsforhold]);

    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [oldArbeidsforhold],
      }, {
        ...oldArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
      }],
    });
  });
});
