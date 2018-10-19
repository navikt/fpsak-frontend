import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';

import dokumentMalType from 'kodeverk/dokumentMalType';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { isKontrollerRevurderingAksjonspunkOpen } from 'behandling/behandlingSelectors';
import {
  ariaCheck, hasValidText, maxLength, minLength, required,
} from 'utils/validation/validators';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';
import { SelectField, TextAreaField } from 'form/Fields';
import ugunstAarsakTyper from 'kodeverk/ugunstAarsakTyper';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

import styles from './messages.less';


const maxLength4000 = maxLength(4000);
const minLength3 = minLength(3);

const getFritekstMessage = brevmalkode => (brevmalkode === dokumentMalType.INNHENT_DOK ? 'Messages.DocumentList' : 'Messages.Fritekst');

const showFritekst = (brevmalkode, arsakskode) => (brevmalkode === dokumentMalType.INNHENT_DOK
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
    <form className={styles.container} onSubmit={handleSubmit}>
      <SelectField
        name="mottaker"
        label={intl.formatMessage({ id: 'Messages.Recipient' })}
        validate={[required]}
        placeholder={intl.formatMessage({ id: 'Messages.ChooseRecipient' })}
        selectValues={recipients.map(recipient => <option key={recipient} value={recipient}>{recipient}</option>)}
        bredde="xxl"
      />
      <SelectField
        name="brevmalkode"
        label={intl.formatMessage({ id: 'Messages.Template' })}
        validate={[required]}
        placeholder={intl.formatMessage({ id: 'Messages.ChooseTemplate' })}
        selectValues={templates.map(template => <option key={template.kode} value={template.kode} disabled={!template.tilgjengelig}>{template.navn}</option>)}
        bredde="xxl"
      />
      {brevmalkode === dokumentMalType.REVURDERING_DOK
      && (
      <SelectField
        name="arsakskode"
        label={intl.formatMessage({ id: 'Messages.Årsak' })}
        validate={[required]}
        placeholder={intl.formatMessage({ id: 'Messages.VelgÅrsak' })}
        selectValues={causes.map(cause => <option key={cause.kode} value={cause.kode}>{cause.navn}</option>)}
        bredde="xxl"
      />
      )}
      {showFritekst(brevmalkode, arsakskode)
      && (
      <div className="input--xxl">
        <TextAreaField
          name="fritekst"
          label={intl.formatMessage({ id: getFritekstMessage(brevmalkode) })}
          validate={[required, maxLength4000, minLength3, hasValidText]}
          maxLength={4000}
          badges={[{ type: 'fokus', textId: languageCode, title: 'Malform.Beskrivelse' }]}
        />
      </div>
      )}
      <div className={styles.buttonRow}>
        <Hovedknapp mini spinner={formProps.submitting} disabled={formProps.submitting} onClick={ariaCheck}>
          {intl.formatMessage({ id: 'Messages.Submit' })}
        </Hovedknapp>
        <a
          href=""
          onClick={previewMessage}
          onKeyDown={e => (e.keyCode === 13 ? previewMessage(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          {intl.formatMessage({ id: 'Messages.Preview' })}
        </a>
      </div>
    </form>);
};

MessagesImpl.propTypes = {
  intl: intlShape.isRequired,
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

const buildInitalValues = (isKontrollerRevurderingApOpen, initialProps) => (isKontrollerRevurderingApOpen
  ? { ...initialProps.initialValues, brevmalkode: dokumentMalType.REVURDERING_DOK }
  : { ...initialProps.initialValues });

const transformValues = (values) => {
  const newValues = values;
  if (values.brevmalkode === dokumentMalType.REVURDERING_DOK && newValues.arsakskode !== ugunstAarsakTyper.ANNET) {
    newValues.fritekst = ' ';
  }
  return newValues;
};
const getfilteredCauses = createSelector(
  [getKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK)],
  causes => causes.filter(cause => cause.kode !== ugunstAarsakTyper.BARN_IKKE_REGISTRERT_FOLKEREGISTER),
);

const mapStateToProps = (state, initialProps) => ({
  ...behandlingFormValueSelector(formName)(state, 'mottaker', 'brevmalkode', 'fritekst', 'arsakskode'),
  causes: getfilteredCauses(state),
  initialValues: buildInitalValues(isKontrollerRevurderingAksjonspunkOpen(state), initialProps),
  onSubmit: values => initialProps.submitCallback(transformValues(values)),
});


const Messages = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
})(MessagesImpl)));

Messages.formName = formName;

export default Messages;
