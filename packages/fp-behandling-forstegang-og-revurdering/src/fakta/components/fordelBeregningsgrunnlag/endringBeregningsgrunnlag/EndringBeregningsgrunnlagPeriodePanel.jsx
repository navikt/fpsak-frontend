import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT,
 formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import classnames from 'classnames/bind';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';


import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop, settReadOnlyBelop,
  erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon, andelErStatusFLOgHarATISammeOrg, starterPaaEllerEtterStp,
} from '../BgFordelingUtils';

import styles from './endringBeregningsgrunnlagPeriodePanel.less';

const classNames = classnames.bind(styles);

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const renderDateHeading = (fom, tom) => {
  if (!tom) {
    return (
      <Element>
        <FormattedMessage
          id="BeregningInfoPanel.EndringBG.PeriodeFom"
          values={{ fom: formatDate(fom) }}
        />
      </Element>
    );
  }
  return (
    <Element>
      <FormattedMessage
        id="BeregningInfoPanel.EndringBG.PeriodeFomOgTom"
        values={{ fom: formatDate(fom), tom: formatDate(tom) }}
      />
    </Element>
  );
};

/**
 * EndringBeregningsgrunnlagPeriodePanel
 *
 * Presentasjonskomponent. Viser ekspanderbart panel for perioder i nytt/endret beregningsgrunnlag
 */

const EndringBeregningsgrunnlagPeriodePanel = ({
  readOnly,
  endringBGFieldArrayName,
  fom,
  tom,
  harPeriodeAarsakGraderingEllerRefusjon,
  isAksjonspunktClosed,
  open,
  showPanel,
}) => (
  <EkspanderbartpanelPure
    className={readOnly ? styles.statusOk : classNames(`endringBeregningsgrunnlagPeriode--${fom}`)}
    tittel={renderDateHeading(fom, tom)}
    apen={open}
    onClick={() => showPanel(fom)}
  >
    <FieldArray
      name={endringBGFieldArrayName}
      component={RenderEndringBGFieldArray}
      readOnly={readOnly}
      periodeUtenAarsak={!harPeriodeAarsakGraderingEllerRefusjon}
      isAksjonspunktClosed={isAksjonspunktClosed}
    />
  </EkspanderbartpanelPure>
);

EndringBeregningsgrunnlagPeriodePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  endringBGFieldArrayName: PropTypes.string.isRequired,
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string,
  open: PropTypes.bool,
  harPeriodeAarsakGraderingEllerRefusjon: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  showPanel: PropTypes.func.isRequired,
};

EndringBeregningsgrunnlagPeriodePanel.defaultProps = {
  open: null,
  tom: null,
};


EndringBeregningsgrunnlagPeriodePanel.validate = (values, sumIPeriode, skalValidereMotRapportert,
  skalValidereInntektMotRefusjon, getKodeverknavn) => RenderEndringBGFieldArray
  .validate(values, sumIPeriode, skalValidereMotRapportert, skalValidereInntektMotRefusjon, getKodeverknavn);

const finnRiktigAndel = (andel, bgPeriode) => bgPeriode.beregningsgrunnlagPrStatusOgAndel.find(a => a.andelsnr === andel.andelsnr);

const erArbeidstakerMedArbeidsforhold = bgAndel => (bgAndel.aktivitetStatus.kode === aktivitetStatuser.ARBEIDSTAKER && bgAndel.arbeidsforhold);

const finnRegister = (andel, bgAndel, skjaeringstidspunktBeregning, faktaOmFordeling) => {
  if (erArbeidstakerMedArbeidsforhold(bgAndel)
  && (andel.nyttArbeidsforhold || starterPaaEllerEtterStp(bgAndel, skjaeringstidspunktBeregning))) {
    return null;
  }
  if (erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon(bgAndel, faktaOmFordeling)) {
    return null;
  }
  if (andelErStatusFLOgHarATISammeOrg(bgAndel, faktaOmFordeling)) {
    return null;
  }
  if (andel.belopFraInntektsmeldingPrAar || andel.belopFraInntektsmeldingPrAar === 0) {
    return formatCurrencyNoKr(andel.belopFraInntektsmeldingPrAar);
  }
  if (bgAndel && (bgAndel.belopPrAarEtterAOrdningen || bgAndel.belopPrAarEtterAOrdningen === 0)) {
    return formatCurrencyNoKr(bgAndel.belopPrAarEtterAOrdningen);
  }
  return bgAndel && bgAndel.belopFraMeldekortPrAar ? formatCurrencyNoKr(bgAndel.belopFraMeldekortPrAar) : null;
};

EndringBeregningsgrunnlagPeriodePanel.buildInitialValues = (periode, bgPeriode, skjaeringstidspunktBeregning,
  faktaOmFordeling, harKunYtelse, getKodeverknavn) => {
  if (!periode || !periode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.endringBeregningsgrunnlagAndeler
    .filter(({ aktivitetStatus }) => aktivitetStatus.kode !== aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE)
    .map((andel) => {
      const bgAndel = andel.lagtTilAvSaksbehandler ? undefined : finnRiktigAndel(andel, bgPeriode);
      return ({
      ...setGenerellAndelsinfo(andel, harKunYtelse, getKodeverknavn),
      ...setArbeidsforholdInitialValues(andel),
      andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
      fordelingForrigeBehandling: andel.fordelingForrigeBehandlingPrAar || andel.fordelingForrigeBehandlingPrAar === 0
        ? formatCurrencyNoKr(andel.fordelingForrigeBehandlingPrAar) : '',
      fastsattBelop: settFastsattBelop(andel.beregnetPrAar, andel.fastsattForrigePrAar, andel.fastsattAvSaksbehandler),
      readOnlyBelop: settReadOnlyBelop(finnRegister(andel, bgAndel, skjaeringstidspunktBeregning, faktaOmFordeling), andel.belopFraInntektsmeldingPrAar),
      refusjonskrav: andel.refusjonskravPrAar !== null && andel.refusjonskravPrAar !== undefined ? formatCurrencyNoKr(andel.refusjonskravPrAar) : '',
      skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon && !andel.lagtTilAvSaksbehandler
      && andel.refusjonskravFraInntektsmeldingPrAar ? periode.skalKunneEndreRefusjon : false,
      belopFraInntektsmelding: andel.belopFraInntektsmeldingPrAar,
      harPeriodeAarsakGraderingEllerRefusjon: periode.harPeriodeAarsakGraderingEllerRefusjon,
      refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmeldingPrAar,
      registerInntekt: andel.lagtTilAvSaksbehandler ? null : finnRegister(andel, bgAndel, skjaeringstidspunktBeregning, faktaOmFordeling),
      nyttArbeidsforhold: andel.nyttArbeidsforhold || starterPaaEllerEtterStp(bgAndel, skjaeringstidspunktBeregning),
    });
})
  );
};

export default EndringBeregningsgrunnlagPeriodePanel;
