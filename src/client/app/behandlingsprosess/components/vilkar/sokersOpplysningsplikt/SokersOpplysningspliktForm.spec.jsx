import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import dokumentTypeId from 'kodeverk/dokumentTypeId';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import {
  buildInitialValues,
  getSortedManglendeVedlegg,
  SokersOpplysningspliktFormImpl,
} from './SokersOpplysningspliktForm';

describe('<SokersOpplysningspliktForm>', () => {
  it('skal vise tabell med manglende vedlegg', () => {
    const manglendeVedlegg = [{
      dokumentType: {
        kode: dokumentTypeId.INNTEKTSMELDING,
        navn: 'Inntektsmelding',
      },
      arbeidsgiver: {
        navn: 'STATOIL ASAAVD STATOIL SOKKELVIRKSOMHET',
        organisasjonsnummer: '973861778',
      },
      brukerHarSagtAtIkkeKommer: false,
    }, {
      dokumentType: {
        kode: dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL,
        navn: 'terminbekreftelse',
      },
      arbeidsgiver: null,
      brukerHarSagtAtIkkeKommer: null,
    }];
    const dokumentTypeIds = [{
      kode: dokumentTypeId.INNTEKTSMELDING,
      navn: 'Inntektsmelding',
    }, {
      kode: dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL,
      navn: 'terminbekreftelse',
    }];

    const wrapper = shallowWithIntl(<SokersOpplysningspliktFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      behandlingsresultat={{}}
      hasSoknad
      erVilkarOk={undefined}
      hasAksjonspunkt
      manglendeVedlegg={manglendeVedlegg}
      dokumentTypeIds={dokumentTypeIds}
      inntektsmeldingerSomIkkeKommer={undefined}
      reduxFormChange={() => undefined}
      behandlingFormPrefix="form"
    />);

    const table = wrapper.find(Table);
    expect(table).to.have.length(1);
    const rows = table.find(TableRow);
    expect(rows).to.have.length(2);

    const columnsAtRow1 = rows.first().children();
    expect(columnsAtRow1).to.have.length(3);
    expect(columnsAtRow1.first().childAt(0).text()).to.eql('Inntektsmelding');
    expect(columnsAtRow1.at(1).childAt(0).text()).to.eql('Statoil Asaavd Statoil Sokkelvirksomhet (973861778)');
    expect(columnsAtRow1.last().childAt(0).prop('label')).to.eql('Søker opplyser at dokumentasjon ikke kommer');

    const columnsAtRow2 = rows.last().children();
    expect(columnsAtRow2).to.have.length(3);
    expect(columnsAtRow2.first().childAt(0).text()).to.eql('terminbekreftelse');
    expect(columnsAtRow2.at(1).childAt(0)).is.empty;
    expect(columnsAtRow2.last().childAt(0)).is.empty;
  });

  it('skal ikke vise tabell når ingen vedlegg mangler', () => {
    const manglendeVedlegg = [];
    const dokumentTypeIds = [];

    const wrapper = shallowWithIntl(<SokersOpplysningspliktFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      behandlingsresultat={{}}
      hasSoknad
      erVilkarOk={undefined}
      hasAksjonspunkt
      manglendeVedlegg={manglendeVedlegg}
      dokumentTypeIds={dokumentTypeIds}
      inntektsmeldingerSomIkkeKommer={undefined}
      reduxFormChange={() => undefined}
      behandlingFormPrefix="form"
    />);

    expect(wrapper.find(Table)).to.have.length(0);
  });

  describe('selectors', () => {
    it('skal sortere manglende vedlegg', () => {
      const manglendeVedlegg = [{
        dokumentType: {
          kode: dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL,
          navn: 'terminbekreftelse',
        },
        arbeidsgiver: null,
        brukerHarSagtAtIkkeKommer: null,
      }, {
        dokumentType: {
          kode: dokumentTypeId.INNTEKTSMELDING,
          navn: 'Inntektsmelding',
        },
        arbeidsgiver: {
          navn: 'STATOIL ASAAVD STATOIL SOKKELVIRKSOMHET',
          organisasjonsnummer: '973861778',
        },
        brukerHarSagtAtIkkeKommer: false,
      }];

      const smv = getSortedManglendeVedlegg.resultFunc({
        manglendeVedlegg,
      });

      expect(smv).to.eql([manglendeVedlegg[1], manglendeVedlegg[0]]);
    });

    it('skal sette opp formens initielle verdier', () => {
      const manglendeVedlegg = [{
        dokumentType: {
          kode: dokumentTypeId.INNTEKTSMELDING,
          navn: 'Inntektsmelding',
        },
        arbeidsgiver: {
          navn: 'STATOIL ASAAVD STATOIL SOKKELVIRKSOMHET',
          organisasjonsnummer: '973861778',
        },
        brukerHarSagtAtIkkeKommer: false,
      }];
      const aksjonspunkter = [];

      const intitialValues = buildInitialValues.resultFunc(manglendeVedlegg, true, vilkarUtfallType.OPPFYLT, aksjonspunkter);

      expect(intitialValues).to.eql({
        aksjonspunktKode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_OVST,
        begrunnelse: '',
        erVilkarOk: true,
        hasAksjonspunkt: false,
        inntektsmeldingerSomIkkeKommer: {
          org_973861778: false,
        },
      });
    });
  });
});
