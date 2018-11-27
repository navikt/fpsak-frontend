import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FadingPanel from 'sharedComponents/FadingPanel';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import uttaksresultatPropType from 'behandling/proptypes/uttaksresultatPropType';
import { getUttaksresultatPerioder, getStonadskontoer } from 'behandling/behandlingSelectors';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import AlertStripe from 'nav-frontend-alertstriper';
import { uttakPeriodeNavn, stonadskontoType } from 'kodeverk/uttakPeriodeType';
import periodeResultatType from 'kodeverk/periodeResultatType';

import Uttak from './Uttak';
import styles from './uttakPanel.less';

const formName = 'UttakForm';

const uttakAksjonspunkter = [
  aksjonspunktCodes.TILKNYTTET_STORTINGET,
  aksjonspunktCodes.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_MEDLEMSKAP,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT,
  aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
];

const hentApTekst = (uttaksresultat, isApOpen, aksjonspunkter) => {
  const texts = [];
  const [helpText] = uttaksresultat.perioderSøker.filter(p => (p.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING));
  const helptTextAksjonspunkter = aksjonspunkter.filter(ap => ap.definisjon.kode !== aksjonspunktCodes.FASTSETT_UTTAKPERIODER
    && ap.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);

  const overstyrApHelpText = aksjonspunkter.length === 1 && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER;
  const uttakPanelAksjonsPunktKoder = {
    5001: 'UttakPanel.Aksjonspunkt.5001',
    5002: 'UttakPanel.Aksjonspunkt.5002',
    5003: 'UttakPanel.Aksjonspunkt.5003',
    5004: 'UttakPanel.Aksjonspunkt.5004',
    5005: 'UttakPanel.Aksjonspunkt.5005',
    5006: 'UttakPanel.Aksjonspunkt.5006',
    5007: 'UttakPanel.Aksjonspunkt.5007',
    5008: 'UttakPanel.Aksjonspunkt.5008',
    5009: 'UttakPanel.Aksjonspunkt.5009',
    5010: 'UttakPanel.Aksjonspunkt.5010',
    5011: 'UttakPanel.Aksjonspunkt.5011',
    5012: 'UttakPanel.Aksjonspunkt.5012',
    5013: 'UttakPanel.Aksjonspunkt.5013',
    5072: 'UttakPanel.Aksjonspunkt.5072',
    5073: 'UttakPanel.Aksjonspunkt.5073',
    5074: 'UttakPanel.Aksjonspunkt.5074',
    5075: 'UttakPanel.Aksjonspunkt.5075',
    5076: 'UttakPanel.Aksjonspunkt.5076',
    5077: 'UttakPanel.Aksjonspunkt.5077',
    5078: 'UttakPanel.Aksjonspunkt.5078',
    5079: 'UttakPanel.Aksjonspunkt.5079',
    5024: 'UttakPanel.Aksjonspunkt.5024',
  };
  if (helptTextAksjonspunkter) {
    helptTextAksjonspunkter.forEach((ap) => {
      if (uttakPanelAksjonsPunktKoder[ap.definisjon.kode]) {
        texts.push(<FormattedMessage key="aksjonspunktTekst" id={uttakPanelAksjonsPunktKoder[ap.definisjon.kode]} />);
      } else {
        texts.push(<FormattedMessage key="aksjonspunktTekst" id={`UttakPanel.Aksjonspunkt.${ap.definisjon.kode}`} />);
      }
    });
  }
  if (helpText) {
    if (uttakPanelAksjonsPunktKoder[helpText.manuellBehandlingÅrsak.kode]) {
      texts.push(<FormattedMessage
        key="manuellÅrsak"
        id={uttakPanelAksjonsPunktKoder[helpText.manuellBehandlingÅrsak.kode]}
      />);
    } else {
      texts.push(<FormattedMessage key="manuellÅrsak" id={`UttakPanel.Aksjonspunkt.${helpText.manuellBehandlingÅrsak.kode}`} />);
    }
    texts.push(<FormattedMessage key="generellTekst" id="UttakPanel.Aksjonspunkt.Generell" />);
  }

  if (overstyrApHelpText) {
    texts.push(<FormattedMessage key="aksjonspunktTekst" id="UttakPanel.Overstyrt.KontrollerPaNytt" />);
  }

  if (!isApOpen) {
    texts.push(<FormattedMessage key="behandlet" id="UttakPanel.Aksjonspunkt.Behandlet" />);
  }
  return texts;
};

export const UttakPanelImpl = ({
  uttaksresultat,
  aksjonspunkter,
  readOnly,
  manuellOverstyring,
  isApOpen,
  intl,
  ...formProps
}) => (
  <FadingPanel>
    <Undertittel>
      <FormattedMessage id="UttakPanel.Title" />
    </Undertittel>
    <VerticalSpacer twentyPx />
    {aksjonspunkter.length > 0
    && (
      <ElementWrapper>
        <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
          {hentApTekst(uttaksresultat, isApOpen, aksjonspunkter)}
        </AksjonspunktHelpText>
        <VerticalSpacer twentyPx />
      </ElementWrapper>
    )
    }
    {uttaksresultat
    && (
      <form onSubmit={formProps.handleSubmit}>
        <Uttak
          intl={intl}
          submitting={formProps.submitting}
          isDirty={formProps.dirty}
          formName={formName}
          manuellOverstyring={manuellOverstyring}
          readOnly={readOnly}
          isApOpen={isApOpen}
          aksjonspunkter={aksjonspunkter}
        />
      </form>
    )
    }
    {formProps.error && formProps.submitFailed
    && formProps.error}
  </FadingPanel>
);

UttakPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  uttaksresultat: uttaksresultatPropType,
  manuellOverstyring: PropTypes.bool,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  isApOpen: PropTypes.bool,
  ...formPropTypes,
};

UttakPanelImpl.defaultProps = {
  uttaksresultat: undefined,
  apCodes: undefined,
  isApOpen: false,
  manuellOverstyring: undefined,
};

const getResult = (uttaksresultatActivity) => {
  const uttakResult = {};
  uttaksresultatActivity.forEach((uttak) => {
    uttak.aktiviteter.forEach((a, index) => {
      const aktivitetDays = (typeof a.days !== 'undefined' && typeof a.weeks !== 'undefined')
        ? ((a.weeks * 5) + a.days)
        : a.trekkdager;

      if ((`${a.stønadskontoType.kode}_${index}`) in uttakResult) {
        const trekkdager = uttakResult[`${a.stønadskontoType.kode}_${index}`].trekkdager + aktivitetDays;
        uttakResult[`${a.stønadskontoType.kode}_${index}`] = {
          trekkdager,
          konto: a.stønadskontoType.kode,
        };
      } else {
        uttakResult[`${a.stønadskontoType.kode}_${index}`] = {
          trekkdager: aktivitetDays,
          konto: a.stønadskontoType.kode,
        };
      }
    });
  });
  return uttakResult;
};


const addAnnenPart = uttakResult => Object.values(uttakResult)
  .map((u) => {
    const uttakElement = { ...u };
    uttakElement.trekkdager = u.trekkdager;
    uttakElement.saldo = u.saldo;
    return uttakElement;
  });

const checkPeriodMaxDays = periode => (periode ? periode.maxDager : 665); // tallet hentet fra -PKMANTIS-1808

const getMaxDays = (stonadskontoTypeKode, stonadskontoer) => {
  switch (stonadskontoTypeKode) {
    case stonadskontoType.FORELDREPENGER_FØR_FØDSEL:
      return checkPeriodMaxDays(stonadskontoer.FORELDREPENGER_FØR_FØDSEL);
    case stonadskontoType.FORELDREPENGER:
      return checkPeriodMaxDays(stonadskontoer.FORELDREPENGER);
    case stonadskontoType.FELLESPERIODE:
      return checkPeriodMaxDays(stonadskontoer.FELLESPERIODE);
    case stonadskontoType.MØDREKVOTE:
      return checkPeriodMaxDays(stonadskontoer.MØDREKVOTE);
    case stonadskontoType.FEDREKVOTE:
      return checkPeriodMaxDays(stonadskontoer.FEDREKVOTE);
    default:
      return undefined;
  }
};

const checkMaxDager = (uttaksresultatActivity, stonadskonto) => {
  let errors = null;
  const uttakResult = getResult(uttaksresultatActivity);
  const addAnnenPartFordelteDager = addAnnenPart(uttakResult);
  addAnnenPartFordelteDager.forEach((value) => {
    const maxDays = getMaxDays(value.konto, stonadskonto.stonadskontoer) - value.trekkdager;
    if (typeof maxDays !== 'undefined' && (maxDays < 0)) {
      errors = {
        _error:
  <AlertStripe type="advarsel" className={styles.marginTop}>
    <FormattedMessage
      id="ValidationMessage.NegativeSaldo"
      values={{
        periode: uttakPeriodeNavn[value.konto],
        days: maxDays * -1,
      }}
    />
  </AlertStripe>,
      };
    }
  });
  return errors;
};

const checkFlerbarnsMaksDager = (uttaksresultatActivity, stonadskonto) => {
  let errors = null;
  let flerbarnsdager = 0;
  const flerbarnsMaksDager = stonadskonto.FLERBARNSDAGER ? stonadskonto.FLERBARNSDAGER.maxDager : 0;
  uttaksresultatActivity.forEach((uttak) => {
    if (uttak.flerbarnsdager) {
      uttak.aktiviteter.forEach((a) => {
        flerbarnsdager += (typeof a.days !== 'undefined' && typeof a.weeks !== 'undefined')
          ? ((a.weeks * 5) + a.days)
          : a.trekkdager;
      });
    }
  });
  if (flerbarnsdager > flerbarnsMaksDager) {
    errors = {
      _error:
  <AlertStripe type="advarsel" className={styles.marginTop}>
    <FormattedMessage
      id="ValidationMessage.InvalidTrekkDagerFlerbarnsdager"
      values={{
        maxDays: flerbarnsMaksDager,
      }}
    />
  </AlertStripe>,
    };
  }
  return errors;
};

const checkValidStonadKonto = (uttakPerioder, stonadskontoer) => {
  let errors = null;
  uttakPerioder.forEach((periode) => {
    const ikkeGyldigKonto = periode.aktiviteter.filter(a => !(Object.prototype.hasOwnProperty.call(stonadskontoer, a.stønadskontoType.kode))
      && (a.days > 0 || a.weeks > 0));
    if (ikkeGyldigKonto && ikkeGyldigKonto.length > 0) {
      errors = {
        _error:
  <AlertStripe type="advarsel" className={styles.marginTop}>
    <FormattedMessage
      id="ValidationMessage.InvalidStonadskonto"
      values={{
        konto: uttakPeriodeNavn[ikkeGyldigKonto[0].stønadskontoType.kode],
      }}
    />
  </AlertStripe>,
      };
    }
  });
  return errors;
};

const validateUttakPanelForm = (values, stonadskonto) => {
  const { uttaksresultatActivity } = values;

  if (uttaksresultatActivity) {
    const stonadkontoError = checkValidStonadKonto(uttaksresultatActivity, stonadskonto.stonadskontoer);
    if (stonadkontoError) {
      return stonadkontoError;
    }
    const maxDagerError = checkMaxDager(uttaksresultatActivity, stonadskonto);
    if (maxDagerError) {
      return maxDagerError;
    }
    const flerbarnsMaksDager = checkFlerbarnsMaksDager(uttaksresultatActivity, stonadskonto.stonadskontoer);
    if (flerbarnsMaksDager) {
      return flerbarnsMaksDager;
    }
  }
  return null;
};

export const buildInitialValues = createSelector(
  [getUttaksresultatPerioder],
  uttaksresultat => ({
    uttaksresultatActivity: uttaksresultat.perioderSøker.map((ua, index) => ({
      ...ua,
      id: index + 1,
    })),
  }),
);

export const transformValues = (values, apCodes, aksjonspunkter) => {
  const overstyrErOpprettet = aksjonspunkter.filter(ap => ap.status.kode === 'OPPR' && ap.definisjon.kode === '6008');
  const removeOverstyrApCode = apCodes.filter(a => a !== '6008');
  let aksjonspunkt = removeOverstyrApCode;

  const transformedResultat = values.uttaksresultatActivity.map((perioder) => {
    const { tilknyttetStortinget, ...uta } = perioder; // NOSONAR destruct er bedre enn delete, immutable
    const { ...transformActivity } = uta;
    const transformAktiviteter = uta.aktiviteter.map((a) => {
      const { days, weeks, ...transformAktivitet } = a;
      if (typeof days !== 'undefined' && typeof weeks !== 'undefined') {
        const trekkdager = (weeks * 5) + days;
        transformAktivitet.trekkdager = trekkdager; // regner om uker og dager til trekkdager
      }
      return transformAktivitet;
    });
    transformActivity.aktiviteter = transformAktiviteter;
    return transformActivity;
  });

  if (values.manuellOverstyring || (aksjonspunkter.length === 1 && overstyrErOpprettet.length > 0)) {
    aksjonspunkt = [aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER];
  }

  return aksjonspunkt.map(ap => ({
    kode: ap,
    perioder: transformedResultat,
  }));
};

const mapStateToProps = (state, ownProps) => {
  const uttaksresultat = getUttaksresultatPerioder(state);
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
  const stonadskonto = getStonadskontoer(state);

  return {
    uttaksresultat,
    aksjonspunkter,
    stonadskonto,
    initialValues: buildInitialValues(state),
    manuellOverstyring: behandlingFormValueSelector(formName)(state, 'manuellOverstyring'),
    validate: values => validateUttakPanelForm(values, stonadskonto),
    onSubmit: values => ownProps.submitCallback(transformValues(values, ownProps.apCodes, aksjonspunkter)),
  };
};

const UttakPanel = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(UttakPanelImpl)));

UttakPanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.UTTAK || uttakAksjonspunkter.some(ap => apCodes.includes(ap));

export default UttakPanel;
