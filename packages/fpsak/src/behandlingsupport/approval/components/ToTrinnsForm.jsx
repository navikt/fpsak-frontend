import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Hovedknapp } from 'nav-frontend-knapper';

import { behandlingFormFpsak, behandlingFormValueSelector } from 'behandling/behandlingFormFpsak';
import { getBehandlingKlageVurderingResultatNFP, getBehandlingKlageVurderingResultatNK, erArsakTypeBehandlingEtterKlage } from 'behandling/duck';
import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';
import ApprovalField from './ApprovalField';
import { isKlage, isKlageWithKA } from './ApprovalTextUtils';

import styles from './ToTrinnsForm.less';

const allApproved = (formState) => formState
  .reduce((a, b) => a.concat(b.aksjonspunkter), [])
  .every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const allSelected = (formState) => formState
  .reduce((a, b) => a.concat(b.aksjonspunkter), [])
  .every((ap) => ap.totrinnskontrollGodkjent !== null);


/*
  * ToTrinnsForm
  *
  * Presentasjonskomponent. Holds the form of the totrinnkontroll
  */
export const ToTrinnsFormImpl = ({
  handleSubmit,
  formState,
  forhandsvisVedtaksbrev,
  klageVurderingResultatNFP,
  klageVurderingResultatNK,
  readOnly,
  erBehandlingEtterKlage,
  totrinnskontrollContext,
  ...formProps
}) => {
  if (formState.length !== totrinnskontrollContext.length) {
    return null;
  }
  return (
    <form name="toTrinn" onSubmit={handleSubmit}>
      {totrinnskontrollContext.map(({
        contextCode, skjermlenke, aksjonspunkter, skjermlenkeNavn,
      }, contextIndex) => {
        if (aksjonspunkter.length > 0) {
          return (
            <div key={contextCode}>
              <NavLink to={skjermlenke} className={styles.lenke}>
                {skjermlenkeNavn}
              </NavLink>
              {aksjonspunkter.map((aksjonspunkt, approvalIndex) => (
                <div key={aksjonspunkt.aksjonspunktKode}>
                  <ApprovalField
                    aksjonspunkt={aksjonspunkt}
                    contextIndex={contextIndex}
                    currentValue={formState[contextIndex].aksjonspunkter[approvalIndex]}
                    approvalIndex={approvalIndex}
                    readOnly={readOnly}
                    klageKA={!!isKlageWithKA(klageVurderingResultatNK)}
                  />
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
      <div className={styles.buttonRow}>
        <Hovedknapp
          mini
          disabled={!allApproved(formState) || !allSelected(formState) || formProps.submitting}
          spinner={formProps.submitting}
        >
          <FormattedMessage id="InfoPanel.Godkjenn" />
        </Hovedknapp>
        <Hovedknapp
          mini
          disabled={allApproved(formState) || !allSelected(formState) || formProps.submitting}
          spinner={formProps.submitting}
          onClick={ariaCheck}
        >
          <FormattedMessage id="InfoPanel.SendTilbake" />
        </Hovedknapp>
        {!isKlage(klageVurderingResultatNFP, klageVurderingResultatNK) && !erBehandlingEtterKlage
        && (
        <button
          type="button"
          className={styles.buttonLink}
          onClick={forhandsvisVedtaksbrev}
        >
          <FormattedMessage id="VedtakForm.ForhandvisBrev" />
        </button>
        )}
      </div>
    </form>
  );
};

ToTrinnsFormImpl.propTypes = {
  ...formPropTypes,
  totrinnskontrollContext: PropTypes.arrayOf(PropTypes.shape({})),
  formState: PropTypes.arrayOf(PropTypes.shape({})),
  forhandsvisVedtaksbrev: PropTypes.func.isRequired,
  klageVurderingResultatNFP: PropTypes.shape(),
  klageVurderingResultatNK: PropTypes.shape(),
  erBehandlingEtterKlage: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
};

ToTrinnsFormImpl.defaultProps = {
  klageVurderingResultatNFP: undefined,
  klageVurderingResultatNK: undefined,
  totrinnskontrollContext: [],
  formState: [{ aksjonspunkter: [] }],
};

const validate = (values) => {
  const errors = {};

  errors.approvals = values.approvals.map((kontekst) => ({
    aksjonspunkter: kontekst.aksjonspunkter.map((ap) => {
      if (!ap.feilFakta && !ap.feilLov && !ap.feilRegel && !ap.annet) {
        return { missingArsakError: isRequiredMessage() };
      }

      return undefined;
    }),
  }));

  return errors;
};

const formName = 'toTrinnForm';

const mapStateToProps = (state) => ({
  formState: behandlingFormValueSelector(formName)(state, 'approvals'),
  klageVurderingResultatNFP: getBehandlingKlageVurderingResultatNFP(state),
  klageVurderingResultatNK: getBehandlingKlageVurderingResultatNK(state),
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(state),
});
const ToTrinnsForm = behandlingFormFpsak({ form: formName, validate })(connect(mapStateToProps)(ToTrinnsFormImpl));

ToTrinnsForm.formName = formName;

export default ToTrinnsForm;
