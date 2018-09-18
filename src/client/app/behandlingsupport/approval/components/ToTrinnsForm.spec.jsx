import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import vilkarType from 'kodeverk/vilkarType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { ToTrinnsFormImpl } from './ToTrinnsForm';
import ApprovalField from './ApprovalField';
import getAksjonspunktText from './ApprovalTextUtils';

describe('<ToTrinnsForm>', () => {
  const getTotrinnsaksjonspunkterFoedsel = () => (
    [
      {
        aksjonspunktKode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.FODSELSVILKARET_MOR,
        vurderPaNyttArsaker: [],
      },
      {
        aksjonspunktKode: aksjonspunktCodes.TERMINBEKREFTELSE,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.FODSELSVILKARET_MOR,
        vurderPaNyttArsaker: [],
      },
      {
        aksjonspunktKode: aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.FODSELSVILKARET_MOR,
        vurderPaNyttArsaker: [],
      },
    ]
  );


  const getTotrinnsaksjonspunkterOmsorg = () => (
    [
      {
        aksjonspunktKode: aksjonspunktCodes.OMSORGSOVERTAKELSE,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.OMSORGSVILKARET,
        vurderPaNyttArsaker: [],
      },
      {
        aksjonspunktKode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.OMSORGSVILKARET,
        vurderPaNyttArsaker: [],
      },
    ]
  );

  const getTotrinnsaksjonspunkterForeldreansvar = () => (
    [
      {
        aksjonspunktKode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.FORELDREANSVARSVILKARET_4_LEDD,
        vurderPaNyttArsaker: [],
      },
      {
        aksjonspunktKode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
        beregningDto: null,
        besluttersBegrunnelse: null,
        opptjeningAktiviteter: [],
        totrinnskontrollGodkjent: null,
        vilkar: vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
        vurderPaNyttArsaker: [],
      },
    ]
  );


  const getBehandling = () => ({
    id: 1234,
    versjon: 123,
    type: {
      kode: 'BT-001',
      navn: 'Endringssøknad',
    },
    fagsakId: 2,
    opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
    status: {
      kode: 'FVED',
      navn: 'Fatter vedtak',
    },
    toTrinnsBehandling: true,
  });

  it('skal ikkje vise noko om approvals i formstate er ulik approvals frå resttjeneste', () => {
    const formState = [{
      contextCode: 'test',
      aksjonspunkter: [],
    },
    {
      contextCode: 'test2',
      aksjonspunkter: [],
    }];

    const totrinnskontrollContext = [{
      contextCode: 'test',
      aksjonspunkter: [],
    },
    ];

    const behandling = getBehandling();

    const isForeldrepenger = true;

    const wrapper = shallowWithIntl(<ToTrinnsFormImpl
      {...reduxFormPropsMock}
      totrinnskontrollContext={totrinnskontrollContext}
      formState={formState}
      location={{ pathname: 'test' }}
      forhandsvisVedtaksbrev={sinon.spy()}
      behandling={behandling}
      getAksjonspunktText={getAksjonspunktText.resultFunc(isForeldrepenger, null, null, null, null)}
      readOnly={false}
      intl={intlMock}
    />);

    const form = wrapper.find('form');
    expect(form).to.have.length(0);
  });

  it('skal rendre form om approvals i formstate er lik lengde som approvals frå resttjeneste', () => {
    const formState = [{
      contextCode: 'test',
      aksjonspunkter: [],
    }];

    const totrinnskontrollContext = [{
      contextCode: 'test',
      skjermlenkeId: 'Behandlingspunkt.Fodselsvilkaret',
      skjermlenke: 'testLocation',
      aksjonspunkter: [],
    },
    ];

    const behandling = getBehandling();

    const isForeldrepenger = true;

    const wrapper = shallowWithIntl(<ToTrinnsFormImpl
      {...reduxFormPropsMock}
      totrinnskontrollContext={totrinnskontrollContext}
      formState={formState}
      location={{ pathname: 'test' }}
      forhandsvisVedtaksbrev={sinon.spy()}
      behandling={behandling}
      getAksjonspunktText={getAksjonspunktText.resultFunc(isForeldrepenger, null, null, null, null)}
      readOnly={false}
      intl={intlMock}
    />);

    const form = wrapper.find('form');
    expect(form).to.have.length(1);
  });


  it('skal rendre form om approvals i formstate er lik lengde som approvals frå resttjeneste', () => {
    const aksjonspunkterFoedsel = getTotrinnsaksjonspunkterFoedsel();
    const aksjonspunkterOmsorg = getTotrinnsaksjonspunkterOmsorg();
    const aksjonspunkterForeldreansvar = getTotrinnsaksjonspunkterForeldreansvar();


    const formState = [{
      contextCode: 'test',
      aksjonspunkter: [],
    },
    {
      contextCode: 'test',
      aksjonspunkter: [],
    },
    {
      contextCode: 'test',
      aksjonspunkter: [],
    }];

    const totrinnskontrollContext = [{
      contextCode: 'FOEDSEL',
      skjermlenkeId: 'Behandlingspunkt.Fodselsvilkaret',
      skjermlenke: 'testLocation',
      aksjonspunkter: aksjonspunkterFoedsel,
    },
    {
      contextCode: 'OMSORG',
      skjermlenkeId: 'Behandlingspunkt.Omsorgsvilkaret',
      skjermlenke: 'testLocation',
      aksjonspunkter: aksjonspunkterOmsorg,
    },
    {
      contextCode: 'FORELDREANSVAR',
      skjermlenkeId: 'Behandlingspunkt.Foreldreansvar',
      skjermlenke: 'testLocation',
      aksjonspunkter: aksjonspunkterForeldreansvar,
    },
    ];

    const behandling = getBehandling();

    const isForeldrepenger = true;

    const wrapper = shallowWithIntl(<ToTrinnsFormImpl
      {...reduxFormPropsMock}
      totrinnskontrollContext={totrinnskontrollContext}
      formState={formState}
      location={{ pathname: 'test' }}
      forhandsvisVedtaksbrev={sinon.spy()}
      behandling={behandling}
      getAksjonspunktText={getAksjonspunktText.resultFunc(isForeldrepenger, null, null, null, null)}
      readOnly={false}
      intl={intlMock}
    />);

    const form = wrapper.find('form');
    expect(form).to.have.length(1);

    const navLink = wrapper.find('NavLink');
    expect(navLink).to.have.length(3);

    const approvalField = wrapper.find(ApprovalField);
    expect(approvalField).to.have.length(7);
  });
});
