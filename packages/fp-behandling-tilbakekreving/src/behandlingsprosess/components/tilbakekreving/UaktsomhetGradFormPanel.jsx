import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

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

import aktsomhet from '../../../kodeverk/aktsomhet';

import styles from './uaktsomhetGradFormPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const andeler = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
const uaktsomhetCodes = [
  aktsomhet.GROVT_UAKTSOM,
  aktsomhet.SIMPEL_UAKTSOM,
];

const UaktsomhetGradFormPanel = ({
  grunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  annet,
  andelSomSkalTilbakekreves,
  resetAnnetTextField,
}) => (
  <>
    { handletUaktsomhetGrad === 'FORSETT' && (
      <div className={styles.arrowbox}>
        <ArrowBox alignOffset={20}>
          <Undertekst>
            <FormattedMessage id="UaktsomhetGradFormPanel.Andel" />
          </Undertekst>
          <Normaltekst>{`${andelSomSkalTilbakekreves} %`}</Normaltekst>
          <VerticalSpacer eightPx />
          <Normaltekst>
            <FormattedMessage id="UaktsomhetGradFormPanel.Renter" />
          </Normaltekst>
        </ArrowBox>
      </div>
    )}
    {uaktsomhetCodes.includes(handletUaktsomhetGrad) && (
      <div className={styles.arrowboxWide}>
        <ArrowBox alignOffset={120}>
          <div>
            <Row>
              <Column md="12">
                <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.GrunnerTilReduksjon" /></Undertekst>
                <VerticalSpacer eightPx />
                <CheckboxField
                  name={sarligGrunn.GRAD_AV_UAKTSOMHET}
                  label={<FormattedMessage id="UaktsomhetGradFormPanel.UaktsomhetRetterSeg" />}
                />
                <CheckboxField
                  name={sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL}
                  label={<FormattedMessage id="UaktsomhetGradFormPanel.FeilTilskrivesTilNav" />}
                />
                <CheckboxField
                  name={sarligGrunn.STOERRELSE_BELOEP}
                  label={<FormattedMessage id="UaktsomhetGradFormPanel.FeilutbetalingStorrelsen" />}
                />
                <CheckboxField
                  name={sarligGrunn.TID_FRA_UTBETALING}
                  label={<FormattedMessage id="UaktsomhetGradFormPanel.TidenSidenFeilutbetaling" />}
                />
                <CheckboxField
                  name={sarligGrunn.ANNET}
                  label={<FormattedMessage id="UaktsomhetGradFormPanel.Annet" />}
                  onChange={resetAnnetTextField}
                />
              </Column>
            </Row>
            {annet
              && (
              <ArrowBox alignOffset={24}>
                <Row>
                  <Column md="12">
                    <TextAreaField
                      name="annetBegrunnelse"
                      label=""
                      validate={[required, minLength3, maxLength1500, hasValidText]}
                      maxLength={1500}
                      readOnly={readOnly}
                    />
                  </Column>
                </Row>
              </ArrowBox>
              )
            }
            <Row>
              <Column md="12">
                <VerticalSpacer eightPx />
                <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.SkalSarligeGrunnerGiReduksjon" /></Undertekst>
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
              <ArrowBox alignOffset={24}>
                <Row>
                  <Column md="6">
                    <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.andelSomTilbakekreves" /></Undertekst>
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

UaktsomhetGradFormPanel.propTypes = {
  grunnerTilReduksjon: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  annet: PropTypes.bool.isRequired,
  resetAnnetTextField: PropTypes.func.isRequired,
  andelSomSkalTilbakekreves: PropTypes.number.isRequired,
};

export default UaktsomhetGradFormPanel;
