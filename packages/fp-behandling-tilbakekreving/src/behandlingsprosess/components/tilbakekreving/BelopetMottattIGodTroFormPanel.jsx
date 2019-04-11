import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
 Undertekst, Element, Normaltekst,
} from 'nav-frontend-typografi';

import {
 minLength, maxLength, hasValidText, required, parseCurrencyInput, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import { VerticalSpacer, ArrowBox } from '@fpsak-frontend/shared-components';
import {
 RadioOption, RadioGroupField, TextAreaField, InputField,
} from '@fpsak-frontend/form';

import styles from './belopetMottattIGodTroFormPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const BelopetMottattIGodTroFormPanel = ({
  readOnly,
  erBelopetIBehold,
}) => (
  <>
    <Element>
      <FormattedMessage id="BelopetMottattIGodTroPanel.BelopetMottattIGodTro" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="godTroBegrunnelse"
      label={{ id: 'BelopetMottattIGodTroPanel.Vurdering' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
    <Undertekst><FormattedMessage id="BelopetMottattIGodTroPanel.BelopetIBehold" /></Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="erBelopetIBehold"
      readOnly={readOnly}
    >
      <RadioOption label={<FormattedMessage id="BelopetMottattIGodTroPanel.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BelopetMottattIGodTroPanel.Nei" />} value={false} />
    </RadioGroupField>
    <div className={styles.arrowbox}>
      {erBelopetIBehold === true && (
      <ArrowBox alignOffset={25}>
        <InputField
          name="tilbakekrevdBelop"
          label={{ id: 'BelopetMottattIGodTroPanel.AngiBelop' }}
          validate={[required]}
          readOnly={readOnly}
          parse={parseCurrencyInput}
          bredde="S"
        />
      </ArrowBox>
    )}
      {erBelopetIBehold === false && (
      <ArrowBox alignOffset={90}>
        <Normaltekst>
          <FormattedMessage id="BelopetMottattIGodTroPanel.IngenTilbakekreving" />
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

BelopetMottattIGodTroFormPanel.transformValuesGodTro = info => ({
  '@type': 'godTro',
  begrunnelse: info.godTroBegrunnelse,
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevesBelop: info.erBelopetIBehold ? removeSpacesFromNumber(info.tilbakekrevdBelop) : undefined,
});

BelopetMottattIGodTroFormPanel.buildIntialValuesGodTro = vilkarResultatInfo => ({
  godTroBegrunnelse: vilkarResultatInfo.begrunnelse,
  erBelopetIBehold: vilkarResultatInfo.erBelopetIBehold,
  tilbakekrevdBelop: vilkarResultatInfo.tilbakekrevesBelop,
});

export default BelopetMottattIGodTroFormPanel;
