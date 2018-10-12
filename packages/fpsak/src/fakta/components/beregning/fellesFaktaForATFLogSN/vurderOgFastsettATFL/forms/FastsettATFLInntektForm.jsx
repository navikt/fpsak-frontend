import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import {
  Element,
  Normaltekst,
} from 'nav-frontend-typografi';
import { required } from '@fpsak-frontend/utils/validation/validators';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import { InputField } from '@fpsak-frontend/form';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components/table';
import aktivitetStatus from '@fpsak-frontend/kodeverk/aktivitetStatus';
import {
  formatCurrencyNoKr,
  parseCurrencyInput,
  removeSpacesFromNumber,
  DDMMYYYY_DATE_FORMAT,
  createVisningsnavnForAktivitet,
} from '@fpsak-frontend/utils';
import faktaOmBeregningTilfelle, { erATFLSpesialtilfelle } from '@fpsak-frontend/kodeverk/faktaOmBeregningTilfelle';

import styles from './fastsettATFLInntektForm.less';

const inntektInputFieldName = 'fastsattInntekt';

export const createInputfieldKeyAT = (arbeidsforhold) => {
  const key = `${inntektInputFieldName}_${arbeidsforhold.virksomhetNavn}_${arbeidsforhold.virksomhetId}_${arbeidsforhold.startdato}`;
  return key;
};

export const createInputfieldKeyFL = () => `${inntektInputFieldName}_FL`;

const skalFastsetteATForholdInntekt = forhold => forhold !== undefined
  && (forhold.inntektPrMnd === null || forhold.inntektPrMnd === undefined);

const createFLTableRow = (frilansAndel, readOnly, isAksjonspunktClosed) => (
  <TableRow key="FLRow">
    <TableColumn>
      <Normaltekst>{frilansAndel.inntektskategori.navn}</Normaltekst>
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
    <TableColumn>
      <Normaltekst>{frilansAndel.inntektskategori ? frilansAndel.inntektskategori.navn : ''}</Normaltekst>
    </TableColumn>
  </TableRow>
);

const createTableRows = (frilansAndel, aktiviteter, readOnly, isAksjonspunktClosed) => {
  const rows = [];
  if (frilansAndel) {
    rows.push(createFLTableRow(frilansAndel, readOnly, isAksjonspunktClosed));
  }
  if (aktiviteter) {
    aktiviteter.forEach((aktivitet) => {
      rows.push(
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
        </TableRow>,
      );
    });
  }
  return rows;
};


const findInstruksjonForBruker = (tilfellerSomSkalFastsettes, manglerInntektsmelding) => {
  if (erATFLSpesialtilfelle(tilfellerSomSkalFastsettes)) {
    return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag';
  }
  if (tilfellerSomSkalFastsettes.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return manglerInntektsmelding === true
      ? 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag'
      : 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag';
  }
  if (tilfellerSomSkalFastsettes.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)) {
    return tilfellerSomSkalFastsettes.length === 1
      ? 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilans'
      : 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag';
  }
  return 'BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt';
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
        <FormattedMessage id={findInstruksjonForBruker(tilfellerSomSkalFastsettes, manglerInntektsmelding)} />
      </Element>
      )
      }
      <VerticalSpacer space={2} />
      <Table headerTextCodes={headerTextCodes} noHover classNameTable={styles.inntektTable}>
        {createTableRows(frilansAndel, arbeidsforholdSomSkalFastsettes, readOnly, isAksjonspunktClosed)}
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

};

FastsettATFLInntektForm.defaultProps = {
  arbeidsforholdSomSkalFastsettes: PropTypes.arrayOf(PropTypes.shape()),
  manglerInntektsmelding: undefined,
  frilansAndel: undefined,
};

const slaSammenATListerSomSkalVurderes = (faktaOmBeregning) => {
  const andelsNrLagtIListen = [];
  const listeMedArbeidsforholdSomSkalFastsettes = [];
  if (faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM) {
    faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM.forEach((forhold) => {
      if (!andelsNrLagtIListen.includes(forhold.andelsnr)) {
        andelsNrLagtIListen.push(forhold.andelsnr);
        listeMedArbeidsforholdSomSkalFastsettes.push(forhold);
      }
    });
  }
  if (faktaOmBeregning.atogFLISammeOrganisasjonListe) {
    faktaOmBeregning.atogFLISammeOrganisasjonListe.forEach((forhold) => {
      if (!andelsNrLagtIListen.includes(forhold.andelsnr)) {
        andelsNrLagtIListen.push(forhold.andelsnr);
        listeMedArbeidsforholdSomSkalFastsettes.push(forhold);
      }
    });
  }
  return listeMedArbeidsforholdSomSkalFastsettes.length === 0 ? null : listeMedArbeidsforholdSomSkalFastsettes;
};

const harFrilansinntektBlittFastsattTidligere = frilansAndel => frilansAndel
&& (frilansAndel.erNyoppstartetEllerSammeOrganisasjon === true || frilansAndel.beregnetPrAar);

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

  if (faktaOmBeregning.atogFLISammeOrganisasjonListe !== null) {
    faktaOmBeregning.atogFLISammeOrganisasjonListe.forEach((aktivitet) => {
      const korrektAndel = finnKorrektBGAndelFraFaktaOmBeregningAndel(aktivitet, beregningsgrunnlag);
      if (korrektAndel && korrektAndel.beregnetPrAar !== null && korrektAndel.beregnetPrAar !== undefined) {
        const key = createInputfieldKeyAT(aktivitet.arbeidsforhold);
        initialValues[key] = formatCurrencyNoKr(korrektAndel.beregnetPrAar / 12);
      }
    });
  }
  if (faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM !== null) {
    faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM.forEach((aktivitet) => {
      const korrektAndel = finnKorrektBGAndelFraFaktaOmBeregningAndel(aktivitet, beregningsgrunnlag);
      if (korrektAndel !== undefined && korrektAndel.lonnsendringIBeregningsperioden === true) {
        const key = createInputfieldKeyAT(aktivitet.arbeidsforhold);
        initialValues[key] = formatCurrencyNoKr(korrektAndel.beregnetPrAar / 12);
      }
    });
  }

  if (harFrilansinntektBlittFastsattTidligere(frilansAndel)) {
    const key = createInputfieldKeyFL();
    initialValues[key] = formatCurrencyNoKr(frilansAndel.beregnetPrAar / 12);
  }
  return initialValues;
};

const transformValuesFL = (values) => {
  const key = createInputfieldKeyFL();
  return removeSpacesFromNumber(values[key]);
};

const transformValuesAT = (values, faktaOmBeregning) => {
  const arbeidsforholdSomSkalSubmittes = slaSammenATListerSomSkalVurderes(faktaOmBeregning);
  const listeMedFastsatteMaanedsinntekter = [];
  arbeidsforholdSomSkalSubmittes.forEach((aktivitet) => {
    if (!aktivitet.inntektPrMnd) {
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

FastsettATFLInntektForm.transformValues = (values, faktaOmBeregning, aktueltTilfelle) => {
  if (aktueltTilfelle === faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL) {
    return {
      fastsettMaanedsinntektFL: { maanedsinntekt: transformValuesFL(values) },
    };
  }
  if (aktueltTilfelle === faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_VED_LONNSENDRING) {
    return {
      fastsatteLonnsendringer: { vurderLønnsendringAndelListe: transformValuesAT(values, faktaOmBeregning) },
    };
  }
  if (aktueltTilfelle === faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON) {
    const andelsliste = transformValuesAT(values, faktaOmBeregning);
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

const mapStateToProps = (state, ownProps) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  const { tilfellerSomSkalFastsettes } = ownProps;
  if (!faktaOmBeregning || tilfellerSomSkalFastsettes === undefined || tilfellerSomSkalFastsettes.length < 1) {
    return {};
  }
  const arbeidsforholdSomSkalFastsettes = slaSammenATListerSomSkalVurderes(faktaOmBeregning);
  const tabellVisesUtenVurdering = !tilfellerSomSkalFastsettes.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)
    && !tilfellerSomSkalFastsettes.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_VED_LONNSENDRING);

  return {
    tabellVisesUtenVurdering,
    arbeidsforholdSomSkalFastsettes,
    frilansAndel: faktaOmBeregning.frilansAndel,
  };
};

export default connect(mapStateToProps)(FastsettATFLInntektForm);
