const filePaths = require('../test-data/filePaths');

Cypress.Commands.add('konsumerDollyPerson', (soker) => {
  const usedIdents = [];
  return cy.readFile(filePaths.CONSUMED_IDENTS)
    .then((str) => {
      str.forEach((u) => {
        usedIdents.push(u);
      });
      usedIdents.push(soker.person.ident);
    })
    .writeFile(filePaths.CONSUMED_IDENTS, usedIdents);
});
