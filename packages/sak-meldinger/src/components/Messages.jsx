import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import {
  ariaCheck, getLanguageCodeFromSprakkode, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './messages.less';

const maxLength4000 = maxLength(4000);
const minLength3 = minLength(3);

const getFritekstMessage = (brevmalkode) => (brevmalkode === dokumentMalType.INNHENT_DOK ? 'Messages.DocumentList' : 'Messages.Fritekst');

// TODO (TOR) Bør erstattast av ein markør fra backend
const showFritekst = (brevmalkode, arsakskode) => (brevmalkode === dokumentMalType.INNHENT_DOK
  || brevmalkode === dokumentMalType.KORRIGVARS
  || brevmalkode === dokumentMalType.FRITKS
  || brevmalkode === dokumentMalType.VARSEL_OM_TILBAKEKREVING
  || (brevmalkode === dokumentMalType.REVURDERING_DOK && arsakskode === ugunstAarsakTyper.ANNET));

/**
 * Messages
 *
 * Presentasjonskomponent. Gir mulighet for å forhåndsvise og sende brev. Mottaker og brevtype velges fra predefinerte lister,
 * og fritekst som skal flettes inn i brevet skrives inn i et eget felt.
 */
export const MessagesImpl = ({
  intl,
  recipients,
  templates,
  causes,
  previewCallback,
  handleSubmit,
  sprakKode,
  mottaker,
  brevmalkode,
  fritekst,
  arsakskode,
  ...formProps
}) => {
  if (!sprakKode) {
    return null;
  }

  const previewMessage = (e) => {
    if (formProps.valid || formProps.pristine) {
      previewCallback(mottaker, brevmalkode, fritekst, arsakskode);
    } else {
      formProps.submit();
    }
    e.preventDefault();
  };

  const languageCode = getLanguageCodeFromSprakkode(sprakKode);

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        name="mottaker"
        label={intl.formatMessage({ id: 'Messages.Recipient' })}
        validate={[required]}
        placeholder={intl.formatMessage({ id: 'Messages.ChooseRecipient' })}
        selectValues={recipients.map((recipient) => <option key={recipient} value={recipient}>{recipient}</option>)}
        bredde="xxl"
      />
      <VerticalSpacer eightPx />
      <SelectField
        name="brevmalkode"
        label={intl.formatMessage({ id: 'Messages.Template' })}
        validate={[required]}
        placeholder={intl.formatMessage({ id: 'Messages.ChooseTemplate' })}
        selectValues={templates.map((template) => <option key={template.kode} value={template.kode} disabled={!template.tilgjengelig}>{template.navn}</option>)}
        bredde="xxl"
      />
      {brevmalkode === dokumentMalType.REVURDERING_DOK && (
        <>
          <VerticalSpacer eightPx />
          <SelectField
            name="arsakskode"
            label={intl.formatMessage({ id: 'Messages.Årsak' })}
            validate={[required]}
            placeholder={intl.formatMessage({ id: 'Messages.VelgÅrsak' })}
            selectValues={causes.map((cause) => <option key={cause.kode} value={cause.kode}>{cause.navn}</option>)}
            bredde="xxl"
          />
        </>
      )}
      {showFritekst(brevmalkode, arsakskode) && (
        <>
          <VerticalSpacer eightPx />
          <div className="input--xxl">
            <TextAreaField
              name="fritekst"
              label={intl.formatMessage({ id: getFritekstMessage(brevmalkode) })}
              validate={[required, maxLength4000, minLength3, hasValidText]}
              maxLength={4000}
              badges={[{ type: 'fokus', textId: languageCode, title: 'Messages.Beskrivelse' }]}
            />
          </div>
        </>
      )}
      <div className={styles.buttonRow}>
        <Hovedknapp mini spinner={formProps.submitting} disabled={formProps.submitting} onClick={ariaCheck}>
          {intl.formatMessage({ id: 'Messages.Submit' })}
        </Hovedknapp>
        <a
          href=""
          onClick={previewMessage}
          onKeyDown={(e) => (e.keyCode === 13 ? previewMessage(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          {intl.formatMessage({ id: 'Messages.Preview' })}
        </a>
      </div>
    </form>
  );
};

MessagesImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.string).isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
    tilgjengelig: PropTypes.bool.isRequired,
  })).isRequired,
  causes: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
    kodeverk: PropTypes.string.isRequired,
  })).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  sprakKode: PropTypes.shape(),
  ...formPropTypes,
};

MessagesImpl.defaultProps = {
  sprakKode: undefined,
};

const formName = 'Messages';

const buildInitalValues = (isKontrollerRevurderingApOpen, recipients, templates) => {
  const initialValues = {
    mottaker: recipients[0] ? recipients[0] : null,
    brevmalkode: templates && templates[0] ? templates[0].kode : null,
    fritekst: '',
    aarsakskode: null,
  };
  return isKontrollerRevurderingApOpen
    ? { ...initialValues, brevmalkode: dokumentMalType.REVURDERING_DOK }
    : { ...initialValues };
};

const transformValues = (values) => {
  const newValues = values;
  if (values.brevmalkode === dokumentMalType.REVURDERING_DOK && newValues.arsakskode !== ugunstAarsakTyper.ANNET) {
    newValues.fritekst = ' ';
  }
  return newValues;
};
const getfilteredCauses = createSelector(
  [(ownProps) => ownProps.revurderingVarslingArsak],
  (causes) => causes.filter((cause) => cause.kode !== ugunstAarsakTyper.BARN_IKKE_REGISTRERT_FOLKEREGISTER),
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps) => ({
    ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'mottaker', 'brevmalkode', 'fritekst', 'arsakskode'),
    causes: getfilteredCauses(ownProps),
    initialValues: buildInitalValues(ownProps.isKontrollerRevurderingApOpen, ownProps.recipients, ownProps.templates),
    onSubmit,
  });
};


const Messages = connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
})(MessagesImpl)));

Messages.formName = formName;

export default Messages;
