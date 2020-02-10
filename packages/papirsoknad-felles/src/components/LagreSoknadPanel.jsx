import React, { Component } from 'react';
import { formValueSelector } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';

import { ariaCheck, hasValidText, maxLength } from '@fpsak-frontend/utils';
import {
  BorderBox, FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import { CheckboxField, TextAreaField } from '@fpsak-frontend/form';

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
      readOnly, form, submitting, onSubmitUfullstendigsoknad, ufullstendigSoeknad, intl,
    } = this.props;
    const { showLukkSoknadModal } = this.state;

    return (
      <BorderBox>
        <FlexContainer fluid>
          <FlexRow>
            <FlexColumn className={styles.fullWidth}>
              <SkjemaGruppe legend={intl.formatMessage({ id: 'Registrering.SaveApplication.Title' })}>
                <FlexRow>
                  <FlexColumn className={styles.halfWidth}>
                    <TextAreaField
                      name="kommentarEndring"
                      label={intl.formatMessage({ id: 'Registrering.SaveApplication.Description' })}
                      textareaClass={styles.textAreaSettings}
                      maxLength={1500}
                      validate={[maxLength1500, hasValidText]}
                      readOnly={readOnly}
                    />
                  </FlexColumn>
                  <FlexColumn>
                    <CheckboxField
                      name="registrerVerge"
                      onChange={this.toggleVerge}
                      label={intl.formatMessage({ id: 'Registrering.Verge' })}
                      readOnly={readOnly}
                    />
                    <CheckboxField
                      name="ufullstendigSoeknad"
                      label={intl.formatMessage({ id: 'Registrering.SaveApplication.OpplysningspliktErIkkeOverholdt' })}
                      readOnly={readOnly}
                    />
                  </FlexColumn>
                </FlexRow>
                <FlexRow>
                  <FlexColumn className="justifyItemsToFlexEnd">
                    <Hovedknapp
                      id="saveButton"
                      mini
                      className={ufullstendigSoeknad ? 'hidden' : ''}
                      spinner={submitting}
                      disabled={readOnly || submitting}
                      onClick={ariaCheck}
                    >
                      {intl.formatMessage({ id: 'Registrering.SaveApplication.SaveButton' })}
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
                      {intl.formatMessage({ id: 'Registrering.SaveApplication.EndButton' })}
                    </Hovedknapp>
                  </FlexColumn>
                </FlexRow>
              </SkjemaGruppe>
              <LukkPapirsoknadModal
                handleSubmit={onSubmitUfullstendigsoknad}
                showModal={showLukkSoknadModal}
                cancelEvent={this.toggleLukkPapirsoknadModal}
                form={form}
              />

            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </BorderBox>
    );
  }
}

LagreSoknadPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
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
