import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { RadioGroupField, RadioOption } from 'form/Fields';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Image from 'sharedComponents/Image';
import PeriodLabel from 'sharedComponents/PeriodLabel';
import checkImage from 'images/check.svg';
import avslaattImage from 'images/avslaatt.svg';
import BostedSokerView from 'fakta/components/BostedSokerView';

import styles from './oppholdINorgeOgAdresserFaktaPanel.less';

const capitalizeFirstLetter = (landNavn) => {
  const string = landNavn.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const sjekkOpphold = (opphold, intl) => (
  opphold !== undefined && (
    <Row>
      <Column xs="1">
        <Image
          className={styles.imageWidth}
          src={opphold === true ? checkImage : avslaattImage}
          alt={intl.formatMessage({ id: opphold === true ? 'OppholdINorgeOgAdresserFaktaPanel.Opphold' : 'OppholdINorgeOgAdresserFaktaPanel.IkkeOpphold' })}
        />
      </Column>
      <Column xs="11">
        <Normaltekst>
          {intl.formatMessage({ id: opphold === true ? 'OppholdINorgeOgAdresserFaktaPanel.Yes' : 'OppholdINorgeOgAdresserFaktaPanel.No' })}
        </Normaltekst>
      </Column>
    </Row>
  )
);

const lagOppholdIUtland = utlandsOpphold => (
  utlandsOpphold && utlandsOpphold.map(u => (
    <div key={`${u.landNavn}${u.fom}${u.tom}`}>
      <Row>
        <Column xs="4">
          <Normaltekst>
            {capitalizeFirstLetter(u.landNavn)}
          </Normaltekst>
        </Column>
        <Column xs="8">
          <Normaltekst>
            <PeriodLabel showTodayString dateStringFom={u.fom} dateStringTom={u.tom} />
          </Normaltekst>
        </Column>
      </Row>
    </div>
  ))
);

/**
 * OppholdINorgeOgAdresserFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 * Viser opphold i innland og utland som er relevante for søker. ReadOnly.
 */
const OppholdINorgeOgAdresserFaktaPanelImpl = ({
  intl,
  readOnly,
  hasAksjonspunkt,
  isBosattAksjonspunktClosed,
  opphold,
  foreldre,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT}>
    <Row>
      <Column xs="6">
        <FaktaGruppe withoutBorder titleCode="OppholdINorgeOgAdresserFaktaPanel.OppholdINorge">
          <Undertekst>
            <FormattedMessage id="OppholdINorgeOgAdresserFaktaPanel.StayingInNorway" />
          </Undertekst>
          <VerticalSpacer fourPx />
          {sjekkOpphold(opphold.oppholdNorgeNa, intl)}
          <VerticalSpacer sixteenPx />
          <Undertekst>
            <FormattedMessage id="OppholdINorgeOgAdresserFaktaPanel.StayingInNorwayLast12" />
          </Undertekst>
          <VerticalSpacer fourPx />
          {sjekkOpphold(opphold.oppholdSistePeriode, intl)}
          <VerticalSpacer eightPx />
          {lagOppholdIUtland(opphold.utlandsoppholdFor)}
          <VerticalSpacer sixteenPx />
          <Undertekst>
            <FormattedMessage id="OppholdINorgeOgAdresserFaktaPanel.StayingInNorwayNext12" />
          </Undertekst>
          <VerticalSpacer fourPx />
          {sjekkOpphold(opphold.oppholdNestePeriode, intl)}
          <VerticalSpacer eightPx />
          {lagOppholdIUtland(opphold.utlandsoppholdEtter)}
        </FaktaGruppe>
      </Column>
      <Column xs="6">
        <FaktaGruppe withoutBorder titleCode="OppholdINorgeOgAdresserFaktaPanel.BosattAdresser">
          {foreldre.map(f => (
            <div key={f.personopplysning.navn}>
              {f.isApplicant
              && <BostedSokerView typeSoker={<FormattedMessage id="BostedFaktaView.Soker" />} soker={f.personopplysning} />
              }
              {!f.isApplicant
              && <BostedSokerView typeSoker={<FormattedMessage id="OppholdINorgeOgAdresserFaktaPanel.Parent" />} soker={f.personopplysning} />
              }
            </div>
          ))
          }
        </FaktaGruppe>
        {hasAksjonspunkt
          && (
            <div className={styles.ieFlex}>
              <ElementWrapper>
                <RadioGroupField name="bosattVurdering" validate={[required]} bredde="XXL" readOnly={readOnly} isEdited={isBosattAksjonspunktClosed}>
                  <RadioOption label={{ id: 'OppholdINorgeOgAdresserFaktaPanel.ResidingInNorway' }} value />
                  <RadioOption label={<FormattedHTMLMessage id="OppholdINorgeOgAdresserFaktaPanel.NotResidingInNorway" />} value={false} />
                </RadioGroupField>
              </ElementWrapper>
            </div>
          )
        }
      </Column>
    </Row>
  </FaktaGruppe>
);

OppholdINorgeOgAdresserFaktaPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  isBosattAksjonspunktClosed: PropTypes.bool.isRequired,
  opphold: PropTypes.shape(),
  foreldre: PropTypes.arrayOf(PropTypes.shape()),
};

OppholdINorgeOgAdresserFaktaPanelImpl.defaultProps = {
  opphold: {},
  foreldre: [],
};

const OppholdINorgeOgAdresserFaktaPanel = connect(state => ({
  opphold: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'opphold'),
  foreldre: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'foreldre'),
  hasAksjonspunkt: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'hasBosattAksjonspunkt'),
  isBosattAksjonspunktClosed: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'isBosattAksjonspunktClosed'),
}))(injectIntl(OppholdINorgeOgAdresserFaktaPanelImpl));

const createParent = (isApplicant, personopplysning) => ({
  isApplicant,
  personopplysning,
});

OppholdINorgeOgAdresserFaktaPanel.buildInitialValues = (soknad, personopplysning, medlem, aksjonspunkter) => {
  let opphold = {};

  if (soknad !== null && soknad.oppgittTilknytning !== null) {
    const { oppgittTilknytning } = soknad;
    opphold = {
      oppholdNorgeNa: oppgittTilknytning.oppholdNorgeNa,
      oppholdNestePeriode: oppgittTilknytning.oppholdNestePeriode,
      oppholdSistePeriode: oppgittTilknytning.oppholdSistePeriode,
      utlandsoppholdFor: oppgittTilknytning.utlandsoppholdFor,
      utlandsoppholdEtter: oppgittTilknytning.utlandsoppholdEtter,
    };
  }

  const parents = [createParent(true, personopplysning)];
  if (personopplysning.annenPart) {
    parents.push(createParent(false, personopplysning.annenPart));
  }

  const filteredAp = aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT);
  return {
    opphold,
    hasBosattAksjonspunkt: filteredAp.length > 0,
    isBosattAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status.kode)),
    foreldre: parents,
    bosattVurdering: medlem.bosattVurdering || medlem.bosattVurdering === false
      ? medlem.bosattVurdering : undefined,
  };
};

OppholdINorgeOgAdresserFaktaPanel.transformValues = values => ({
  kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
  bosattVurdering: values.bosattVurdering,
});

export default OppholdINorgeOgAdresserFaktaPanel;
