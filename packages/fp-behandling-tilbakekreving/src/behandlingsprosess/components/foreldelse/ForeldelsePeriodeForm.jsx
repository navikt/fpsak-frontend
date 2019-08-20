import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import {
  RadioOption, RadioGroupField, TextAreaField,
} from '@fpsak-frontend/form';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import {
  VerticalSpacer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';

import tilbakekrevingKodeverkTyper from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingKodeverkTyper';
import { getTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckTilbake';
import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';
import { behandlingForm } from '../../../behandlingForm';
import TilbakekrevingTimelineData from '../felles/splittePerioder/TilbakekrevingTimelineData';

import styles from './foreldelsePeriodeForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const FORELDELSE_PERIODE_FORM_NAME = 'foreldelsesresultatActivity';

const oldForeldetValue = fvType => (fvType.kode !== foreldelseVurderingType.UDEFINERT ? fvType.kode : null);
const checkForeldetValue = selectedItemData => (selectedItemData.foreldet ? selectedItemData.foreldet
  : oldForeldetValue(selectedItemData.foreldelseVurderingType));

export class ForeldelsePeriodeFormImpl extends Component {
  constructor() {
    super();
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields() {
    const {
      behandlingFormPrefix, clearFields: clearFormFields, oppfylt,
    } = this.props;
    const fields = [oppfylt];
    clearFormFields(`${behandlingFormPrefix}.${FORELDELSE_PERIODE_FORM_NAME}`, false, false, ...fields);
  }

  render() {
    const {
      skjulPeriode,
      readOnly,
      foreldelseVurderingTyper,
      periode,
      setNestePeriode,
      setForrigePeriode,
      oppdaterSplittedePerioder,
      ...formProps
    } = this.props;

    return (
      <div className={styles.container}>
        <TilbakekrevingTimelineData
          periode={periode}
          callbackForward={setNestePeriode}
          callbackBackward={setForrigePeriode}
          oppdaterSplittedePerioder={oppdaterSplittedePerioder}
          readOnly={readOnly}
        />
        <VerticalSpacer twentyPx />
        <Row>
          <Column md="6">
            <TextAreaField
              name="begrunnelse"
              label={{ id: 'Foreldelse.Vurdering' }}
              validate={[required, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
              id="foreldelseVurdering"
            />
          </Column>
          <Column md="6">
            <Undertekst><FormattedMessage id="Foreldelse.RadioGroup.Foreldet" /></Undertekst>
            <VerticalSpacer eightPx />
            <RadioGroupField
              validate={[required]}
              name="foreldet"
              direction="vertical"
              readOnly={readOnly}
              onChange={this.resetFields}
            >
              {foreldelseVurderingTyper.map(type => <RadioOption key={type.kode} label={type.navn} value={type.kode} />)}
            </RadioGroupField>
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <Hovedknapp
              mini
              htmlType="button"
              onClick={formProps.handleSubmit || formProps.submitting}
              disabled={formProps.pristine}
              readOnly={readOnly}
              spinner={formProps.submitting}
            >
              <FormattedMessage id="UttakActivity.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="button" onClick={skjulPeriode}>
              <FormattedMessage id="UttakActivity.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </div>
    );
  }
}

ForeldelsePeriodeFormImpl.propTypes = {
  periode: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  skjulPeriode: PropTypes.func.isRequired,
  ...formPropTypes,
};

const transformValues = (periode, values) => {
  const { foreldet, begrunnelse } = values;

  return {
    ...periode,
    begrunnelse,
    foreldet,
  };
};

const buildInitalValues = periode => ({
  ...periode,
  foreldet: checkForeldetValue(periode),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const initialValues = buildInitalValues(ownProps.periode);
  const onSubmit = values => ownProps.oppdaterPeriode(transformValues(ownProps.periode, values));
  const foreldelseVurderingTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING)(initialState)
    .filter(fv => fv.kode !== foreldelseVurderingType.IKKE_VURDERT);
  return () => ({
    initialValues,
    onSubmit,
    foreldelseVurderingTyper,
  });
};

const ForeldelsePeriodeForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: FORELDELSE_PERIODE_FORM_NAME,
  enableReinitialize: true,
})(ForeldelsePeriodeFormImpl)));

export default ForeldelsePeriodeForm;
