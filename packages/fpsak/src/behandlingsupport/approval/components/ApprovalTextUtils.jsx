import React from 'react';
import moment from 'moment';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import aksjonspunktCodes, { isUttakAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getBehandlingStatus, getBehandlingKlageVurdering } from 'behandling/duck';
import { isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';
import { getKodeverk } from 'kodeverk/duck';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import totrinnskontrollaksjonspunktTextCodes from '../totrinnskontrollaksjonspunktTextCodes';
import vurderFaktaOmBeregningTotrinnText from '../VurderFaktaBeregningTotrinnText';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';

export const isKlage = (klageVurderingResultatNFP, klageVurderingResultatNK) => {
  const meholdIKlageAvNFP = klageVurderingResultatNFP;
  const meholdIKlageAvNK = klageVurderingResultatNK;
  return meholdIKlageAvNFP || meholdIKlageAvNK;
};

export const isKlageWithKA = (klageVurderingResultatNK) => {
  const meholdIKlageAvNK = klageVurderingResultatNK;
  return meholdIKlageAvNK;
};

const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const buildVarigEndringBeregningText = (beregningDto) => (beregningDto.fastsattVarigEndringNaering ? (
  <FormattedMessage
    id="ToTrinnsForm.Beregning.VarigEndring"
  />
) : (
  <FormattedMessage
    id="ToTrinnsForm.Beregning.IkkeVarigEndring"
  />
));

export const getFaktaOmArbeidsforholdMessages = (arbeidforholdDto, arbeidsforholdHandlingTyper) => {
  const formattedMessages = [];
  const { kode } = arbeidforholdDto.arbeidsforholdHandlingType;
  if (arbeidforholdDto.brukPermisjon === true) {
    formattedMessages.push(<FormattedHTMLMessage id="ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIPermisjon" />);
    return formattedMessages;
  }
  if (arbeidforholdDto.brukPermisjon === false) {
    formattedMessages.push(<FormattedHTMLMessage id="ToTrinnsForm.FaktaOmArbeidsforhold.SoekerErIkkeIPermisjon" />);
    if (kode === arbeidsforholdHandlingType.BRUK) {
      return formattedMessages;
    }
  }
  const type = arbeidsforholdHandlingTyper.find((t) => t.kode === kode);
  const melding = type !== undefined && type !== null ? type.navn : '';
  formattedMessages.push(<FormattedHTMLMessage id="ToTrinnsForm.FaktaOmArbeidsforhold.Melding" values={{ melding }} />);
  return formattedMessages;
};

const buildArbeidsforholdText = (aksjonspunkt, arbeidsforholdHandlingTyper) => aksjonspunkt.arbeidforholdDtos.map((arbeidforholdDto) => {
  const formattedMessages = getFaktaOmArbeidsforholdMessages(arbeidforholdDto, arbeidsforholdHandlingTyper);
  return (
    <>
      <FormattedHTMLMessage
        id="ToTrinnsForm.OpplysningerOmSøker.Arbeidsforhold"
        values={{
          orgnavn: arbeidforholdDto.navn,
          orgnummer: arbeidforholdDto.organisasjonsnummer,
          arbeidsforholdId: arbeidforholdDto.arbeidsforholdId ? `...${arbeidforholdDto.arbeidsforholdId.slice(-4)}` : '',
        }}
      />
      { formattedMessages.map((formattedMessage) => (
        <React.Fragment key={formattedMessage.props.id}>
          {' '}
          {formattedMessage}
          {' '}
        </React.Fragment>
      ))}
    </>
  );
});

const buildUttakText = (aksjonspunkt) => aksjonspunkt.uttakPerioder.map((uttakperiode) => {
  const fom = formatDate(uttakperiode.fom);
  const tom = formatDate(uttakperiode.tom);
  let id;

  if (uttakperiode.erSlettet) {
    id = 'ToTrinnsForm.AvklarUttak.PeriodeSlettet';
  } else if (uttakperiode.erLagtTil) {
    id = 'ToTrinnsForm.AvklarUttak.PeriodeLagtTil';
  } else if (uttakperiode.erEndret && (
    aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.FASTSETT_UTTAKPERIODER
    || aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.TILKNYTTET_STORTINGET
  )
  ) {
    id = 'ToTrinnsForm.ManueltFastsattUttak.PeriodeEndret';
  } else if (uttakperiode.erEndret && aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER) {
    id = 'ToTrinnsForm.OverstyrUttak.PeriodeEndret';
  } else if (uttakperiode.erEndret) {
    id = 'ToTrinnsForm.AvklarUttak.PeriodeEndret';
  } else {
    id = 'ToTrinnsForm.AvklarUttak.PeriodeAvklart';
  }

  return (
    <FormattedMessage
      id={id}
      values={{ a: fom, b: tom }}
    />
  );
});

const buildOpptjeningText = (aksjonspunkt) => aksjonspunkt.opptjeningAktiviteter.map((aktivitet) => (
  <OpptjeningTotrinnText
    aktivitet={aktivitet}
  />
));

const getTextFromAksjonspunktkode = (aksjonspunkt) => {
  const aksjonspunktTextId = totrinnskontrollaksjonspunktTextCodes[aksjonspunkt.aksjonspunktKode];
  return aksjonspunktTextId ? (
    <FormattedMessage
      id={aksjonspunktTextId}
    />
  ) : null;
};


const getTextForForeldreansvarsvilkåretAndreLedd = (isForeldrepenger) => {
  const aksjonspunktTextId = isForeldrepenger
    ? 'ToTrinnsForm.Foreldreansvar.VurderVilkarForeldreansvarAndreLeddFP'
    : 'ToTrinnsForm.Foreldreansvar.VurderVilkarForeldreansvarAndreLeddES';
  return [<FormattedMessage id={aksjonspunktTextId} />];
};

const getFaktaOmBeregningText = (beregningDto) => {
  if (!beregningDto.faktaOmBeregningTilfeller) {
    return null;
  }
  const aksjonspunktTextIds = beregningDto.faktaOmBeregningTilfeller.map(({ kode }) => vurderFaktaOmBeregningTotrinnText[kode]);
  return aksjonspunktTextIds.map((aksjonspunktTextId) => (aksjonspunktTextId ? (
    <FormattedMessage
      id={aksjonspunktTextId}
    />
  ) : null));
};

const omgjoerTekstMap = {
  DELVIS_MEDHOLD_I_KLAGE: 'ToTrinnsForm.Klage.DelvisOmgjortTilGunst',
  GUNST_MEDHOLD_I_KLAGE: 'ToTrinnsForm.Klage.OmgjortTilGunst',
  UGUNST_MEDHOLD_I_KLAGE: 'ToTrinnsForm.Klage.OmgjortTilUgunst',
};


const getTextForKlageHelper = (klageVurderingResultat) => {
  let aksjonspunktTextId = '';
  switch (klageVurderingResultat.klageVurdering) {
    case klageVurderingCodes.STADFESTE_YTELSESVEDTAK:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.StadfesteYtelsesVedtak';
      break;
    case klageVurderingCodes.OPPHEVE_YTELSESVEDTAK:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.OppheveYtelsesVedtak';
      break;
    case klageVurderingCodes.AVVIS_KLAGE:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.Avvist';
      break;
    case klageVurderingCodes.HJEMSENDE_UTEN_Å_OPPHEVE:
      aksjonspunktTextId = 'ToTrinnsForm.Klage.HjemsendUtenOpphev';
      break;
    case klageVurderingCodes.MEDHOLD_I_KLAGE:
      if (klageVurderingResultat.klageVurderingOmgjoer
        && klageVurderingResultat.klageVurderingOmgjoer !== klageVurderingOmgjoerCodes.UDEFINERT) {
        aksjonspunktTextId = omgjoerTekstMap[klageVurderingResultat.klageVurderingOmgjoer];
        break;
      }
      aksjonspunktTextId = 'VedtakForm.ResultatKlageMedhold';
      break;
    default:
      break;
  }
  return <FormattedMessage id={aksjonspunktTextId} />;
};

const getTextForKlage = (klagebehandlingVurdering, behandlingStaus) => {
  if (behandlingStaus.kode === behandlingStatusCode.FATTER_VEDTAK) {
    if (klagebehandlingVurdering.klageVurderingResultatNK) {
      return getTextForKlageHelper(klagebehandlingVurdering.klageVurderingResultatNK);
    }
    if (klagebehandlingVurdering.klageVurderingResultatNFP) {
      return getTextForKlageHelper(klagebehandlingVurdering.klageVurderingResultatNFP);
    }
  }
  return null;
};

const buildAvklarAnnenForelderText = () => <FormattedMessage id="ToTrinnsForm.AvklarUttak.AnnenForelderHarRett" />;

const erKlageAksjonspunkt = (aksjonspunkt) => aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
  || aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK
  || aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP
  || aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA;

export const getAksjonspunktTextSelector = createSelector(
  [isForeldrepengerFagsak, getBehandlingKlageVurdering, getBehandlingStatus, getKodeverk(kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE)],
  (isForeldrepenger, klagebehandlingVurdering, behandlingStatus, arbeidsforholdHandlingTyper) => (aksjonspunkt) => {
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) {
      return buildOpptjeningText(aksjonspunkt);
    }
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE) {
      return [buildVarigEndringBeregningText(aksjonspunkt.beregningDto)];
    }
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN) {
      return getFaktaOmBeregningText(aksjonspunkt.beregningDto);
    }
    if (isUttakAksjonspunkt(aksjonspunkt.aksjonspunktKode) && aksjonspunkt.uttakPerioder && aksjonspunkt.uttakPerioder.length > 0) {
      return buildUttakText(aksjonspunkt);
    }

    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT) {
      return [buildAvklarAnnenForelderText()];
    }
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD) {
      return getTextForForeldreansvarsvilkåretAndreLedd(isForeldrepenger);
    }
    if (erKlageAksjonspunkt(aksjonspunkt)) {
      return [getTextForKlage(klagebehandlingVurdering, behandlingStatus)];
    }
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD) {
      return buildArbeidsforholdText(aksjonspunkt, arbeidsforholdHandlingTyper);
    }
    return [getTextFromAksjonspunktkode(aksjonspunkt)];
  },
);


export default getAksjonspunktTextSelector;
