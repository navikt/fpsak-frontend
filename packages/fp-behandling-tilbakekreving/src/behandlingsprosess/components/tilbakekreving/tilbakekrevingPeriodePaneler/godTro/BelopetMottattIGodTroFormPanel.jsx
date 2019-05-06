import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
 Undertekst, Element, Normaltekst,
} from 'nav-frontend-typografi';

import {
  minValue, minLength, maxLength, hasValidText, required, removeSpacesFromNumber, formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { VerticalSpacer, ArrowBox } from '@fpsak-frontend/shared-components';
import {
 RadioOption, RadioGroupField, TextAreaField, InputField,
} from '@fpsak-frontend/form';

import styles from './belopetMottattIGodTroFormPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const minValue1 = minValue(1);

const parseCurrencyInput = (input) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : parsedValue;
};

const BelopetMottattIGodTroFormPanel = ({
  readOnly,
  erBelopetIBehold,
}) => (
  <>
    <Element>
      <FormattedMessage id="BelopetMottattIGodTroFormPanel.BelopetMottattIGodTro" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="godTroBegrunnelse"
      label={{ id: 'BelopetMottattIGodTroFormPanel.Vurdering' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
    <Undertekst><FormattedMessage id="BelopetMottattIGodTroFormPanel.BelopetIBehold" /></Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="erBelopetIBehold"
      readOnly={readOnly}
    >
      <RadioOption label={<FormattedMessage id="BelopetMottattIGodTroFormPanel.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BelopetMottattIGodTroFormPanel.Nei" />} value={false} />
    </RadioGroupField>
    <div className={styles.arrowbox}>
      {erBelopetIBehold === true && (
        <ArrowBox alignOffset={25}>
          <InputField
            name="tilbakekrevdBelop"
            label={{ id: 'BelopetMottattIGodTroFormPanel.AngiBelop' }}
            validate={[required, minValue1]}
            readOnly={readOnly}
            format={formatCurrencyNoKr}
            parse={parseCurrencyInput}
            bredde="S"
          />
        </ArrowBox>
      )}
      {erBelopetIBehold === false && (
        <ArrowBox alignOffset={90}>
          <Normaltekst>
            <FormattedMessage id="BelopetMottattIGodTroFormPanel.IngenTilbakekreving" />
          </Normaltekst>
        </ArrowBox>
      )}
    </div>
  </>
);

BelopetMottattIGodTroFormPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erBelopetIBehold: PropTypes.bool,
};

BelopetMottattIGodTroFormPanel.defaultProps = {
  erBelopetIBehold: undefined,
};

BelopetMottattIGodTroFormPanel.transformValues = info => ({
  '@type': 'godTro',
  begrunnelse: info.godTroBegrunnelse,
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevesBelop: info.erBelopetIBehold ? removeSpacesFromNumber(info.tilbakekrevdBelop) : undefined,
});

BelopetMottattIGodTroFormPanel.buildIntialValues = info => ({
  godTroBegrunnelse: info.begrunnelse,
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevdBelop: info.tilbakekrevesBelop,
});

export default BelopetMottattIGodTroFormPanel;
