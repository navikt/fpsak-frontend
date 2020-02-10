import React from 'react';
import { connect } from 'react-redux';
import { FieldArray, FormSection, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Column, Row } from 'nav-frontend-grid';

import { CheckboxField } from '@fpsak-frontend/form';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';
import { ArrowBox, BorderBox, ElementWrapper } from '@fpsak-frontend/shared-components';

import RenderAndreYtelserPerioderFieldArray from './RenderAndreYtelserPerioderFieldArray';

import styles from './andreYtelserPanel.less';

export const ANDRE_YTELSER_FORM_NAME_PREFIX = 'andreYtelser';

const ANDRE_YTELSER_PERIODE_SUFFIX = 'PERIODER';

const removeArbeidstyper = (andreYtelser, kunMiliterEllerSiviltjeneste) => {
  if (kunMiliterEllerSiviltjeneste) {
    return andreYtelser.filter((ay) => ay.kode === arbeidType.MILITÆR_ELLER_SIVILTJENESTE);
  }
  return andreYtelser.filter((ay) => ay.kode !== arbeidType.UTENLANDSK_ARBEIDSFORHOLD
  && ay.kode !== arbeidType.FRILANSER && ay.kode !== arbeidType.LONN_UNDER_UTDANNING);
};

/**
 * AndreYtelserPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 */
export const AndreYtelserPanelImpl = ({
  intl,
  readOnly,
  andreYtelser,
  selectedYtelser,
  kunMiliterEllerSiviltjeneste,
}) => {
  const checkboxFields = removeArbeidstyper(andreYtelser, kunMiliterEllerSiviltjeneste)
    .map((ay) => {
      const ytelseFieldName = `${ay.kode}_${ANDRE_YTELSER_PERIODE_SUFFIX}`;
      return (
        <ElementWrapper key={ay.kode}>
          <CheckboxField key={ay.kode} name={ay.kode} label={ay.navn} readOnly={readOnly} />
          {selectedYtelser && selectedYtelser[ay.kode]
          && (
          <Row>
            <Column xs="6">
              <ArrowBox>
                <FieldArray
                  name={ytelseFieldName}
                  component={RenderAndreYtelserPerioderFieldArray}
                  readOnly={readOnly}
                />
              </ArrowBox>
            </Column>
          </Row>
          )}
        </ElementWrapper>
      );
    });
  return (
    <ElementWrapper>
      <FormSection name={ANDRE_YTELSER_FORM_NAME_PREFIX}>
        <BorderBox>
          <SkjemaGruppe className={styles.fullWidth} legend={intl.formatMessage({ id: 'Registrering.AndreYtelser.Title' })}>
            {checkboxFields}
          </SkjemaGruppe>
        </BorderBox>
      </FormSection>
    </ElementWrapper>
  );
};


AndreYtelserPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  andreYtelser: kodeverkPropType.isRequired,
  selectedYtelser: PropTypes.shape().isRequired,
  kunMiliterEllerSiviltjeneste: PropTypes.bool,
};

AndreYtelserPanelImpl.defaultProps = {
  kunMiliterEllerSiviltjeneste: false,
};

const mapStateToProps = (state, initialProps) => ({
  selectedYtelser: formValueSelector(initialProps.form)(state, ANDRE_YTELSER_FORM_NAME_PREFIX),
  andreYtelser: initialProps.alleKodeverk[kodeverkTyper.ARBEID_TYPE],
});

const AndreYtelserPanel = injectIntl(AndreYtelserPanelImpl);

AndreYtelserPanel.buildInitialValues = (andreYtelser) => {
  const ytelseInitialValues = {};
  removeArbeidstyper(andreYtelser).forEach((ay) => {
    const ytelsePeriodeFieldName = `${ay.kode}_${ANDRE_YTELSER_PERIODE_SUFFIX}`;
    ytelseInitialValues[ytelsePeriodeFieldName] = [{}];
  });
  return { [ANDRE_YTELSER_FORM_NAME_PREFIX]: ytelseInitialValues };
};


AndreYtelserPanel.validate = (values, andreYtelser) => {
  const ytelseValues = values[ANDRE_YTELSER_FORM_NAME_PREFIX];
  const errors = {
    [ANDRE_YTELSER_FORM_NAME_PREFIX]: {},
  };
  andreYtelser.filter((ay) => ytelseValues && ytelseValues[ay.kode]).forEach((ay) => {
    const ytelsePerioderFieldName = `${ay.kode}_${ANDRE_YTELSER_PERIODE_SUFFIX}`;
    errors[ANDRE_YTELSER_FORM_NAME_PREFIX][ytelsePerioderFieldName] = RenderAndreYtelserPerioderFieldArray.validate(ytelseValues[ytelsePerioderFieldName]);
  });
  return errors;
};

AndreYtelserPanel.transformValues = (values, andreYtelser) => {
  const ytelseValues = values[ANDRE_YTELSER_FORM_NAME_PREFIX];
  const newValues = [];

  andreYtelser.filter((ay) => ytelseValues && ytelseValues[ay.kode]).forEach((ay) => {
    const ytelsePerioderFieldName = `${ay.kode}_${ANDRE_YTELSER_PERIODE_SUFFIX}`;
    const ytelsePerioder = ytelseValues[ytelsePerioderFieldName];
    if (ytelsePerioder) {
      RenderAndreYtelserPerioderFieldArray.transformValues(ytelsePerioder, ay.kode).forEach((tv) => newValues.push(tv));
    }
  });

  return newValues;
};


export default connect(mapStateToProps)(AndreYtelserPanel);
