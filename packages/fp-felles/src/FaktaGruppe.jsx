import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';

const Wrapper = ({
  withoutBorder, error, children, className,
}) => (
  withoutBorder
    ? children
    : <BorderBox error={error} className={className}>{children}</BorderBox>
);

Wrapper.propTypes = {
  error: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  withoutBorder: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
};

/**
 * FaktaGruppe
 *
 * Presentasjonskomponent. Grupperingsboks til bruk i faktapaneler, med eller uten ramme. Man kan også spesifisere hvilket aksjonspunkt
 * gruppen hører til, slik at gruppen får rød ramme hvis beslutter har lagt inn merknader.
 */
const FaktaGruppe = ({
  merknaderFraBeslutter,
  titleCode,
  children,
  withoutBorder,
  className,
}) => {
  const error = !!(merknaderFraBeslutter && merknaderFraBeslutter.notAccepted);
  return (
    <Wrapper withoutBorder={withoutBorder && !error} error={error} className={className}>
      {titleCode
      && (
      <div>
        <Element><FormattedMessage id={titleCode} /></Element>
        <VerticalSpacer twentyPx />
      </div>
      )}
      {children}
    </Wrapper>
  );
};

FaktaGruppe.propTypes = {
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
  titleCode: PropTypes.string,
  withoutBorder: PropTypes.bool,
  className: PropTypes.string,
};

FaktaGruppe.defaultProps = {
  titleCode: '',
  withoutBorder: false,
  className: '',
  merknaderFraBeslutter: undefined,
};

export default FaktaGruppe;
