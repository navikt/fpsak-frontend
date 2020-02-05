import React from 'react';
import PropTypes from 'prop-types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import classnames from 'classnames/bind';
import styles from './avsnittSkiller.less';

const classNames = classnames.bind(styles);

const AvsnittSkiller = ({
  luftUnder,
  luftOver,
  leftPanel,
  rightPanel,
}) => (
  <>
    {luftOver && (
    <VerticalSpacer thirtyTwoPx />
    )}
    <Row>
      <Column xs="12">
        <div className={classNames(
          {
            leftPanel,
            rightPanel,
          },
        )}
        >
          <div className={styles.divider} />
        </div>
      </Column>
    </Row>
    {luftUnder && (
    <VerticalSpacer thirtyTwoPx />
    )}
  </>
);
AvsnittSkiller.propTypes = {
  luftUnder: PropTypes.bool,
  luftOver: PropTypes.bool,
  leftPanel: PropTypes.bool,
  rightPanel: PropTypes.bool,

};
AvsnittSkiller.defaultProps = {
  luftUnder: false,
  luftOver: false,
  leftPanel: false,
  rightPanel: false,
};
export default AvsnittSkiller;
