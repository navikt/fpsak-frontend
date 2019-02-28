import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import {
  VerticalSpacer, ArrowBox, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import {
  RadioOption, RadioGroupField, CheckboxField, SelectField, TextAreaField,
} from '@fpsak-frontend/form';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import styles from './tilbakekrevingForm.less';
import tilbakekrevingCodes from './tilbakekrevingCodes';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const andeler = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
const uaktsomhetCodes = [
  tilbakekrevingCodes.GROVUAKTSOMHET,
  tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER,
];

const HandletUaktsomhetGrad = ({
  grunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  annet,
  resetAnnetTextField,
}) => (
  <>
    { handletUaktsomhetGrad === tilbakekrevingCodes.FORSETT
    && (
      <div className={styles.marginBottom20}>
        <ArrowBox alignOffset={12}>
          <Normaltekst>
            <FormattedMessage id="Tilbakekreving.RadioGroup.Andel" />
          </Normaltekst>
          <Normaltekst>100%</Normaltekst>
          <Normaltekst>
            <FormattedMessage id="Tilbakekreving.RadioGroup.Renter" />
          </Normaltekst>
        </ArrowBox>
      </div>
    )
    }
    {uaktsomhetCodes.includes(handletUaktsomhetGrad)
    && (
      <div className={styles.marginBottom20}>
        <ArrowBox alignOffset={112}>
          <div>
            <Row>
              <Column md="12">
                <Undertekst><FormattedMessage id="Tilbakekreving.CheckboxGroup.GrunnerTilReduksjon" /></Undertekst>
                <VerticalSpacer eightPx />
                <CheckboxField
                  name="uaktsomhetRetterSeg"
                  label={<FormattedMessage id="Tilbakekreving.Checkbox.UaktsomhetRetterSeg" />}
                />
                <CheckboxField
                  name="feilTilskrivesTilNav"
                  label={<FormattedMessage id="Tilbakekreving.Checkbox.FeilTilskrivesTilNav" />}
                />
                <CheckboxField
                  name="feilutbetalingStørrelsen"
                  label={<FormattedMessage id="Tilbakekreving.Checkbox.FeilutbetalingStørrelsen" />}
                />
                <CheckboxField
                  name="tideSidenFeilutbetaling"
                  label={<FormattedMessage id="Tilbakekreving.Checkbox.TideSidenFeilutbetaling" />}
                />
                <CheckboxField
                  name="annet"
                  label={<FormattedMessage id="Tilbakekreving.Checkbox.Annet" />}
                  onChange={resetAnnetTextField}
                />
              </Column>
            </Row>
            {annet
              && (
              <ArrowBox alignOffset={16}>
                <Row>
                  <Column md="12">
                    <TextAreaField
                      name="annetTekst"
                      label=""
                      validate={[required, minLength3, maxLength1500, hasValidText]}
                      maxLength={1500}
                      readOnly={readOnly}
                      id="annetTekst"
                    />
                  </Column>
                </Row>
              </ArrowBox>
              )
            }
            <Row>
              <Column md="12">
                <VerticalSpacer eightPx />
                <Undertekst><FormattedMessage id="Tilbakekreving.RadioGroup.GrunnerTilReduksjon" /></Undertekst>
                <VerticalSpacer eightPx />
                <RadioGroupField
                  validate={[required]}
                  name="grunnerTilReduksjon"
                  readOnly={readOnly}
                >
                  <RadioOption label={<FormattedMessage id="Tilbakekreving.Ja" />} value />
                  <RadioOption label={<FormattedMessage id="Tilbakekreving.Nei" />} value={false} />
                </RadioGroupField>
              </Column>
            </Row>
            {grunnerTilReduksjon
              && (
              <ArrowBox alignOffset={16}>
                <Row>
                  <Column md="6">
                    <Undertekst><FormattedMessage id="Tilbakekreving.andelSomTilbakekreves" /></Undertekst>
                    <FlexRow>
                      <FlexColumn>
                        <SelectField
                          name="andelSomTilbakekreves"
                          label=""
                          validate={[required]}
                          selectValues={andeler.map(andel => <option key={andel} value={andel}>{andel}</option>)}
                          bredde="m"
                        />
                      </FlexColumn>
                      <FlexColumn className={styles.suffix}>%</FlexColumn>
                    </FlexRow>
                  </Column>
                </Row>
              </ArrowBox>
              )
            }
          </div>
        </ArrowBox>
      </div>
    )
    }
  </>
);


HandletUaktsomhetGrad.propTypes = {
  grunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  annet: PropTypes.bool,
  resetAnnetTextField: PropTypes.func.isRequired,
};

HandletUaktsomhetGrad.defaultProps = {
  annet: false,
  grunnerTilReduksjon: false,
};

export default HandletUaktsomhetGrad;
