import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import moment from 'moment';
import EndringBeregningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';
import {
  skalValidereMotBeregningsgrunnlag,
} from '../BgFordelingUtils';

import styles from './endringBeregningsgrunnlagForm.less';

const ElementWrapper = ({ children }) => children;

const endringBGFieldArrayNamePrefix = 'endringBGPeriode';

export const getFieldNameKey = (index) => (endringBGFieldArrayNamePrefix + index);

const harPeriodeSomKanKombineresMedForrige = (periode, bgPerioder, endretPeriode, periodeList) => {
  const forrigeEndringPeriode = periodeList[periodeList.length - 1];
  if (endretPeriode.harPeriodeAarsakGraderingEllerRefusjon !== forrigeEndringPeriode.harPeriodeAarsakGraderingEllerRefusjon) {
    return false;
  }
  if (periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.ENDRING_I_REFUSJONSKRAV)
  || periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.REFUSJON_OPPHOERER)
  || periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.GRADERING)
  || periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.GRADERING_OPPHOERER)) {
    return false;
  }
  if (periode.periodeAarsaker.includes(periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET)) {
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
 * EndringBeregningsgrunnlagForm
 *
 * Container komponent.. Behandling av aksjonspunktet for fasetting av nytt/endret beregningsgrunnlag.
 */

export class EndringBeregningsgrunnlagForm extends Component {
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
    } = this.props;
    const { openPanels } = this.state;
    return (
      <BorderBox className={styles.lessPadding}>
        {slaaSammenPerioder(perioder, bgPerioder).map((periode, index) => (
          <ElementWrapper key={endringBGFieldArrayNamePrefix + periode.fom}>
            <VerticalSpacer eightPx />
            <EndringBeregningsgrunnlagPeriodePanel
              readOnly={readOnly}
              endringBGFieldArrayName={getFieldNameKey(index)}
              fom={periode.fom}
              tom={periode.tom}
              open={openPanels ? openPanels.filter((panel) => panel === periode.fom).length > 0 : false}
              harPeriodeAarsakGraderingEllerRefusjon={periode.harPeriodeAarsakGraderingEllerRefusjon}
              isAksjonspunktClosed={isAksjonspunktClosed}
              showPanel={this.showPanel}
            />
            <VerticalSpacer eightPx />
          </ElementWrapper>
        ))}
      </BorderBox>
    );
  }
}

EndringBeregningsgrunnlagForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  bgPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export const finnSumIPeriode = (bgPerioder, fom) => {
  const periode = bgPerioder.find((p) => p.beregningsgrunnlagPeriodeFom === fom);
  return periode.bruttoPrAar;
};

EndringBeregningsgrunnlagForm.validate = (values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn) => {
  const errors = {};
  if (endringBGPerioder && endringBGPerioder.length > 0) {
    const skalValidereMotBeregningsgrunnlagPrAar = (andel) => skalValidereMotBeregningsgrunnlag(beregningsgrunnlag)(andel);
    for (let i = 0; i < endringBGPerioder.length; i += 1) {
      const sumIPeriode = finnSumIPeriode(beregningsgrunnlag.beregningsgrunnlagPeriode, endringBGPerioder[i].fom);
      const periode = values[getFieldNameKey(i)];
      errors[getFieldNameKey(i)] = EndringBeregningsgrunnlagPeriodePanel.validate(periode, sumIPeriode,
        skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
    }
  }
  return errors;
};

const finnRiktigBgPeriode = (periode, bgPerioder) => bgPerioder.find((p) => p.beregningsgrunnlagPeriodeFom === periode.fom);

EndringBeregningsgrunnlagForm.buildInitialValues = (endringBGPerioder, bg, getKodeverknavn) => {
  const initialValues = {};
  if (!endringBGPerioder) {
    return initialValues;
  }
  const harKunYtelse = bg.aktivitetStatus.some((status) => status.kode === aktivitetStatuser.KUN_YTELSE);
  const bgPerioder = bg.beregningsgrunnlagPeriode;
  slaaSammenPerioder(endringBGPerioder, bgPerioder).forEach((periode, index) => {
    const bgPeriode = finnRiktigBgPeriode(periode, bgPerioder);
    initialValues[getFieldNameKey(index)] = EndringBeregningsgrunnlagPeriodePanel
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
  arbeidsforholdId: aktivitet.arbeidsforholdId !== '' ? aktivitet.arbeidsforholdId : null,
  nyAndel: aktivitet.nyAndel,
  lagtTilAvSaksbehandler: aktivitet.lagtTilAvSaksbehandler,
  fastsatteVerdier: mapTilFastsatteVerdier(aktivitet),
});

const inkludererPeriode = (periode) => (p) => moment(p.fom).isSameOrAfter(moment(periode.fom))
&& (periode.tom === null || moment(p.tom).isSameOrBefore(moment(periode.tom)));

export const lagPerioderForSubmit = (values, index, kombinertPeriode, endringBGPerioder) => endringBGPerioder
  .filter(inkludererPeriode(kombinertPeriode))
  .map((p) => ({
    andeler: values[getFieldNameKey(index)].map(mapAndel),
    fom: p.fom,
    tom: p.tom,
  }));

export const transformPerioder = (endringBGPerioder, values, bgPerioder) => {
  const endringBeregningsgrunnlagPerioder = [];
  const kombinertePerioder = slaaSammenPerioder(endringBGPerioder, bgPerioder);
  for (let index = 0; index < kombinertePerioder.length; index += 1) {
    const { harPeriodeAarsakGraderingEllerRefusjon } = kombinertePerioder[index];
    if (harPeriodeAarsakGraderingEllerRefusjon) {
      lagPerioderForSubmit(values, index, kombinertePerioder[index], endringBGPerioder)
        .forEach((p) => endringBeregningsgrunnlagPerioder.push(p));
    }
  }
  return endringBeregningsgrunnlagPerioder;
};

EndringBeregningsgrunnlagForm.transformValues = (values, endringBGPerioder, bgPerioder) => ({
  endretBeregningsgrunnlagPerioder: transformPerioder(endringBGPerioder, values, bgPerioder),
});

export default EndringBeregningsgrunnlagForm;
