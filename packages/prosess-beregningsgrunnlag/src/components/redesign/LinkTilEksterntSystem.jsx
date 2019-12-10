import React from 'react';
import linkArrow from '@fpsak-frontend/assets/images/ekstern_link_pil.svg';
import PropTypes from 'prop-types';
import styles from './linkTilEksternSystem.less';


const LinkTilEksterntSystem = ({ linkText, key }) => {
  const link = 'http://alink';
  if (!linkText) {
    return null;
  }
  return (
    <span className={styles.linkContainer} key={key} id={`ExtLink${key}`}>
      <a
        href={link}
        className={styles.linkText}
        key={`a${key}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${linkText}`}
        <img
          className={styles.linkArrow}
          src={linkArrow}
          alt={`Ekster link til ${linkText}`}
          key={`img${key}`}
        />
      </a>
    </span>
  );
};
LinkTilEksterntSystem.propTypes = {
  linkText: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
};

export default LinkTilEksterntSystem;
