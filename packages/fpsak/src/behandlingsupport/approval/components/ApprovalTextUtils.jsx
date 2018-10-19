import React from 'react';
import moment from 'moment';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { getFagsakYtelseType, isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import klageVurdering from 'kodeverk/klageVurdering';
import {
  getBehandlingKlageVurderingResultatNFP,
  getBehandlingKlageVurderingResultatNK,
  getBehandlingsresultat,
} from 'behandling/behandlingSelectors';

import totrinnskontrollaksjonspunktTextCodes from '../totrinnskontrollaksjonspunktTextCodes';
import vurderFaktaOmBeregningTotrinnText from '../VurderFaktaBeregningTotrinnText';
import aksjonspunktCodes, { isUttakAksjonspunkt } from '../../../kodeverk/aksjonspunktCodes';
import OpptjeningTotrinnText from './OpptjeningTotrinnText';
import { findAvslagResultatText } from '../../../behandlingsprosess/components/vedtak/VedtakHelper';

export const isMeholdIKlage = (klageVurderingResultatNFP, klageVurderingResultatNK) => {
  const meholdIKlageAvNFP = klageVurderingResultatNFP
    && klageVurderingResultatNFP.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE;
  const meholdIKlageAvNK = klageVurderingResultatNK
    && klageVurderingResultatNK.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE;

  return meholdIKlageAvNFP || meholdIKlageAvNK;
};

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const buildVarigEndringBeregningText = beregningDto => (beregningDto.fastsattVarigEndringNaering ? (
  <FormattedMessage
    id="ToTrinnsForm.Beregning.VarigEndring"
  />
) : (
  <FormattedMessage
    id="ToTrinnsForm.Beregning.IkkeVarigEndring"
  />
));

const buildArbeidsforholdText = aksjonspunkt => aksjonspunkt.arbeidforholdDtos.map(
  arbeidforholdDto => (
    <FormattedHTMLMessage
      id="ToTrinnsForm.OpplysningerOmSøker.Arbeidsforhold"
      values={
        {
          orgnavn: arbeidforholdDto.navn,
          orgnummer: arbeidforholdDto.organisasjonsnummer,
          arbeidsforholdId: arbeidforholdDto.arbeidsforholdId ? `...${arbeidforholdDto.arbeidsforholdId.slice(-4)}` : '',
          melding: arbeidforholdDto.arbeidsforholdHandlingType.navn,
        }
      }
    />
  ),
);

const buildUttakText = aksjonspunkt => aksjonspunkt.uttakPerioder.map((uttakperiode) => {
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

const buildOpptjeningText = aksjonspunkt => aksjonspunkt.opptjeningAktiviteter.map(aktivitet => (
  <OpptjeningTotrinnText
    aktivitet={aktivitet}
  />));

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
  return aksjonspunktTextIds.map(aksjonspunktTextId => (aksjonspunktTextId ? (
    <FormattedMessage
      id={aksjonspunktTextId}
    />
  ) : null));
};

const getTextForKlage = (klageVurderingResultatNK, klageVurderingResultatNFP, ytelseType, behandlingsresultat) => {
  if (isMeholdIKlage(klageVurderingResultatNFP, klageVurderingResultatNK)) {
    return <FormattedMessage id="VedtakForm.ResultatKlageMedhold" />;
  }
  return <FormattedMessage id={findAvslagResultatText(behandlingsresultat.type.kode, ytelseType)} />;
};

const erKlageAksjonspunkt = aksjonspunkt => aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
  || aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK;


export const getAksjonspunktTextSelector = createSelector(
  [isForeldrepengerFagsak, getBehandlingKlageVurderingResultatNK, getBehandlingKlageVurderingResultatNFP, getFagsakYtelseType, getBehandlingsresultat],
  (isForeldrepenger, klageVurderingResultatNK, klageVurderingResultatNFP, ytelseType, behandlingsresultat) => (aksjonspunkt) => {
    if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) {
      return buildOpptjeningText(aksjonspunkt);
    } if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE) {
      return [buildVarigEndringBeregningText(aksjonspunkt.beregningDto)];
    } if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN) {
      return getFaktaOmBeregningText(aksjonspunkt.beregningDto);
    } if (isUttakAksjonspunkt(aksjonspunkt.aksjonspunktKode)) {
      return buildUttakText(aksjonspunkt);
    } if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD) {
      return getTextForForeldreansvarsvilkåretAndreLedd(isForeldrepenger);
    } if (erKlageAksjonspunkt(aksjonspunkt)) {
      return [getTextForKlage(klageVurderingResultatNK, klageVurderingResultatNFP, ytelseType, behandlingsresultat)];
    } if (aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD) {
      return buildArbeidsforholdText(aksjonspunkt);
    }
    return [getTextFromAksjonspunktkode(aksjonspunkt)];
  },
);


export default getAksjonspunktTextSelector;
