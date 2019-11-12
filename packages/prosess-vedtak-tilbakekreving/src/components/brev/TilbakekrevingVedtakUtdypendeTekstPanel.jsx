import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import {
  required, hasValidText, maxLength, minLength,
} from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';

import styles from './tilbakekrevingVedtakUtdypendeTekstPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const valideringsregler = [minLength3, maxLength1500, hasValidText];
const valideringsreglerPakrevet = [required, minLength3, maxLength1500, hasValidText];

export const TilbakekrevingVedtakUtdypendeTekstPanel = ({
  intl,
  isEmpty,
  type,
  readOnly,
  fritekstPakrevet,
}) => {
  const [isTextfieldHidden, hideTextField] = useState(isEmpty && !fritekstPakrevet);
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
            <Image
              className={styles.addCircleIcon}
              src={addCircleIcon}
              alt={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst' })}
            />
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
              validate={fritekstPakrevet ? valideringsreglerPakrevet : valideringsregler}
              maxLength={1500}
              readOnly={readOnly}
            />
          </>
        )}
    </>
  );
};

TilbakekrevingVedtakUtdypendeTekstPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  type: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  fritekstPakrevet: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  isEmpty: behandlingFormValueSelector(ownProps.formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state, ownProps.type) === undefined,
});

export default connect(mapStateToProps)(injectIntl(TilbakekrevingVedtakUtdypendeTekstPanel));
