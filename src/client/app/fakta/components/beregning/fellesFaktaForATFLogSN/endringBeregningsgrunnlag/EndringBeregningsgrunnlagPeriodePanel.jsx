import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import createVisningsnavnForAktivitet from '@fpsak-frontend/utils/arbeidsforholdUtil';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils/currencyUtils';
import inntektskategorier from '@fpsak-frontend/kodeverk/inntektskategorier';
import aktivitetStatus from '@fpsak-frontend/kodeverk/aktivitetStatus';
import moment from 'moment';
import classnames from 'classnames/bind';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils/formats';
import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';

import styles from './endringBeregningsgrunnlagPeriodePanel.less';


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

const classNames = classnames.bind(styles);


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
      readOnly={readOnly || !harPeriodeAarsakGraderingEllerRefusjon}
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
  tom: '',
  open: null,
};

export const createAndelnavn = (andel, aktivitetstatuskoder) => {
  if (andel.arbeidsforhold !== undefined && andel.arbeidsforhold !== null) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold);
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.UDEFINERT) {
    return '';
  }
  return aktivitetstatuskoder.filter(ik => ik.kode === andel.aktivitetStatus.kode)[0].navn;
};

const preutfyllInntektskategori = andel => (andel.inntektskategori
&& andel.inntektskategori.kode !== inntektskategorier.UDEFINERT ? andel.inntektskategori.kode : '');

export const settFastsattBelop = (harPeriodeAarsakGraderingEllerRefusjon, beregnetPrMnd,
  fastsattForrige, fordelingForrigeBehandling, fastsattAvSaksbehandler) => {
  if (harPeriodeAarsakGraderingEllerRefusjon) {
    if (beregnetPrMnd && fastsattAvSaksbehandler) {
      return formatCurrencyNoKr(beregnetPrMnd);
    }
    if (fastsattForrige) {
      return formatCurrencyNoKr(fastsattForrige);
    }
    return '';
  } if (fordelingForrigeBehandling) {
    return formatCurrencyNoKr(fordelingForrigeBehandling);
  }
  return 0;
};

const settAndelIArbeid = (andelerIArbeid) => {
  if (andelerIArbeid.length === 0) {
    return '';
  }
  if (andelerIArbeid.length === 1) {
    return `${parseFloat(andelerIArbeid[0]).toFixed(2)}`;
  }
  const minAndel = Math.min(...andelerIArbeid);
  const maxAndel = Math.max(...andelerIArbeid);
  return `${minAndel} - ${maxAndel}`;
};

EndringBeregningsgrunnlagPeriodePanel.validate = values => RenderEndringBGFieldArray.validate(values);

EndringBeregningsgrunnlagPeriodePanel.buildInitialValues = (periode, aktivitetstatuskoder) => {
  if (!periode || !periode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.endringBeregningsgrunnlagAndeler.map(andel => ({
      andel: createAndelnavn(andel, aktivitetstatuskoder),
      andelsnr: andel.andelsnr,
      aktivitetstatus: andel.aktivitetStatus.kode,
      arbeidsforholdId: andel.arbeidsforhold ? andel.arbeidsforhold.arbeidsforholdId : '',
      arbeidsperiodeFom: andel.arbeidsforhold ? andel.arbeidsforhold.startdato : '',
      arbeidsperiodeTom: andel.arbeidsforhold && andel.arbeidsforhold.opphoersdato !== null
        ? andel.arbeidsforhold.opphoersdato : '',
      andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
      fordelingForrigeBehandling: formatCurrencyNoKr(andel.fordelingForrigeBehandling),
      fastsattBeløp: settFastsattBelop(periode.harPeriodeAarsakGraderingEllerRefusjon,
        andel.beregnetPrMnd, andel.fastsattForrige, andel.fordelingForrigeBehandling, andel.fastsattAvSaksbehandler),
      refusjonskrav: andel.refusjonskrav && andel.refusjonskrav !== 0 ? formatCurrencyNoKr(andel.refusjonskrav) : '',
      inntektskategori: preutfyllInntektskategori(andel),
      skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon ? periode.skalKunneEndreRefusjon : false,
      belopFraInntektsmelding: andel.belopFraInntektsmelding,
      nyAndel: false,
      lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler,
      harPeriodeAarsakGraderingEllerRefusjon: periode.harPeriodeAarsakGraderingEllerRefusjon,
      refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmelding,
    }))
  );
};

export default EndringBeregningsgrunnlagPeriodePanel;
