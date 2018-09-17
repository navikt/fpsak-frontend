# fpsak-frontend
Frontend kode for vl-foreldrepenger

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

###Struktur som skal deles inn i moduler/pakker
<pre>
<code>
├───eslint
├───src
│   ├───client
│   │   ├───app
│   │   │   ├───app
│   │   │   │   ├───components
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
│   │   │   ├───data
│   │   │   │   └───rest
│   │   │   │       └───redux
│   │   │   ├───fagsak
│   │   │   │   └───components
│   │   │   ├───fagsakprofile
│   │   │   │   └───components
│   │   │   ├───fagsakSearch
│   │   │   │   └───components
│   │   │   ├───fakta
│   │   │   │   └───components
│   │   │   │       ├───adopsjon
│   │   │   │       ├───beregning
│   │   │   │       │   ├───fellesFaktaForATFLogSN
│   │   │   │       │   │   ├───besteberegningFodendeKvinne
│   │   │   │       │   │   ├───endringBeregningsgrunnlag
│   │   │   │       │   │   ├───nyIArbeidslivet
│   │   │   │       │   │   ├───tidsbegrensetArbeidsforhold
│   │   │   │       │   │   └───vurderOgFastsettATFL
│   │   │   │       │   │       └───forms
│   │   │   │       │   └───tilstøtendeYtelse
│   │   │   │       ├───fodsel
│   │   │   │       ├───medlemskap
│   │   │   │       │   ├───oppholdInntektOgPerioder
│   │   │   │       │   └───startdatoForPeriode
│   │   │   │       ├───omsorg
│   │   │   │       ├───omsorgOgForeldreansvar
│   │   │   │       ├───opptjening
│   │   │   │       │   ├───activity
│   │   │   │       │   └───timeline
│   │   │   │       ├───person
│   │   │   │       │   ├───panelBody
│   │   │   │       │   │   └───arbeidsforhold
│   │   │   │       │   └───panelHeader
│   │   │   │       ├───tilleggsopplysninger
│   │   │   │       ├───uttak
│   │   │   │       │   ├───components
│   │   │   │       │   └───perioder
│   │   │   │       └───verge
│   │   │   ├───form
│   │   │   │   └───fields
│   │   │   ├───kodeverk
│   │   │   ├───navAnsatt
│   │   │   ├───papirsoknad
│   │   │   │   └───components
│   │   │   │       ├───commonPanels
│   │   │   │       │   ├───fodsel
│   │   │   │       │   ├───omsorgOgAdopsjon
│   │   │   │       │   └───rettigheter
│   │   │   │       ├───engangsstonad
│   │   │   │       └───foreldrepenger
│   │   │   │           ├───andreYtelser
│   │   │   │           ├───dekningsgrad
│   │   │   │           ├───frilans
│   │   │   │           ├───inntektsgivendeArbeid
│   │   │   │           ├───permisjon
│   │   │   │           └───virksomhet
│   │   │   ├───person
│   │   │   │   └───components
│   │   │   ├───sharedComponents
│   │   │   │   ├───datepicker
│   │   │   │   ├───flexGrid
│   │   │   │   └───periodpicker
│   │   │   └───utils
│   │   │       └───validation
│   │   ├───images
│   │   ├───nomodulestyles
│   │   ├───styles
│   │   └───testHelpers
│   └───docs
├───webpack
└───_scripts
</code>
</pre>