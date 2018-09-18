import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';
import BorderBox from 'sharedComponents/BorderBox';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import PropTypes from 'prop-types';
import RenderInntektsgivendeArbeidFieldArray from './RenderInntektsgivendeArbeidFieldArray';


const inntektsgivendeArbeidFieldArrayName = 'arbeidsforhold';

/**
 * InntektsgivendeArbeidPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 */
const InntektsgivendeArbeidPanel = ({
  readOnly,
}) => (
  <BorderBox>
    <Undertittel><FormattedMessage id="Registrering.InntektsgivendeArbeid.ArbeidINorge.Title" /></Undertittel>
    <VerticalSpacer eightPx />
    <Undertekst>
      <FormattedMessage id="Registrering.InntektsgivendeArbeid.ArbeidINorge.SkalIkkeRegistrereArbeidsforhold" />
    </Undertekst>
    <VerticalSpacer sixteenPx />
    <VerticalSpacer sixteenPx />
    <Undertittel><FormattedMessage id="Registrering.InntektsgivendeArbeid.ArbeidIUtlandet.Title" /></Undertittel>
    <VerticalSpacer eightPx />
    <FieldArray
      name={inntektsgivendeArbeidFieldArrayName}
      component={RenderInntektsgivendeArbeidFieldArray}
      readOnly={readOnly}
    />
  </BorderBox>
);

InntektsgivendeArbeidPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
};

InntektsgivendeArbeidPanel.initialValues = {
  [inntektsgivendeArbeidFieldArrayName]: [{}],
};


export default InntektsgivendeArbeidPanel;
