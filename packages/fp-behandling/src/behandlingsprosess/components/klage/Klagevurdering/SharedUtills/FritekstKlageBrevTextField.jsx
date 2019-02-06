import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { required, hasValidText, getLanguageCodeFromSprakkode } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';
import styles from './behandleKlageForm.less';


const FritekstKlageBrevTextField = ({
  sprakkode,
  readOnly,
  intl,
}) => (
  <div className={styles.fritekstTilBrevTextArea}>
    <TextAreaField
      name="fritekstTilBrev"
      label={intl.formatMessage({ id: 'VedtakKlageForm.Fritekst' })}
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


FritekstKlageBrevTextField.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool,
};

FritekstKlageBrevTextField.defaultProps = {
  readOnly: true,
};

export default injectIntl(FritekstKlageBrevTextField);
