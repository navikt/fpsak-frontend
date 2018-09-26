# fpsak-frontend
Monorepo for Frontend kode for vl-foreldrepenger.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

###Strukter (WIP)
<pre>
<code>
├───eslint
├───packages
│   ├───data
│   │   └───rest
│   │       └───redux
│   ├───form
│   │   └───fields
│   ├───images
│   ├───kodeverk
│   ├───nav-ansatt
│   ├───papirsoknad
│   │   └───components
│   │       ├───commonPanels
│   │       │   ├───fodsel
│   │       │   ├───omsorgOgAdopsjon
│   │       │   └───rettigheter
│   │       ├───engangsstonad
│   │       └───foreldrepenger
│   │           ├───andreYtelser
│   │           ├───dekningsgrad
│   │           ├───frilans
│   │           ├───inntektsgivendeArbeid
│   │           ├───permisjon
│   │           └───virksomhet
│   ├───person
│   │   └───components
│   ├───shared-components
│   │   ├───datepicker
│   │   ├───flexGrid
│   │   └───periodpicker
│   ├───styles
│   └───utils
│       └───validation
├───src
│   ├───client
│   │   ├───app
│   │   │   ├───app
│   │   │   │   └───data
│   │   │   ├───behandling
│   │   │   │   ├───components
│   │   │   │   │   └───fodselSammenligning
│   │   │   │   ├───proptypes
│   │   │   │   └───selectors
│   │   │   ├───behandlingmenu
│   │   │   │   └───components
│   │   │   │       ├───changeBehandlendeEnhet
│   │   │   │       ├───createNewBehandling
│   │   │   │       ├───openBehandlingForChanges
│   │   │   │       ├───pauseBehandling
│   │   │   │       ├───resumeBehandling
│   │   │   │       └───shelveBehandling
│   │   │   ├───behandlingsprosess
│   │   │   │   ├───components
│   │   │   │   │   ├───beregningsgrunnlag
│   │   │   │   │   │   ├───arbeidstaker
│   │   │   │   │   │   ├───beregningsgrunnlagPanel
│   │   │   │   │   │   ├───beregningsresultatPanel
│   │   │   │   │   │   ├───fellesPaneler
│   │   │   │   │   │   ├───frilanser
│   │   │   │   │   │   ├───selvstendigNaeringsdrivende
│   │   │   │   │   │   └───tilstotendeYtelser
│   │   │   │   │   ├───beregningsresultat
│   │   │   │   │   ├───innsyn
│   │   │   │   │   ├───klage
│   │   │   │   │   ├───revurdering
│   │   │   │   │   ├───saksopplysninger
│   │   │   │   │   ├───soknadsfrist
│   │   │   │   │   ├───tilkjentYtelse
│   │   │   │   │   │   └───timeline
│   │   │   │   │   ├───uttak
│   │   │   │   │   │   └───stonadkonto
│   │   │   │   │   ├───vedtak
│   │   │   │   │   │   ├───innsyn
│   │   │   │   │   │   ├───klage
│   │   │   │   │   │   └───revurdering
│   │   │   │   │   └───vilkar
│   │   │   │   │       ├───adopsjon
│   │   │   │   │       ├───fodsel
│   │   │   │   │       ├───foreldreansvar
│   │   │   │   │       ├───omsorg
│   │   │   │   │       ├───opptjening
│   │   │   │   │       ├───sokersOpplysningsplikt
│   │   │   │   │       └───soknadsfrist
│   │   │   │   └───definition
│   │   │   ├───behandlingsupport
│   │   │   │   ├───approval
│   │   │   │   │   └───components
│   │   │   │   ├───components
│   │   │   │   ├───documents
│   │   │   │   │   └───components
│   │   │   │   ├───history
│   │   │   │   │   └───components
│   │   │   │   └───messages
│   │   │   │       └───components
│   │   │   ├───fagsak
│   │   │   │   └───components
│   │   │   ├───fagsakprofile
│   │   │   │   └───components
│   │   │   ├───fagsakSearch
│   │   │   │   └───components
│   │   │   └───fakta
│   │   │       └───components
│   │   │           ├───adopsjon
│   │   │           ├───beregning
│   │   │           │   ├───fellesFaktaForATFLogSN
│   │   │           │   │   ├───besteberegningFodendeKvinne
│   │   │           │   │   ├───endringBeregningsgrunnlag
│   │   │           │   │   ├───nyIArbeidslivet
│   │   │           │   │   ├───tidsbegrensetArbeidsforhold
│   │   │           │   │   └───vurderOgFastsettATFL
│   │   │           │   │       └───forms
│   │   │           │   └───tilstøtendeYtelse
│   │   │           ├───fodsel
│   │   │           ├───medlemskap
│   │   │           │   ├───oppholdInntektOgPerioder
│   │   │           │   └───startdatoForPeriode
│   │   │           ├───omsorg
│   │   │           ├───omsorgOgForeldreansvar
│   │   │           ├───opptjening
│   │   │           │   ├───activity
│   │   │           │   └───timeline
│   │   │           ├───person
│   │   │           │   ├───panelBody
│   │   │           │   │   └───arbeidsforhold
│   │   │           │   └───panelHeader
│   │   │           ├───tilleggsopplysninger
│   │   │           ├───uttak
│   │   │           │   ├───components
│   │   │           │   └───perioder
│   │   │           └───verge
│   │   ├───nomodulestyles
│   │   └───testHelpers
│   └───docs
├───webpack
└───_scripts
</code>
</pre>

##Licenses and attribution
*For updated information, always see LICENSE first!*
