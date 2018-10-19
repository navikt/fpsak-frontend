import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  hasValidText, maxLength, minLength, required,
} from 'utils/validation/validators';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';
import classNames from 'classnames';
import { Column, Row } from 'nav-frontend-grid';
import { TextAreaField } from 'form/Fields';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { Undertittel } from 'nav-frontend-typografi';
import styles from './vedtakForm.less';

const maxLength200 = maxLength(200);
const maxLength5000 = maxLength(5000);
const minLength3 = (0, minLength)(3);

const FritekstBrevPanelImpl = ({
  previewBrev,
  readOnly,
  sprakkode,
}) => (
  <ElementWrapper>
    <div className={styles.automatiskBrev}>
      <Row>
        <Column xs="12">
          <FormattedMessage id="VedtakForm.AutomatiskBrev" />
        </Column>
      </Row>
      <Row>
        <Column xs="6">
          <a
            href=""
            onClick={previewBrev}
            onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
            className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
          >
            <FormattedMessage id="VedtakForm.AutomatiskBrev.Lenke" />
          </a>
        </Column>
      </Row>
    </div>
    <Row>
      <Column xs="12">
        <Undertittel>
          <FormattedMessage id="VedtakForm.Brev" />
        </Undertittel>
      </Column>
    </Row>
    <Row>
      <Column xs="12">
        <TextAreaField
          name="overskrift"
          label={{ id: 'VedtakForm.Overskrift' }}
          validate={[required, minLength3, maxLength200, hasValidText]}
          maxLength={200}
          isEdited={readOnly}
          rows={1}
          readOnly={readOnly}
          className={styles.smallTextArea}
          badges={[{
            type: 'fokus',
            textId: getLanguageCodeFromSprakkode(sprakkode),
            title: 'Malform.Beskrivelse',
          }]}
        />
      </Column>
    </Row>
    <Row>
      <Column xs="12">
        <TextAreaField
          name="brødtekst"
          label={{ id: 'VedtakForm.Innhold' }}
          validate={[required, minLength3, maxLength5000, hasValidText]}
          maxLength={5000}
          readOnly={readOnly}
        />
      </Column>
    </Row>
  </ElementWrapper>
);

FritekstBrevPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  previewBrev: PropTypes.func.isRequired,
  sprakkode: PropTypes.shape().isRequired,
};

FritekstBrevPanelImpl.defaultProps = {
};

const FritekstBrevPanel = injectIntl(FritekstBrevPanelImpl);
export default FritekstBrevPanel;
