// @flow
import ErrorMessage from './ErrorMessage';

export interface Formatter<A> {
  isOfType(type: string): boolean;
  format(errorData: A): ?ErrorMessage;
}
