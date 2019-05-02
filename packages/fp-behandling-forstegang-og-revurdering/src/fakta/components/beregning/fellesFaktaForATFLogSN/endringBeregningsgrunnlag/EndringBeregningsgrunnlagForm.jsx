import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import EndringBeregningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';
import {
 mapToBelop, skalRedigereInntektForAndel, skalKunneOverstyreBeregningsgrunnlag, skalKunneOverstigeRapportertInntekt,
} from '../BgFordelingUtils';

import styles from './endringBeregningsgrunnlagForm.less';

const ElementWrapper = ({ children }) => children;

const endringBGFieldArrayNamePrefix = 'endringBGPeriode';

export const getFieldNameKey = index => (endringBGFieldArrayNamePrefix + index);


/**
 * EndringBeregningsgrunnlagForm
 *
 * Container komponent.. Behandling av aksjonspunktet for fasetting av nytt/endret beregningsgrunnlag.
 */

export class EndringBeregningsgrunnlagForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPanels: props.perioder.map(periode => periode.fom),
    };
    this.showPanel = this.showPanel.bind(this);
  }

  showPanel(fom) {
    const { openPanels } = this.state;
    if (openPanels.includes(fom)) {
      this.setState({ openPanels: openPanels.filter(panel => panel !== fom) });
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
      skalHaEndretInformasjonIHeader,
    } = this.props;
    const { openPanels } = this.state;
    return (
      <BorderBox className={styles.lessPadding}>
        {perioder.map((periode, index) => (
          <ElementWrapper key={endringBGFieldArrayNamePrefix + periode.fom}>
            <VerticalSpacer eightPx />
            <EndringBeregningsgrunnlagPeriodePanel
              readOnly={readOnly}
              endringBGFieldArrayName={getFieldNameKey(index)}
              fom={periode.fom}
              tom={periode.tom}
              open={openPanels ? openPanels.filter(panel => panel === periode.fom).length > 0 : false}
              harPeriodeAarsakGraderingEllerRefusjon={periode.harPeriodeAarsakGraderingEllerRefusjon}
              isAksjonspunktClosed={isAksjonspunktClosed}
              showPanel={this.showPanel}
              skalHaEndretInformasjonIHeader={skalHaEndretInformasjonIHeader}
            />
            <VerticalSpacer eightPx />
          </ElementWrapper>
        ))
        }
      </BorderBox>
    );
  }
}

EndringBeregningsgrunnlagForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalHaEndretInformasjonIHeader: PropTypes.bool,
};

EndringBeregningsgrunnlagForm.defaultProps = {
  skalHaEndretInformasjonIHeader: false,

};
export const finnFastsattIForstePeriode = (values, skalRedigereInntekt) => {
  const forstePeriode = values[getFieldNameKey(0)];
  return forstePeriode
    .map(mapToBelop(skalRedigereInntekt))
    .reduce((sum, fastsattBelop) => sum + fastsattBelop, 0);
};

EndringBeregningsgrunnlagForm.validate = (values, endringBGPerioder, faktaOmBeregning, beregningsgrunnlag, getKodeverknavn) => {
  const errors = {};
  if (endringBGPerioder && endringBGPerioder.length > 0) {
    const skalRedigereInntekt = skalRedigereInntektForAndel(values, faktaOmBeregning, beregningsgrunnlag);
    const skalOverstyreBg = skalKunneOverstyreBeregningsgrunnlag(values, faktaOmBeregning, beregningsgrunnlag);
    const skalValidereMotRapportert = andel => !skalKunneOverstigeRapportertInntekt(values, faktaOmBeregning, beregningsgrunnlag)(andel);
    const fastsattIForstePeriode = finnFastsattIForstePeriode(values, skalRedigereInntekt);
    for (let i = 0; i < endringBGPerioder.length; i += 1) {
      const periode = values[getFieldNameKey(i)];
      errors[getFieldNameKey(i)] = EndringBeregningsgrunnlagPeriodePanel.validate(periode, fastsattIForstePeriode,
         skalRedigereInntekt, skalOverstyreBg, skalValidereMotRapportert, getKodeverknavn);
    }
  }
  return errors;
};

const finnRiktigBgPeriode = (periode, bgPerioder) => bgPerioder.find(p => p.beregningsgrunnlagPeriodeFom === periode.fom);

EndringBeregningsgrunnlagForm.buildInitialValues = (endringBGPerioder, bg, getKodeverknavn) => {
  const initialValues = {};
  if (!endringBGPerioder) {
    return initialValues;
  }
  const bgPerioder = bg.beregningsgrunnlagPeriode;
  endringBGPerioder.forEach((periode, index) => {
    const bgPeriode = finnRiktigBgPeriode(periode, bgPerioder);
    initialValues[getFieldNameKey(index)] = EndringBeregningsgrunnlagPeriodePanel
    .buildInitialValues(periode, bgPeriode, bg.skjaeringstidspunktBeregning, bg.faktaOmBeregning, getKodeverknavn);
  });
  return initialValues;
};

const getAndelsnr = (aktivitet) => {
  if (aktivitet.nyAndel === true) {
    return aktivitet.andel;
  }
  return aktivitet.andelsnr;
};

const getAndelsnrForKunYtelse = (periode) => {
  const brukersAndel = periode.endringBeregningsgrunnlagAndeler.find(andel => !andel.lagtTilAvSaksbehandler
  && andel.aktivitetStatus.kode === aktivitetStatus.BRUKERS_ANDEL);
  return brukersAndel.andelsnr;
};

const gjelderKunYtelse = (harKunYtelse, aktivitet) => (harKunYtelse
  && aktivitet.nyAndel
  && aktivitet.andel === beregningsgrunnlagAndeltyper.BRUKERS_ANDEL);

const harAndelMedRedigerbarInntekt = andeler => (andeler.some(andel => andel.skalRedigereInntekt));

export const shouldBeSubmitted = (harPeriodeAarsakGraderingEllerRefusjon, values, index) => (harPeriodeAarsakGraderingEllerRefusjon
    || harAndelMedRedigerbarInntekt(values[getFieldNameKey(index)]));

export const finnRedigerteAndeler = (values, index, harPeriodeAarsakGraderingEllerRefusjon) => (values[getFieldNameKey(index)]
  .filter(({ skalRedigereInntekt }) => harPeriodeAarsakGraderingEllerRefusjon || skalRedigereInntekt));

export const mapTilFastsatteVerdier = (aktivitet, skalHaBesteberegning) => ({
  refusjon: aktivitet.skalKunneEndreRefusjon ? removeSpacesFromNumber(aktivitet.refusjonskrav) : null,
  fastsattBeløp: removeSpacesFromNumber(aktivitet.fastsattBelop),
  inntektskategori: aktivitet.inntektskategori,
  skalHaBesteberegning,
});

export const mapAndel = (harKunYtelse, endringBGPerioder, index, skalHaBesteberegning) => aktivitet => ({
  andel: aktivitet.andel,
  andelsnr: gjelderKunYtelse(harKunYtelse, aktivitet) ? getAndelsnrForKunYtelse(endringBGPerioder[index]) : getAndelsnr(aktivitet),
  arbeidsforholdId: aktivitet.arbeidsforholdId !== '' ? aktivitet.arbeidsforholdId : null,
  nyAndel: aktivitet.nyAndel,
  lagtTilAvSaksbehandler: aktivitet.lagtTilAvSaksbehandler,
  fastsatteVerdier: mapTilFastsatteVerdier(aktivitet, skalHaBesteberegning),
});

export const lagPeriodeForSubmit = (values, index, harPeriodeAarsakGraderingEllerRefusjon, harKunYtelse, endringBGPerioder, skalHaBesteberegning) => ({
  andeler: finnRedigerteAndeler(values, index, harPeriodeAarsakGraderingEllerRefusjon)
    .map(mapAndel(harKunYtelse, endringBGPerioder, index, skalHaBesteberegning)),
  fom: endringBGPerioder[index].fom,
  tom: endringBGPerioder[index].tom,
});

export const transformPerioder = (endringBGPerioder, values, harKunYtelse, skalHaBesteberegning) => {
  const endringBeregningsgrunnlagPerioder = [];
  for (let index = 0; index < endringBGPerioder.length; index += 1) {
    const { harPeriodeAarsakGraderingEllerRefusjon } = endringBGPerioder[index];
    if (shouldBeSubmitted(harPeriodeAarsakGraderingEllerRefusjon, values, index)) {
      endringBeregningsgrunnlagPerioder.push(lagPeriodeForSubmit(values, index, harPeriodeAarsakGraderingEllerRefusjon,
        harKunYtelse, endringBGPerioder, skalHaBesteberegning));
    }
  }
  return endringBeregningsgrunnlagPerioder;
};

EndringBeregningsgrunnlagForm.transformValues = (values, endringBGPerioder, harKunYtelse, skalHaBesteberegning) => ({
  fastsettEndringBeregningsgrunnlag: {
    endretBeregningsgrunnlagPerioder: transformPerioder(endringBGPerioder, values, harKunYtelse, skalHaBesteberegning),
  },
});

export default EndringBeregningsgrunnlagForm;
