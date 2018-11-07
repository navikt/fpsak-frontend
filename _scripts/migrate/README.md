


## Starte på nytt


```
git checkout -b migrering
node copy-single-files
node overwrite-with-prod
node fix-paths
```

## Henter ut alle imports fra det nye prosjektet.

`node find-imports`
