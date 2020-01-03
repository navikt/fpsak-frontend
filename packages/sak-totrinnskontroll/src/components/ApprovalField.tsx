import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, IntlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { NavFieldGroup, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
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
}: ApprovalFieldImplProps) => {
  const fieldName = `approvals[${contextIndex}].aksjonspunkter[${approvalIndex}]`;
  const erKlageKA = klageKA && currentValue && currentValue.totrinnskontrollGodkjent;
  const erAnke = aksjonspunkt.aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE
    && currentValue.totrinnskontrollGodkjent === true;
  const showOnlyBegrunnelse = erAnke || erKlageKA ? currentValue.totrinnskontrollGodkjent : showBegrunnelse;
  const showReasons = erAnke || (currentValue && currentValue.totrinnskontrollGodkjent === false) || erKlageKA;
  return (
    <div className={styles.approvalItemContainer}>
      {getAksjonspunktText(aksjonspunkt)?.map((formattedMessage, index) => (
        <div
          key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}
          className={styles.aksjonspunktTextContainer}
        >
          <Normaltekst key={aksjonspunkt.aksjonspunktKode.concat('_'.concat(`${index}`))}>
            {formattedMessage}
          </Normaltekst>
        </div>
      ))}
      <NavFieldGroup>
        <RadioGroupField name={`${fieldName}.totrinnskontrollGodkjent`} bredde="M" readOnly={readOnly}>
          <RadioOption label={{ id: 'ApprovalField.Godkjent' }} value />
          <RadioOption label={{ id: 'ApprovalField.Vurder' }} value={false} />
        </RadioGroupField>
        {showReasons && (
          <ReasonsField fieldName={fieldName} godkjentHosKA={erKlageKA} showOnlyBegrunnelse={showOnlyBegrunnelse} />
        )}
      </NavFieldGroup>
    </div>
  );
};

interface ApprovalFieldImplProps {
  aksjonspunkt: { aksjonspunktKode: string };
  getAksjonspunktText: (aksjonspunkt: any) => (JSX.Element | null)[] | null;
  readOnly: boolean;
  approvalIndex?: number;
  contextIndex?: number;
  currentValue?: any;
  showBegrunnelse?: boolean;
  klageKA?: boolean;
  intl: IntlShape;
}

const mapStateToProps = (state, ownProps) => ({
  getAksjonspunktText: getAksjonspunktTextSelector(ownProps),
});

export default connect(mapStateToProps)(injectIntl(ApprovalFieldImpl));
