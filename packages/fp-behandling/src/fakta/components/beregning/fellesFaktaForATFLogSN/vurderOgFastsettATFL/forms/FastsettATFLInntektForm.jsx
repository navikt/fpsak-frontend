import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { getFaktaOmBeregning, getBeregningsgrunnlag } from 'behandlingFpsak/src/behandlingSelectors';
import {
  required, createVisningsnavnForAktivitet, DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import { InputField } from '@fpsak-frontend/form';
import {
  VerticalSpacer, Table, TableRow, TableColumn,
} from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle, {
  erATFLSpesialtilfelle,
  harKunATFLISammeOrgUtenBestebergning,
  harVurderMottarYtelseUtenBesteberegning,
  fastsettATLIntersection,
} from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { andelsnrMottarYtelseMap, frilansMottarYtelse } from './VurderMottarYtelseUtils';
import styles from './fastsettATFLInntektForm.less';
import { getFormValuesForBeregning } from '../../../BeregningFormUtils';

const inntektInputFieldName = 'fastsattInntekt';

export const createInputfieldKeyAT = (arbeidsforhold) => {
  const key = `${inntektInputFieldName}_${arbeidsforhold.arbeidsgiverNavn}_${arbeidsforhold.startdato}_${arbeidsforhold.arbeidsforholdId}`;
  return key;
};

export const createInputfieldKeyFL = () => `${inntektInputFieldName}_FL`;

const skalFastsetteATForholdInntekt = (forhold) => {
  if (forhold !== undefined) {
    if (forhold.redigerbar) {
      return true;
    }
    return (forhold.inntektPrMnd === null || forhold.inntektPrMnd === undefined);
  }
  return false;
};

const skalFastsetteMinstEttATForhold = arbeidsforholdListe => (arbeidsforholdListe !== null
  && arbeidsforholdListe.find(forhold => skalFastsetteATForholdInntekt(forhold)) !== undefined);

const skalFastsetteFrilansinntekt = (frilans) => {
  if (frilans !== undefined) {
    if (!frilans.redigerbar) {
      return false;
    }
    return true;
  }
  return false;
};

const createFLTableRow = (frilansAndel, readOnly, isAksjonspunktClosed) => (
  <TableRow key="FLRow">
    <TableColumn>
      <Normaltekst>{frilansAndel.inntektskategori ? frilansAndel.inntektskategori.navn : ''}</Normaltekst>
    </TableColumn>
    <TableColumn>
      {frilansAndel.arbeidsforhold && frilansAndel.arbeidsforhold.startdato
      && (
      <Normaltekst>
        <FormattedMessage
          id="BeregningInfoPanel.VurderOgFastsettATFL.Periode"
          values={{
            fom: moment(frilansAndel.arbeidsforhold.startdato).format(DDMMYYYY_DATE_FORMAT),
            tom: frilansAndel && frilansAndel.arbeidsforhold && frilansAndel.arbeidsforhold.opphoersdato
              ? moment(frilansAndel.arbeidsforhold.opphoersdato).format(DDMMYYYY_DATE_FORMAT) : '',
          }}
        />
      </Normaltekst>
      )
      }
    </TableColumn>
    {skalFastsetteFrilansinntekt(frilansAndel)
    && (
      <TableColumn>
        <div className={readOnly ? styles.adjustedFieldInput : styles.rightAlignInput}>
          <InputField
            name={createInputfieldKeyFL()}
            bredde="S"
            validate={[required]}
            parse={parseCurrencyInput}
            isEdited={isAksjonspunktClosed}
            readOnly={readOnly}
          />
        </div>
      </TableColumn>
    )
    }
    {!skalFastsetteFrilansinntekt(frilansAndel)
    && (
      <TableColumn>
        <div className={styles.shortLeftAligned}>
          <div className={styles.rightAlignText}>
            <Normaltekst>{formatCurrencyNoKr(frilansAndel.inntektPrMnd)}</Normaltekst>
          </div>
        </div>

      </TableColumn>
    )
    }
    <TableColumn>
      <div className={styles.paddingRight}>
        <Normaltekst>{frilansAndel.inntektskategori ? frilansAndel.inntektskategori.navn : ''}</Normaltekst>
      </div>
    </TableColumn>
  </TableRow>
);

const createATTableRow = (aktivitet, readOnly, isAksjonspunktClosed) => (
  <TableRow key={createInputfieldKeyAT(aktivitet.arbeidsforhold)}>
    <TableColumn>
      <Normaltekst>{createVisningsnavnForAktivitet(aktivitet.arbeidsforhold)}</Normaltekst>
    </TableColumn>
    <TableColumn>
      {aktivitet.arbeidsforhold && aktivitet.arbeidsforhold.startdato
      && (
        <Normaltekst>
          <FormattedMessage
            id="BeregningInfoPanel.VurderOgFastsettATFL.Periode"
            values={{
              fom: moment(aktivitet.arbeidsforhold.startdato).format(DDMMYYYY_DATE_FORMAT),
              tom: aktivitet.arbeidsforhold.opphoersdato ? moment(aktivitet.arbeidsforhold.opphoersdato).format(DDMMYYYY_DATE_FORMAT) : '',
            }}
          />
        </Normaltekst>
      )
      }
    </TableColumn>
    {skalFastsetteATForholdInntekt(aktivitet)
    && (
      <TableColumn className={readOnly ? styles.adjustedFieldInput : styles.rightAlignInput}>
        <InputField
          name={createInputfieldKeyAT(aktivitet.arbeidsforhold)}
          bredde="S"
          validate={[required]}
          parse={parseCurrencyInput}
          isEdited={isAksjonspunktClosed}
          readOnly={readOnly}
        />
      </TableColumn>
    )
    }
    {!skalFastsetteATForholdInntekt(aktivitet)
    && (
      <TableColumn>
        <div className={styles.rightAlignText}>
          <Normaltekst>{formatCurrencyNoKr(aktivitet.inntektPrMnd)}</Normaltekst>
        </div>
      </TableColumn>
    )
    }
    <TableColumn>
      <Normaltekst>{aktivitet.inntektskategori ? aktivitet.inntektskategori.navn : ''}</Normaltekst>
    </TableColumn>
  </TableRow>
);

const createTableRows = (frilansAndel, aktiviteter, readOnly, isAksjonspunktClosed, skalViseFL, skalViseAT) => {
  const rows = [];
  if (frilansAndel && skalViseFL) {
    rows.push(createFLTableRow(frilansAndel, readOnly, isAksjonspunktClosed));
  }
  if (aktiviteter && skalViseAT) {
    aktiviteter.forEach((aktivitet) => {
      rows.push(createATTableRow(aktivitet, readOnly, isAksjonspunktClosed));
    });
  }
  return rows;
};


const findInstruksjonForBruker = (tilfellerSomSkalFastsettes, manglerInntektsmelding, skalFastsetteFL, skalFastsetteAT) => {
  if (erATFLSpesialtilfelle(tilfellerSomSkalFastsettes)) {
    return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag';
  }
  if (harVurderMottarYtelseUtenBesteberegning(tilfellerSomSkalFastsettes)) {
    const fastsetteATFLIntersection = fastsettATLIntersection(tilfellerSomSkalFastsettes);
    if (skalFastsetteFL) {
      if (!skalFastsetteAT) {
        return fastsetteATFLIntersection.length === 1
          ? 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilans'
          : 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag';
      }
      return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag';
    }
    if (skalFastsetteAT) {
      return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt';
    }
    return ' ';
  }
  if (tilfellerSomSkalFastsettes.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return manglerInntektsmelding === true
      ? 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag'
      : 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag';
  }
  if (skalFastsetteFL) {
    return tilfellerSomSkalFastsettes.length === 1
      ? 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilans'
      : 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag';
  }
  if (skalFastsetteAT) {
    return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt';
  }
  return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag';
};

const lagInstruksjonForBrukerUtenVurdering = (manglerInntektsmelding) => {
  if (manglerInntektsmelding) {
    return (
      <div>
        <Normaltekst>
          <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM" />
        </Normaltekst>
        <Normaltekst>
          <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag" />
        </Normaltekst>
      </div>
    );
  }
  return (
    <div>
      <Normaltekst>
        <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrg" />
      </Normaltekst>
      <Normaltekst>
        <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag" />
      </Normaltekst>
    </div>
  );
};


/**
 * FastsettATFLInntektForm
 *
 * Presentasjonskomponent. Inneholder inntektstabellen som brukes til å fastsette innteker for frilansere og arbeidstakere.
 * Kan vises av komponentene LonnsendringForm, NyoppstartetFLForm eller
 * direkte av VurderOgFastsettATFL dersom ingen forhåndsvurdering er nødvendig.
 */
const FastsettATFLInntektForm = ({
  readOnly,
  isAksjonspunktClosed,
  tilfellerSomSkalFastsettes,
  arbeidsforholdSomSkalFastsettes,
  frilansAndel,
  manglerInntektsmelding,
  tabellVisesUtenVurdering,
  skalViseFL,
  skalViseAT,
}) => {
  const headerTextCodes = [
    'BeregningInfoPanel.FastsettInntektTabell.Aktivitet',
    'BeregningInfoPanel.FastsettInntektTabell.Arbeidsperiode',
    'BeregningInfoPanel.FastsettInntektTabell.InntektPrMnd',
    'BeregningInfoPanel.FastsettInntektTabell.Inntektskategori',
  ];
  return (
    <div className={!tabellVisesUtenVurdering ? styles.paddingRundtTabell : undefined}>
      {tabellVisesUtenVurdering
      && (
      <div>
        {lagInstruksjonForBrukerUtenVurdering(manglerInntektsmelding)}
      </div>
      )
      }
      {!tabellVisesUtenVurdering
      && (
      <Element>
        <FormattedMessage id={findInstruksjonForBruker(tilfellerSomSkalFastsettes, manglerInntektsmelding,
          skalFastsetteFrilansinntekt(frilansAndel), skalFastsetteMinstEttATForhold(arbeidsforholdSomSkalFastsettes))}
        />
      </Element>
      )
      }
      <VerticalSpacer space={2} />
      <Table headerTextCodes={headerTextCodes} noHover classNameTable={styles.inntektTable}>
        {createTableRows(frilansAndel, arbeidsforholdSomSkalFastsettes, readOnly, isAksjonspunktClosed, skalViseFL, skalViseAT)}
      </Table>
    </div>
  );
};

FastsettATFLInntektForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  tilfellerSomSkalFastsettes: PropTypes.arrayOf(PropTypes.string).isRequired,
  tabellVisesUtenVurdering: PropTypes.bool.isRequired,
  manglerInntektsmelding: PropTypes.bool,
  frilansAndel: PropTypes.shape(),
  arbeidsforholdSomSkalFastsettes: PropTypes.arrayOf(PropTypes.shape()),
  skalViseFL: PropTypes.bool,
  skalViseAT: PropTypes.bool,
};

FastsettATFLInntektForm.defaultProps = {
  arbeidsforholdSomSkalFastsettes: PropTypes.arrayOf(PropTypes.shape()),
  manglerInntektsmelding: undefined,
  frilansAndel: undefined,
  skalViseFL: true,
  skalViseAT: true,
};

const slaSammenATListerSomSkalVurderes = (values, faktaOmBeregning, beregningsgrunnlag) => {
  const andelsNrLagtIListen = [];
  const listeMedArbeidsforholdSomSkalFastsettes = [];
  const mottarYtelseMap = andelsnrMottarYtelseMap(values, faktaOmBeregning.vurderMottarYtelse, beregningsgrunnlag);
  if (faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM) {
    faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM.forEach((forhold) => {
      if (!andelsNrLagtIListen.includes(forhold.andelsnr)) {
        const arbforhold = {
          ...forhold,
          redigerbar: mottarYtelseMap[forhold.andelsnr],
        };
        andelsNrLagtIListen.push(forhold.andelsnr);
        listeMedArbeidsforholdSomSkalFastsettes.push(arbforhold);
      }
    });
  }
  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe) {
    faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.forEach((forhold) => {
      if (!andelsNrLagtIListen.includes(forhold.andelsnr)) {
        const arbforhold = {
          ...forhold,
          redigerbar: mottarYtelseMap[forhold.andelsnr],
        };
        andelsNrLagtIListen.push(forhold.andelsnr);
        listeMedArbeidsforholdSomSkalFastsettes.push(arbforhold);
      }
    });
  }
  if (faktaOmBeregning.vurderMottarYtelse) {
    faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM.forEach((andel) => {
      if (!andelsNrLagtIListen.includes(andel.andelsnr)) {
        const forhold = {
          ...andel,
          redigerbar: mottarYtelseMap[andel.andelsnr],
        };
        andelsNrLagtIListen.push(andel.andelsnr);
        listeMedArbeidsforholdSomSkalFastsettes.push(forhold);
      }
    });
  }

  return listeMedArbeidsforholdSomSkalFastsettes.length === 0 ? null : listeMedArbeidsforholdSomSkalFastsettes;
};

const harFrilansinntektBlittFastsattTidligere = frilansAndel => frilansAndel
&& ((frilansAndel.fastsattAvSaksbehandler && frilansAndel.beregnetPrAar !== undefined && frilansAndel.beregnetPrAar !== null)
 || frilansAndel.erNyoppstartetEllerSammeOrganisasjon === true);

const finnKorrektBGAndelFraFaktaOmBeregningAndel = (faktaOmBeregningAndel, beregningsgrunnlag) => {
  const forstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode
    ? beregningsgrunnlag.beregningsgrunnlagPeriode[0] : undefined;
  return forstePeriode
    ? forstePeriode.beregningsgrunnlagPrStatusOgAndel.find(andel => andel.andelsnr === faktaOmBeregningAndel.andelsnr) : undefined;
};


FastsettATFLInntektForm.buildInitialValues = (beregningsgrunnlag) => {
  const initialValues = {};
  const faktaOmBeregning = beregningsgrunnlag ? beregningsgrunnlag.faktaOmBeregning : undefined;
  if (!beregningsgrunnlag || !faktaOmBeregning || !beregningsgrunnlag.beregningsgrunnlagPeriode
    || beregningsgrunnlag.beregningsgrunnlagPeriode.length < 1) {
    return initialValues;
  }

  const frilansAndel = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
    .find(andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);

  if (faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe) {
    faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.forEach((aktivitet) => {
      const korrektAndel = finnKorrektBGAndelFraFaktaOmBeregningAndel(aktivitet, beregningsgrunnlag);
      if (korrektAndel && korrektAndel.beregnetPrAar !== null && korrektAndel.beregnetPrAar !== undefined && korrektAndel.fastsattAvSaksbehandler) {
        const key = createInputfieldKeyAT(aktivitet.arbeidsforhold);
        initialValues[key] = formatCurrencyNoKr(korrektAndel.beregnetPrAar / 12);
      }
    });
  }
  if (faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM) {
    faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM.forEach((aktivitet) => {
      const korrektAndel = finnKorrektBGAndelFraFaktaOmBeregningAndel(aktivitet, beregningsgrunnlag);
      if (korrektAndel !== undefined && korrektAndel.lonnsendringIBeregningsperioden === true && korrektAndel.fastsattAvSaksbehandler) {
        const key = createInputfieldKeyAT(aktivitet.arbeidsforhold);
        initialValues[key] = formatCurrencyNoKr(korrektAndel.beregnetPrAar / 12);
      }
    });
  }
  if (faktaOmBeregning.vurderMottarYtelse) {
    faktaOmBeregning.vurderMottarYtelse.arbeidstakerAndelerUtenIM.forEach((aktivitet) => {
      const korrektAndel = finnKorrektBGAndelFraFaktaOmBeregningAndel(aktivitet, beregningsgrunnlag);
      if (korrektAndel) {
        const key = createInputfieldKeyAT(aktivitet.arbeidsforhold);
        if (korrektAndel.fastsattAvSaksbehandler && korrektAndel.beregnetPrAar !== null && korrektAndel.beregnetPrAar !== undefined) {
          initialValues[key] = formatCurrencyNoKr(korrektAndel.beregnetPrAar / 12);
        }
      }
    });
  }

  const frilansKey = createInputfieldKeyFL();
  if (harFrilansinntektBlittFastsattTidligere(frilansAndel)) {
    initialValues[frilansKey] = formatCurrencyNoKr(frilansAndel.beregnetPrAar / 12);
  }
  return initialValues;
};

const transformValuesFL = (values) => {
  const key = createInputfieldKeyFL();
  const inntektUtenFormat = values[key];
  return inntektUtenFormat ? removeSpacesFromNumber(inntektUtenFormat) : undefined;
};

const transformValuesAT = (values, faktaOmBeregning, beregningsgrunnlag) => {
  const arbeidsforholdSomSkalSubmittes = slaSammenATListerSomSkalVurderes(values, faktaOmBeregning, beregningsgrunnlag);
  const listeMedFastsatteMaanedsinntekter = [];
  arbeidsforholdSomSkalSubmittes.forEach((aktivitet) => {
    if (!aktivitet.inntektPrMnd || aktivitet.redigerbar) {
      const inputField = createInputfieldKeyAT(aktivitet.arbeidsforhold);
      const inntektUtenFormat = values[inputField];
      listeMedFastsatteMaanedsinntekter.push({
        andelsnr: aktivitet.andelsnr,
        arbeidsinntekt: inntektUtenFormat ? removeSpacesFromNumber(inntektUtenFormat) : undefined,
      });
    }
  });
  return listeMedFastsatteMaanedsinntekter;
};

FastsettATFLInntektForm.eraseValuesFL = () => ({
  fastsettMaanedsinntektFL: null,
});

FastsettATFLInntektForm.eraseValuesAT = () => ({
  fastsettMaanedsinntektFL: null,
});

FastsettATFLInntektForm.transformValues = (values, faktaOmBeregning, aktueltTilfelle, beregningsgrunnlag) => {
  if (aktueltTilfelle === faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL) {
    return {
      fastsettMaanedsinntektFL: { maanedsinntekt: transformValuesFL(values) },
    };
  }
  if (aktueltTilfelle === faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING) {
    return {
      fastsattUtenInntektsmelding: { andelListe: transformValuesAT(values, faktaOmBeregning, beregningsgrunnlag) },
    };
  }
  if (aktueltTilfelle === faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON) {
    const andelsliste = transformValuesAT(values, faktaOmBeregning, beregningsgrunnlag);
    andelsliste.push({
      andelsnr: faktaOmBeregning.frilansAndel.andelsnr,
      arbeidsinntekt: transformValuesFL(values),
    });
    return {
      vurderATogFLiSammeOrganisasjon: { vurderATogFLiSammeOrganisasjonAndelListe: andelsliste },
    };
  }
  return {};
};

const lagFrilansAndel = (values, faktaOmBeregning, erNyoppstartetFL) => {
  if (faktaOmBeregning.vurderMottarYtelse) {
    if (faktaOmBeregning.vurderMottarYtelse.erFrilans) {
      const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode);
      return {
        ...faktaOmBeregning.frilansAndel,
        inntektPrMnd: tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
          ? null : faktaOmBeregning.vurderMottarYtelse.frilansInntektPrMnd,
        redigerbar: frilansMottarYtelse(values) === true || tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
        || erNyoppstartetFL === true,
      };
    }
  }
  if (faktaOmBeregning.frilansAndel) {
    return {
      ...faktaOmBeregning.frilansAndel,
      redigerbar: true,
    };
  }
  return undefined;
};

const mapStateToProps = (state, ownProps) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  const { tilfellerSomSkalFastsettes } = ownProps;
  if (!faktaOmBeregning || tilfellerSomSkalFastsettes === undefined || tilfellerSomSkalFastsettes.length < 1) {
    return {};
  }
  const values = getFormValuesForBeregning(state);
  const beregningsgrunnlag = getBeregningsgrunnlag(state);
  const arbeidsforholdSomSkalFastsettes = slaSammenATListerSomSkalVurderes(values, faktaOmBeregning, beregningsgrunnlag);
  const tabellVisesUtenVurdering = harKunATFLISammeOrgUtenBestebergning(tilfellerSomSkalFastsettes);
  return {
    tabellVisesUtenVurdering,
    arbeidsforholdSomSkalFastsettes,
    frilansAndel: lagFrilansAndel(values, faktaOmBeregning, ownProps.erNyoppstartetFL),
  };
};

export default connect(mapStateToProps)(FastsettATFLInntektForm);
