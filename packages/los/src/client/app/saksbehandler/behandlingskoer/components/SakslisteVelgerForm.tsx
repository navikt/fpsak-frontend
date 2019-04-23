import React, { Component, Node } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, FormSpy } from 'react-final-form';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import { bindActionCreators, Dispatch } from 'redux';
import { Element, Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import Image from 'sharedComponents/Image';
import { getValueFromLocalStorage, setValueInLocalStorage, removeValueFromLocalStorage } from 'utils/localStorageHelper';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import sakslistePropType from 'saksbehandler/behandlingskoer/sakslistePropType';
import { Saksliste } from 'saksbehandler/behandlingskoer/sakslisteTsType';
import { SelectField } from '@fpsak-frontend/form-final';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import gruppeUrl from 'images/gruppe.svg';
import { getSakslistensSaksbehandlere, fetchAntallOppgaverForBehandlingsko, fetchSakslistensSaksbehandlere } from '../duck';
import { Saksbehandler } from '../saksbehandlerTsType';
import saksbehandlerPropType from '../saksbehandlerPropType';

import styles from './sakslisteVelgerForm.less';

interface TsProps {
  intl: any;
  sakslister: Saksliste[];
  fetchSakslisteOppgaver: (sakslisteId: number) => void;
  fetchSakslistensSaksbehandlere: (sakslisteId: number) => void;
  fetchAntallOppgaverForBehandlingsko: (sakslisteId: number) => void;
  saksbehandlere?: Saksbehandler[];
}

interface Toolip {
  header: Node;
  body: Node;
}

const getDefaultSaksliste = (sakslister) => {
  const lagretSakslisteId = getValueFromLocalStorage('sakslisteId');
  if (lagretSakslisteId) {
    if (sakslister.some(s => `${s.sakslisteId}` === lagretSakslisteId)) {
      return parseInt(lagretSakslisteId, 10);
    }
    removeValueFromLocalStorage('sakslisteId');
  }

  const sortertSakslister = sakslister.sort((saksliste1, saksliste2) => saksliste1.navn.localeCompare(saksliste2.navn));
  return sortertSakslister.length > 0 ? sortertSakslister[0].sakslisteId : undefined;
};

const getInitialValues = (sakslister) => {
  if (sakslister.length === 0) {
    return {
      sakslisteId: undefined,
    };
  }
  const defaultSaksliste = getDefaultSaksliste(sakslister);
  return {
    sakslisteId: defaultSaksliste ? `${defaultSaksliste}` : undefined,
  };
};

const getValgtSaksliste = (sakslister: Saksliste[], sakslisteId: string) => sakslister.find(s => sakslisteId === `${s.sakslisteId}`);

const getStonadstyper = (saksliste?: Saksliste, intl: any) => (saksliste && saksliste.fagsakYtelseTyper.length > 0
  ? saksliste.fagsakYtelseTyper.map(type => type.navn) : [intl.formatMessage({ id: 'SakslisteVelgerForm.Alle' })]);

const getBehandlingstyper = (saksliste?: Saksliste, intl: any) => (saksliste && saksliste.behandlingTyper.length > 0
  ? saksliste.behandlingTyper.map(type => type.navn) : [intl.formatMessage({ id: 'SakslisteVelgerForm.Alle' })]);

const getAndreKriterier = (saksliste?: Saksliste, intl: any) => {
  if (saksliste && saksliste.andreKriterier.length > 0) {
    return saksliste.andreKriterier.map(ak => (ak.inkluder ? ak.andreKriterierType.navn
      : intl.formatMessage({ id: 'SakslisteVelgerForm.Uten' }, { kriterie: ak.andreKriterierType.navn })));
  }
  return [intl.formatMessage({ id: 'SakslisteVelgerForm.Alle' })];
};

const getSorteringsnavn = (saksliste?: Saksliste) => {
  if (!saksliste || !saksliste.sortering) {
    return '';
  }

  const {
    erDynamiskPeriode, sorteringType, fomDager, tomDager, fomDato, tomDato,
  } = saksliste.sortering;
  let values = {};
  if (!erDynamiskPeriode) {
    if (!fomDato && !tomDato) {
      return sorteringType.navn;
    }
    values = {
      navn: sorteringType.navn,
      fomDato: fomDato ? moment(fomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
      tomDato: tomDato ? moment(tomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
    };
  } else {
    if (!fomDager && !tomDager) {
      return sorteringType.navn;
    }
    values = {
      navn: sorteringType.navn,
      fomDato: fomDager ? moment().add(fomDager, 'days').format(DDMMYYYY_DATE_FORMAT) : undefined,
      tomDato: tomDager ? moment().add(tomDager, 'days').format(DDMMYYYY_DATE_FORMAT) : undefined,
    };
  }

  if (!values.fomDato) {
    return <FormattedHTMLMessage id="SakslisteVelgerForm.SorteringsinfoTom" values={values} />;
  } if (!values.tomDato) {
    return <FormattedHTMLMessage id="SakslisteVelgerForm.SorteringsinfoFom" values={values} />;
  }
  return <FormattedHTMLMessage id="SakslisteVelgerForm.Sorteringsinfo" values={values} />;
};

const imageSrcFunction = isHovering => (isHovering ? gruppeHoverUrl : gruppeUrl);

/**
 * SakslisteVelgerForm
 *
 */
export class SakslisteVelgerForm extends Component<TsProps> {
  static propTypes = {
    intl: intlShape.isRequired,
    sakslister: PropTypes.arrayOf(sakslistePropType).isRequired,
    fetchSakslisteOppgaver: PropTypes.func.isRequired,
    fetchSakslistensSaksbehandlere: PropTypes.func.isRequired,
    fetchAntallOppgaverForBehandlingsko: PropTypes.func.isRequired,
    saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType),
  };

  static defaultProps = {
    saksbehandlere: [],
  };

  componentDidMount = () => {
    const {
      sakslister, fetchSakslisteOppgaver, fetchSakslistensSaksbehandlere: fetchSaksbehandlere, fetchAntallOppgaverForBehandlingsko: fetchAntallOppgaver,
    } = this.props;
    if (sakslister.length > 0) {
      const defaultSakslisteId = getDefaultSaksliste(sakslister);
      if (defaultSakslisteId) {
        fetchSakslisteOppgaver(defaultSakslisteId);
        fetchSaksbehandlere(defaultSakslisteId);
        fetchAntallOppgaver(defaultSakslisteId);
      }
    }
  }

  createTooltip = (): Toolip | undefined => {
    const {
      intl, saksbehandlere,
    } = this.props;
    if (!saksbehandlere || saksbehandlere.length === 0) {
      return undefined;
    }

    return {
      header: <Undertittel>{intl.formatMessage({ id: 'SakslisteVelgerForm.SaksbehandlerToolip' })}</Undertittel>,
      body: saksbehandlere.map(s => s.navn).sort((n1, n2) => n1.localeCompare(n2)).map(navn => (<Normaltekst key={navn}>{navn}</Normaltekst>)),
    };
  }

  render = () => {
    const {
      intl, sakslister, fetchSakslisteOppgaver, fetchSakslistensSaksbehandlere: fetchSaksbehandlere, fetchAntallOppgaverForBehandlingsko: fetchAntallOppgaver,
    } = this.props;
    return (
      <Form
        onSubmit={() => undefined}
        initialValues={getInitialValues(sakslister)}
        render={({ values = {} }) => (
          <form>
            <Element><FormattedMessage id="SakslisteVelgerForm.Utvalgskriterier" /></Element>
            <VerticalSpacer eightPx />
            <FormSpy
              onChange={(val) => {
                if (val && val.values.sakslisteId && val.dirtyFields.sakslisteId) {
                  setValueInLocalStorage('sakslisteId', val.values.sakslisteId);
                  const id = parseInt(val.values.sakslisteId, 10);
                  fetchSakslisteOppgaver(id);
                  fetchSaksbehandlere(id);
                  fetchAntallOppgaver(id);
                }
              }}
              subscription={{ values: true, dirtyFields: true }}
            />
            <FlexContainer>
              <FlexRow>
                <FlexColumn className={styles.navnInput}>
                  <SelectField
                    name="sakslisteId"
                    label={intl.formatMessage({ id: 'SakslisteVelgerForm.Saksliste' })}
                    selectValues={sakslister
                      .map(saksliste => (<option key={saksliste.sakslisteId} value={`${saksliste.sakslisteId}`}>{saksliste.navn}</option>))}
                    bredde="l"
                  />
                </FlexColumn>
                {values.sakslisteId && (
                  <>
                    <FlexColumn>
                      <div className={styles.saksbehandlerIkon} />
                      <Image
                        altCode="SakslisteVelgerForm.Saksbehandlere"
                        imageSrcFunction={imageSrcFunction}
                        tabIndex="0"
                        tooltip={this.createTooltip()}
                        alignTooltipArrowLeft
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'SakslisteVelgerForm.Stonadstype' })}
                        texts={getStonadstyper(getValgtSaksliste(sakslister, values.sakslisteId), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'SakslisteVelgerForm.Behandlingstype' })}
                        texts={getBehandlingstyper(getValgtSaksliste(sakslister, values.sakslisteId), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'SakslisteVelgerForm.AndreKriterier' })}
                        texts={getAndreKriterier(getValgtSaksliste(sakslister, values.sakslisteId), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'SakslisteVelgerForm.Sortering' })}
                        texts={[getSorteringsnavn(getValgtSaksliste(sakslister, values.sakslisteId))]}
                      />
                    </FlexColumn>
                  </>
                )}
              </FlexRow>
            </FlexContainer>
          </form>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  saksbehandlere: getSakslistensSaksbehandlere(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchSakslistensSaksbehandlere,
    fetchAntallOppgaverForBehandlingsko,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SakslisteVelgerForm));
