import React from 'react';
import PropTypes from 'prop-types';
import { required } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import {
  VerticalSpacer, ArrowBox, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import {
  RadioOption, RadioGroupField, CheckboxField, SelectField,
} from '@fpsak-frontend/form';
import styles from './tilbakekrevingForm.less';
import tilbakekrevingCodes from './tilbakekrevingCodes';

const andeler = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
const uaktsomhetCodes = [
  tilbakekrevingCodes.GROVUAKTSOMHET,
  tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER,
];

const HandletUaktsomhetGrad = ({
  grunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
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
          {grunnerTilReduksjon && (
            <div>
              <Row>
                <Column md="12">
                  <ArrowBox alignOffset={12}>
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
                    />
                  </ArrowBox>
                </Column>
              </Row>
              <VerticalSpacer eightPx />
              <Row>
                <Column md="6">
                  <Undertekst><FormattedMessage id="Tilbakekreving.andelSomTilbakekreves" /></Undertekst>
                  <FlexRow>
                    <FlexColumn>
                      <SelectField
                        name="andelSomTilbakekreves"
                        validate={[required]}
                        selectValues={andeler.map(andel => <option key={andel} value={andel}>{andel}</option>)}
                        bredde="m"
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.suffix}>%</FlexColumn>
                  </FlexRow>
                </Column>
                <Column md="6">
                  <Normaltekst>
                    <FormattedMessage id="Tilbakekreving.RenterTillegges" />
                  </Normaltekst>
                  <VerticalSpacer twentyPx />
                  <Normaltekst><FormattedMessage id="Tilbakekreving.Nei" /></Normaltekst>
                </Column>
              </Row>
            </div>
          )
          }
        </ArrowBox>
      </div>
    )
    }
  </>
);


HandletUaktsomhetGrad.propTypes = {
  grunnerTilReduksjon: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
};

export default HandletUaktsomhetGrad;
