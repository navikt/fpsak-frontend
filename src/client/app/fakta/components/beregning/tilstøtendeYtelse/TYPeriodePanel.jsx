import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import createVisningsnavnForAktivitet from '@fpsak-frontend/utils/arbeidsforholdUtil';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils/currencyUtils';
import inntektskategorier from 'kodeverk/inntektskategorier';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils/formats';
import RenderBruttoBGFordelingFieldArray from './RenderBruttoBGFordelingFieldArray';


const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const renderDateHeading = (fom, tom) => {
  if (tom === undefined || tom === null) {
    return (
      <FormattedMessage
        id="BeregningInfoPanel.EndringBG.PeriodeFom"
        values={{ fom: formatDate(fom) }}
      />
    );
  }
  return (
    <FormattedMessage
      id="BeregningInfoPanel.EndringBG.PeriodeFomOgTom"
      values={{ fom: formatDate(fom), tom: formatDate(tom) }}
    />
  );
};


/**
 * TilstøtendeYtelsePeriodePanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for avklaring av beregningsgrunnlag ved tilstøtende ytelse.
 */

const TilstøtendeYtelsePeriodePanel = ({
  readOnly,
  fordelingAvBruttoBGFieldArrayName,
  fom,
  tom,
}) => (
  <div>
    <Element>
      {renderDateHeading(fom, tom)}
    </Element>
    <VerticalSpacer eightPx />
    <FieldArray
      name={fordelingAvBruttoBGFieldArrayName}
      component={RenderBruttoBGFordelingFieldArray}
      readOnly={readOnly}
    />
  </div>
);

TilstøtendeYtelsePeriodePanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fordelingAvBruttoBGFieldArrayName: PropTypes.string.isRequired,
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string,
};

TilstøtendeYtelsePeriodePanel.defaultProps = {
  tom: '',
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


TilstøtendeYtelsePeriodePanel.validate = values => RenderBruttoBGFordelingFieldArray.validate(values);


TilstøtendeYtelsePeriodePanel.buildInitialValues = (periode, aktivitetstatuskoder) => {
  if (!periode || !periode.tilstøtendeYtelseAndeler) {
    return {};
  }
  return (
    periode.tilstøtendeYtelseAndeler.map(andel => ({
      andel: createAndelnavn(andel, aktivitetstatuskoder),
      andelsnr: andel.andelsnr,
      arbeidsforholdId: andel.arbeidsforhold ? andel.arbeidsforhold.arbeidsforholdId : '',
      arbeidsperiodeFom: andel.arbeidsforhold ? andel.arbeidsforhold.startdato : '',
      arbeidsperiodeTom: andel.arbeidsforhold && andel.arbeidsforhold.opphoersdato !== null
        ? andel.arbeidsforhold.opphoersdato : '',
      fordelingForrigeYtelse: formatCurrencyNoKr(andel.fordelingForrigeYtelse),
      fastsattBeløp: formatCurrencyNoKr(andel.fastsattPrAar),
      refusjonskrav: formatCurrencyNoKr(andel.refusjonskrav),
      inntektskategori: preutfyllInntektskategori(andel),
      nyAndel: false,
      lagtTilAvSaksbehandler: andel.lagtTilAvSaksbehandler,
    }))
  );
};

export default TilstøtendeYtelsePeriodePanel;
