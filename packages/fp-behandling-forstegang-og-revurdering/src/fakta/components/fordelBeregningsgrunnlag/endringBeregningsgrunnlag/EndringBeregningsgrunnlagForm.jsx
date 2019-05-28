import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import EndringBeregningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';
import {
  skalValidereMotBeregningsgrunnlag,
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
};

export const finnSumIPeriode = (bgPerioder, fom) => {
  const periode = bgPerioder.find(p => p.beregningsgrunnlagPeriodeFom === fom);
  return periode.beregningsgrunnlagPrStatusOgAndel
  .map(andel => andel.beregnetPrAar)
  .reduce((sum, beregnetPrAar) => (beregnetPrAar === null ? sum : sum + beregnetPrAar), 0);
};

EndringBeregningsgrunnlagForm.validate = (values, endringBGPerioder, beregningsgrunnlag, getKodeverknavn) => {
  const errors = {};
  if (endringBGPerioder && endringBGPerioder.length > 0) {
    const skalValidereMotBeregningsgrunnlagPrAar = andel => skalValidereMotBeregningsgrunnlag(beregningsgrunnlag)(andel);
    for (let i = 0; i < endringBGPerioder.length; i += 1) {
      const sumIPeriode = finnSumIPeriode(beregningsgrunnlag.beregningsgrunnlagPeriode, endringBGPerioder[i].fom);
      const periode = values[getFieldNameKey(i)];
      errors[getFieldNameKey(i)] = EndringBeregningsgrunnlagPeriodePanel.validate(periode, sumIPeriode,
        skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
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
  const harKunYtelse = bg.aktivitetStatus.some(status => status.kode === aktivitetStatuser.KUN_YTELSE);
  const bgPerioder = bg.beregningsgrunnlagPeriode;
  endringBGPerioder.forEach((periode, index) => {
    const bgPeriode = finnRiktigBgPeriode(periode, bgPerioder);
    initialValues[getFieldNameKey(index)] = EndringBeregningsgrunnlagPeriodePanel
    .buildInitialValues(periode, bgPeriode, bg.skjaeringstidspunktBeregning, bg.faktaOmBeregning, harKunYtelse, getKodeverknavn);
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

export const mapAndel = aktivitet => ({
  andel: aktivitet.andel,
  andelsnr: getAndelsnr(aktivitet),
  arbeidsforholdId: aktivitet.arbeidsforholdId !== '' ? aktivitet.arbeidsforholdId : null,
  nyAndel: aktivitet.nyAndel,
  lagtTilAvSaksbehandler: aktivitet.lagtTilAvSaksbehandler,
  fastsatteVerdier: mapTilFastsatteVerdier(aktivitet),
});

export const lagPeriodeForSubmit = (values, index, endringBGPerioder) => ({
  andeler: values[getFieldNameKey(index)].map(mapAndel),
  fom: endringBGPerioder[index].fom,
  tom: endringBGPerioder[index].tom,
});

export const transformPerioder = (endringBGPerioder, values) => {
  const endringBeregningsgrunnlagPerioder = [];
  for (let index = 0; index < endringBGPerioder.length; index += 1) {
    const { harPeriodeAarsakGraderingEllerRefusjon } = endringBGPerioder[index];
    if (harPeriodeAarsakGraderingEllerRefusjon) {
      endringBeregningsgrunnlagPerioder.push(lagPeriodeForSubmit(values, index, endringBGPerioder));
    }
  }
  return endringBeregningsgrunnlagPerioder;
};

EndringBeregningsgrunnlagForm.transformValues = (values, endringBGPerioder) => ({
    endretBeregningsgrunnlagPerioder: transformPerioder(endringBGPerioder, values),
});

export default EndringBeregningsgrunnlagForm;
