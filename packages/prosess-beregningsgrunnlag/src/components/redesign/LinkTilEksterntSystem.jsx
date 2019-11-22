import React from 'react';
import linkArrow from '@fpsak-frontend/assets/images/ekstern_link_pil.svg';

import styles from './linkTilEksternSystem.less';

const createExternalLink = (linkText, key) => {
  const link = 'http://alink';
  return (
    <span className={styles.linkContainer} key={key} id={`ExtLink${key}`}>
      <a href={link} className={styles.linkText} key={`a${key}`}>
        {`${linkText}`}
        <img className={styles.linkArrow} src={linkArrow} alt={`Ekster link til ${linkText}`} key={`img${key}`} />
      </a>
    </span>
  );
};

export default createExternalLink;
