import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import FordelBeregningsgrunnlagPeriodePanel from './FordelBeregningsgrunnlagPeriodePanel';
import { skalValidereMotBeregningsgrunnlag } from '../BgFordelingUtils';

import styles from './fordelBeregningsgrunnlagForm.less';

const ElementWrapper = ({ children }) => children;

const fordelBGFieldArrayNamePrefix = 'fordelBGPeriode';

export const getFieldNameKey = (index) => (fordelBGFieldArrayNamePrefix + index);

const harPeriodeSomKanKombineresMedForrige = (periode, bgPerioder, fordelPeriode, periodeList) => {
  const forrigeEndringPeriode = periodeList[periodeList.length - 1];
  if (fordelPeriode.harPeriodeAarsakGraderingEllerRefusjon !== forrigeEndringPeriode.harPeriodeAarsakGraderingEllerRefusjon) {
    return false;
  }
  if (periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.ENDRING_I_REFUSJONSKRAV)
  || periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.REFUSJON_OPPHOERER)
  || periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.GRADERING)
  || periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.GRADERING_OPPHOERER)) {
    return false;
  }
  if (periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET)) {
    const periodeIndex = bgPerioder.indexOf(periode);
    const forrigePeriode = bgPerioder[periodeIndex - 1];
    return forrigePeriode.bruttoPrAar === periode.bruttoPrAar;
  }
  return true;
};

const oppdaterTomDatoForSistePeriode = (liste, periode) => {
  const forrigePeriode = liste.pop();
  forrigePeriode.tom = periode.tom;
  liste.push(forrigePeriode);
};

const sjekkOmPeriodeSkalLeggesTil = (bgPerioder) => (aggregatedPeriodList, periode) => {
  if (aggregatedPeriodList.length === 0) {
    aggregatedPeriodList.push({ ...periode });
    return aggregatedPeriodList;
  }
  const matchendeBgPeriode = bgPerioder.find((p) => p.beregningsgrunnlagPeriodeFom === periode.fom);
  if (matchendeBgPeriode) {
    if (harPeriodeSomKanKombineresMedForrige(matchendeBgPeriode, bgPerioder, periode, aggregatedPeriodList)) {
      oppdaterTomDatoForSistePeriode(aggregatedPeriodList, periode);
      return aggregatedPeriodList;
    }
    aggregatedPeriodList.push({ ...periode });
  }
  return aggregatedPeriodList;
};

export const slaaSammenPerioder = (perioder, bgPerioder) => perioder.reduce(sjekkOmPeriodeSkalLeggesTil(bgPerioder), []);


/**
 * FordelBeregningsgrunnlagForm
 *
 * Container komponent.. Behandling av aksjonspunktet for fasetting av nytt/endret beregningsgrunnlag.
 */

export class FordelBeregningsgrunnlagForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPanels: props.perioder.map((periode) => periode.fom),
    };
    this.showPanel = this.showPanel.bind(this);
  }

  showPanel(fom) {
    const { openPanels } = this.state;
    if (openPanels.includes(fom)) {
      this.setState({ openPanels: openPanels.filter((panel) => panel !== fom) });
    } else {
      openPanels.push(fom);
      this.setState({ openPanels });
    }
  }

  render() {
    const {
      readOnly,
      perioder,
      isAksjonspunktClosed,
      bgPerioder,
      beregningsgrunnlag,
      alleKodeverk,
      behandlingType,
    } = this.props;
    const { openPanels } = this.state;
    return (
      <BorderBox className={styles.lessPadding}>
        {slaaSammenPerioder(perioder, bgPerioder).map((periode, index) => (
          <ElementWrapper key={fordelBGFieldArrayNamePrefix + periode.fom}>
            <VerticalSpacer eightPx />
            <FordelBeregningsgrunnlagPeriodePanel
              readOnly={readOnly}
              fordelBGFieldArrayName={getFieldNameKey(index)}
              fom={periode.fom}
              tom={periode.tom}
              open={openPanels ? openPanels.filter((panel) => panel === periode.fom).length > 0 : false}
              harPeriodeAarsakGraderingEllerRefusjon={periode.harPeriodeAarsakGraderingEllerRefusjon}
              isAksjonspunktClosed={isAksjonspunktClosed}
              showPanel={this.showPanel}
              beregningsgrunnlag={beregningsgrunnlag}
              alleKodeverk={alleKodeverk}
              behandlingType={behandlingType}
            />
            <VerticalSpacer eightPx />
          </ElementWrapper>
        ))}
      </BorderBox>
    );
  }
}

FordelBeregningsgrunnlagForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  bgPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
};

export const finnSumIPeriode = (bgPerioder, fom) => {
  const periode = bgPerioder.find((p) => p.beregningsgrunnlagPeriodeFom === fom);
  return periode.bruttoPrAar;
};

FordelBeregningsgrunnlagForm.validate = (values, fordelBGPerioder, beregningsgrunnlag, getKodeverknavn) => {
  const errors = {};
  if (fordelBGPerioder && fordelBGPerioder.length > 0) {
    const skalValidereMotBeregningsgrunnlagPrAar = (andel) => skalValidereMotBeregningsgrunnlag(beregningsgrunnlag)(andel);
    const perioderSlattSammen = slaaSammenPerioder(fordelBGPerioder, beregningsgrunnlag.beregningsgrunnlagPeriode);
    const grunnbeløp = Number(beregningsgrunnlag.halvG) * 2;
    for (let i = 0; i < perioderSlattSammen.length; i += 1) {
      const sumIPeriode = finnSumIPeriode(beregningsgrunnlag.beregningsgrunnlagPeriode, perioderSlattSammen[i].fom);
      const periode = values[getFieldNameKey(i)];
      const periodeDato = { fom: perioderSlattSammen[i], tom: perioderSlattSammen[i] };
      errors[getFieldNameKey(i)] = FordelBeregningsgrunnlagPeriodePanel.validate(periode, sumIPeriode,
        skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn, grunnbeløp, periodeDato);
    }
  }
  return errors;
};

const finnRiktigBgPeriode = (periode, bgPerioder) => bgPerioder.find((p) => p.beregningsgrunnlagPeriodeFom === periode.fom);

FordelBeregningsgrunnlagForm.buildInitialValues = (fordelBGPerioder, bg, getKodeverknavn) => {
  const initialValues = {};
  if (!fordelBGPerioder) {
    return initialValues;
  }
  const harKunYtelse = bg.aktivitetStatus.some((status) => status.kode === aktivitetStatuser.KUN_YTELSE);
  const bgPerioder = bg.beregningsgrunnlagPeriode;
  slaaSammenPerioder(fordelBGPerioder, bgPerioder).forEach((periode, index) => {
    const bgPeriode = finnRiktigBgPeriode(periode, bgPerioder);
    initialValues[getFieldNameKey(index)] = FordelBeregningsgrunnlagPeriodePanel
      .buildInitialValues(periode, bgPeriode, bg.skjaeringstidspunktBeregning, harKunYtelse, getKodeverknavn);
  });
  return initialValues;
};

const getAndelsnr = (aktivitet) => {
  if (aktivitet.nyAndel === true) {
    return aktivitet.andel;
  }
  return aktivitet.andelsnr;
};

export const mapTilFastsatteVerdier = (aktivitet, skalHaBesteberegning) => ({
  refusjonPrÅr: aktivitet.skalKunneEndreRefusjon ? removeSpacesFromNumber(aktivitet.refusjonskrav) : null,
  fastsattÅrsbeløp: removeSpacesFromNumber(aktivitet.fastsattBelop),
  inntektskategori: aktivitet.inntektskategori,
  skalHaBesteberegning,
});

export const mapAndel = (aktivitet) => ({
  andel: aktivitet.andel,
  andelsnr: getAndelsnr(aktivitet),
  aktivitetStatus: aktivitet.aktivitetStatus,
  arbeidsgiverId: aktivitet.arbeidsgiverId !== '' ? aktivitet.arbeidsgiverId : null,
  arbeidsforholdId: aktivitet.arbeidsforholdId !== '' ? aktivitet.arbeidsforholdId : null,
  nyAndel: aktivitet.nyAndel,
  lagtTilAvSaksbehandler: aktivitet.lagtTilAvSaksbehandler,
  arbeidsforholdType: aktivitet.arbeidsforholdType,
  beregningsperiodeTom: aktivitet.beregningsperiodeTom,
  beregningsperiodeFom: aktivitet.beregningsperiodeFom,
  forrigeArbeidsinntektPrÅr: aktivitet.forrigeArbeidsinntektPrAar,
  forrigeRefusjonPrÅr: aktivitet.forrigeRefusjonPrAar,
  forrigeInntektskategori: aktivitet.forrigeInntektskategori,
  fastsatteVerdier: mapTilFastsatteVerdier(aktivitet),
});

const inkludererPeriode = (periode) => (p) => moment(p.fom).isSameOrAfter(moment(periode.fom))
&& (periode.tom === null || moment(p.tom).isSameOrBefore(moment(periode.tom)));

export const lagPerioderForSubmit = (values, index, kombinertPeriode, fordelBGPerioder) => fordelBGPerioder
  .filter(inkludererPeriode(kombinertPeriode))
  .map((p) => ({
    andeler: values[getFieldNameKey(index)].map(mapAndel),
    fom: p.fom,
    tom: p.tom,
  }));

export const transformPerioder = (fordelBGPerioder, values, bgPerioder) => {
  const fordelBeregningsgrunnlagPerioder = [];
  const kombinertePerioder = slaaSammenPerioder(fordelBGPerioder, bgPerioder);
  for (let index = 0; index < kombinertePerioder.length; index += 1) {
    const { harPeriodeAarsakGraderingEllerRefusjon } = kombinertePerioder[index];
    if (harPeriodeAarsakGraderingEllerRefusjon) {
      lagPerioderForSubmit(values, index, kombinertePerioder[index], fordelBGPerioder)
        .forEach((p) => fordelBeregningsgrunnlagPerioder.push(p));
    }
  }
  return fordelBeregningsgrunnlagPerioder;
};

FordelBeregningsgrunnlagForm.transformValues = (values, fordelBGPerioder, bgPerioder) => ({
  endretBeregningsgrunnlagPerioder: transformPerioder(fordelBGPerioder, values, bgPerioder),
});

export default FordelBeregningsgrunnlagForm;
