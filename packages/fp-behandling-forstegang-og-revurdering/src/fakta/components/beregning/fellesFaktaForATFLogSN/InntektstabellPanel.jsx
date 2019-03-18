import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import PropTypes from 'prop-types';

import styles from './InntektstabellPanel.less';


/**
 * Inntektstabell
 *
 *
 */
const InntektstabellPanel = ({
  tabell,
  hjelpeTekstId,
  children,
  skalViseTabell,
}) => (
  <ElementWrapper>
    {children}
    <div className={styles.fadeinTabell}>
      <VerticalSpacer sixteenPx />
      {skalViseTabell
      && (
      <ElementWrapper>
        {hjelpeTekstId
        && (
          <Element>
            <FormattedMessage id={hjelpeTekstId} />
          </Element>
        )}
        {tabell}
      </ElementWrapper>
      )
      }
    </div>
  </ElementWrapper>
);


InntektstabellPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  tabell: PropTypes.node.isRequired,
  hjelpeTekstId: PropTypes.string,
  skalViseTabell: PropTypes.bool,
};


InntektstabellPanel.defaultProps = {
  hjelpeTekstId: undefined,
  skalViseTabell: true,
};


export default InntektstabellPanel;
