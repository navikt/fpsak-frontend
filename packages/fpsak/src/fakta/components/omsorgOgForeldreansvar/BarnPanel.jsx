import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import moment from 'moment';

import soknadType from 'kodeverk/soknadType';
import opplysningsKilde from 'kodeverk/opplysningsKilde';
import { DatepickerField } from 'form/Fields';
import { required, hasValidDate } from 'utils/validation/validators';
import DateLabel from 'sharedComponents/DateLabel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import { getEditedStatus } from 'behandling/behandlingSelectors';

import styles from './barnPanel.less';

const calculateAgeFromDate = fodselsdato => moment().startOf('day').diff(moment(fodselsdato).startOf('day'), 'years');

const adjustNumberOfFields = (fields, originalFields, antallBarn) => {
  if (fields.length < antallBarn) {
    const diff = antallBarn - fields.length;
    for (let i = fields.length; i <= diff || i < originalFields.length; i += 1) {
      if (originalFields.getAll()[i]) {
        fields.push(originalFields.getAll()[i]);
      }
    }
  } else if (fields.length > antallBarn) {
    const diff = fields.length - antallBarn;
    for (let i = 0; i < diff; i += 1) {
      fields.pop();
    }
  }
};

/**
 * BarnPanel
 *
 * Presentasjonskomponent. Brukes i tilknytning til faktapanel for omsorg.
 * Viser barn som er bekreftet av TPS som readonly, mens en kan endre fødselsdato for de som ikke er det
 */
export class BarnPanelImpl extends Component {
  componentWillMount() {
    const { fields, antallBarn } = this.props;
    this.originalFields = fields;
    adjustNumberOfFields(fields, fields, antallBarn);
  }

  componentWillReceiveProps(nextProps) {
    adjustNumberOfFields(nextProps.fields, this.originalFields, nextProps.antallBarn);
  }

  shouldComponentUpdate(nextProps) {
    if (Number.isNaN(nextProps.antallBarn)) {
      return true;
    }
    return nextProps.fields.length === nextProps.antallBarn;
  }

  render() {
    const { fields, isFodselsdatoerEdited, readOnly } = this.props;

    return (
      <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.OMSORGSOVERTAKELSE} titleCode="BarnPanel.BarnDetSøkesOm">
        {fields.map((barn, index, field) => {
          const b = field.get(index);
          if (b.opplysningsKilde === opplysningsKilde.TPS) {
            return (
              <div key={`${b.nummer ? b.nummer : b.aktorId}`}>
                <Undertittel>
                  {b.navn}
                  {' '}
                </Undertittel>
                <Element className={styles.antallaar}>
                  <DateLabel dateString={b.fodselsdato} />
                  <FormattedMessage id="BarnPanel.Age" values={{ age: calculateAgeFromDate(new Date(b.fodselsdato)).toString() }} />
                </Element>
                <VerticalSpacer eightPx />
                <Normaltekst><FormattedMessage id="BarnPanel.Address" /></Normaltekst>
                <Element>
                  {b.adresse}
                  {' '}
                </Element>
                <VerticalSpacer sixteenPx />
              </div>);
          }

          return (
            <div key={`${b.nummer}`}>
              <DatepickerField
                name={`${barn}.fodselsdato`}
                label={{ id: 'BarnPanel.ChildNumberBornData', args: { childNumber: index + 1 } }}
                validate={[required, hasValidDate]}
                readOnly={readOnly}
                isEdited={isFodselsdatoerEdited[b.nummer]}
              />
              <VerticalSpacer eightPx />
              <Normaltekst><FormattedMessage id="BarnPanel.Address" /></Normaltekst>
              <Normaltekst> - </Normaltekst>
              <VerticalSpacer sixteenPx />
            </div>
          );
        })
        }
      </FaktaGruppe>
    );
  }
}

BarnPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number,
  fields: PropTypes.shape().isRequired,
  isFodselsdatoerEdited: PropTypes.shape(),
};

BarnPanelImpl.defaultProps = {
  antallBarn: '',
  isFodselsdatoerEdited: {},
};

const mapStateToProps = state => ({
  isFodselsdatoerEdited: getEditedStatus(state).fodselsdatoer,
});

const BarnPanel = connect(mapStateToProps)(BarnPanelImpl);

const sortChildren = children => children
  .sort(bb1 => bb1.opplysningsKilde && bb1.opplysningsKilde === opplysningsKilde.TPS)
  .sort((bb1, bb2) => (bb1.navn < bb2.navn ? -1 : 1))
  .sort((bb1, bb2) => new Date(bb1.fodselsdato) - new Date(bb2.fodselsdato));

BarnPanel.buildInitialValues = (personopplysning, soknad) => {
  const confirmedChildren = personopplysning.barnSoktFor
    ? personopplysning.barnSoktFor.map(b => ({
      aktorId: b.aktoerId,
      nummer: b.nummer,
      navn: b.navn,
      fodselsdato: b.fodselsdato,
      opplysningsKilde: b.opplysningsKilde.kode,
    }))
    : [];

  const applicationChildren = soknad.soknadType.kode === soknadType.FODSEL
    ? Object.keys(soknad.fodselsdatoer)
      .map(key => ({
        nummer: parseInt(key, 10),
        fodselsdato: soknad.fodselsdatoer[key],
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
      }))
    : Object.keys(soknad.adopsjonFodelsedatoer)
      .map(key => ({
        nummer: parseInt(key, 10),
        fodselsdato: soknad.adopsjonFodelsedatoer[key],
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
      }));

  const children = [...confirmedChildren];
  children.forEach((cc, indexCc) => {
    const index = applicationChildren.findIndex(ac => (cc.nummer ? ac.nummer === cc.nummer : ac.fodselsdato === cc.fodselsdato));
    if (index !== -1) {
    // Om barnet fra søknad finnes i TPS eller allerede er lagret av NAV-ansatt => fjern barnet i søknad.
      applicationChildren.splice(index, 1);
    } else {
    // Om barnet i TPS ikke finnes i søknad, fjern dette.
      confirmedChildren.splice(indexCc, 1);
    }
  });

  return {
    barn: sortChildren([...confirmedChildren, ...applicationChildren]),
  };
};

export default BarnPanel;
