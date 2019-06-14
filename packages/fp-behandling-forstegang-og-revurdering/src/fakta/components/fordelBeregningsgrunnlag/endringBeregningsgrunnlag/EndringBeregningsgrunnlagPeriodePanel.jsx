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
import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop, starterPaaEllerEtterStp,
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
  getKodeverknavn) => RenderEndringBGFieldArray
  .validate(values, sumIPeriode, skalValidereMotRapportert, getKodeverknavn);

const finnRiktigAndel = (andel, bgPeriode) => bgPeriode.beregningsgrunnlagPrStatusOgAndel.find(a => a.andelsnr === andel.andelsnr);

const finnBeregningsgrunnlagPrAar = (bgAndel) => {
  if (!bgAndel) {
    return null;
  }
  if (bgAndel.bruttoPrAar) {
    return formatCurrencyNoKr(bgAndel.bruttoPrAar);
  }
  return null;
};

EndringBeregningsgrunnlagPeriodePanel.buildInitialValues = (periode, bgPeriode, skjaeringstidspunktBeregning, harKunYtelse, getKodeverknavn) => {
  if (!periode || !periode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.endringBeregningsgrunnlagAndeler
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
    });
})
  );
};

export default EndringBeregningsgrunnlagPeriodePanel;
