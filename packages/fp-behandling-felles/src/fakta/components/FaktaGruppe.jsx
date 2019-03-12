import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
const FaktaGruppeImpl = ({
  error,
  titleCode,
  children,
  withoutBorder,
  className,
}) => (
  <Wrapper withoutBorder={withoutBorder} error={error} className={className}>
    {titleCode
    && (
    <div>
      <Element><FormattedMessage id={titleCode} /></Element>
      <VerticalSpacer twentyPx />
    </div>
    )
    }
    {children}
  </Wrapper>
);

FaktaGruppeImpl.propTypes = {
  ...Wrapper.propTypes,
  titleCode: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => ({
  error: !!(props.merknaderFraBeslutter && props.merknaderFraBeslutter.notAccepted),
});

const FaktaGruppe = connect(mapStateToProps)(FaktaGruppeImpl);

FaktaGruppe.propTypes = {
  titleCode: PropTypes.string,
  children: PropTypes.node,
  withoutBorder: PropTypes.bool,
  className: PropTypes.string,
};

FaktaGruppe.defaultProps = {
  titleCode: '',
  children: null,
  withoutBorder: false,
  className: '',
};

export default FaktaGruppe;
