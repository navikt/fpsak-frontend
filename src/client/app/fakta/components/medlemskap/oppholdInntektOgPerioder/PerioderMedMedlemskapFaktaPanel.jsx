import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import moment from 'moment';

import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { RadioGroupField, RadioOption } from 'form/Fields';
import DateLabel from 'sharedComponents/DateLabel';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import PeriodLabel from 'sharedComponents/PeriodLabel';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { required } from 'utils/validation/validators';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';


const headerTextCodes = [
  'PerioderMedMedlemskapFaktaPanel.Period',
  'PerioderMedMedlemskapFaktaPanel.Coverage',
  'PerioderMedMedlemskapFaktaPanel.Status',
  'PerioderMedMedlemskapFaktaPanel.Date',
];

/**
 * PerioderMedMedlemskapFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av perioder (Medlemskapsvilkåret).
 */
export const PerioderMedMedlemskapFaktaPanelImpl = ({
  readOnly,
  hasPeriodeAksjonspunkt,
  isPeriodAksjonspunktClosed,
  periods,
  fodselsdato,
  termindato,
  omsorgsovertakelseDato,
  vurderingTypes,
}) => {
  if (!periods || periods.length === 0) {
    return (
      <FaktaGruppe titleCode="PerioderMedMedlemskapFaktaPanel.ApplicationInformation">
        <Normaltekst>
          <FormattedMessage id="PerioderMedMedlemskapFaktaPanel.NoInformation" />
        </Normaltekst>
      </FaktaGruppe>
    );
  }

  return (
    <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE} titleCode="PerioderMedMedlemskapFaktaPanel.ApplicationInformation">
      <Table headerTextCodes={headerTextCodes}>
        {periods.map((period) => {
          const key = period.fom + period.tom + period.dekning + period.status + period.beslutningsdato;
          return (
            <TableRow key={key} id={key}>
              <TableColumn>
                <PeriodLabel showTodayString dateStringFom={period.fom} dateStringTom={period.tom} />
              </TableColumn>
              <TableColumn>
                {period.dekning}
              </TableColumn>
              <TableColumn>
                {period.status}
              </TableColumn>
              <TableColumn>
                {period.beslutningsdato ? <DateLabel dateString={period.beslutningsdato} /> : null}
              </TableColumn>
            </TableRow>
          );
        })
        }
      </Table>
      {hasPeriodeAksjonspunkt
      && (
      <Row>
        <Column xs="12">
          <RadioGroupField name="manuellVurderingType.kode" validate={[required]} readOnly={readOnly} isEdited={isPeriodAksjonspunktClosed}>
            {vurderingTypes.map(type => <RadioOption key={type.kode} value={type.kode} label={type.navn} />)}
          </RadioGroupField>
        </Column>
      </Row>
      )
      }
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="8" />
        <Column xs="4">
          {fodselsdato
          && (
          <FormattedMessage
            id="PerioderMedMedlemskapFaktaPanel.Fodselsdato"
            values={{ dato: moment(fodselsdato).format(DDMMYYYY_DATE_FORMAT) }}
          />
          )
          }
          {termindato
          && (
          <FormattedMessage
            id="PerioderMedMedlemskapFaktaPanel.Termindato"
            values={{ dato: moment(termindato).format(DDMMYYYY_DATE_FORMAT) }}
          />
          )
          }
          {omsorgsovertakelseDato
          && (
          <FormattedMessage
            id="PerioderMedMedlemskapFaktaPanel.Omsorgsovertakelse"
            values={{ dato: moment(omsorgsovertakelseDato).format(DDMMYYYY_DATE_FORMAT) }}
          />
          )
          }
        </Column>
      </Row>
    </FaktaGruppe>
  );
};

PerioderMedMedlemskapFaktaPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  periods: PropTypes.arrayOf(PropTypes.shape()),
  fodselsdato: PropTypes.string,
  termindato: PropTypes.string,
  omsorgsovertakelseDato: PropTypes.string,
  vurderingTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasPeriodeAksjonspunkt: PropTypes.bool.isRequired,
  isPeriodAksjonspunktClosed: PropTypes.bool.isRequired,
};

PerioderMedMedlemskapFaktaPanelImpl.defaultProps = {
  fodselsdato: undefined,
  termindato: undefined,
  omsorgsovertakelseDato: undefined,
  periods: [],
};

const mapStateToProps = state => ({
  ...behandlingFormValueSelector('OppholdInntektOgPerioderForm')(
    state, 'periods', 'fodselsdato', 'termindato',
    'omsorgsovertakelseDato', 'hasPeriodeAksjonspunkt', 'isPeriodAksjonspunktClosed',
  ),
  vurderingTypes: getKodeverk(kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE)(state),
});

const PerioderMedMedlemskapFaktaPanel = connect(mapStateToProps)(PerioderMedMedlemskapFaktaPanelImpl);

PerioderMedMedlemskapFaktaPanel.buildInitialValues = (medlem, soknad, aksjonspunkter) => {
  if (medlem === null) {
    return [];
  }

  const periods = medlem.medlemskapPerioder
    .map(i => ({
      fom: i.fom,
      tom: i.tom,
      dekning: i.dekningType.navn,
      status: i.medlemskapType.navn,
      beslutningsdato: i.beslutningsdato,
    }))
    .sort((p1, p2) => moment(p1.fom).isSameOrBefore(p2.fom));

  const filteredAp = aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE);
  return {
    periods,
    manuellVurderingType: medlem.medlemskapManuellVurderingType,
    fodselsdato: soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined,
    termindato: soknad.termindato,
    omsorgsovertakelseDato: soknad.omsorgsovertakelseDato,
    hasPeriodeAksjonspunkt: filteredAp.length > 0,
    isPeriodAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status.kode)),
  };
};

PerioderMedMedlemskapFaktaPanel.transformValues = (values, manuellVurderingTyper) => ({
  kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  manuellVurderingType: manuellVurderingTyper.find(m => m.kode === values.manuellVurderingType.kode),
});

export default PerioderMedMedlemskapFaktaPanel;
