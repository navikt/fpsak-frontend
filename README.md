# fpsak-frontend
Monorepo for Frontend kode for vl-foreldrepenger.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

##TODO
1. omstrukturere client/src
2. rydde opp i struktur i de forskjellige pakkene
3. Fikse så mye cycles i depenencies som lar seg gjøre
4. riktig namespace, bruker scoped for nå(@fpsak-frontend)
5. Sette opp lerna publish
6. sette opp jenkins og tbd
7. gjøre form pakken tilgjengelig med final-form og redux-form

###Strukter (WIP)
<pre>
<code>
+---eslint
+---packages
|   +---data
|   |   \---rest
|   |       \---redux
|   +---fagsak-search
|   |   \---components
|   +---form
|   |   \---fields
|   +---images
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
|   +---styles
|   \---utils
|       \---validation
+---src
|   +---client
|   |   +---app
|   |   |   +---behandling
|   |   |   |   +---components
|   |   |   |   |   \---fodselSammenligning
|   |   |   |   +---proptypes
|   |   |   |   \---selectors
|   |   |   +---behandlingmenu
|   |   |   |   \---components
|   |   |   |       +---changeBehandlendeEnhet
|   |   |   |       +---createNewBehandling
|   |   |   |       +---openBehandlingForChanges
|   |   |   |       +---pauseBehandling
|   |   |   |       +---resumeBehandling
|   |   |   |       \---shelveBehandling
|   |   |   +---behandlingsprosess
|   |   |   |   +---components
|   |   |   |   |   +---beregningsgrunnlag
|   |   |   |   |   |   +---arbeidstaker
|   |   |   |   |   |   +---beregningsgrunnlagPanel
|   |   |   |   |   |   +---beregningsresultatPanel
|   |   |   |   |   |   +---fellesPaneler
|   |   |   |   |   |   +---frilanser
|   |   |   |   |   |   +---selvstendigNaeringsdrivende
|   |   |   |   |   |   \---tilstotendeYtelser
|   |   |   |   |   +---beregningsresultat
|   |   |   |   |   +---innsyn
|   |   |   |   |   +---klage
|   |   |   |   |   +---revurdering
|   |   |   |   |   +---saksopplysninger
|   |   |   |   |   +---soknadsfrist
|   |   |   |   |   +---tilkjentYtelse
|   |   |   |   |   |   \---timeline
|   |   |   |   |   +---uttak
|   |   |   |   |   |   \---stonadkonto
|   |   |   |   |   +---vedtak
|   |   |   |   |   |   +---innsyn
|   |   |   |   |   |   +---klage
|   |   |   |   |   |   \---revurdering
|   |   |   |   |   \---vilkar
|   |   |   |   |       +---adopsjon
|   |   |   |   |       +---fodsel
|   |   |   |   |       +---foreldreansvar
|   |   |   |   |       +---omsorg
|   |   |   |   |       +---opptjening
|   |   |   |   |       +---sokersOpplysningsplikt
|   |   |   |   |       \---soknadsfrist
|   |   |   |   \---definition
|   |   |   +---behandlingsupport
|   |   |   |   +---approval
|   |   |   |   |   \---components
|   |   |   |   +---components
|   |   |   |   +---documents
|   |   |   |   |   \---components
|   |   |   |   +---history
|   |   |   |   |   \---components
|   |   |   |   \---messages
|   |   |   |       \---components
|   |   |   +---data
|   |   |   +---fagsak
|   |   |   |   \---components
|   |   |   +---fagsakprofile
|   |   |   |   \---components
|   |   |   +---fagsakSearch
|   |   |   \---fakta
|   |   |       \---components
|   |   |           +---adopsjon
|   |   |           +---beregning
|   |   |           |   +---fellesFaktaForATFLogSN
|   |   |           |   |   +---besteberegningFodendeKvinne
|   |   |           |   |   +---endringBeregningsgrunnlag
|   |   |           |   |   +---nyIArbeidslivet
|   |   |           |   |   +---tidsbegrensetArbeidsforhold
|   |   |           |   |   \---vurderOgFastsettATFL
|   |   |           |   |       \---forms
|   |   |           |   \---tilstøtendeYtelse
|   |   |           +---fodsel
|   |   |           +---medlemskap
|   |   |           |   +---oppholdInntektOgPerioder
|   |   |           |   \---startdatoForPeriode
|   |   |           +---omsorg
|   |   |           +---omsorgOgForeldreansvar
|   |   |           +---opptjening
|   |   |           |   +---activity
|   |   |           |   \---timeline
|   |   |           +---person
|   |   |           |   +---panelBody
|   |   |           |   |   \---arbeidsforhold
|   |   |           |   \---panelHeader
|   |   |           +---tilleggsopplysninger
|   |   |           +---uttak
|   |   |           |   +---components
|   |   |           |   \---perioder
|   |   |           \---verge
|   |   +---nomodulestyles
|   |   \---testHelpers
|   \---docs
+---webpack
\---_scripts

</code>
</pre>

##Licenses and attribution
*For updated information, always see LICENSE first!*
