# search-form

### Install
```
yarn add @fpsak-frontend/search-form
```

### SearchForm
Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.

| navn                     | type     | påkrevd |
|--------------------------|----------|---------|
| onSubmit                 | function | x       |
| searchStarted            | bool     | x       |
| searchResultAccessDenied | object   |         |
| searchString             | string   |         |

 ##### Eksempel:
 ```js
<SearchForm
  onSubmit={yourCallBack}
  searchStarted={searchStarted}
  searchResultAccessDenied={searchResultAccessDenied}
/>
```
