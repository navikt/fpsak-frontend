import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';

import { uttaksresultaltPerioderSøkerPropType } from '@fpsak-frontend/prop-types';
import { behandlingFormValueSelector, behandlingForm } from '@fpsak-frontend/fp-felles';
import {
  AksjonspunktHelpTextTemp, ElementWrapper, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AlertStripe from 'nav-frontend-alertstriper';
import { stonadskontoType, uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';

import Uttak from './Uttak';
import styles from './uttakPanel.less';

const formName = 'UttakForm';

const hentApTekst = (uttaksresultat, isApOpen, aksjonspunkter) => {
  const helptTextAksjonspunkter = aksjonspunkter.filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.FASTSETT_UTTAKPERIODER
    && ap.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);

  const uttakPanelAksjonsPunktKoder = {
    5072: 'UttakPanel.Aksjonspunkt.5072',
    5073: 'UttakPanel.Aksjonspunkt.5073',
    5074: 'UttakPanel.Aksjonspunkt.5074',
    5075: 'UttakPanel.Aksjonspunkt.5075',
    5076: 'UttakPanel.Aksjonspunkt.5076',
    5077: 'UttakPanel.Aksjonspunkt.5077',
    5078: 'UttakPanel.Aksjonspunkt.5078',
    5079: 'UttakPanel.Aksjonspunkt.5079',
    5098: 'UttakPanel.Aksjonspunkt.5098',
  };

  const texts = [];
  const helpText = uttaksresultat.perioderSøker.find((p) => (p.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING));

  const overstyrApHelpTextOpen = aksjonspunkter.length === 1
    && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
    && aksjonspunkter[0].status.kode !== 'UTFO';

  const overstyrApHelpTextUtfort = aksjonspunkter.length === 1
    && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
    && aksjonspunkter[0].status.kode === 'UTFO';


  helptTextAksjonspunkter.forEach((ap) => {
    if (uttakPanelAksjonsPunktKoder[ap.definisjon.kode]) {
      texts.push(<FormattedMessage key="aksjonspunktTekst" id={uttakPanelAksjonsPunktKoder[ap.definisjon.kode]} />);
    }
  });

  if (helpText) {
    texts.push(<FormattedMessage key="generellTekst" id="UttakPanel.Aksjonspunkt.Generell" />);
  }

  if (overstyrApHelpTextOpen) {
    texts.push(<FormattedMessage key="aksjonspunktTekst" id="UttakPanel.Overstyrt.KontrollerPaNytt" />);
  }
  if (overstyrApHelpTextUtfort) {
    texts.push(<FormattedMessage key="aksjonspunktTekst" id="UttakPanel.Overstyrt.Utfort" />);
  }

  if (!isApOpen) {
    texts.push(<FormattedMessage key="behandlet" id="UttakPanel.Aksjonspunkt.Behandlet" />);
  }
  return texts;
};

export const UttakPanelImpl = ({
  uttaksresultat,
  aksjonspunkter,
  soknad,
  person,
  familiehendelse,
  uttakPeriodeGrense,
  ytelsefordeling,
  behandlingId,
  behandlingType,
  behandlingStatus,
  alleKodeverk,
  behandlingVersjon,
  employeeHasAccess,
  behandlingsresultat,
  tempUpdateStonadskontoer,
  readOnly,
  manuellOverstyring,
  fagsak,
  isApOpen,
  intl,
  ...formProps
}) => (
  <>
    <Undertittel>
      <FormattedMessage id="UttakPanel.Title" />
    </Undertittel>
    <VerticalSpacer twentyPx />
    {aksjonspunkter.length > 0
        && (
          <ElementWrapper>
            <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
              {hentApTekst(uttaksresultat, isApOpen, aksjonspunkter)}
            </AksjonspunktHelpTextTemp>
            <VerticalSpacer twentyPx />
          </ElementWrapper>
        )}
    {uttaksresultat
        && (
          <form onSubmit={formProps.handleSubmit}>
            <Uttak
              intl={intl}
              submitting={formProps.submitting}
              isDirty={formProps.dirty}
              formName={formName}
              manuellOverstyring={manuellOverstyring}
              person={person}
              familiehendelse={familiehendelse}
              uttakPeriodeGrense={uttakPeriodeGrense}
              ytelsefordeling={ytelsefordeling}
              behandlingId={behandlingId}
              behandlingType={behandlingType}
              behandlingVersjon={behandlingVersjon}
              behandlingStatus={behandlingStatus}
              fagsak={fagsak}
              alleKodeverk={alleKodeverk}
              readOnly={readOnly}
              isApOpen={isApOpen}
              aksjonspunkter={aksjonspunkter}
              employeeHasAccess={employeeHasAccess}
              uttaksresultat={uttaksresultat}
              behandlingsresultat={behandlingsresultat}
              dekningsgrad={soknad.dekningsgrad}
              mottattDato={soknad.mottattDato}
              fodselsdatoer={soknad.fodselsdatoer}
              termindato={soknad.termindato}
              adopsjonFodelsedatoer={soknad.adopsjonFodelsedatoer}
              soknadsType={soknad.soknadType.kode}
              omsorgsovertakelseDato={soknad.omsorgsovertakelseDato}
              tempUpdateStonadskontoer={tempUpdateStonadskontoer}
            />
          </form>
        )}
    {formProps.error && formProps.submitFailed
        && formProps.error}
  </>
);

UttakPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  uttaksresultat: uttaksresultaltPerioderSøkerPropType,
  stonadskonto: PropTypes.shape().isRequired,
  soknad: PropTypes.shape().isRequired,
  manuellOverstyring: PropTypes.bool,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  isApOpen: PropTypes.bool,
  familiehendelse: PropTypes.shape().isRequired,
  person: PropTypes.shape().isRequired,
  uttakPeriodeGrense: PropTypes.shape().isRequired,
  ytelsefordeling: PropTypes.shape().isRequired,
  behandlingType: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingStatus: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsak: PropTypes.shape().isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  tempUpdateStonadskontoer: PropTypes.func.isRequired,
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
        ? ((a.weeks * 5) + parseFloat(a.days))
        : a.trekkdagerDesimaler;

      if ((`${a.stønadskontoType.kode}_${index}`) in uttakResult) {
        const trekkdagerDesimaler = uttakResult[`${a.stønadskontoType.kode}_${index}`].trekkdagerDesimaler + aktivitetDays;
        uttakResult[`${a.stønadskontoType.kode}_${index}`] = {
          trekkdagerDesimaler,
          konto: a.stønadskontoType.kode,
        };
      } else {
        uttakResult[`${a.stønadskontoType.kode}_${index}`] = {
          trekkdagerDesimaler: aktivitetDays,
          konto: a.stønadskontoType.kode,
        };
      }
    });
  });
  return uttakResult;
};


const convertToArray = (uttakResult) => Object.values(uttakResult)
  .map((u) => {
    const uttakElement = { ...u };
    uttakElement.trekkdagerDesimaler = u.trekkdagerDesimaler;
    uttakElement.saldo = u.saldo;
    return uttakElement;
  });

const getGjeldendeStønadskonto = (stonadskontoTypeKode, stonadskontoer) => {
  switch (stonadskontoTypeKode) {
    case stonadskontoType.FORELDREPENGER_FØR_FØDSEL:
      return stonadskontoer.FORELDREPENGER_FØR_FØDSEL;
    case stonadskontoType.FORELDREPENGER:
      return stonadskontoer.FORELDREPENGER;
    case stonadskontoType.FELLESPERIODE:
      return stonadskontoer.FELLESPERIODE;
    case stonadskontoType.MØDREKVOTE:
      return stonadskontoer.MØDREKVOTE;
    case stonadskontoType.FEDREKVOTE:
      return stonadskontoer.FEDREKVOTE;
    default:
      return undefined;
  }
};

const checkMaxDager = (uttaksresultatActivity, stonadskonto) => {
  let errors = null;
  const uttakResult = getResult(uttaksresultatActivity);
  const uttakResultArray = convertToArray(uttakResult);
  uttakResultArray
    .filter((res) => !(res.konto === stonadskontoType.UDEFINERT && res.trekkdagerDesimaler === 0))
    .forEach((value) => {
      const gjeldendeStønadskonto = getGjeldendeStønadskonto(value.konto, stonadskonto.stonadskontoer);
      if (gjeldendeStønadskonto && !gjeldendeStønadskonto.gyldigForbruk) {
        const minsteSaldo = gjeldendeStønadskonto.aktivitetSaldoDtoList.reduce((min, akt) => {
          if (akt.saldo < min) {
            return akt.saldo;
          }

          return min;
        }, 0);

        errors = {
          _error: (
            <AlertStripe type="advarsel" className={styles.marginTop}>
              <FormattedMessage
                id="ValidationMessage.NegativeSaldo"
                values={{
                  periode: uttakPeriodeNavn[value.konto],
                  days: minsteSaldo * -1,
                }}
              />
            </AlertStripe>
          ),
        };
      }
    });
  return errors;
};

const checkFlerbarnsMaksDager = (stonadskonto = {}) => {
  let errors = null;
  if (stonadskonto.FLERBARNSDAGER && !stonadskonto.FLERBARNSDAGER.gyldigForbruk) {
    errors = {
      _error:
  <AlertStripe type="advarsel" className={styles.marginTop}>
    <FormattedMessage
      id="ValidationMessage.InvalidTrekkDagerFlerbarnsdager"
      values={{
        maxDays: stonadskonto.FLERBARNSDAGER.maxDager,
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
    const ikkeGyldigKonto = periode.aktiviteter.filter((a) => !(Object.prototype.hasOwnProperty.call(stonadskontoer, a.stønadskontoType.kode))
      && (a.days >= 0 || a.weeks >= 0));
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

const validateUttakPanelForm = (values) => {
  const { uttaksresultatActivity, stonadskonto = {} } = values;
  if (uttaksresultatActivity) {
    const stonadkontoError = checkValidStonadKonto(uttaksresultatActivity, stonadskonto.stonadskontoer);
    if (stonadkontoError) {
      return stonadkontoError;
    }
    const maxDagerError = checkMaxDager(uttaksresultatActivity, stonadskonto);
    if (maxDagerError) {
      return maxDagerError;
    }
    const flerbarnsMaksDager = checkFlerbarnsMaksDager(stonadskonto.stonadskontoer);
    if (flerbarnsMaksDager) {
      return flerbarnsMaksDager;
    }
  }
  return null;
};

export const buildInitialValues = createSelector(
  [(props) => props.uttaksresultat, (props) => props.stonadskonto],
  (uttaksresultat, stonadskonto) => ({
    uttaksresultatActivity: uttaksresultat.perioderSøker.map((ua, index) => ({
      ...ua,
      id: index + 1,
    })),
    stonadskonto,
  }),
);

export const transformValues = (values, apCodes, aksjonspunkter) => {
  const overstyrErOpprettet = aksjonspunkter.filter((ap) => ap.status.kode === 'OPPR' && ap.definisjon.kode === '6008');
  const removeOverstyrApCode = apCodes.filter((a) => a !== '6008');
  let aksjonspunkt = removeOverstyrApCode;

  const transformedResultat = values.uttaksresultatActivity.map((perioder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tilknyttetStortinget, ...uta } = perioder; // NOSONAR destruct er bedre enn delete, immutable
    const { ...transformActivity } = uta;
    if (uta.oppholdÅrsak.kode !== '-') {
      uta.aktiviteter = [];
    }

    const transformAktiviteter = uta.aktiviteter.map((a) => {
      const { days, weeks, ...transformAktivitet } = a;
      if (typeof days !== 'undefined' && typeof weeks !== 'undefined') {
        const trekkdager = parseFloat((weeks * 5) + parseFloat(days)).toFixed(1);
        transformAktivitet.trekkdagerDesimaler = trekkdager; // regner om uker og dager til trekkdager
        transformAktivitet.trekkdager = null;
      }
      return transformAktivitet;
    });
    transformActivity.aktiviteter = transformAktiviteter;
    return transformActivity;
  });

  if (values.manuellOverstyring || (aksjonspunkter.length === 1 && overstyrErOpprettet.length > 0)) {
    aksjonspunkt = [aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER];
  }

  return aksjonspunkt.map((ap) => ({
    kode: ap,
    perioder: transformedResultat,
  }));
};

const mapStateToPropsFactory = (_initialState, initOwnProps) => {
  const { behandlingId, behandlingVersjon, aksjonspunkter } = initOwnProps;
  const validate = (values) => validateUttakPanelForm(values);
  const onSubmit = (values) => initOwnProps.submitCallback(transformValues(values, initOwnProps.apCodes, aksjonspunkter));

  return (state, ownProps) => {
    const initialValues = buildInitialValues(ownProps);

    return {
      validate,
      onSubmit,
      initialValues,
      manuellOverstyring: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'manuellOverstyring'),
    };
  };
};

const UttakPanel = connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: false,
})(UttakPanelImpl)));

export default UttakPanel;
