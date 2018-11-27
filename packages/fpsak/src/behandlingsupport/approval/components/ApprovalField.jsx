import React from 'react';
import { NavFieldGroup, RadioGroupField, RadioOption } from 'form/Fields';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
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
}) => {
  const fieldName = `approvals[${contextIndex}].aksjonspunkter[${approvalIndex}]`;
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
        {currentValue && currentValue.totrinnskontrollGodkjent === false
        && <ReasonsField fieldName={fieldName} showOnlyBegrunnelse={showBegrunnelse} />
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
};

ApprovalFieldImpl.defaultProps = {
  showBegrunnelse: false,
  currentValue: undefined,
  approvalIndex: null,
  contextIndex: null,
};

const mapStateToProps = state => ({ getAksjonspunktText: getAksjonspunktTextSelector(state) });

export default connect(mapStateToProps)(injectIntl(ApprovalFieldImpl));
