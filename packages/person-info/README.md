# person-info

### Install
```
yarn add @fpsak-frontend/person-info
```

### PersonInfo
 Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)

| navn     | type   | påkrevd |
|----------|--------|---------|
| person    | object   |    x    |
| medPanel    | bool |      |

 ##### Eksempel:
 ```js
 <PersonInfo person={navn:"Ola" alder:{40} personnummer:"12345678910" erKvinne:false
 erDod:false diskresjonskode:"6" dodsdato:"1990.03.03"} medPanel />
```

### MerkePanel
Presentasjonskomponent. Definerer visning av personens merkinger. (Søker)

| navn     | type   | påkrevd |
|----------|--------|---------|
| erDod    | bool   |        |
| erNAVAnsatt | bool |        |
| erVerge | bool    |        |
| diskresjonskode | string  |        |
| intl | object |   x     |

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
