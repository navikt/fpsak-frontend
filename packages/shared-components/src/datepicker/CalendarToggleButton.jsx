import React, { Component } from 'react';
import PropTypes from 'prop-types';

const generateStyleObject = (inputTop, inputWidth, buttonWidth = 0) => ({
  top: inputTop,
  left: inputWidth - buttonWidth,
});

class CalendarToggleButton extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleButtonRef = this.handleButtonRef.bind(this);
  }

  handleButtonRef(buttonRef) {
    if (buttonRef) {
      this.setState({ buttonWidth: buttonRef.offsetWidth });
      const { buttonRef: buttonRefFn } = this.props;
      buttonRefFn(buttonRef);
    }
  }

  render() {
    const {
      className,
      inputOffsetTop,
      inputOffsetWidth,
      disabled,
      toggleShowCalendar,
    } = this.props;

    const { buttonWidth } = this.state;

    return (
      <button
        type="button"
        ref={this.handleButtonRef}
        className={className}
        style={generateStyleObject(inputOffsetTop, inputOffsetWidth, buttonWidth)}
        disabled={disabled}
        onClick={toggleShowCalendar}
      />
    );
  }
}

CalendarToggleButton.propTypes = {
  toggleShowCalendar: PropTypes.func.isRequired,
  inputOffsetTop: PropTypes.number,
  inputOffsetWidth: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  buttonRef: PropTypes.func,
};

CalendarToggleButton.defaultProps = {
  inputOffsetTop: 0,
  inputOffsetWidth: 0,
  className: '',
  disabled: false,
  buttonRef: () => undefined,
};

export default CalendarToggleButton;
