import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';

import tilbakekrevingKodeverkTyper from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingKodeverkTyper';
import { getTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';
import { behandlingFormTilbakekreving } from '../../../behandlingFormTilbakekreving';
import TilbakekrevingTimelineData from '../felles/splittePerioder/TilbakekrevingTimelineData';

import styles from './foreldelsePeriodeForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const FORELDELSE_PERIODE_FORM_NAME = 'foreldelsesresultatActivity';

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
              {foreldelseVurderingTyper.map((type) => <RadioOption key={type.kode} label={type.navn} value={type.kode} />)}
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
  readOnly: PropTypes.bool.isRequired,
  foreldelseVurderingTyper: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
  setNestePeriode: PropTypes.func.isRequired,
  setForrigePeriode: PropTypes.func.isRequired,
  oppdaterSplittedePerioder: PropTypes.func.isRequired,
  ...formPropTypes,
};

const oldForeldetValue = (fvType) => (fvType.kode !== foreldelseVurderingType.UDEFINERT ? fvType.kode : null);
const checkForeldetValue = (selectedItemData) => (selectedItemData.foreldet ? selectedItemData.foreldet
  : oldForeldetValue(selectedItemData.foreldelseVurderingType));

const buildInitalValues = (periode) => ({
  ...periode,
  foreldet: checkForeldetValue(periode),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const initialValues = buildInitalValues(ownProps.periode);
  const onSubmit = (values) => ownProps.oppdaterPeriode(values);
  const foreldelseVurderingTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING)(initialState)
    .filter((fv) => fv.kode !== foreldelseVurderingType.IKKE_VURDERT);
  return () => ({
    initialValues,
    onSubmit,
    foreldelseVurderingTyper,
  });
};

const ForeldelsePeriodeForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingFormTilbakekreving({
  form: FORELDELSE_PERIODE_FORM_NAME,
  enableReinitialize: true,
})(ForeldelsePeriodeFormImpl)));

export default ForeldelsePeriodeForm;
