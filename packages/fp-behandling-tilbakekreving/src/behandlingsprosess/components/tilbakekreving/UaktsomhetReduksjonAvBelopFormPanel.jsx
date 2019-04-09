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
import { required, parseCurrencyInput, formatCurrencyNoKr } from '@fpsak-frontend/utils';

import aktsomhet from '../../../kodeverk/aktsomhet';

import styles from './uaktsomhetReduksjonAvBelopFormPanel.less';

const andeler = ['30', '50', '70'];

const UaktsomhetReduksjonAvBelopFormPanel = ({
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
        <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.SkalSarligeGrunnerGiReduksjon" /></Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          validate={[required]}
          name="harGrunnerTilReduksjon"
          readOnly={readOnly}
        >
          <RadioOption label={<FormattedMessage id="UaktsomhetGradFormPanel.Ja" />} value />
          <RadioOption label={<FormattedMessage id="UaktsomhetGradFormPanel.Nei" />} value={false} />
        </RadioGroupField>
      </Column>
    </Row>
    {harGrunnerTilReduksjon && (
      <ArrowBox alignOffset={24}>
        <Row>
          <Column md="6">
            {!harMerEnnEnYtelse && (
              <>
                <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.AngiAndelSomTilbakekreves" /></Undertekst>
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
                label={<FormattedMessage id="UaktsomhetGradFormPanel.AngiBelopSomSkalTilbakekreves" />}
                validate={[required]}
                readOnly={readOnly}
                parse={parseCurrencyInput}
                bredde="S"
              />
            )}
          </Column>
          {handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM && (
            <Column md="6">
              <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.SkalTilleggesRenter" /></Undertekst>
              <Normaltekst className={styles.labelPadding}><FormattedMessage id="UaktsomhetGradFormPanel.Nei" /></Normaltekst>
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
                id={harMerEnnEnYtelse ? 'UaktsomhetGradFormPanel.BelopSomSkalTilbakekreves' : 'UaktsomhetGradFormPanel.andelSomTilbakekreves'}
              />
            </Undertekst>
            <Normaltekst className={styles.labelPadding}>{harMerEnnEnYtelse ? formatCurrencyNoKr(feilutbetalingBelop) : '100%'}</Normaltekst>
          </Column>
          { handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM && (
            <Column md="6">
              <RadioGroupField
                label={<FormattedMessage id="UaktsomhetGradFormPanel.SkalTilleggesRenter" />}
                validate={[required]}
                name="skalDetTilleggesRenter"
                readOnly={readOnly}
              >
                <RadioOption label={<FormattedMessage id="UaktsomhetGradFormPanel.Ja" />} value />
                <RadioOption label={<FormattedMessage id="UaktsomhetGradFormPanel.Nei" />} value={false} />
              </RadioGroupField>
            </Column>
          )}
        </Row>
      </ArrowBox>
    )}
  </>
);

UaktsomhetReduksjonAvBelopFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
};

UaktsomhetReduksjonAvBelopFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
};

export default UaktsomhetReduksjonAvBelopFormPanel;
