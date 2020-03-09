import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { RadioGroupField, RadioOption, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { required } from '@fpsak-frontend/utils';
import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';
import {
  ElementWrapper, Image, PeriodLabel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import checkImage from '@fpsak-frontend/assets/images/check.svg';
import avslaattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import { FaktaGruppe } from '@fpsak-frontend/fp-felles';

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
          <FormattedMessage id={opphold === true ? 'OppholdINorgeOgAdresserFaktaPanel.Yes' : 'OppholdINorgeOgAdresserFaktaPanel.No'} />
        </Normaltekst>
      </Column>
    </Row>
  )
);

const lagOppholdIUtland = (utlandsOpphold) => (
  utlandsOpphold && utlandsOpphold.map((u) => (
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
  hasBosattAksjonspunkt,
  isBosattAksjonspunktClosed,
  opphold,
  foreldre,
  alleKodeverk,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT}
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]}
  >
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
          {lagOppholdIUtland(opphold.utlandsoppholdFor, intl)}
          <VerticalSpacer sixteenPx />
          <Undertekst>
            <FormattedMessage id="OppholdINorgeOgAdresserFaktaPanel.StayingInNorwayNext12" />
          </Undertekst>
          <VerticalSpacer fourPx />
          {sjekkOpphold(opphold.oppholdNestePeriode, intl)}
          <VerticalSpacer eightPx />
          {lagOppholdIUtland(opphold.utlandsoppholdEtter, intl)}
        </FaktaGruppe>
      </Column>
      <Column xs="6">
        <FaktaGruppe withoutBorder titleCode="OppholdINorgeOgAdresserFaktaPanel.BosattAdresser">
          {foreldre.map((f) => (
            <div key={f.personopplysning.navn}>
              {f.isApplicant && (
                <BostedSokerFaktaIndex personopplysninger={f.personopplysning} alleKodeverk={alleKodeverk} />
              )}
              {!f.isApplicant && (
                <BostedSokerFaktaIndex
                  sokerTypeTextId="OppholdINorgeOgAdresserFaktaPanel.Parent"
                  personopplysninger={f.personopplysning}
                  alleKodeverk={alleKodeverk}
                />
              )}
            </div>
          ))}
        </FaktaGruppe>
        {hasBosattAksjonspunkt
          && (
            <div className={styles.ieFlex}>
              <ElementWrapper>
                <RadioGroupField name="bosattVurdering" validate={[required]} bredde="XXL" readOnly={readOnly} isEdited={isBosattAksjonspunktClosed}>
                  <RadioOption label={{ id: 'OppholdINorgeOgAdresserFaktaPanel.ResidingInNorway' }} value />
                  <RadioOption label={<FormattedHTMLMessage id="OppholdINorgeOgAdresserFaktaPanel.NotResidingInNorway" />} value={false} />
                </RadioGroupField>
              </ElementWrapper>
            </div>
          )}
      </Column>
    </Row>
  </FaktaGruppe>
);

OppholdINorgeOgAdresserFaktaPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasBosattAksjonspunkt: PropTypes.bool.isRequired,
  isBosattAksjonspunktClosed: PropTypes.bool.isRequired,
  opphold: PropTypes.shape(),
  foreldre: PropTypes.arrayOf(PropTypes.shape()),
  alleKodeverk: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

OppholdINorgeOgAdresserFaktaPanelImpl.defaultProps = {
  opphold: {},
  foreldre: [],
};

const mapStateToProps = (state, ownProps) => {
  const { behandlingId, behandlingVersjon } = ownProps;
  const formName = `OppholdInntektOgPeriodeForm-${ownProps.id}`;
  return {
    opphold: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'opphold'),
    foreldre: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'foreldre'),
    hasBosattAksjonspunkt: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'hasBosattAksjonspunkt'),
    isBosattAksjonspunktClosed: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isBosattAksjonspunktClosed'),
  };
};

const OppholdINorgeOgAdresserFaktaPanel = connect(mapStateToProps)(injectIntl(OppholdINorgeOgAdresserFaktaPanelImpl));

const createParent = (isApplicant, personopplysning) => ({
  isApplicant,
  personopplysning,
});

OppholdINorgeOgAdresserFaktaPanel.buildInitialValues = (soknad, periode, aksjonspunkter) => {
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

  const { personopplysninger } = periode;
  const parents = [createParent(true, personopplysninger)];
  if (personopplysninger.annenPart) {
    parents.push(createParent(false, personopplysninger.annenPart));
  }

  const filteredAp = aksjonspunkter
    .filter((ap) => periode.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT)
      || (periode.aksjonspunkter.length > 0
        && periode.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT)
        && ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP));

  return {
    opphold,
    hasBosattAksjonspunkt: filteredAp.length > 0,
    isBosattAksjonspunktClosed: filteredAp.some((ap) => !isAksjonspunktOpen(ap.status.kode)),
    foreldre: parents,
    bosattVurdering: periode.bosattVurdering || periode.bosattVurdering === false
      ? periode.bosattVurdering : undefined,
  };
};

OppholdINorgeOgAdresserFaktaPanel.transformValues = (values) => ({
  kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
  bosattVurdering: values.bosattVurdering,
});

export default OppholdINorgeOgAdresserFaktaPanel;
