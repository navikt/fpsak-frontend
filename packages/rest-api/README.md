Dette er stega for å implementera eit nytt rest-kall:

1. Legg til ny nøkkel i "FpsakApiKeys" i fila fpsakApi.jsx.
2. Legg til ny url i "endpoints" i fila fpsakApi.jsx med nøkkel fra punkt 1. Definer kallet som GET, POST eller 
PUT. For long-polling bruk async-versjonen av desse. (withPost => withAsyncPost)
3. Utfør kallet. Dette blir i vår applikasjon oftast implementert i duck.jsx evt. i ein toppnivå-komponent 
(*Index.jsx).
4. Les status/resultat fra applikasjons-state.


Implementasjon av punkt 1 og 2 vil føra til at det automatisk bli laga ein "plass" i applikasjonslageret for denne 
url'en. Her kan ein finna status for kallet. Er kallet starta? Kva slags data er returnert? Har kallet feila? Er kallet ferdig?

 
Sjølve applikasjonslageret er ein Redux store. Redux fungerar kort fortalt på denne måten:

actionCreators blir brukt for å starta ei handling. Denne sender i sin tur ut ein eller fleire actions (med eller utan 
data) som blir håndtert av ein reducer som oppdaterar state. Ein kan så lese resultatet fra state, noko me ofte gjer via 
ein selector. (Dette er ein funksjon med innebygd caching av resultatet. Det er kun når input endrar seg at resultat 
blir kalkulert på nytt.)

 
Døme:
* Først utfører ein kall til server. Til dette trengs ein actionCreator:
```javascript
const actionCreator = fpsakApi.BEHANDLING.makeRestApiRequest();
```
* Etter at actionCreator er laga må ein gjera sjølve kallet, evt med parametere:
```javascript
actionCreator(params);
```
For at Redux skal greie å håndtere actions korrekt må kallet wrappes med "dispatch":
```javascript
dispatch(actionCreator(params));
```
* State blir så oppdatert fleire gonger undervegs: (Kun dei viktigaste vist her.)

    - Først blir kallet markert som starta. Resultatet av dette kan ein lesa sånn:
    ```javascript
    const erStartet = fpsakApi.BEHANDLING.getRestApiStarted();
    ```
    - Kallet blir så utført og data returnert og lagra i state. Data kan så hentast sånn:
    ```javascript
    const dataFraServer = fpsakApi.BEHANDLING.getRestApiData();
    ```
    - Ein har òg ein markør for om kallet er ferdig:
    ```javascript
    const erFerdig = fpsakApi.BEHANDLING.getRestApiFinished();
    ```

I nettlesar-konsollet blir alle Redux-actions logga. Den delen av state'en som er avsatt til rest-kalla finn ein under 
"default/dataContext".
