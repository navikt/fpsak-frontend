This example commands.js shows you how to
create various custom commands and overwrite
existing commands.

For more comprehensive examples of custom
commands please read more here:
https://on.cypress.io/custom-commands

**This is a parent command**
```javascript
Cypress.Commands.add("login", (email, password) => { 
  //... 
})
```

**This is a child command**
```javascript
Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { 
  //... 
})
```

**This is a dual command**
```javascript
Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { 
  //... 
})
```

**This is will overwrite an existing command**
```javascript
Cypress.Commands.overwrite("visit", (originalFn, url, options) => { 
  //... 
})
```
