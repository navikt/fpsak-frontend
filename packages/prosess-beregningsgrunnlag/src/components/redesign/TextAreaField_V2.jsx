import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Textarea as NavTextarea } from 'nav-frontend-skjema';
import EtikettFokus from 'nav-frontend-etiketter';
import { FormattedMessage, injectIntl } from 'react-intl';

import { labelPropType } from '@fpsak-frontend/form/src/Label';
import renderNavField from '@fpsak-frontend/form/src/renderNavField';
import styles from './textAreaField_V2.less';
import ReadOnlyFieldV2 from './ReadOnlyField_V2';


const TextAreaWithBadgeV2 = ({
  badges,
  intl,
  ...otherProps
}) => {
  const { placeholder } = otherProps;
  return (
    <div className={badges ? styles.textAreaFieldWithBadges : null}>
      { badges
      && (
        <div className={styles.etikettWrapper}>
          { badges.map(({ textId, type, title }) => (
            <EtikettFokus key={textId} type={type} title={intl.formatMessage({ id: title })}>
              <FormattedMessage id={textId} />
            </EtikettFokus>
          ))}
        </div>
      )}
      <div className={placeholder ? styles.textAreaWithPlaceholder : null}>
        <NavTextarea {...otherProps} />
      </div>
    </div>
  );
};

const renderNavTextArea = renderNavField(injectIntl(TextAreaWithBadgeV2));

const TextAreaFieldV2 = ({
  name, label, validate, readOnly, ...otherProps
}) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyFieldV2 : renderNavTextArea}
    label={label}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    autoComplete="off"
  />
);

TextAreaFieldV2.propTypes = {
  name: PropTypes.string.isRequired,
  label: labelPropType.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  readOnly: PropTypes.bool,
};

TextAreaFieldV2.defaultProps = {
  validate: null,
  readOnly: false,
};

TextAreaWithBadgeV2.propTypes = {
  intl: PropTypes.shape().isRequired,
  badges: PropTypes.arrayOf(PropTypes.shape({
    textId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
};

TextAreaWithBadgeV2.defaultProps = {
  badges: null,
};

export default TextAreaFieldV2;
