import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';

import errorHandler from '@fpsak-frontend/error-api-redux';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';

import styles from './errorMessagePanel.less';

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
export class ErrorMessagePanel extends Component {
  constructor() {
    super();

    this.state = {
      isModalOpen: false,
      selectedErrorMsgIndex: undefined,
    };

    this.toggleModalOnClick = this.toggleModalOnClick.bind(this);
    this.toggleModalOnKeyDown = this.toggleModalOnKeyDown.bind(this);
  }

  toggleModalOnClick(event, index) {
    const { isModalOpen } = this.state;
    this.setState({
      isModalOpen: !isModalOpen,
      selectedErrorMsgIndex: index,
    });

    if (event) event.preventDefault();
  }

  toggleModalOnKeyDown(event, index) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleModal(event, index);
    } else {
      event.preventDefault();
    }
  }

  render() {
    const {
      showDetailedErrorMessages, errorMessages, removeErrorMessage, intl,
    } = this.props;
    const { isModalOpen, selectedErrorMsgIndex } = this.state;

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <div className={styles.container}>
        {errorMessages.map((message, index) => (
          <Row key={message}>
            <Column xs="11">
              <Undertekst className={styles.wordWrap}>
                {`${decodeHtmlEntity(message.message)} `}
              </Undertekst>
              {showDetailedErrorMessages && message.additionalInfo
              && (
                <Undertekst>
                  <a
                    href=""
                    onClick={event => this.toggleModalOnClick(event, index)}
                    onKeyDown={event => this.toggleModalOnKeyDown(event, index)}
                    className={styles.link}
                  >
                    <FormattedMessage id="ErrorMessagePanel.ErrorDetails" />
                  </a>
                </Undertekst>
              )}
            </Column>
          </Row>
        ))}
        <div className={styles.lukkContainer}>
          <Lukknapp hvit onClick={removeErrorMessage}>{intl.formatMessage({ id: 'ErrorMessagePanel.Close' })}</Lukknapp>
        </div>
        {isModalOpen
          && (
          <ErrorMessageDetailsModal
            showModal={isModalOpen}
            closeModalFn={this.toggleModalOnClick}
            errorDetails={errorMessages[selectedErrorMsgIndex].additionalInfo}
          />
          )
        }
      </div>
    );
  }
}

ErrorMessagePanel.propTypes = {
  intl: intlShape.isRequired,
  showDetailedErrorMessages: PropTypes.bool.isRequired,
  errorMessages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
    additionalInfo: PropTypes.shape(),
  }).isRequired).isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
};

export const getErrorMessageList = createSelector([(state, ownProps) => ownProps, errorHandler.getAllErrorMessages], (ownProps, allErrorMessages = []) => {
  const { queryStrings, intl } = ownProps;
  const errorMessages = [];

  if (queryStrings.errorcode) {
    errorMessages.push({ message: intl.formatMessage({ id: queryStrings.errorcode }) });
  }
  if (queryStrings.errormessage) {
    errorMessages.push({ message: queryStrings.errormessage });
  }

  allErrorMessages.forEach((message) => {
    let msg = { message: (message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text) };
    if (message.params && message.params.errorDetails) {
      msg = {
        ...msg,
        additionalInfo: JSON.parse(decodeHtmlEntity(message.params.errorDetails)),
      };
    }
    errorMessages.push(msg);
  });

  return errorMessages;
});


const mapStateToProps = (state, ownProps) => ({
  errorMessages: getErrorMessageList(state, ownProps),
});

export default injectIntl(connect(mapStateToProps)(ErrorMessagePanel));
