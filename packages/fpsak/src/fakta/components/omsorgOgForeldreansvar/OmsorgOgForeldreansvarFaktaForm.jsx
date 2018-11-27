import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { getEditedStatus } from 'behandling/behandlingSelectors';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import EditedIcon from 'sharedComponents/EditedIcon';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { SelectField } from 'form/Fields';
import { required, hasValidInteger } from 'utils/validation/validators';
import VilkarType from 'kodeverk/vilkarType';
import { isEmpty } from 'utils/objectUtils';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import OmsorgsovertakelseFaktaPanel from './OmsorgsovertakelseFaktaPanel';
import RettighetFaktaPanel from './RettighetFaktaPanel';
import BarnPanel from './BarnPanel';
import ForeldrePanel from './ForeldrePanel';

import styles from './omsorgOgForeldreansvarFaktaForm.less';

const getDescriptionText = (vilkarCode) => {
  if (vilkarCode === VilkarType.OMSORGSVILKARET) {
    return <FormattedMessage id="OmsorgOgForeldreansvarFaktaForm.HelpTextOmsorgTredjeLedd" />;
  } if (vilkarCode === VilkarType.FORELDREANSVARSVILKARET_2_LEDD) {
    return <FormattedMessage id="OmsorgOgForeldreansvarFaktaForm.HelpTextForeldreAndreLedd" />;
  } if (vilkarCode === VilkarType.FORELDREANSVARSVILKARET_4_LEDD) {
    return <FormattedMessage id="OmsorgOgForeldreansvarFaktaForm.HelpTextForeldreFjerdeLedd" />;
  }
  return <FormattedMessage id="OmsorgOgForeldreansvarFaktaForm.ChooseVilkarToSeeDescription" />;
};

const findAksjonspunktHelpTexts = erAksjonspunktForeldreansvar => (erAksjonspunktForeldreansvar
  ? [<FormattedMessage key="CheckInformation" id="OmsorgOgForeldreansvarFaktaForm.CheckInformationForeldreansvar" />]
  : [<FormattedMessage key="CheckInformation" id="OmsorgOgForeldreansvarFaktaForm.CheckInformation" />,
    <FormattedMessage key="ChooseVilkar" id="OmsorgOgForeldreansvarFaktaForm.ChooseVilkar" />]);

/**
 * OmsorgOgForeldreansvarFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av fakta for omsorgs og foreldreansvarsvilkåret.
 */
const OmsorgOgForeldreansvarFaktaFormImpl = ({
  intl,
  readOnly,
  vilkarTypes,
  hasOpenAksjonspunkter,
  antallBarn,
  vilkarType,
  relatertYtelseTypes,
  vilkarTypeIsEdited,
  erAksjonspunktForeldreansvar,
}) => (
  <ElementWrapper>
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {findAksjonspunktHelpTexts(erAksjonspunktForeldreansvar)}
    </AksjonspunktHelpText>
    <Row>
      <Column xs={erAksjonspunktForeldreansvar ? '12' : '6'}>
        <OmsorgsovertakelseFaktaPanel readOnly={readOnly} erAksjonspunktForeldreansvar={erAksjonspunktForeldreansvar} />
      </Column>
      {!erAksjonspunktForeldreansvar
        && (
        <Column xs="6">
          <RettighetFaktaPanel relatertYtelseTypes={relatertYtelseTypes} />
        </Column>
        )
      }
    </Row>
    <Row>
      <Column xs="6">
        <FieldArray name="barn" component={BarnPanel} antallBarn={antallBarn} readOnly={readOnly} />
      </Column>
      <Column xs="6">
        <FieldArray name="foreldre" component={ForeldrePanel} readOnly={readOnly} />
      </Column>
    </Row>
    {!erAksjonspunktForeldreansvar
      && (
      <FaktaGruppe
        aksjonspunktCode={aksjonspunktCodes.OMSORGSOVERTAKELSE}
        titleCode="OmsorgOgForeldreansvarFaktaForm.VelgVilkaarSomSkalAnvendes"
      >
        {!readOnly
          && (
          <SelectField
            name="vilkarType"
            validate={[required]}
            label=""
            placeholder={intl.formatMessage({ id: 'OmsorgOgForeldreansvarFaktaForm.SelectVIlkar' })}
            selectValues={vilkarTypes.map(d => (<option key={d.kode} value={d.kode}>{d.navn}</option>))}
            bredde="xxl"
            readOnly={readOnly}
            disabled={readOnly}
          />
          )
        }
        {(readOnly && vilkarType)
          && (
          <div className={styles.vilkarTypeReadOnly}>
            <Element tag="span">
              {vilkarTypes.find(d => d.kode === vilkarType).navn}
            </Element>
            {vilkarTypeIsEdited
              && <EditedIcon />
            }
          </div>
          )
        }
        <Normaltekst>
          {getDescriptionText(vilkarType)}
          {' '}
        </Normaltekst>
      </FaktaGruppe>
      )
    }
  </ElementWrapper>
);

OmsorgOgForeldreansvarFaktaFormImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  vilkarTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number.isRequired,
  vilkarType: PropTypes.string.isRequired,
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erAksjonspunktForeldreansvar: PropTypes.bool.isRequired,
  vilkarTypeIsEdited: PropTypes.bool,
};

OmsorgOgForeldreansvarFaktaFormImpl.defaultProps = {
  vilkarTypeIsEdited: false,
};

const OmsorgOgForeldreansvarFaktaForm = connect(state => ({
  vilkarTypeIsEdited: getEditedStatus(state).vilkarType,
  ...behandlingFormValueSelector('OmsorgOgForeldreansvarInfoPanel')(state, 'antallBarn', 'vilkarType'),
}))(injectIntl(OmsorgOgForeldreansvarFaktaFormImpl));


OmsorgOgForeldreansvarFaktaForm.buildInitialValues = (soknad, familiehendelse, personopplysning, innvilgetRelatertTilgrensendeYtelserForAnnenForelder) => ({
  vilkarType: familiehendelse.vilkarType ? familiehendelse.vilkarType.kode : '',
  originalAntallBarn: soknad.antallBarn,
  ...ForeldrePanel.buildInitialValues(personopplysning),
  ...BarnPanel.buildInitialValues(personopplysning, soknad),
  ...OmsorgsovertakelseFaktaPanel.buildInitialValues(soknad, familiehendelse),
  ...RettighetFaktaPanel.buildInitialValues(soknad, innvilgetRelatertTilgrensendeYtelserForAnnenForelder),
});

OmsorgOgForeldreansvarFaktaForm.validate = ({ originalAntallBarn, antallBarn }) => {
  const errors = {};
  if (antallBarn < 1 || antallBarn > originalAntallBarn) {
    errors.antallBarn = ([{ id: 'OmsorgOgForeldreansvarFaktaForm.AntallBarnValidation' }]);
  }
  if (isEmpty(errors)) {
    const res = hasValidInteger(antallBarn);
    if (res !== null) {
      errors.antallBarn = res;
    }
  }
  return errors;
};

OmsorgOgForeldreansvarFaktaForm.transformValues = (values, aksjonspunkt) => {
  const newValues = {
    omsorgsovertakelseDato: values.omsorgsovertakelseDato,
    antallBarn: values.antallBarn,
    barn: values.barn,
    foreldre: values.foreldre,
  };
  if (aksjonspunkt.definisjon.kode === aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR) {
    newValues.foreldreansvarDato = values.foreldreansvarDato;
    newValues.kode = aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR;
  } else {
    newValues.vilkarType = values.vilkarType;
    newValues.kode = aksjonspunktCodes.OMSORGSOVERTAKELSE;
  }
  return newValues;
};

export default OmsorgOgForeldreansvarFaktaForm;
