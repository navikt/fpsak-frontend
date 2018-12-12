import React from 'react';
import PropTypes from 'prop-types';
import NavModal from 'nav-frontend-modal';

/**
 * Modal
 *
 * Presentasjonskomponent. Wrapper Modal-komponenten fra nav-frontend-biblioteket, men tillater ikke bruk av propertien 'shouldCloseOnOverlayClick'.
 */
export const Modal = ({ children, ...otherProps }) => {
  NavModal.setAppElement('div#app');
  return (
    <NavModal ariaHideApp={false} {...otherProps}>
      {children}
    </NavModal>
  );
};

Modal.propTypes = {
  ...NavModal.propTypes,
  shouldCloseOnOverlayClick: PropTypes.oneOf([false]),
};

Modal.defaultProps = {
  shouldCloseOnOverlayClick: false,
};

export default Modal;
