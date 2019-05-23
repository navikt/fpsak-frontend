import React, { Component } from 'react';
import { reduxForm, formPropTypes, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from '@fpsak-frontend/utils';

import { getRegisteredFields } from 'papirsoknad/src/duck';
import SoknadData from 'papirsoknad/src/SoknadData';
import LagreSoknadForm from 'papirsoknad/src/components/commonPanels/LagreSoknadPanel';
import MottattDatoPanel from 'papirsoknad/src/components/commonPanels/MottattDatoPanel';
import PermisjonPanel, { TIDSROM_PERMISJON_FORM_NAME_PREFIX } from './permisjon/PermisjonPanel';

const ENDRING_FORELDREPENGER_FORM_NAME = 'EndringForeldrepengerForm';

const buildInitialValues = () => ({ ...PermisjonPanel.initialValues });

/**
 * TODO skriv dok
 */
export class EndringForeldrepengerForm extends Component {
  componentWillReceiveProps(nextProps) {
    const { soknadData } = this.props;
    if (!isEqual(soknadData, nextProps.soknadData)) {
      nextProps.initialize(buildInitialValues());
    }
  }

  render() {
    const {
      handleSubmit, submitting, form, readOnly, soknadData, onSubmitUfullstendigsoknad,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <MottattDatoPanel readOnly={readOnly} />
        <PermisjonPanel
          soknadData={soknadData}
          form={form}
          readOnly={readOnly}
        />
        <LagreSoknadForm readOnly={readOnly} onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad} form={form} submitting={submitting} />
      </form>
    );
  }
}

const mapStateToPropsFactory = (initialState, ownProps) => {
  const validate = values => PermisjonPanel.validate(values, ownProps.soknadData);
  const initialValues = buildInitialValues();

  return (state) => {
    const registeredFields = getRegisteredFields(ENDRING_FORELDREPENGER_FORM_NAME)(state);
    const registeredFieldNames = Object.values(registeredFields).map(rf => rf.name);
    const valuesForRegisteredFieldsOnly = registeredFieldNames.length
      ? {
        ...formValueSelector(ENDRING_FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames),
        [TIDSROM_PERMISJON_FORM_NAME_PREFIX]: PermisjonPanel
          .transformValues(formValueSelector(ENDRING_FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames)),
      }
      : {};

    return {
      initialValues,
      valuesForRegisteredFieldsOnly,
      validate,
    };
  };
};

EndringForeldrepengerForm.propTypes = {
  ...formPropTypes,
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
};

EndringForeldrepengerForm.defaultProps = {
  readOnly: true,
};


export default connect(mapStateToPropsFactory)(reduxForm({
  form: ENDRING_FORELDREPENGER_FORM_NAME,
  enableReinitialize: true,
})(EndringForeldrepengerForm));
