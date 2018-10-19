import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { NavFieldGroup } from 'form/Fields';
import Image from 'sharedComponents/Image';
import addCircleIcon from 'images/add-circle.svg';

import styles from './periodFieldArray.less';

const onClick = (fields, emptyPeriodTemplate) => () => {
  fields.push(emptyPeriodTemplate);
};

const onKeyDown = (fields, emptyPeriodTemplate) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(emptyPeriodTemplate);
  }
};

const getRemoveButton = (index, fields) => (className) => {
  if (index > 0) {
    return (
      <button
        className={className || styles.buttonRemove}
        type="button"
        onClick={() => {
          fields.remove(index);
        }}
      />
    );
  }
  return undefined;
};

const showErrorMessage = meta => meta && meta.error && (meta.dirty || meta.submitFailed);

/**
 * PeriodFieldArray
 *
 * Overbygg over FieldArray (Redux-form) som håndterer å legge til og fjerne perioder
 */
const PeriodFieldArray = ({
  intl,
  fields,
  readOnly,
  meta,
  titleTextCode,
  textCode,
  emptyPeriodTemplate,
  shouldShowAddButton,
  createAddButtonInsteadOfImageLink,
  children,
}) => (
  <NavFieldGroup
    title={titleTextCode ? intl.formatMessage({ id: titleTextCode }) : undefined}
    errorMessage={showErrorMessage(meta) ? intl.formatMessage(...meta.error) : null}
  >
    {fields.map((periodeElementFieldId, index) => children(periodeElementFieldId, index, getRemoveButton(index, fields)))}
    {shouldShowAddButton
    && (
    <Row>
      <Column xs="12">
        {!createAddButtonInsteadOfImageLink && !readOnly
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          && (
          <div
            onClick={onClick(fields, emptyPeriodTemplate)}
            onKeyDown={onKeyDown(fields, emptyPeriodTemplate)}
            className={styles.addPeriode}
            role="button"
            tabIndex="0"
          >
            <Image className={styles.addCircleIcon} src={addCircleIcon} altCode={textCode} />
            <Undertekst className={styles.imageText}>
              <FormattedMessage id={textCode} />
            </Undertekst>
          </div>
          )
        }
        {createAddButtonInsteadOfImageLink && !readOnly && (
          <button
            type="button"
            onClick={onClick(fields, emptyPeriodTemplate)}
            className={styles.buttonAdd}
          >
            <FormattedMessage id={textCode} />
          </button>
        )
        }
        <VerticalSpacer sixteenPx />
      </Column>
    </Row>
    )
    }
  </NavFieldGroup>
);


PeriodFieldArray.propTypes = {
  intl: intlShape.isRequired,
  children: PropTypes.func.isRequired,
  fields: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
  meta: PropTypes.shape(),
  titleTextCode: PropTypes.string,
  textCode: PropTypes.string,
  emptyPeriodTemplate: PropTypes.shape(),
  shouldShowAddButton: PropTypes.bool,
  createAddButtonInsteadOfImageLink: PropTypes.bool,
};

PeriodFieldArray.defaultProps = {
  readOnly: true,
  titleTextCode: undefined,
  meta: undefined,
  textCode: 'PeriodFieldArray.LeggTilPeriode',
  emptyPeriodTemplate: {
    periodeFom: '',
    periodeTom: '',
  },
  shouldShowAddButton: true,
  createAddButtonInsteadOfImageLink: false,
};

export default injectIntl(PeriodFieldArray);
