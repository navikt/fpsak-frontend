const fs = require('fs');
const path = require('path');
const conf = require('./config');

const filesToCopy = [];
const dirsToCreateAtTarget = [];
dirsToCreateAtTarget.push('fpsak/src/behandlingsprosess/components/avregning');
dirsToCreateAtTarget.push('fpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/tilstotendeYtelse/');
filesToCopy['app/kodeverk/avslagsarsakCodes.jsx'] = 'kodeverk/avslagsarsakCodes.jsx';
filesToCopy['app/kodeverk/konsekvensForYtelsen.jsx'] = 'kodeverk/konsekvensForYtelsen.jsx';
filesToCopy['app/kodeverk/uttakArbeidTypeCodes.jsx'] = 'kodeverk/uttakArbeidTypeCodes.jsx';
filesToCopy['app/behandlingsprosess/components/avregning/AvregningPanel.jsx'] = 'fpsak/src/behandlingsprosess/components/avregning/AvregningPanel.jsx';
filesToCopy['app/behandlingsprosess/components/avregning/AvregningSummary.jsx'] = 'fpsak/src/behandlingsprosess/components/avregning/AvregningSummary.jsx';
filesToCopy['app/behandlingsprosess/components/avregning/AvregningTable.jsx'] = 'fpsak/src/behandlingsprosess/components/avregning/AvregningTable.jsx';
filesToCopy['app/behandlingsprosess/components/avregning/avregningSummary.less'] = 'fpsak/src/behandlingsprosess/components/avregning/avregningSummary.less';
filesToCopy['app/behandlingsprosess/components/uttak/UttakInfo.jsx'] = 'fpsak/src/behandlingsprosess/components/uttak/UttakInfo.jsx';
filesToCopy['app/behandlingsprosess/components/uttak/UttakInfo.spec.jsx'] = 'fpsak/src/behandlingsprosess/components/uttak/UttakInfo.spec.jsx';
filesToCopy['app/behandlingsprosess/components/uttak/UttakMedsokerReadOnly.jsx'] = 'fpsak/src/behandlingsprosess/components/uttak/UttakMedsokerReadOnly.jsx';
filesToCopy['app/fakta/components/beregning/fellesFaktaForATFLogSN/InntektstabellPanel.jsx'] = 'fpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/InntektstabellPanel.jsx';
filesToCopy['app/fakta/components/beregning/fellesFaktaForATFLogSN/InntektstabellPanel.less'] = 'fpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/InntektstabellPanel.less';
filesToCopy['app/fakta/components/beregning/fellesFaktaForATFLogSN/InntektstabellPanel.spec.jsx'] = 'fpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/InntektstabellPanel.spec.jsx';
filesToCopy['app/fakta/components/beregning/fellesFaktaForATFLogSN/tilstotendeYtelse/TilstotendeYtelseIKombinasjon.jsx'] = 'fpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/tilstotendeYtelse/TilstotendeYtelseIKombinasjon.jsx';
filesToCopy['app/fakta/components/beregning/fellesFaktaForATFLogSN/tilstotendeYtelse/TilstotendeYtelseIKombinasjon.spec.jsx'] = 'fpsak/src/fakta/components/beregning/fellesFaktaForATFLogSN/tilstotendeYtelse/TilstotendeYtelseIKombinasjon.spec.jsx';
filesToCopy['app/fakta/components/uttak/components/UttakPeriodeValidering.jsx'] = 'fpsak/src/fakta/components/uttak/components/UttakPeriodeValidering.jsx';
filesToCopy['app/form/Fields.jsx'] = 'form/Fields.jsx';
filesToCopy['app/kodeverk/featureToggle.jsx'] = 'kodeverk/featureToggle.jsx';
filesToCopy['@fpsak-frontend/assets/styles/mixins.less'] = 'assets/styles/mixins.less';
filesToCopy['styles/modigDesign.less'] = 'assets/styles/modigDesign.less';
filesToCopy['styles/tabellModigDesign.less'] = 'assets/styles/tabellModigDesign.less';

dirsToCreateAtTarget.forEach((newTargetDirName) => {
  const newTargetDirPath = path.join(conf.targetDir, newTargetDirName);
  !fs.existsSync(newTargetDirPath) && fs.mkdirSync(newTargetDirPath);
});

Object.keys(filesToCopy).forEach((sourceFileName) => {
  const targetFileName = filesToCopy[sourceFileName];
  const sourceFilePath = path.join(conf.sourceDir, sourceFileName);
  const targetFilePath = path.join(conf.targetDir, targetFileName);
  console.log(sourceFilePath, targetFilePath);
  fs.copyFileSync(sourceFilePath, targetFilePath);
});
