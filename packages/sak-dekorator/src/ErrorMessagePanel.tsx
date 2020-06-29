import React, { Component } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';

import styles from './errorMessagePanel.less';

interface OwnProps {
  showDetailedErrorMessages: boolean;
  errorMessages: {
    message: string;
    additionalInfo?: any;
  }[];
  removeErrorMessage: () => void;
}

interface StateProps {
  isModalOpen: boolean;
  selectedErrorMsgIndex?: number;
}

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
export class ErrorMessagePanel extends Component<OwnProps & WrappedComponentProps, StateProps> {
  constructor(props) {
    super(props);

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
      this.toggleModalOnClick(event, index);
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
          <Row key={message.message}>
            <Column xs="11">
              <Undertekst className={styles.wordWrap}>
                {`${decodeHtmlEntity(message.message)} `}
              </Undertekst>
              {showDetailedErrorMessages && message.additionalInfo
              && (
                <Undertekst>
                  <a
                    href=""
                    onClick={(event) => this.toggleModalOnClick(event, index)}
                    onKeyDown={(event) => this.toggleModalOnKeyDown(event, index)}
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
            closeModalFn={this.toggleModalOnClick as () => void}
            errorDetails={errorMessages[selectedErrorMsgIndex].additionalInfo}
          />
          )}
      </div>
    );
  }
}

export default injectIntl(ErrorMessagePanel);
