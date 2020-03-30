declare global {
  interface Document {
      documentMode?: any;
  }
}

export const isIE11 = () => !!window.MSInputMethodContext && !!document.documentMode;

export const isEdge = () => /Edge/.test(navigator.userAgent);

/**
 * IE11 workaround for åpen bug i React: https://github.com/facebook/react/issues/3751
 *
 * Workaround hentet herfra: https://github.com/facebook/react/issues/6410#issuecomment-354163472
 */
export const getRelatedTargetIE11 = () => new Promise((resolve) => setTimeout(() => resolve(document.activeElement)));
