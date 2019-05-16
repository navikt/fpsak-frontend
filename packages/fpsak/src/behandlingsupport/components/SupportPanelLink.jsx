import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import SupportPanel from 'behandlingsupport/supportPanels';

import { getBehandlingKlageVurderingResultatNK } from 'behandling/duck';
import { isKlageWithKA } from '../approval/components/ApprovalTextUtils';
import styles from './supportPanelLink.less';

const classNames = classnames.bind(styles);

const messageId = {
  [SupportPanel.HISTORY]: 'InfoPanel.History',
  [SupportPanel.MESSAGES]: 'InfoPanel.Messages',
  [SupportPanel.DOCUMENTS]: 'InfoPanel.Documents',
  [SupportPanel.APPROVAL]: 'InfoPanel.Approval',
  [SupportPanel.RETURNED]: isKlageWithKA(getBehandlingKlageVurderingResultatNK) ? 'InfoPanel.Medunderskriver' : 'InfoPanel.Returned',
};

const SupportPanelLink = ({
  supportPanel, isEnabled, isActive, supportPanelLocation,
}) => {
  const linkContent = <FormattedMessage id={messageId[supportPanel]} />;
  if (isEnabled) {
    return (
      <NavLink to={supportPanelLocation} className={classNames('link', { isActive })} tabIndex={isActive || !isEnabled ? -1 : 0}>
        <Element tag="span">{linkContent}</Element>
      </NavLink>
    );
  }
  return <span className={classNames('disabled')}>{linkContent}</span>;
};

SupportPanelLink.propTypes = {
  supportPanel: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  supportPanelLocation: PropTypes.shape().isRequired,
};

export default SupportPanelLink;
