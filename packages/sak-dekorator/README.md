# dekorator

```
yarn add @fpsak-frontend/sak-dekorator
```

### Header
 Presentasjonskomponent. Viser dekoratør med tittel og navansatt navn

| navn               | type   | påkrevd | default |
|--------------------|--------|---------|---------|
| queryStrings       | object | x       |         |
| navAnsattName      | string | x       |         |
| removeErrorMessage | func   | x       |         |

 ##### Eksempel
 ```js
 <Header
  queryStrings={queryStrings}
  navAnsattName={navAnsattName}
  removeErrorMessage={removeErrorMsg}
  funksjonellTid={funksjonellTid}
/>
 ```

 ### ErrorMessagePanel
| navn                      | type   | påkrevd | default |
|---------------------------|--------|---------|---------|
| intl                      | object | x       |         |
| showDetailedErrorMessages | bool   | x       |         |
| errorMessages             | array  | x       |         |
| removeErrorMessage        | func   | x       |         |

 ##### Eksempel

 ```js
 <ErrorMessagePanel queryStrings={queryStrings} removeErrorMessage={removeErrorMessage} />
 ```

 ### ErrorMessageDetailsModal
| navn         | type   | påkrevd | default |
|--------------|--------|---------|---------|
| intl         | object | x       |         |
| showModal    | bool   | x       |         |
| closeModalFn | func   | x       |         |
| errorDetails | object | x       |         |

##### Eksempel
 ```js
<ErrorMessageDetailsModal
  showModal={isModalOpen}
  closeModalFn={this.toggleModalOnClick}
  errorDetails={errorMessages[selectedErrorMsgIndex].additionalInfo}
/>
 ```
