# fpsak-frontend
Monorepo for Frontend kode for vl-foreldrepenger.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)

##Komme i gang

##TODO
1. rydde opp i struktur i de forskjellige pakkene
2. riktig namespace, bruker scoped for nå(@fpsak-frontend)
3. Sette opp lerna publish
4. sette opp travis og tbd
5. gjøre form pakken tilgjengelig med final-form og redux-form

##ESLINT
- eslint/eslintrc.dev.js 

##Strukter (WIP)
<pre>
<code>
+---eslint
+---packages
|   +---assets
|   |   +---images
|   |   +---styles
|   |   \---testHelpers
|   +---data
|   |   +---error
|   |   \---rest
|   |       \---redux
|   +---fagsak-search
|   |   \---components
|   +---form
|   |   \---fields
|   +---fpsak
|   |   +---behandling
|   |   |   +---components
|   |   |   |   \---fodselSammenligning
|   |   |   +---proptypes
|   |   |   \---selectors
|   |   +---behandlingmenu
|   |   |   \---components
|   |   |       +---changeBehandlendeEnhet
|   |   |       +---createNewBehandling
|   |   |       +---openBehandlingForChanges
|   |   |       +---pauseBehandling
|   |   |       +---resumeBehandling
|   |   |       \---shelveBehandling
|   |   +---behandlingsprosess
|   |   |   +---components
|   |   |   |   +---beregningsgrunnlag
|   |   |   |   |   +---arbeidstaker
|   |   |   |   |   +---beregningsgrunnlagPanel
|   |   |   |   |   +---beregningsresultatPanel
|   |   |   |   |   +---fellesPaneler
|   |   |   |   |   +---frilanser
|   |   |   |   |   +---selvstendigNaeringsdrivende
|   |   |   |   |   \---tilstotendeYtelser
|   |   |   |   +---beregningsresultat
|   |   |   |   +---innsyn
|   |   |   |   +---klage
|   |   |   |   +---revurdering
|   |   |   |   +---saksopplysninger
|   |   |   |   +---soknadsfrist
|   |   |   |   +---tilkjentYtelse
|   |   |   |   |   \---timeline
|   |   |   |   +---uttak
|   |   |   |   |   \---stonadkonto
|   |   |   |   +---vedtak
|   |   |   |   |   +---innsyn
|   |   |   |   |   +---klage
|   |   |   |   |   \---revurdering
|   |   |   |   \---vilkar
|   |   |   |       +---adopsjon
|   |   |   |       +---fodsel
|   |   |   |       +---foreldreansvar
|   |   |   |       +---omsorg
|   |   |   |       +---opptjening
|   |   |   |       +---sokersOpplysningsplikt
|   |   |   |       \---soknadsfrist
|   |   |   \---definition
|   |   +---behandlingsupport
|   |   |   +---approval
|   |   |   |   \---components
|   |   |   +---components
|   |   |   +---documents
|   |   |   |   \---components
|   |   |   +---history
|   |   |   |   \---components
|   |   |   \---messages
|   |   |       \---components
|   |   +---data
|   |   +---fagsak
|   |   |   \---components
|   |   +---fagsakprofile
|   |   |   \---components
|   |   +---fagsakSearch
|   |   \---fakta
|   |       \---components
|   |           +---adopsjon
|   |           +---beregning
|   |           |   +---fellesFaktaForATFLogSN
|   |           |   |   +---besteberegningFodendeKvinne
|   |           |   |   +---endringBeregningsgrunnlag
|   |           |   |   +---nyIArbeidslivet
|   |           |   |   +---tidsbegrensetArbeidsforhold
|   |           |   |   \---vurderOgFastsettATFL
|   |           |   |       \---forms
|   |           |   \---tilst›tendeYtelse
|   |           +---fodsel
|   |           +---medlemskap
|   |           |   +---oppholdInntektOgPerioder
|   |           |   \---startdatoForPeriode
|   |           +---omsorg
|   |           +---omsorgOgForeldreansvar
|   |           +---opptjening
|   |           |   +---activity
|   |           |   \---timeline
|   |           +---person
|   |           |   +---panelBody
|   |           |   |   \---arbeidsforhold
|   |           |   \---panelHeader
|   |           +---tilleggsopplysninger
|   |           +---uttak
|   |           |   +---components
|   |           |   \---perioder
|   |           \---verge
|   +---kodeverk
|   +---nav-ansatt
|   +---papirsoknad
|   |   \---components
|   |       +---commonPanels
|   |       |   +---fodsel
|   |       |   +---omsorgOgAdopsjon
|   |       |   \---rettigheter
|   |       +---engangsstonad
|   |       \---foreldrepenger
|   |           +---andreYtelser
|   |           +---dekningsgrad
|   |           +---frilans
|   |           +---inntektsgivendeArbeid
|   |           +---permisjon
|   |           \---virksomhet
|   +---person
|   |   \---components
|   +---shared-components
|   |   +---datepicker
|   |   +---flexGrid
|   |   \---periodpicker
|   \---utils
|       \---validation
+---src
|   +---client
|   \---docs
+---target
|   \---public
+---webpack
\---_scripts
</code>
</pre>

##Licenses and attribution
*For updated information, always see LICENSE first!*

##For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen #p2-frontend.
