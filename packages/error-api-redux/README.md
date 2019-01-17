Tilbyr en løsning for lagring og aksessering av feil i en Redux store.

To typer feil:
* Feil som blir eksplisitt håndtert eller kasta serverside. (Heretter kalt bruker-feil.)
* Kodefeil i klient. (Heretter kalt teknisk-feil.)

### TODO

- [ ] Tolking av feil må forbedres. Formatet på feil er for uklar. Formatters bør muligens flyttest ut/fjernest.


Oppsett:
```javascript
import errorHandler from '@fpsak-frontend/error-api-redux';

// Registrer reducer
reducerRegistry.register(errorHandler.getErrorReducerName(), errorHandler.getErrorReducer());
```

Legg til bruker-feil:
```javascript
const mapDispatchToProps = dispatch => bindActionCreators({
  addErrorMessage: errorHandler.getErrorActionCreator(),
}, dispatch);
```

Legg til teknisk-feil: 
```javascript
const mapDispatchToProps = dispatch => bindActionCreators({
  addCrashMessage: errorHandler.getCrashMessageActionCreator(),
}, dispatch);
```

Fjern feil: (Både bruker-feil og tekniske-feil.)
```javascript
const mapDispatchToProps = dispatch => bindActionCreators({
  removeErrorMessage: errorHandler.getRemoveErrorMessageActionCreator(),
}, dispatch);
```

Vise bruker-feil: (Funksjon returnerer en selector, derfor state som input.)
```javascript
const mapStateToProps = state => ({
  errorMessages: errorHandler.getAllErrorMessages(state),
});
```

Vise teknisk-feil: (Funksjon returnerer en selector, derfor state som input.)
```javascript
const mapStateToProps = state => ({
  crashMessage: errorHandler.getCrashMessage(state),
});
```