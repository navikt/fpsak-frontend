import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';

import { RadioGroupField, RadioOption } from 'form/Fields';
import { required } from 'utils/validation/validators';
import { Normaltekst } from 'nav-frontend-typografi';
import { getBehandlingYtelseFordeling, getSoknad } from 'behandling/behandlingSelectors';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';

import FaktaGruppe from 'fakta/components/FaktaGruppe';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import IkkeOmsorgPeriodeField from './IkkeOmsorgPeriodeField';
import styles from './omsorgFaktaForm.less';

const { MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG } = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);
const getAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCode);

const OmsorgFaktaForm = ({
  aksjonspunkter,
  readOnly,
  omsorg,
  className,
  aleneomsorgIsEdited,
  omsorgIsEdited,
  oppgittOmsorgSoknad,
  oppgittAleneomsorgSoknad,
}) => (
  <div className={className}>
    {hasAksjonspunkt(MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, aksjonspunkter)
      && (
      <FaktaGruppe aksjonspunktCode={MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG} titleCode="OmsorgFaktaForm.Aleneomsorg" withoutBorder>
        <Normaltekst className={styles.paddingBottom}>
          {oppgittAleneomsorgSoknad
            ? <FormattedHTMLMessage id="OmsorgFaktaForm.OppgittAleneomsorg" />
            : <FormattedHTMLMessage id="OmsorgFaktaForm.OppgittIkkeAleneomsorg" />
          }
        </Normaltekst>
        <RadioGroupField name="aleneomsorg" readOnly={readOnly} validate={[required]} isEdited={aleneomsorgIsEdited}>
          <RadioOption label={{ id: 'OmsorgFaktaForm.HarAleneomsorg' }} value />
          <RadioOption label={<FormattedHTMLMessage id="OmsorgFaktaForm.HarIkkeAleneomsorg" />} value={false} />
        </RadioGroupField>
      </FaktaGruppe>
      )
    }
    {hasAksjonspunkt(MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG, aksjonspunkter)
      && (
      <FaktaGruppe
        aksjonspunktCode={MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG}
        titleCode="OmsorgFaktaForm.Omsorg"
        withoutBorder
      >
        <Normaltekst className={styles.paddingBottom}>
          {oppgittOmsorgSoknad
            ? <FormattedHTMLMessage id="OmsorgFaktaForm.OppgittOmsorg" />
            : <FormattedHTMLMessage id="OmsorgFaktaForm.OppgittIkkeOmsorg" />
          }
        </Normaltekst>
        <RadioGroupField name="omsorg" readOnly={readOnly} validate={[required]} isEdited={omsorgIsEdited}>
          <RadioOption label={{ id: 'OmsorgFaktaForm.HarOmsorg' }} value />
          <RadioOption label={<FormattedHTMLMessage id="OmsorgFaktaForm.HarIkkeOmsorg" />} value={false} />
        </RadioGroupField>
        {omsorg === false
          ? (
            <Row>
              <Column xs="2" />
              <Column xs="6">
                <div className={styles.arrowBox}>
                  <FieldArray
                    name="ikkeOmsorgPerioder"
                    component={IkkeOmsorgPeriodeField}
                    readOnly={readOnly}
                  />
                </div>
              </Column>
            </Row>
          )
          : null
        }
      </FaktaGruppe>
      )
    }
  </div>
);

OmsorgFaktaForm.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  aleneomsorgIsEdited: PropTypes.bool,
  omsorgIsEdited: PropTypes.bool,
  omsorg: PropTypes.bool,
  className: PropTypes.string,
  oppgittAleneomsorgSoknad: PropTypes.bool.isRequired,
  oppgittOmsorgSoknad: PropTypes.bool.isRequired,
};

OmsorgFaktaForm.defaultProps = {
  aleneomsorgIsEdited: false,
  omsorgIsEdited: false,
  omsorg: undefined,
  className: styles.defaultAleneOmsorgFakta,
};

OmsorgFaktaForm.buildInitialValues = (ytelsefordeling, aksjonspunkter) => {
  const aleneomsorgAp = getAksjonspunkt(MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, aksjonspunkter);
  const omsorgAp = getAksjonspunkt(MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG, aksjonspunkter);
  let aleneomsorg = null;
  let omsorg = null;

  if (aleneomsorgAp.length > 0 && !isAksjonspunktOpen(aleneomsorgAp[0].status.kode)) {
    aleneomsorg = ytelsefordeling.aleneOmsorgPerioder && ytelsefordeling.aleneOmsorgPerioder.length > 0;
  }
  if (omsorgAp.length > 0 && !isAksjonspunktOpen(omsorgAp[0].status.kode)) {
    omsorg = !(ytelsefordeling.ikkeOmsorgPerioder && ytelsefordeling.ikkeOmsorgPerioder.length > 0);
  }

  return {
    aleneomsorg,
    omsorg,
    ikkeOmsorgPerioder: ytelsefordeling.ikkeOmsorgPerioder && ytelsefordeling.ikkeOmsorgPerioder.length > 0
      ? ytelsefordeling.ikkeOmsorgPerioder : [{}],
  };
};

OmsorgFaktaForm.transformAleneomsorgValues = values => ({
  kode: MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
  aleneomsorg: values.aleneomsorg,
});

OmsorgFaktaForm.transformOmsorgValues = values => ({
  kode: MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
  omsorg: values.omsorg,
  ikkeOmsorgPerioder: values.ikkeOmsorgPerioder && values.ikkeOmsorgPerioder.length > 0 ? values.ikkeOmsorgPerioder : null,
});


const mapStateToProps = state => ({
  aleneomsorgIsEdited: !!getBehandlingYtelseFordeling(state).aleneOmsorgPerioder,
  omsorgIsEdited: !!getBehandlingYtelseFordeling(state).ikkeOmsorgPerioder,
  oppgittOmsorgSoknad: getSoknad(state).oppgittRettighet.omsorgForBarnet,
  oppgittAleneomsorgSoknad: getSoknad(state).oppgittRettighet.aleneomsorgForBarnet,
});

export default connect(mapStateToProps)(OmsorgFaktaForm);
