import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import classnames from 'classnames/bind';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';
import { createEndringHeadingForDate, renderDateHeading } from './EndretBeregningsgrunnlagUtils';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop, settReadOnlyBelop,
  erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon, andelErStatusFLOgHarATISammeOrg,
} from '../BgFordelingUtils';

import styles from './endringBeregningsgrunnlagPeriodePanel.less';


const classNames = classnames.bind(styles);


/**
 * EndringBeregningsgrunnlagPeriodePanel
 *
 * Presentasjonskomponent. Viser ekspanderbart panel for perioder i nytt/endret beregningsgrunnlag
 */

const EndringBeregningsgrunnlagPeriodePanelImpl = ({
  readOnly,
  endringBGFieldArrayName,
  fom,
  harPeriodeAarsakGraderingEllerRefusjon,
  isAksjonspunktClosed,
  open,
  showPanel,
  heading,
}) => (
  <EkspanderbartpanelPure
    className={readOnly ? styles.statusOk : classNames(`endringBeregningsgrunnlagPeriode--${fom}`)}
    tittel={heading}
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

EndringBeregningsgrunnlagPeriodePanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  endringBGFieldArrayName: PropTypes.string.isRequired,
  fom: PropTypes.string.isRequired,
  open: PropTypes.bool,
  harPeriodeAarsakGraderingEllerRefusjon: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  showPanel: PropTypes.func.isRequired,
  heading: PropTypes.element.isRequired,
};

EndringBeregningsgrunnlagPeriodePanelImpl.defaultProps = {
  open: null,
};


EndringBeregningsgrunnlagPeriodePanelImpl.validate = (values, fastsattIForstePeriode,
  skalRedigereInntekt, skalOverstyreBg, skjaeringstidspunktBeregning, skalValidereMotRapportert, getKodeverknavn) => RenderEndringBGFieldArray
  .validate(values, fastsattIForstePeriode,
    skalRedigereInntekt, skalOverstyreBg, skjaeringstidspunktBeregning, skalValidereMotRapportert, getKodeverknavn);

const finnRiktigAndel = (andel, bgPeriode) => bgPeriode.beregningsgrunnlagPrStatusOgAndel.find(a => a.andelsnr === andel.andelsnr);

const erArbeidstakerMedArbeidsforhold = bgAndel => (bgAndel.aktivitetStatus.kode === aktivitetStatuser.ARBEIDSTAKER && bgAndel.arbeidsforhold);

const finnRegister = (andel, bgAndel, skjaeringstidspunktBeregning, faktaOmBeregning) => {
  if (erArbeidstakerMedArbeidsforhold(bgAndel) && !moment(bgAndel.arbeidsforhold.startdato).isBefore(moment(skjaeringstidspunktBeregning))) {
    return null;
  }
  if (erArbeidstakerUtenInntektsmeldingOgFrilansISammeOrganisasjon(bgAndel, faktaOmBeregning)) {
    return null;
  }
  if (andelErStatusFLOgHarATISammeOrg(bgAndel, faktaOmBeregning)) {
    return null;
  }
  return andel.belopFraInntektsmelding
|| andel.belopFraInntektsmelding === 0 ? formatCurrencyNoKr(andel.belopFraInntektsmelding) : formatCurrencyNoKr(bgAndel.belopPrMndEtterAOrdningen);
};

EndringBeregningsgrunnlagPeriodePanelImpl.buildInitialValues = (periode, readOnly, bgPeriode, skjaeringstidspunktBeregning, faktaOmBeregning,
    getKodeverknavn) => {
  if (!periode || !periode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.endringBeregningsgrunnlagAndeler
    .filter(({ aktivitetStatus }) => aktivitetStatus.kode !== aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE)
    .map((andel) => {
      const bgAndel = andel.lagtTilAvSaksbehandler ? undefined : finnRiktigAndel(andel, bgPeriode);
      return ({
      ...setGenerellAndelsinfo(andel, getKodeverknavn),
      ...setArbeidsforholdInitialValues(andel),
      andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
      fordelingForrigeBehandling: andel.fordelingForrigeBehandling || andel.fordelingForrigeBehandling === 0
        ? formatCurrencyNoKr(andel.fordelingForrigeBehandling) : '',
      fastsattBelop: settFastsattBelop(andel.beregnetPrMnd, andel.fastsattForrige, andel.fastsattAvSaksbehandler),
      readOnlyBelop: settReadOnlyBelop(readOnly, andel.beregnetPrMnd, andel.snittIBeregningsperiodenPrMnd, andel.belopFraInntektsmelding),
      skalRedigereInntekt: periode.harPeriodeAarsakGraderingEllerRefusjon,
      snittIBeregningsperiodenPrMnd: andel.snittIBeregningsperiodenPrMnd,
      refusjonskrav: andel.refusjonskrav !== null && andel.refusjonskrav !== undefined ? formatCurrencyNoKr(andel.refusjonskrav) : '',
      skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon && !andel.lagtTilAvSaksbehandler
      && andel.refusjonskravFraInntektsmelding ? periode.skalKunneEndreRefusjon : false,
      belopFraInntektsmelding: andel.belopFraInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: periode.harPeriodeAarsakGraderingEllerRefusjon,
      refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmelding,
      registerInntekt: andel.lagtTilAvSaksbehandler ? null : finnRegister(andel, bgAndel, skjaeringstidspunktBeregning, faktaOmBeregning),
    });
})
  );
};

const mapStateToProps = (state, props) => {
  if (props.skalHaEndretInformasjonIHeader) {
    return ({
      heading: createEndringHeadingForDate(state, props.fom, props.tom, renderDateHeading(props.fom, props.tom),
        props.harPeriodeAarsakGraderingEllerRefusjon, getKodeverknavnFn(getAlleKodeverk(state), kodeverkTyper)),
    });
  }
  return ({
    heading: renderDateHeading(props.fom, props.tom),
  });
};

export default connect(mapStateToProps)(EndringBeregningsgrunnlagPeriodePanelImpl);
