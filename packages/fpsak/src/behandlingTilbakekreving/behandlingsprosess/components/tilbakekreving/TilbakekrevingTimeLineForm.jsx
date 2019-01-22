import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingTilbakekreving/behandlingForm';
import { Column, Row } from 'nav-frontend-grid';
import {
  RadioOption, RadioGroupField, TextAreaField, CheckboxField, SelectField,
} from '@fpsak-frontend/form';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Undertekst } from 'nav-frontend-typografi';
import tilbakekrevingCodes from './tilbakekrevingCodes';
import TilbakekrevingPeriodSummary from './TilbakekrevingPeriodSummary';
import styles from './tilbakekrevingTimeLineForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const readOnly = false;
const handleSubmit = () => null;
const feilutbetalingÅrsakOptions = ['Tilbakekreving.Arbeid'];

export const TilbakekrevingTimeLineFormImpl = ({
  periodenForeldet,
  arbeid,
  sykdom,
  institusjonsopphold,
  uttakEndring,
  opptjeningEndring,
  medlemskapEndring,
  morsAktivitet,
  død,
  utbetalingFeil,
  selectedItemData,
}) => (
  <>
    <form onSubmit={handleSubmit}>
      <Row>
        <Column md="6">
          <TilbakekrevingPeriodSummary
            feilutbetaling={selectedItemData.feilutbetaling}
            fom={selectedItemData.fom}
            tom={selectedItemData.tom}
          />
        </Column>
        <Column md="6">
          <Undertekst><FormattedMessage id="Tilbakekreving.PeriodenForeldet" /></Undertekst>
          <VerticalSpacer eightPx />
          <RadioGroupField
            validate={[required]}
            name="periodenForeldet"
            direction="vertical"
            readOnly={readOnly}
          >
            <RadioOption label={<FormattedMessage id="Tilbakekreving.Foreldet" />} value={tilbakekrevingCodes.FORELDET} />
            <RadioOption label={<FormattedMessage id="Tilbakekreving.IkkeForeldet" />} value={tilbakekrevingCodes.IKKE_FORELDET} />
            <RadioOption label={<FormattedMessage id="Tilbakekreving.IkkeForeldetTilleggsfrist" />} value={tilbakekrevingCodes.IKKE_FORELDET_TILLEGGSFRIST} />
          </RadioGroupField>
        </Column>
      </Row>
      {periodenForeldet === tilbakekrevingCodes.IKKE_FORELDET && (
        <>
          <Row>
            <Column md="6">
              <Undertekst><FormattedMessage id="Tilbakekreving.FeilutbetalingÅrsak" /></Undertekst>
              <VerticalSpacer eightPx />
            </Column>
          </Row>
          <Row>
            <Column md="4" sm="6" xs="12">
              <CheckboxField
                name="arbeid"
                label={<FormattedMessage id="Tilbakekreving.Arbeid" />}
              />
              {arbeid && (
                <div className={styles.selectField}>
                  <SelectField
                    name="arbeidUttsetelseÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="gradering"
                label={<FormattedMessage id="Tilbakekreving.Gradering" />}
              />
              <CheckboxField
                name="ferie"
                label={<FormattedMessage id="Tilbakekreving.Ferie" />}
              />
              <CheckboxField
                name="sykdom"
                label={<FormattedMessage id="Tilbakekreving.Sykdom" />}
              />
              {sykdom && (
                <div className={styles.selectField}>
                  <SelectField
                    name="sykdomUttsetelseÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="institusjonsopphold"
                label={<FormattedMessage id="Tilbakekreving.Institusjonsopphold" />}
              />
              {institusjonsopphold && (
                <div className={styles.selectField}>
                  <SelectField
                    name="institusjonsoppholdUttsetelseÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
            </Column>
            <Column md="4" sm="6" xs="12">
              <CheckboxField
                name="uttakEndring"
                label={<FormattedMessage id="Tilbakekreving.UttakEndring" />}
              />
              {uttakEndring && (
                <div className={styles.selectField}>
                  <SelectField
                    name="uttakEndringÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="beregningEndring"
                label={<FormattedMessage id="Tilbakekreving.BeregningEndring" />}
              />
              <CheckboxField
                name="opptjeningEndring"
                label={<FormattedMessage id="Tilbakekreving.OpptjeningEndring" />}
              />
              {opptjeningEndring && (
                <div className={styles.selectField}>
                  <SelectField
                    name="opptjeningEndringÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="medlemskapEndring"
                label={<FormattedMessage id="Tilbakekreving.MedlemskapEndring" />}
              />
              {medlemskapEndring && (
                <div className={styles.selectField}>
                  <SelectField
                    name="medlemskapEndringÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="dekningsgradEndring"
                label={<FormattedMessage id="Tilbakekreving.DekningsgradEndring" />}
              />
            </Column>
            <Column md="4" sm="6" xs="12">
              <CheckboxField
                name="morsAktivitet"
                label={<FormattedMessage id="Tilbakekreving.MorsAktivitet" />}
              />
              {morsAktivitet && (
                <div className={styles.selectField}>
                  <SelectField
                    name="morsAktivitetÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="ikkeAleneomsorg"
                label={<FormattedMessage id="Tilbakekreving.IkkeAleneomsorg" />}
              />
              <CheckboxField
                name="ikkeBarnetomsorg"
                label={<FormattedMessage id="Tilbakekreving.IkkeBarnetomsorg" />}
              />
              <CheckboxField
                name="død"
                label={<FormattedMessage id="Tilbakekreving.Død" />}
              />
              {død && (
                <div className={styles.selectField}>
                  <SelectField
                    name="dødÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="utbetalingFeil"
                label={<FormattedMessage id="Tilbakekreving.UtbetalingFeil" />}
              />
              {utbetalingFeil && (
                <div className={styles.selectField}>
                  <SelectField
                    name="utbetalingFeilÅrsak"
                    validate={[required]}
                    selectValues={feilutbetalingÅrsakOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    bredde="xxl"
                  />
                </div>
              )
              }
              <CheckboxField
                name="annet"
                label={<FormattedMessage id="Tilbakekreving.Annet" />}
              />
            </Column>
          </Row>
        </>
      )
      }
      <Row>
        <Column md="6">
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'Tilbakekreving.Vurdering' }}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            id="tilbakekrevingVurdering"
          />
        </Column>
      </Row>
    </form>
  </>
);

export const transformValues = values => [{
  ...values,
}];

TilbakekrevingTimeLineFormImpl.propTypes = {
  selectedItemData: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
};

const mapStateToProps = (state, initialProps) => ({
  arbeid: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'arbeid'),
  utbetalingFeil: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'utbetalingFeil'),
  død: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'død'),
  morsAktivitet: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'morsAktivitet'),
  medlemskapEndring: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'medlemskapEndring'),
  opptjeningEndring: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'opptjeningEndring'),
  uttakEndring: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'uttakEndring'),
  institusjonsopphold: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'institusjonsopphold'),
  sykdom: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'sykdom'),
  periodenForeldet: behandlingFormValueSelector(initialProps.activityPanelName)(state, 'periodenForeldet'),
  onSubmit: values => initialProps.submitCallback(transformValues(values)),
});

const TilbakekrevingTimeLineForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: 'tilbakekrevingsresultatActivity',
  enableReinitialize: true,
})(TilbakekrevingTimeLineFormImpl)));

export default TilbakekrevingTimeLineForm;
