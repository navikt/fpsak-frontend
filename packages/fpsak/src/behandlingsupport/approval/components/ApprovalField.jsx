import React from 'react';
import { NavFieldGroup, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getAksjonspunktTextSelector } from './ApprovalTextUtils';
import ReasonsField from './ReasonsField';
import styles from './ApprovalField.less';


/*
 * ApprovalField
 *
 * Presentasjonskomponent. Holds the radiobuttons for approving or disapproving the decisions of the handler
 *
 * Eksempel:
 * ```html
 * <ApprovalField
 *   key={aksjonspunkt.aksjonspunktId}
 *   aksjonspunkt={aksjonspunkt}
 *   currentValue={formState[vilkarIndex].toTrinnsAksjonspunkter[approvalIndex]}
 *   vilkarIndex={vilkarIndex}
 *   approvalIndex={approvalIndex}
 *   showBegrunnelse={akspktDef}
 * />
 * ```
 */
export const ApprovalFieldImpl = ({
  aksjonspunkt,
  readOnly,
  currentValue,
  approvalIndex,
  contextIndex,
  showBegrunnelse,
  getAksjonspunktText,
  klageKA,
}) => {
  const fieldName = `approvals[${contextIndex}].aksjonspunkter[${approvalIndex}]`;
  const erKlageKA = (klageKA && currentValue && currentValue.totrinnskontrollGodkjent);
  const erAnke = aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE && currentValue.totrinnskontrollGodkjent === true;
  const showOnlyBegrunnelse = erAnke || erKlageKA ? currentValue.totrinnskontrollGodkjent : showBegrunnelse;
  const showReasons = (erAnke || ((currentValue && currentValue.totrinnskontrollGodkjent === false) || erKlageKA));
  return (
    <div className={styles.approvalItemContainer}>
      {getAksjonspunktText(aksjonspunkt).map((formattedMessage, index) => (
        <div key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(index))} className={styles.aksjonspunktTextContainer}>
          <Normaltekst key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(index))}>
            {' '}
            {formattedMessage}
            {' '}
          </Normaltekst>
        </div>
      ))}
      <NavFieldGroup>
        <RadioGroupField name={`${fieldName}.totrinnskontrollGodkjent`} bredde="M" readOnly={readOnly}>
          <RadioOption label={{ id: 'InfoPanel.Godkjent' }} value />
          <RadioOption label={{ id: 'InfoPanel.Vurder' }} value={false} />
        </RadioGroupField>
        {showReasons
        && (
        <ReasonsField
          fieldName={fieldName}
          godkjentHosKA={erKlageKA}
          showOnlyBegrunnelse={showOnlyBegrunnelse}
        />
        )
        }
      </NavFieldGroup>
    </div>
  );
};


ApprovalFieldImpl.propTypes = {
  aksjonspunkt: PropTypes.shape().isRequired,
  getAksjonspunktText: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  approvalIndex: PropTypes.number,
  contextIndex: PropTypes.number,
  currentValue: PropTypes.shape(),
  showBegrunnelse: PropTypes.bool,
  klageKA: PropTypes.bool,
};

ApprovalFieldImpl.defaultProps = {
  showBegrunnelse: false,
  currentValue: undefined,
  approvalIndex: null,
  contextIndex: null,
  klageKA: false,
};

const mapStateToProps = state => ({ getAksjonspunktText: getAksjonspunktTextSelector(state) });

export default connect(mapStateToProps)(injectIntl(ApprovalFieldImpl));
