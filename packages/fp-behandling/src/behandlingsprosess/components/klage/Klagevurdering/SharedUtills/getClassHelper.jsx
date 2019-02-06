import classNames from 'classnames';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import styles from './behandleKlageForm.less';

export const getClassForMedholdKlage = (readOnly, aksjonspunktKode) => {
  if (readOnly) {
    return styles.selectReadOnly;
  }
  return classNames(
    styles.arrowLine,
    aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? styles.selectNkOmgjort : styles.selectOmgjort,
  );
};
export const getClassForOpphevKlage = (readOnly, aksjonspunktKode) => {
  if (readOnly) {
    return styles.selectReadOnly;
  }
  return classNames(
    styles.arrowLine,
    aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? styles.selectNkOpphoert : styles.selectOpphoert,
  );
};
