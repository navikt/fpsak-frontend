# person-info

### Install
```
yarn add @fpsak-frontend/person-info
```

### MerkePanel
Presentasjonskomponent. Definerer visning av personens merkinger. (Søker)

| navn            | type   | påkrevd |
|-----------------|--------|---------|
| erDod           | bool   |         |
| erNAVAnsatt     | bool   |         |
| erVerge         | bool   |         |
| diskresjonskode | string |         |
| intl            | object |    x    |

##### Eksempel:
```js
<MerkePanel erDod={false} diskresjonskode="SPSF" erVerge erNAVANsatt />
```

### AlderVisning
Presentasjonskomponent. Definerer visning av personens alder. (Søker)

| navn     | type   | påkrevd |
|----------|--------|---------|
| erDod    | bool   |    x    |
| alder    | number |    x    |
| dodsdato | string |         |


### PersonYtelserTable
Presentasjonskomponent som viser tilgrensede ytelser for valgt person.

| navn                 | type   | påkrevd |
|----------------------|--------|---------|
| intl                 | object |   x     |
| ytelser              | array  |   x     |
| relatertYtelseTypes  | array  |   x     |
| relatertYtelseStatus | array  |   x     |

