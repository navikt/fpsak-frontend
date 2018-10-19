import React from 'react';
import { expect } from 'chai';


import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import innsynResultatType from 'kodeverk/innsynResultatType';
import { FormattedMessage } from 'react-intl';


import { TextAreaField } from 'form/Fields';


import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import { InnsynVedtakFormImpl } from './InnsynVedtakForm';


describe('<InnsynVedtakForm>', () => {
  //  Tester for readOnly betingelse på confirm-vilkår knapp
  it('skal vise bekreft vedtak-knapp når ikke readonly', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      saksNr={123}
      sprakkode={{}}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });

  it('skal ikke vise bekreft vedtak-knapp når readonly', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
    />);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(0);
  });

  //  Tester for readOnly betingelse se-documenter lenke
  it('skal vise lenke med tekst InnsynVedtakForm.ForhåndsvisBrev ved ikke readOnly', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      saksNr={123}
      sprakkode={{}}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
    />);
    expect(wrapper.find(FormattedMessage).last().prop('id')).is.equal('InnsynVedtakForm.ForhåndsvisBrev');
  });

  it('skal vise lenke med tekst InnsynVedtakForm.VisVedtaksbrev ved ikke readOnly', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}
    />);
    expect(wrapper.find(FormattedMessage).last().prop('id')).is.equal('InnsynVedtakForm.VisVedtaksbrev');
  });


  // Tester for når TextAreaField skal vises
  it('skal vise TextAreaField når resultat lik AVVIST', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.AVVIST}
      saksNr={123}
      sprakkode={{}}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });

  it('skal vise TextAreaField når resultat lik DELVISTINNVILGET', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.DELVISTINNVILGET}
      saksNr={123}
      sprakkode={{}}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });


  it('skal ikke vise TextAreaField når resultat lik INNVILGET', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(TextAreaField)).to.have.length(0);
  });

  // Tester for når DocumentListVedtakInnsyn skal vises
  it('skal vise DocumentListVedtakInnsyn når resultat lik INNVILGET', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find('DocumentListVedtakInnsyn')).to.have.length(1);
  });

  it('skal vise DocumentListVedtakInnsyn når resultat lik DELVISTINNVILGET', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.DELVISTINNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find('DocumentListVedtakInnsyn')).to.have.length(1);
  });

  it('skal ikke vise DocumentListVedtakInnsyn når resultat lik AVVIST', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.AVVIST}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find('DocumentListVedtakInnsyn')).to.have.length(0);
  });

  // Tester for riktig resultat-tekst
  it('skal vise resultattekst for innvilget når resultat = INNVILGET', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.INNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(FormattedMessage).at(2).prop('id')).is.equal('InnsynVedtakForm.Innvilget');
  });
  it('skal vise resultattekst for delvis innvilget når resultat = DELVISINNVILGET', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.DELVISTINNVILGET}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(FormattedMessage).at(2).prop('id')).is.equal('InnsynVedtakForm.Delvis');
  });

  it('skal vise resultattekst for avvist når resultat = AVVIST', () => {
    const wrapper = shallowWithIntl(<InnsynVedtakFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      apBegrunnelse="Dette er en test"
      begrunnelse="Dette er en test"
      resultat={innsynResultatType.AVVIST}
      sprakkode={{}}
      saksNr={123}
      documents={[]}
      innsynResultatTyper={[{ kode: 'kodeTest', navn: 'navnTest' }]}

    />);
    expect(wrapper.find(FormattedMessage).at(2).prop('id')).is.equal('InnsynVedtakForm.Avslatt');
  });
});
