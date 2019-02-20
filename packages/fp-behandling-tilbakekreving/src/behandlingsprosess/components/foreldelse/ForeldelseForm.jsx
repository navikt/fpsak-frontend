import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import {
  RadioOption, RadioGroupField, TextAreaField,
} from '@fpsak-frontend/form';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';
import {
  VerticalSpacer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import { getStatusPeriode } from '../felles/behandlingspunktTimelineSkjema/BpTimelineHelper';
import { behandlingForm } from '../../../behandlingForm';
import foreldelseCodes from './foreldelseCodes';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const readOnly = false;
const PERIODE_RESULTAT_TYPE = 'PERIODE_RESULTAT_TYPE';
const innvilgetTekst = 'Innvilget';

export class ForeldelseFormImpl extends Component {
  constructor() {
    super();
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields() {
    const {
      behandlingFormPrefix, activityPanelName, clearFields: clearFormFields, oppfylt,
    } = this.props;
    const fields = [oppfylt];
    clearFormFields(`${behandlingFormPrefix}.${activityPanelName}`, false, false, ...fields);
  }

  render() {
    const {
      cancelSelectedActivity,
      ...formProps
    } = this.props;

    return (
      <>
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
              <RadioOption
                label={<FormattedMessage id="Foreldelse.RadioOption.Foreldet" />}
                value={foreldelseCodes.FORELDET}
              />
              <RadioOption
                label={<FormattedMessage id="Foreldelse.RadioOption.IkkeForeldet" />}
                value={foreldelseCodes.IKKE_FORELDET}
              />
              <RadioOption
                label={<FormattedMessage id="Foreldelse.RadioOption.IkkeForeldetTilleggsfrist" />}
                value={foreldelseCodes.IKKE_FORELDET_TILLEGGSFRIST}
              />
            </RadioGroupField>
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <Hovedknapp
              mini
              htmlType="button"
              onClick={formProps.handleSubmit}
              disabled={formProps.pristine}
            >
              <FormattedMessage id="UttakActivity.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="button" onClick={cancelSelectedActivity}>
              <FormattedMessage id="UttakActivity.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </>
    );
  }
}

ForeldelseFormImpl.propTypes = {
  selectedItemData: PropTypes.shape().isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  activityPanelName: PropTypes.string.isRequired,
  updateActivity: PropTypes.func.isRequired,
  ...formPropTypes,
};

const transformValues = (selectedItemData, values) => {
  const { foreldet, begrunnelse } = values;

  const resultatType = {
    kode: foreldet === foreldelseCodes.FORELDET ? periodeResultatType.AVSLATT : periodeResultatType.INNVILGET,
    navn: innvilgetTekst,
    kodeverk: PERIODE_RESULTAT_TYPE,
  };

  return {
    ...selectedItemData,
    begrunnelse,
    foreldet,
    className: getStatusPeriode(resultatType),
    periodeResultatType: resultatType,
  };
};

const buildInitalValues = selectedItemData => ({ ...selectedItemData });

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const mapStateToProps = (state, initialProps) => ({
  initialValues: buildInitalValues(initialProps.selectedItemData),
  onSubmit: values => initialProps.updateActivity(transformValues(initialProps.selectedItemData, values)),
});

const ForeldelseForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: 'foreldelsesresultatActivity',
  enableReinitialize: true,
})(ForeldelseFormImpl)));

export default ForeldelseForm;
