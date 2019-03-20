# form

```
yarn add @fpsak-frontend/form
```

### CheckboxField

| navn     | type   | påkrevd | default |
|----------|--------|---------|---------|
| name     | string | x       |         |
| label    | label  | x       |         |
| validate | func   |         | null    |
| readOnly | bool   |         | false   |

##### Example
```js
<CheckboxField
  name="flerbarnsdager"
  label={<FormattedMessage id="UttakInfoPanel.Flerbarnsdager" />}
/>
```
### DatepickerField

| navn     | type   | påkrevd | default        |
|----------|--------|---------|----------------|
| name     | string | x       |                |
| label    | label  |         | ''             |
| parse    | func   |         | value => value |
| format   | func   |         | value => value |
| readOnly | bool   |         | false          |
| isEdited | bool   |         | false          |

###### Example
```js
<DatepickerField
  name={`${barn}.fodselsdato`}
  label={{ id: 'BarnPanel.ChildNumberBornData', args: { childNumber: index + 1 } }}
  validate={[required, hasValidDate]}
  readOnly={readOnly}
  isEdited={isFodselsdatoerEdited[b.nummer]}
/>
```

### DecimalField
| navn            | type   | påkrevd | default  |
|-----------------|--------|---------|----------|
| name            | string | x       |          |
| label           | label  |         | ''       |
| type            | string |         | 'number' |
| validate        | func   |         | null     |
| readOnly        | bool   |         | false    |
| isEdited        | bool   |         | false    |
| normalizeOnBlur | func   | x       |          |

##### Example
```js
<DecimalField
  className={styles.fieldHorizontal}
  name="samtidigUttaksprosent"
  bredde="XS"
  label={{ id: 'UttakInfoPanel.SamtidigUttakProsentandel' }}
  validate={[required, maxValue100, hasValidDecimal]}
  normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
  inputClassName={styles.textAlignRight}
/>
```

### InputField
| navn            | type   | påkrevd | default  |
|-----------------|--------|---------|----------|
| name            | string | x       |          |
| label           | label  |         | ''       |
| type            | string |         | 'number' |
| validate        | func   |         | null     |
| readOnly        | bool   |         | false    |
| isEdited        | bool   |         | false    |

##### Example
```js
<InputField
  className={styles.fieldHorizontal}
  name="samtidigUttaksprosent"
  bredde="XS"
  label={{ id: 'UttakInfoPanel.SamtidigUttakProsentandel' }}
  validate={[required]}
  inputClassName={styles.textAlignRight}
/>
```

### NavFieldGroup
| navn             | type   | påkrevd | default |
|------------------|--------|---------|---------|
| errorMessageName | string |         | null    |
| errorMessage     | string |         | null    |
| title            | string |         | ''      |
| children         | node   | x       |         |
| className        | string |         | ''      |

##### Example
```js
<NavFieldGroup
    title={titleTextCode ? intl.formatMessage({ id: titleTextCode }) : undefined}
    errorMessage={showErrorMessage(meta) ? intl.formatMessage(...meta.error) : null}
  >
  ...
  </NavFieldGroup>
/>
```

### PeriodpickerField

| navn     | type   | påkrevd | default        |
|----------|--------|---------|----------------|
| names     | arrayOf(string) | x       |                |
| label    | label  |         | ''             |
| parse    | func   |         | value => value |
| format   | func   |         | value => value |
| readOnly | bool   |         | false          |
| isEdited | bool   |         | false          |
| renderIfMissingDateOnReadOnly | bool   |         | false          |

###### Example
```js
<PeriodpickerField
  names={['fom', 'tom']}
  label={{ id: 'UttakInfoPanel.Periode' }}
  validate={[required, hasValidDate]}
  disabledDays={{ before: moment(nyPeriodeDisabledDaysFom).toDate() }}
/>
```


### RadioGroupField
| navn         | type             | påkrevd | default      | beskrivelse                                   |
|--------------|------------------|---------|--------------|-----------------------------------------------|
| name         | string           | x       |              |                                               |
| label        | node             |         | ''           |                                               |
| columns      | number           |         | 0            | Antall kolonner som valgene skal fordeles på. |
| bredde       | string           |         | 'fullbredde' |                                               |
| children     | radioOptionsOnly | x       |              |                                               |
| spaceBetween | bool             |         | false        |                                               |
| rows         | number           |         | 0            |                                               |
| direction    | string           |         | 'horizontal' |                                               |
| DOMName      | string           |         | undefined    |                                               |


##### Example
```js
<RadioGroupField name="ektefellesBarn" validate={[required]} bredde="XL" readOnly={readOnly} isEdited={ektefellesBarnIsEdited}>
  ...
</RadioGroupField>
```

### RadioOption

| navn               | type   | påkrevd | default         |
|--------------------|--------|---------|-----------------|
| name               | string |         | ''              |
| label              | label  | x       |                 |
| value              | any    | x       |                 |
| actualValue        | any    |         | undefined       |
| className          | string |         | false           |
| disabled           | bool   |         | false           |
| groupDisabled      | bool   |         | false           |
| onChange           | func   |         | () => undefined |
| children           | node   |         | undefined       |
| style              | object |         | undefined       |
| manualHideChildren | bool   |         | false           |

##### Example
```js
<RadioOption label={"bacon"} value={false} />
```

### SelectField
| navn               | type            | påkrevd | default |
|--------------------|-----------------|---------|---------|
| name               | string          | x       |         |
| label              | label           | x       |         |
| selectValues       | arrayOf(object) | x       |         |
| validate           | func            |         | null    |
| readOnly           | bool            |         | false   |
| placeholder        | string          |         | ' '     |
| hideValueOnDisable | bool            |         | false   |

##### Example
```js
<SelectField
  name="aktivitetType.kode"
  label={"bacon"}
  validate={[required]}
  placeholder={"bacon"}
  selectValues={opptjeningAktivitetTypes.map(oat => <option key={oat.kode} value={oat.kode}>{oat.navn}</option>)}
  readOnly={readOnly}
/>
```

### TextAreaField

| navn     | type            | påkrevd | default |
|----------|-----------------|---------|---------|
| name     | string          | x       |         |
| label    | label           | x       |         |
| validate | func            |         | null    |
| readOnly | bool            |         | false   |
| isEdited | bool            |         | false   |
| onChange | func            |         |         |
| intl     | intlShape       | x       |         |
| badges   | arrayOf(object) |         | null    |

##### Example
```js
<TextAreaField
  name="overskrift"
  label={{ id: 'VedtakForm.Overskrift' }}
  validate={[required, minLength3, maxLength200, hasValidText]}
  maxLength={200}
  rows={1}
  readOnly={readOnly}
  className={styles.smallTextArea}
  badges={[{
    type: 'fokus',
    textId: getLanguageCodeFromSprakkode(sprakkode),
    title: 'Malform.Beskrivelse',
  }]}
/>
```

