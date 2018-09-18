import React, { Component } from 'react';
import { formValueSelector } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Fieldset } from 'nav-frontend-skjema';
import { Row, Column } from 'nav-frontend-grid';

import { ariaCheck, maxLength, hasValidText } from 'utils/validation/validators';
import BorderBox from 'sharedComponents/BorderBox';
import { CheckboxField, TextAreaField } from 'form/Fields';
import LukkPapirsoknadModal from './LukkPapirsoknadModal';

import styles from './lagreSoknadPanel.less';

const maxLength1500 = maxLength(1500);

export class LagreSoknadPanel extends Component {
  constructor() {
    super();
    this.toggleLukkPapirsoknadModal = this.toggleLukkPapirsoknadModal.bind(this);
    this.toggleVerge = this.toggleVerge.bind(this);
    this.state = {
      showLukkSoknadModal: false,
      verge: false,
    };
  }

  toggleLukkPapirsoknadModal() {
    const { showLukkSoknadModal } = this.state;
    this.setState({ showLukkSoknadModal: !showLukkSoknadModal });
  }

  toggleVerge() {
    const { verge } = this.state;
    this.setState({ verge: !verge });
  }

  render() {
    const {
      readOnly, form, submitting, onSubmitUfullstendigsoknad, ufullstendigSoeknad, intl: { formatMessage },
    } = this.props;
    const { showLukkSoknadModal } = this.state;

    return (
      <Row>
        <Column xs="12">
          <BorderBox>
            <Fieldset legend={formatMessage({ id: 'Registrering.SaveApplication.Title' })}>
              <Row>
                <Column xs="12">
                  <div className={styles.flexContainer}>
                    <div className={styles.textFlex}>
                      <TextAreaField
                        name="kommentarEndring"
                        label={formatMessage({ id: 'Registrering.SaveApplication.Description' })}
                        textareaClass={styles.textAreaSettings}
                        maxLength={1500}
                        validate={[maxLength1500, hasValidText]}
                        readOnly={readOnly}
                      />
                    </div>
                    <div className={styles.buttonFlex}>
                      <CheckboxField
                        name="registrerVerge"
                        onChange={this.toggleVerge}
                        label={formatMessage({ id: 'Registrering.Verge' })}
                        readOnly={readOnly}
                      />
                      <CheckboxField
                        name="ufullstendigSoeknad"
                        label={formatMessage({ id: 'Registrering.SaveApplication.OpplysningspliktErIkkeOverholdt' })}
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                </Column>
              </Row>
              <Row>
                <Column xs="12">
                  <div>
                    <div className={styles.right}>
                      <Hovedknapp
                        id="saveButton"
                        mini
                        className={ufullstendigSoeknad ? 'hidden' : ''}
                        spinner={submitting}
                        disabled={readOnly || submitting}
                        onClick={ariaCheck}
                      >
                        {formatMessage({ id: 'Registrering.SaveApplication.SaveButton' })}
                      </Hovedknapp>
                      <Hovedknapp
                        id="endButton"
                        htmlType="button"
                        onClick={this.toggleLukkPapirsoknadModal}
                        mini
                        className={ufullstendigSoeknad ? '' : 'hidden'}
                        spinner={submitting}
                        disabled={readOnly || submitting}
                      >
                        {formatMessage({ id: 'Registrering.SaveApplication.EndButton' })}
                      </Hovedknapp>
                    </div>
                  </div>
                </Column>
              </Row>
            </Fieldset>
            <LukkPapirsoknadModal
              handleSubmit={onSubmitUfullstendigsoknad}
              showModal={showLukkSoknadModal}
              cancelEvent={this.toggleLukkPapirsoknadModal}
              form={form}
            />
          </BorderBox>
        </Column>
      </Row>
    );
  }
}

LagreSoknadPanel.propTypes = {
  intl: intlShape.isRequired,
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  ufullstendigSoeknad: PropTypes.bool,
  submitting: PropTypes.bool.isRequired,
  form: PropTypes.string.isRequired,
};

LagreSoknadPanel.defaultProps = {
  readOnly: true,
  ufullstendigSoeknad: false,
};

const mapStateToProps = (state, ownProps) => ({
  ufullstendigSoeknad: formValueSelector(ownProps.form)(state, 'ufullstendigSoeknad'),
});

export default connect(mapStateToProps)(injectIntl(LagreSoknadPanel));
