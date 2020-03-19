# shared-components

```
yarn add @fpsak-frontend/shared-components
```

### AksjonspunktHelpText
 Presentasjonskomponent. Viser hjelpetekster som forteller NAV-ansatt hva som må gjøres for
 å avklare en eller flere aksjonspunkter.

| navn               | type  | påkrevd | default |
|--------------------|-------|---------|---------|
| children           | array | x       |         |
| isAksjonspunktOpen | bool  | x       |         |
| marginBottom       | bool  |         | false   |

 ##### Eksempel:
 ```js
 <AksjonspunktHelpText children={['tekst1', 'tekst2']} isAksjonspunktOpen={false} />
 ```

### ArrowBox
Vise innhold med ramme og pil enten til venstre eller topp

| navn        | type   | påkrevd | default |
|-------------|--------|---------|---------|
| alignOffset | number |         | 0       |
| alignLeft   | bool   |         | false   |
| hideBorder  | bool   |         | false   |
| children    | node   | x       |         |
| marginTop   | number |         | 0       |
| marginLeft  | number |         | 0       |

 ##### Eksempel:
 ```js
 <ArrowBox alignOffset={64}>
 {children}
 </ArrowBox>
 ```

### BorderBox
### DateLabel
Presentasjonskomponent. Formaterer dato på formatet dd.mm.yyyy.

| navn       | type   | påkrevd |
|------------|--------|---------|
| dateString | string | x       |

##### Eksempel
```js
<DateLabel dateString="2017-08-31" />
```

### DateTimeLabel
Presentasjonskomponent. Formaterer dato til formatet dd.mm.yyyy - hh:mm.

| navn           | type   | påkrevd |
|----------------|--------|---------|
| dateTimeString | string | x       |

##### Eksempel:
```js
<DateTimeLabel dateTimeString="2017-08-02T00:54:25.455"
```

### EditedIcon
Komponent/Ikon som viser om noe i GUI er endret.

| navn                  | type          | påkrevd | default |
|-----------------------|---------------|---------|---------|
| className             | string        |         | null    |

### FadingPanel
### Image
Presentasjonskomponent. Komponent som har ansvar for visning av bilder.

| navn                  | type          | påkrevd | default |
|-----------------------|---------------|---------|---------|
| className             | string        |         | null    |
| src                   | string/object |         | null    |
| imageSrcFunction      | function      |         | null    |
| onMouseDown           | function      |         | null    |
| onKeyDown             | function      |         | null    |
| onClick               | function      |         | void    |
| alt                   | string        |         | null    |
| title                 | string        |         | null    |
| tabIndex              | string        |         | -1      |
| tooltip               | string        |         | null    |
| alignTooltipArrowLeft | bool          |         | null    |
| intl                  | object        | x       |         |

##### Eksempel:
```js
<Image className={styles.image} src={sendDokumentImageUrl} titleCode="DocumentListInnsyn.Send" altCode="DocumentListInnsyn.Send" />
```

### LoadingPanel
### Tooltip
### OkAvbrytModal
### PeriodFieldArray
### PeriodLabel
Presentasjonskomponent. Formaterer til og fra dato til en periode på formatet dd.mm.yyyy - dd.mm.yyyy.

| navn          | type   | påkrevd |
|---------------|--------|---------|
| dateStringFom | string | x       |
| dateStringTom | string | x       |

##### Eksempel:
```js
<PeriodLabel dateStringFom="2017-08-25" dateStringTom="2017-08-31" />
```

### VerticalSpacer
Presentasjonskomponent. Legg inn vertikalt tomrom.

| navn      | type | påkrevd |
|-----------|------|---------|
| fourPx    | bool |         |
| eightPx   | bool |         |
| sixteenPx | bool |         |
| twentyPx  | bool |         |
| dashed    | bool |         |

##### Eksempel
```js
<VerticalSpacer twentyPx />
```

### Datepicker
### Periodpicker
### Table
### TableRow
### TableColumn
### FlexColumn
### FlexContainer
### FlexRow
