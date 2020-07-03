import ErrorMessage from './ErrorMessage';

interface Formatter<A> {
  isOfType(type: string): boolean;
  format(errorData: A): ErrorMessage | undefined;
}

export default Formatter;
