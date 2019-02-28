# person-info

### Install
```
yarn add @fpsak-frontend/person-info
```

### PersonInfo
 Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)

| navn     | type   | påkrevd |
|----------|--------|---------|
| person   | object |    x    |
| medPanel | bool   |         |

 ##### Eksempel:
 ```js
<PersonInfo
    person={{
        navn: 'Ola',
        alder: 40,
        personnummer: '12345678910',
        erKvinne: false,
        erDod: false,
        diskresjonskode: '6',
        dodsdato: '1990.03.03'
    }}
    medPanel
/>
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



### PersonDetailedHeader
Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)

##### Eksempel:
```js
<PersonDetailedHeader personopplysninger={} isPrimaryParent medPanel />
```


### AdressePanel
Presentasjonskomponent. Har ansvar for å vise de kjente adressene til en person. Viser tilhørende labels hvis
en person er: bosatt, norsk statsborger eller skilt. Viser også label for foretrukket målform eller engelsk.

| navn               | type   | påkrevd |
|--------------------|--------|---------|
| intl               | object |   x     |
| bostedsadresse     | string |         |
| midlertidigAdresse | string |         |
| postAdresseNorge   | string |         |
| postadresseUtland  | string |         |
| sprakkode          | objekt |   x     |
| region             | string |         |
| personstatus       | objekt |   x     |
| sivilstandtype     | objekt |         |
| sivilstandTypes    | objekt |   x     |
| personstatusTypes  | objekt |   x     |
| isPrimaryParent    | bool   |   x     |

### Barnepanel
Presentasjonskomponent. Viser en liste over en persons kjente barn med informasjon om
kjønn, navn, personnummer og adresse. Forventer å få inn en liste med personopplysningsobjekter.

| navn       | type  | påkrevd |
|------------|-------|---------|
| barneListe | array |    x    |


### PersonYtelserTable
Presentasjonskomponent som viser tilgrensede ytelser for valgt person.

| navn                 | type   | påkrevd |
|----------------------|--------|---------|
| intl                 | object |   x     |
| ytelser              | array  |   x     |
| relatertYtelseTypes  | array  |   x     |
| relatertYtelseStatus | array  |   x     |

