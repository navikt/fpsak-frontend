import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import {
  minLength, maxLength, hasValidText,
} from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer, Image } from '@fpsak-frontend/shared-components';

import { behandlingFormValueSelector } from 'behandlingTilbakekreving/src/behandlingFormTilbakekreving';

import styles from './tilbakekrevingVedtakUtdypendeTekstPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const TilbakekrevingVedtakUtdypendeTekstPanel = ({
  intl,
  isEmpty,
  type,
  readOnly,
}) => {
  const [isTextfieldHidden, hideTextField] = useState(isEmpty);
  return (
    <>
      {(isTextfieldHidden && !readOnly) && (
        <>
          <VerticalSpacer eightPx />
          <div
            onClick={(event) => { event.preventDefault(); hideTextField(false); }}
            onKeyDown={(event) => { event.preventDefault(); hideTextField(false); }}
            className={styles.addPeriode}
            role="button"
            tabIndex="0"
          >
            <Image className={styles.addCircleIcon} src={addCircleIcon} altCode="TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst" />
            <Undertekst className={styles.imageText}>
              <FormattedMessage className={styles.text} id="TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst" />
            </Undertekst>
          </div>
        </>
      )}
      {!isTextfieldHidden
        && (
          <>
            <VerticalSpacer eightPx />
            <TextAreaField
              name={type}
              label={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.UtdypendeTekst' })}
              validate={[minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </>
      )}
    </>
  );
};

TilbakekrevingVedtakUtdypendeTekstPanel.propTypes = {
  type: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isEmpty: behandlingFormValueSelector(ownProps.formName)(state, ownProps.type) === undefined,
});

export default connect(mapStateToProps)(injectIntl(TilbakekrevingVedtakUtdypendeTekstPanel));
