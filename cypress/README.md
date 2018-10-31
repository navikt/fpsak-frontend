# Frontend tester Cypress


## Lage inntektsmeldinger og søknader
For hindre å ha duplisert kode i systemet løser vi dette foreløpig med å lage XML via
testhub sine endepunkter.

Testcase kan da gjenbrukes på tvers av VTP og Testhub.

Ulempen med dette er at vi da er avhengig av at Testhub kjører i det miljøet som
cypress skal kjøre på.

 

http://stash.devillo.no/projects/VEDFP/repos/vl-testhub/browse/web/server/src/main/java/no/nav/foreldrepenger/testhub/service/dokmot/ArkiverController.java#57
