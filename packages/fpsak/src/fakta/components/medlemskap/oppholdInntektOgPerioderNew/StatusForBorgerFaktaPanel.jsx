import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { RadioGroupField, RadioOption } from 'form/Fields';
import { required } from 'utils/validation/validators';

import styles from './statusForBorgerFaktaPanel.less';

/**
 * StatusForBorgerFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av borgerstatus (Medlemskapsvilkåret).
 */
const StatusForBorgerFaktaPanelImpl = ({
  readOnly,
  erEosBorger,
  isBorgerAksjonspunktClosed,
  apKode,
}) => (
  <FaktaGruppe aksjonspunktCode={apKode} titleCode="StatusForBorgerFaktaPanel.ApplicationInformation">
    <RadioGroupField className={styles.radioGroup} name="erEosBorger" validate={[required]} readOnly={readOnly}>
      <RadioOption label={{ id: 'StatusForBorgerFaktaPanel.CitizenEEA' }} value />
      <RadioOption label={{ id: 'StatusForBorgerFaktaPanel.CitizenOutsideEEA' }} value={false} />
    </RadioGroupField>

    {erEosBorger
    && (
    <div className={styles.arrowLineEos}>
      <Undertekst><FormattedMessage id="StatusForBorgerFaktaPanel.Oppholdsrett" /></Undertekst>
      <VerticalSpacer fourPx />
      <Row className={styles.error}>
        <Column xs="9">
          <RadioGroupField name="oppholdsrettVurdering" validate={[required]} readOnly={readOnly} isEdited={isBorgerAksjonspunktClosed}>
            <RadioOption label={{ id: 'StatusForBorgerFaktaPanel.HarOppholdsrett' }} value />
            <RadioOption label={<FormattedHTMLMessage id="StatusForBorgerFaktaPanel.HarIkkeOppholdsrett" />} value={false} />
          </RadioGroupField>
        </Column>
      </Row>
    </div>
    )
    }
    {erEosBorger === false
    && (
    <div className={styles.arrowLineOther}>
      <Undertekst><FormattedMessage id="StatusForBorgerFaktaPanel.LovligOpphold" /></Undertekst>
      <VerticalSpacer fourPx />
      <Row className={styles.error}>
        <Column xs="12">
          <RadioGroupField name="lovligOppholdVurdering" validate={[required]} readOnly={readOnly} isEdited={isBorgerAksjonspunktClosed}>
            <RadioOption label={{ id: 'StatusForBorgerFaktaPanel.HarLovligOpphold' }} value />
            <RadioOption label={<FormattedHTMLMessage id="StatusForBorgerFaktaPanel.HarIkkeLovligOpphold" />} value={false} />
          </RadioGroupField>
        </Column>
      </Row>
    </div>
    )
    }
  </FaktaGruppe>
);


StatusForBorgerFaktaPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erEosBorger: PropTypes.bool,
  isBorgerAksjonspunktClosed: PropTypes.bool.isRequired,
  apKode: PropTypes.string.isRequired,
};

StatusForBorgerFaktaPanelImpl.defaultProps = {
  erEosBorger: undefined,
};

const StatusForBorgerFaktaPanel = connect((state, ownProps) => ({
  ...behandlingFormValueSelector(`OppholdInntektOgPeriodeForm-${ownProps.id}`)(state, 'erEosBorger', 'isBorgerAksjonspunktClosed', 'apKode'),
}))(StatusForBorgerFaktaPanelImpl);

const getApKode = aksjonspunkter => aksjonspunkter
  .map(ap => ap.definisjon.kode)
  .filter(kode => kode === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT || kode === aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD)[0];

const getEosBorger = (periode, aksjonspunkter) => (periode.erEosBorger || periode.erEosBorger === false
  ? periode.erEosBorger
  : aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT));

const getOppholdsrettVurdering = periode => (periode.oppholdsrettVurdering
|| periode.oppholdsrettVurdering === false ? periode.oppholdsrettVurdering : undefined);

const getLovligOppholdVurdering = periode => (periode.lovligOppholdVurdering || periode.lovligOppholdVurdering === false
  ? periode.lovligOppholdVurdering : undefined);

StatusForBorgerFaktaPanel.buildInitialValues = (periode, aksjonspunkter) => {
  const erEosBorger = getEosBorger(periode, aksjonspunkter);
  const closedAp = aksjonspunkter
    .filter(ap => periode.aksjonspunkter.includes(ap.definisjon.kode)
      || (periode.aksjonspunkter.length > 0 && ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP))
    .filter(ap => !isAksjonspunktOpen(ap.status.kode));

  return {
    erEosBorger,
    isBorgerAksjonspunktClosed: closedAp.length > 0,
    oppholdsrettVurdering: erEosBorger ? getOppholdsrettVurdering(periode) : undefined,
    lovligOppholdVurdering: erEosBorger === false ? getLovligOppholdVurdering(periode) : undefined,
    apKode: getApKode(aksjonspunkter),
  };
};

StatusForBorgerFaktaPanel.transformValues = (values, aksjonspunkter) => ({
  kode: getApKode(aksjonspunkter),
  oppholdsrettVurdering: values.oppholdsrettVurdering,
  lovligOppholdVurdering: values.lovligOppholdVurdering,
  erEosBorger: values.erEosBorger,
});

export default StatusForBorgerFaktaPanel;
