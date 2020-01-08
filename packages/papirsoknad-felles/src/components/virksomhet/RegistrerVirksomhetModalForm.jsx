import React from 'react';
import { FormSection, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Undertittel } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import getRegisteredFields from '../../papirsoknadUtils';
import VirksomhetIdentifikasjonPanel from './VirksomhetIdentifikasjonPanel';
import VirksomhetRegnskapPanel from './VirksomhetRegnskapPanel';
import VirksomhetStartetEndretPanel from './VirksomhetStartetEndretPanel';
import VirksomhetRelasjonPanel from './VirksomhetRelasjonPanel';
import VirksomhetTypeNaringPanel from './VirksomhetTypeNaringPanel';

import styles from './registrerVirksomhetModalForm.less';

const REGISTRER_VIRKSOMHET_FORM_NAME = 'VirksomhetForm';
const TYPE_VIRKSOMHET_PREFIX = 'typeVirksomhet';

/**
 * RegistrerVirksomhetModalForm
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og saksbehandler skal legge til ny virksomhet for
 * søker.
 */
export const RegistrerVirksomhetModalForm = ({
  showModal,
  closeEvent,
  handleSubmit,
  readOnly,
  intl,
  alleKodeverk,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    contentLabel={intl.formatMessage({ id: 'Registrering.RegistrerVirksomhetModalForm.ModalDescription' })}
    onRequestClose={closeEvent}
    closeButton={false}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
  >
    <form className={styles.form}>
      <Undertittel><FormattedMessage id="Registrering.RegistrerVirksomhetModalForm.Title" /></Undertittel>
      <VerticalSpacer twentyPx />
      <VirksomhetIdentifikasjonPanel
        intl={intl}
        readOnly={readOnly}
        form={REGISTRER_VIRKSOMHET_FORM_NAME}
        alleKodeverk={alleKodeverk}
      />
      <FormSection name={TYPE_VIRKSOMHET_PREFIX}>
        <VirksomhetTypeNaringPanel
          readOnly={readOnly}
          form={REGISTRER_VIRKSOMHET_FORM_NAME}
          namePrefix={TYPE_VIRKSOMHET_PREFIX}
          alleKodeverk={alleKodeverk}
        />
      </FormSection>
      <VirksomhetStartetEndretPanel readOnly={readOnly} form={REGISTRER_VIRKSOMHET_FORM_NAME} />
      <VirksomhetRegnskapPanel readOnly={readOnly} form={REGISTRER_VIRKSOMHET_FORM_NAME} />
      <VirksomhetRelasjonPanel readOnly={readOnly} form={REGISTRER_VIRKSOMHET_FORM_NAME} />
      <VerticalSpacer sixteenPx />
      <Hovedknapp
        htmlType="button"
        onClick={handleSubmit}
        readOnly={readOnly}
        className={styles.savebutton}
        mini
      >
        {intl.formatMessage({ id: 'Registrering.RegistrerVirksomhetModalForm.Save' })}
      </Hovedknapp>
      <Knapp
        htmlType="button"
        onClick={closeEvent}
        readOnly={readOnly}
        className={styles.cancelbutton}
        mini
      >
        {intl.formatMessage({ id: 'Registrering.RegistrerVirksomhetModalForm.Cancel' })}
      </Knapp>
    </form>
  </Modal>
);

RegistrerVirksomhetModalForm.propTypes = {
  showModal: PropTypes.bool,
  closeEvent: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

RegistrerVirksomhetModalForm.defaultProps = {
  showModal: false,
  readOnly: false,
};

const mapStateToProps = (state) => {
  const registeredFields = getRegisteredFields(REGISTRER_VIRKSOMHET_FORM_NAME)(state);
  const registeredFieldNames = registeredFields ? Object.values(registeredFields).map((rf) => rf.name) : [];
  const valuesForRegisteredFieldsOnly = registeredFieldNames.length
    ? formValueSelector(REGISTRER_VIRKSOMHET_FORM_NAME)(state, ...registeredFieldNames)
    : {};
  return {
    valuesForRegisteredFieldsOnly,
  };
};

export default connect(mapStateToProps)(reduxForm({
  enableReinitialize: true,
  validate: VirksomhetIdentifikasjonPanel.validate,
  form: REGISTRER_VIRKSOMHET_FORM_NAME,
})(injectIntl(RegistrerVirksomhetModalForm)));
