import React from 'react';
import { expect } from 'chai';
import { Knapp } from 'nav-frontend-knapper';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';

import TilretteleggingDetailForm, { TilretteleggingDetailFormImpl } from './TilretteleggingDetailForm';

describe('<TilretteleggingDetailForm>', () => {
  it('skal vise knapper for oppdater og avbryt når en ikke er i readonly-modus og en har datoer', () => {
    const wrapper = shallowWithIntl(<TilretteleggingDetailFormImpl
      intl={intlMock}
      readOnly={false}
      cancelTilrettelegging={() => undefined}
      submittable
      harIngenTilretteleggingDatoer={false}
      initialValues={{
        fom: undefined,
      }}
    />);

    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
    expect(wrapper.find(Knapp)).has.length(1);
  });

  it('skal ikke vise knapper når en er i readonly-modus', () => {
    const wrapper = shallowWithIntl(<TilretteleggingDetailFormImpl
      intl={intlMock}
      readOnly
      cancelTilrettelegging={() => undefined}
      submittable
      harIngenTilretteleggingDatoer={false}
      initialValues={{
        fom: undefined,
      }}
    />);

    expect(wrapper.find(FaktaSubmitButton)).has.length(0);
    expect(wrapper.find(Knapp)).has.length(0);
  });

  it('skal ikke vise avbryt-knapp når en ikke har datoer', () => {
    const wrapper = shallowWithIntl(<TilretteleggingDetailFormImpl
      intl={intlMock}
      readOnly={false}
      cancelTilrettelegging={() => undefined}
      submittable
      harIngenTilretteleggingDatoer
      initialValues={{
        fom: undefined,
      }}
    />);

    expect(wrapper.find(FaktaSubmitButton)).has.length(1);
    expect(wrapper.find(Knapp)).has.length(0);
  });

  it('skal vise knapp med tekst Legg-til når en ikke editerer eksisterende periode', () => {
    const wrapper = shallowWithIntl(<TilretteleggingDetailFormImpl
      intl={intlMock}
      readOnly={false}
      cancelTilrettelegging={() => undefined}
      submittable
      harIngenTilretteleggingDatoer
      initialValues={{
        fom: undefined,
      }}
    />);

    const button = wrapper.find(FaktaSubmitButton);
    expect(button.prop('buttonTextId')).is.eql('TilretteleggingDetailForm.LeggTil');
  });

  it('skal vise knapp med tekst Endre når en editerer eksisterende periode', () => {
    const wrapper = shallowWithIntl(<TilretteleggingDetailFormImpl
      intl={intlMock}
      readOnly={false}
      cancelTilrettelegging={() => undefined}
      submittable
      harIngenTilretteleggingDatoer={false}
      initialValues={{
        fom: '2019-02-02',
      }}
    />);

    const button = wrapper.find(FaktaSubmitButton);
    expect(button.prop('buttonTextId')).is.eql('TilretteleggingDetailForm.Endre');
  });

  it('skal vise feilmelding når tilretteleggingsdato finnes fra før', () => {
    const values = {
      id: 1,
      fom: '2019-01-01',
    };
    const tilretteleggingDatoer = [{
      id: 2,
      fom: '2019-01-01',
    }];
    const jordmorTilretteleggingFraDato = '2019-01-01';

    const errors = TilretteleggingDetailForm.validate(values, tilretteleggingDatoer, jordmorTilretteleggingFraDato);

    expect(errors).is.eql({
      fom: [{ id: 'TilretteleggingDetailForm.DatoFinnes' }],
    });
  });

  it('skal ikke vise feilmelding når tilretteleggingsdato ikke finnes fra før', () => {
    const values = {
      id: 1,
      fom: '2019-01-01',
    };
    const tilretteleggingDatoer = [{
      id: 1,
      fom: '2019-01-01',
    }];
    const jordmorTilretteleggingFraDato = '2019-01-01';

    const errors = TilretteleggingDetailForm.validate(values, tilretteleggingDatoer, jordmorTilretteleggingFraDato);

    expect(errors).is.eql({});
  });

  it('skal vise feilmelding når dato er før dato satt av jordmor', () => {
    const values = {
      id: 1,
      fom: '2019-01-01',
    };
    const tilretteleggingDatoer = [{
      id: 1,
      fom: '2019-01-01',
    }];
    const jordmorTilretteleggingFraDato = '2019-02-01';

    const errors = TilretteleggingDetailForm.validate(values, tilretteleggingDatoer, jordmorTilretteleggingFraDato);

    expect(errors).is.eql({
      fom: [{ id: 'TilretteleggingDetailForm.TidligereEnnOppgittAvJordmor' }],
    });
  });
});
