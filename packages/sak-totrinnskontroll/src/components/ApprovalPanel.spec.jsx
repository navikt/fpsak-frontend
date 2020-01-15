import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import ToTrinnsForm from './ToTrinnsForm';
import ToTrinnsFormReadOnly from './TilbakemeldingerFraTotrinnskontroll';
import { ApprovalPanel, mapPropsToContext } from './ApprovalPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-totrinnskontroll';

describe('<ApprovalPanel>', () => {
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

  const getKodeverkSkjemalenkeTyper = aksjonspunkter =>
    aksjonspunkter.map(ap => ({
      kode: ap.skjermlenkeType,
      navn: 'Dummy Tekst',
    }));

  const getNextProps = (totrinnskontrollSkjermlenkeContext, status) => ({
    totrinnskontrollSkjermlenkeContext,
    behandlingStatus: { kode: status },
    selectedBehandling: getBehandling(),
    location: { pathname: 'test' },
    totrinnskontrollReadOnlySkjermlenkeContext: [],
  });

  const createAksjonspunkt = aksjonspunktKode => ({
    aksjonspunktKode,
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  });

  const getTotrinnsaksjonspunkterFoedsel = () => ({
    skjermlenkeType: 'FAKTA_OM_FOEDSEL',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL),
      createAksjonspunkt(aksjonspunktCodes.TERMINBEKREFTELSE),
      createAksjonspunkt(aksjonspunktCodes.AUTO_VENT_PÅ_FODSELREGISTRERING),
    ],
  });

  const getTotrinnsaksjonspunkterOmsorg = () => ({
    skjermlenkeType: 'FAKTA_FOR_OMSORG',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.OMSORGSOVERTAKELSE),
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET),
    ],
  });

  const getTotrinnsaksjonspunkterForeldreansvar = () => ({
    skjermlenkeType: 'PUNKT_FOR_FORELDREANSVAR',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD),
      createAksjonspunkt(aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD),
    ],
  });

  const getTotrinnsaksjonspunkter = () => [getTotrinnsaksjonspunkterFoedsel()];

  const getTotrinnsaksjonspunkterAdopsjon = () => ({
    skjermlenkeType: 'PUNKT_FOR_ADOPSJON',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.ADOPSJONSDOKUMENTAJON),
      createAksjonspunkt(aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN),
      createAksjonspunkt(aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE),
    ],
  });

  const getTotrinnsaksjonspunkterMedlemskap = () => ({
    skjermlenkeType: 'FAKTA_OM_MEDLEMSKAP',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD),
      createAksjonspunkt(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT),
      createAksjonspunkt(aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE),
      createAksjonspunkt(aksjonspunktCodes.AVKLAR_OPPHOLDSRETT),
      createAksjonspunkt(aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN),
    ],
  });

  const getAksjonspunktOpptjening = () => ({
    skjermlenkeType: 'FAKTA_FOR_OPPTJENING',
    totrinnskontrollAksjonspunkter: [createAksjonspunkt(aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING)],
  });

  const getAksjonspunktBeregning = () => ({
    skjermlenkeType: 'BEREGNING_FORELDREPENGER',
    totrinnskontrollAksjonspunkter: [
      createAksjonspunkt(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS),
      createAksjonspunkt(aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE),
      createAksjonspunkt(aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE),
      createAksjonspunkt(aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD),
    ],
  });

  const getAksjonspunktFaktaOmBeregning = () => ({
    skjermlenkeType: 'FAKTA_OM_BEREGNING',
    totrinnskontrollAksjonspunkter: [createAksjonspunkt(aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN)],
  });

  it('skal mappe aksjonspunkter til context-objekt når aksjonspunkter hentes frå rest-tjeneste', () => {
    const totrinnskontrollAksjonspunkter = [
      getTotrinnsaksjonspunkterFoedsel(),
      getTotrinnsaksjonspunkterOmsorg(),
      getTotrinnsaksjonspunkterForeldreansvar(),
      getTotrinnsaksjonspunkterAdopsjon(),
      getAksjonspunktBeregning(),
      getTotrinnsaksjonspunkterMedlemskap(),
      getAksjonspunktOpptjening(),
      getAksjonspunktFaktaOmBeregning(),
    ];

    const nextProps = getNextProps(totrinnskontrollAksjonspunkter, behandlingStatus.FATTER_VEDTAK);
    const skjemalenkeTyper = getKodeverkSkjemalenkeTyper(totrinnskontrollAksjonspunkter);
    const context = mapPropsToContext(true, nextProps, skjemalenkeTyper);
    expect(context).to.have.length(8);
    const foedselContext = context.filter(({ contextCode }) => contextCode === 'FAKTA_OM_FOEDSEL');
    expect(foedselContext).to.have.length(1);
    expect(foedselContext[0].aksjonspunkter).to.have.length(3);
    const omsorgContext = context.filter(({ contextCode }) => contextCode === 'FAKTA_FOR_OMSORG');
    expect(omsorgContext).to.have.length(1);
    expect(omsorgContext[0].aksjonspunkter).to.have.length(2);
    const foreldreansContext = context.filter(({ contextCode }) => contextCode === 'PUNKT_FOR_FORELDREANSVAR');
    expect(foreldreansContext).to.have.length(1);
    expect(foreldreansContext[0].aksjonspunkter).to.have.length(2);
    const adopsjonContext = context.filter(({ contextCode }) => contextCode === 'PUNKT_FOR_ADOPSJON');
    expect(adopsjonContext).to.have.length(1);
    expect(adopsjonContext[0].aksjonspunkter).to.have.length(3);
    const beregningContext = context.filter(({ contextCode }) => contextCode === 'BEREGNING_FORELDREPENGER');
    expect(beregningContext).to.have.length(1);
    expect(beregningContext[0].aksjonspunkter).to.have.length(4);
    const opptjeningContext = context.filter(({ contextCode }) => contextCode === 'FAKTA_FOR_OPPTJENING');
    expect(opptjeningContext).to.have.length(1);
    expect(opptjeningContext[0].aksjonspunkter).to.have.length(1);
    const medlemskapContext = context.filter(({ contextCode }) => contextCode === 'FAKTA_OM_MEDLEMSKAP');
    expect(medlemskapContext).to.have.length(1);
    expect(medlemskapContext[0].aksjonspunkter).to.have.length(5);
    const faktaOmBeregningContext = context.filter(({ contextCode }) => contextCode === 'FAKTA_OM_BEREGNING');
    expect(faktaOmBeregningContext).to.have.length(1);
    expect(faktaOmBeregningContext[0].aksjonspunkter).to.have.length(1);
  });

  it('skal vise approvals under godkjenning fanen', () => {
    const behandling = getBehandling();
    const totrinnskontrollAksjonspunkter = getTotrinnsaksjonspunkter();

    const wrapper = shallowWithIntl(
      <ApprovalPanel
        behandlingId={1}
        behandlingVersjon={1}
        behandlingStatus={behandling.status}
        onSubmit={sinon.spy()}
        readOnly={false}
        forhandsvisVedtaksbrev={sinon.spy()}
        isForeldrepengerFagsak
        behandlingKlageVurdering={{}}
        alleKodeverk={{}}
        erBehandlingEtterKlage={false}
        erKlageWithKA={false}
        erKlage={false}
        toTrinnsBehandling={behandling.toTrinnsBehandling}
        aksjonspunkter={[]}
        resetApproval={sinon.spy()}
        location={{ pathname: 'test' }}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollAksjonspunkter}
        skjemalenkeTyper={getKodeverkSkjemalenkeTyper(totrinnskontrollAksjonspunkter)}
        disableGodkjennKnapp={false}
      />,
    );

    const approvals = wrapper.state('approvals');
    expect(approvals).to.have.length(1);
    expect(approvals[0].aksjonspunkter).to.have.length(3);

    const toTrinnsForm = wrapper.find(ToTrinnsForm);
    expect(toTrinnsForm).to.have.length(1);
  });

  it('skal ikkje vise approvals under godkjenning fanen når aksjonspunkter ikkje har komt inn frå resttjeneste', () => {
    const behandling = getBehandling();

    const wrapper = shallowWithIntl(
      <ApprovalPanel
        behandlingId={1}
        behandlingVersjon={1}
        behandlingStatus={behandling.status}
        onSubmit={sinon.spy()}
        readOnly={false}
        forhandsvisVedtaksbrev={sinon.spy()}
        isForeldrepengerFagsak
        behandlingKlageVurdering={{}}
        alleKodeverk={{}}
        erBehandlingEtterKlage={false}
        erKlageWithKA={false}
        erKlage={false}
        toTrinnsBehandling={behandling.toTrinnsBehandling}
        resetApproval={sinon.spy()}
        location={{ pathname: 'test' }}
        totrinnskontrollSkjermlenkeContext={undefined}
        skjemalenkeTyper={[]}
        disableGodkjennKnapp={false}
      />,
    );

    const approvals = wrapper.state('approvals');
    expect(approvals).to.have.length(0);

    const toTrinnsForm = wrapper.find(ToTrinnsForm);
    expect(toTrinnsForm).to.have.length(0);
  });

  it('skal vise approvals under fraBeslutter fanen', () => {
    const behandling = getBehandling();
    behandling.status = {
      kode: 'UTRED',
      navn: 'Behandling utredes',
    };

    const totrinnskontrollAksjonspunkter = [
      getTotrinnsaksjonspunkterFoedsel(),
      getTotrinnsaksjonspunkterOmsorg(),
      getTotrinnsaksjonspunkterForeldreansvar(),
    ];

    const wrapper = shallowWithIntl(
      <ApprovalPanel
        behandlingId={1}
        behandlingVersjon={1}
        behandlingStatus={behandling.status}
        onSubmit={sinon.spy()}
        readOnly={false}
        forhandsvisVedtaksbrev={sinon.spy()}
        isForeldrepengerFagsak
        behandlingKlageVurdering={{}}
        alleKodeverk={{}}
        erBehandlingEtterKlage={false}
        erKlageWithKA={false}
        erKlage={false}
        toTrinnsBehandling={behandling.toTrinnsBehandling}
        resetApproval={sinon.spy()}
        location={{ pathname: 'test' }}
        totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollAksjonspunkter}
        skjemalenkeTyper={getKodeverkSkjemalenkeTyper(totrinnskontrollAksjonspunkter)}
        disableGodkjennKnapp={false}
      />,
    );

    const approvals = wrapper.state('approvals');
    expect(approvals).to.have.length(3);

    const toTrinnsFormReadOnly = wrapper.find(ToTrinnsFormReadOnly);
    expect(toTrinnsFormReadOnly).to.have.length(1);
  });
});
