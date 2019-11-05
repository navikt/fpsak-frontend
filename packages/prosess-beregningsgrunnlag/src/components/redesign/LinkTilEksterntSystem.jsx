import React from 'react';
import linkArrow from '@fpsak-frontend/assets/images/ekstern_link_pil.svg';

import styles from './linkTilEksternSystem.less';

const createExternalLink = (linkText) => {
  const link = 'http://alink';
  return (
    <div className={styles.linkContainer}>
      <a href={link} className={styles.linkText}>
        {`${linkText}`}
        <img className={styles.linkArrow} src={linkArrow} alt={`Ekster link til ${linkText}`} />
      </a>

    </div>
  );
};

export default createExternalLink;
