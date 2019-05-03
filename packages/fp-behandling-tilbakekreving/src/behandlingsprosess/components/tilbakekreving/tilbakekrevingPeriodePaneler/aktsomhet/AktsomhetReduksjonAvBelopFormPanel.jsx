import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import {
  VerticalSpacer, ArrowBox, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import {
  RadioOption, RadioGroupField, SelectField, InputField,
} from '@fpsak-frontend/form';

import { required, formatCurrencyNoKr, minValue } from '@fpsak-frontend/utils';

import aktsomhet from 'behandlingTilbakekreving/src/kodeverk/aktsomhet';

import styles from './aktsomhetReduksjonAvBelopFormPanel.less';

const minValue1 = minValue(1);

const parseCurrencyInput = (input) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : parsedValue;
};

const andeler = ['30', '50', '70'];

const AktsomhetReduksjonAvBelopFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
}) => (
  <>
    <Row>
      <Column md="12">
        <VerticalSpacer eightPx />
        <Undertekst><FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalSarligeGrunnerGiReduksjon" /></Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          validate={[required]}
          name="harGrunnerTilReduksjon"
          readOnly={readOnly}
        >
          <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
          <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
        </RadioGroupField>
      </Column>
    </Row>
    {harGrunnerTilReduksjon && (
      <ArrowBox alignOffset={24}>
        <Row>
          <Column md="6">
            {!harMerEnnEnYtelse && (
              <>
                <Undertekst><FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.AngiAndelSomTilbakekreves" /></Undertekst>
                <FlexRow>
                  <FlexColumn>
                    <SelectField
                      name="andelSomTilbakekreves"
                      label=""
                      validate={[required]}
                      selectValues={andeler.map(andel => <option key={andel} value={andel}>{andel}</option>)}
                      bredde="s"
                    />
                  </FlexColumn>
                  <FlexColumn className={styles.suffix}>%</FlexColumn>
                </FlexRow>
              </>
            )}
            {harMerEnnEnYtelse && (
              <InputField
                name="belopSomSkalTilbakekreves"
                label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.AngiBelopSomSkalTilbakekreves" />}
                validate={[required, minValue1]}
                readOnly={readOnly}
                format={formatCurrencyNoKr}
                parse={parseCurrencyInput}
                bredde="S"
              />
            )}
          </Column>
          {handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM && (
            <Column md="6">
              <Undertekst><FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" /></Undertekst>
              <Normaltekst className={styles.labelPadding}><FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" /></Normaltekst>
            </Column>
          )}
        </Row>
      </ArrowBox>
    )}
    {harGrunnerTilReduksjon === false && (
      <ArrowBox alignOffset={90}>
        <Row>
          <Column md="6">
            <Undertekst>
              <FormattedMessage
                id={harMerEnnEnYtelse ? 'AktsomhetReduksjonAvBelopFormPanel.BelopSomSkalTilbakekreves'
                : 'AktsomhetReduksjonAvBelopFormPanel.andelSomTilbakekreves'}
              />
            </Undertekst>
            <Normaltekst className={styles.labelPadding}>{harMerEnnEnYtelse ? formatCurrencyNoKr(feilutbetalingBelop) : '100%'}</Normaltekst>
          </Column>
          { handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM && (
            <Column md="6">
              <RadioGroupField
                label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" />}
                validate={[required]}
                name="skalDetTilleggesRenter"
                readOnly={readOnly}
              >
                <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
                <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
              </RadioGroupField>
            </Column>
          )}
        </Row>
      </ArrowBox>
    )}
  </>
);

AktsomhetReduksjonAvBelopFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
};

AktsomhetReduksjonAvBelopFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
};

export default AktsomhetReduksjonAvBelopFormPanel;
