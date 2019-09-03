import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { getLanguageCodeFromSprakkode, hasValidText, required } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';

import styles from './fritekstAnkeBrevTextField.less';

const FritekstAnkeBrevTextField = ({
  sprakkode,
  readOnly,
  intl,
}) => (
  <div className={styles.fritekstTilBrevTextArea}>
    <TextAreaField
      name="fritekstTilBrev"
      label={intl.formatMessage({ id: 'FritekstAnkeBrevTextField' })}
      validate={[required, hasValidText]}
      readOnly={readOnly}
      textareaClass={styles.explanationTextarea}
      maxLength={100000}
      badges={[{
        type: 'fokus',
        textId: getLanguageCodeFromSprakkode(sprakkode),
        title: 'Malform.Beskrivelse',
      }]}
    />
  </div>
);

FritekstAnkeBrevTextField.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
};

FritekstAnkeBrevTextField.defaultProps = {
  readOnly: true,
};

export default injectIntl(FritekstAnkeBrevTextField);
