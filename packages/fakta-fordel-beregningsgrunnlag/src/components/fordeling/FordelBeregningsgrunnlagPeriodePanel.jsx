import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { Element } from 'nav-frontend-typografi';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import {
  DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT,
  formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import RenderFordelBGFieldArray from './RenderFordelBGFieldArray';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop, starterPaaEllerEtterStp, finnFastsattPrAar,
} from '../BgFordelingUtils';

import styles from './fordelBeregningsgrunnlagPeriodePanel.less';

const classNames = classnames.bind(styles);

const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const renderDateHeading = (fom, tom) => {
  if (!tom) {
    return (
      <Element>
        <FormattedMessage
          id="BeregningInfoPanel.FordelBG.PeriodeFom"
          values={{ fom: formatDate(fom) }}
        />
      </Element>
    );
  }
  return (
    <Element>
      <FormattedMessage
        id="BeregningInfoPanel.FordelBG.PeriodeFomOgTom"
        values={{ fom: formatDate(fom), tom: formatDate(tom) }}
      />
    </Element>
  );
};

/**
 * FordelBeregningsgrunnlagPeriodePanel
 *
 * Presentasjonskomponent. Viser ekspanderbart panel for perioder i nytt/endret beregningsgrunnlag
 */

const FordelBeregningsgrunnlagPeriodePanel = ({
  readOnly,
  fordelBGFieldArrayName,
  fom,
  tom,
  harPeriodeAarsakGraderingEllerRefusjon,
  isAksjonspunktClosed,
  open,
  showPanel,
  beregningsgrunnlag,
  alleKodeverk,
  behandlingType,
}) => (
  <EkspanderbartpanelPure
    className={readOnly ? styles.statusOk : classNames(`fordelBeregningsgrunnlagPeriode--${fom}`)}
    tittel={renderDateHeading(fom, tom)}
    apen={open}
    onClick={() => showPanel(fom)}
  >
    <FieldArray
      name={fordelBGFieldArrayName}
      component={RenderFordelBGFieldArray}
      readOnly={readOnly}
      periodeUtenAarsak={!harPeriodeAarsakGraderingEllerRefusjon}
      isAksjonspunktClosed={isAksjonspunktClosed}
      alleKodeverk={alleKodeverk}
      beregningsgrunnlag={beregningsgrunnlag}
      behandlingType={behandlingType}
    />
  </EkspanderbartpanelPure>
);

FordelBeregningsgrunnlagPeriodePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fordelBGFieldArrayName: PropTypes.string.isRequired,
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string,
  open: PropTypes.bool,
  harPeriodeAarsakGraderingEllerRefusjon: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  showPanel: PropTypes.func.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
};

FordelBeregningsgrunnlagPeriodePanel.defaultProps = {
  open: null,
  tom: null,
};

FordelBeregningsgrunnlagPeriodePanel.validate = (values, sumIPeriode, skalValidereMotRapportert,
  getKodeverknavn, grunnbeløp, periodeDato) => RenderFordelBGFieldArray
  .validate(values, sumIPeriode, skalValidereMotRapportert, getKodeverknavn, grunnbeløp, periodeDato);

const finnRiktigAndel = (andel, bgPeriode) => bgPeriode.beregningsgrunnlagPrStatusOgAndel.find((a) => a.andelsnr === andel.andelsnr);

const finnBeregningsgrunnlagPrAar = (bgAndel) => {
  if (!bgAndel) {
    return null;
  }
  if (bgAndel.overstyrtPrAar || bgAndel.overstyrtPrAar === 0) {
    return formatCurrencyNoKr(bgAndel.overstyrtPrAar);
  }
  if (bgAndel.beregnetPrAar || bgAndel.beregnetPrAar === 0) {
    return formatCurrencyNoKr(bgAndel.beregnetPrAar);
  }
  return null;
};

FordelBeregningsgrunnlagPeriodePanel.buildInitialValues = (periode, bgPeriode, skjaeringstidspunktBeregning, harKunYtelse, getKodeverknavn) => {
  if (!periode || !periode.fordelBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.fordelBeregningsgrunnlagAndeler
      .map((andel) => {
        const bgAndel = finnRiktigAndel(andel, bgPeriode);
        return ({
          ...setGenerellAndelsinfo(andel, harKunYtelse, getKodeverknavn),
          ...setArbeidsforholdInitialValues(andel),
          andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
          fordelingForrigeBehandling: andel.fordelingForrigeBehandlingPrAar || andel.fordelingForrigeBehandlingPrAar === 0
            ? formatCurrencyNoKr(andel.fordelingForrigeBehandlingPrAar) : '',
          fastsattBelop: settFastsattBelop(andel.fordeltPrAar, andel.fastsattForrigePrAar),
          readOnlyBelop: finnBeregningsgrunnlagPrAar(bgAndel),
          refusjonskrav: andel.refusjonskravPrAar !== null && andel.refusjonskravPrAar !== undefined ? formatCurrencyNoKr(andel.refusjonskravPrAar) : '',
          skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon && !andel.lagtTilAvSaksbehandler
      && andel.refusjonskravFraInntektsmeldingPrAar ? periode.skalKunneEndreRefusjon : false,
          belopFraInntektsmelding: andel.belopFraInntektsmeldingPrAar,
          harPeriodeAarsakGraderingEllerRefusjon: periode.harPeriodeAarsakGraderingEllerRefusjon,
          refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmeldingPrAar,
          nyttArbeidsforhold: andel.nyttArbeidsforhold || starterPaaEllerEtterStp(bgAndel, skjaeringstidspunktBeregning),
          beregningsgrunnlagPrAar: finnBeregningsgrunnlagPrAar(bgAndel),
          forrigeRefusjonPrAar: andel.refusjonskravPrAar,
          forrigeArbeidsinntektPrAar: finnFastsattPrAar(andel.fordeltPrAar, andel.fastsattForrigePrAar),
          beregningsperiodeFom: bgAndel.beregningsperiodeFom,
          beregningsperiodeTom: bgAndel.beregningsperiodeTom,
        });
      })
  );
};

export default FordelBeregningsgrunnlagPeriodePanel;
