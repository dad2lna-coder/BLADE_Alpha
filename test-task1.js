const fs = require('fs');

// Simulate window.Scheduler like classic boot does
global.window = { Scheduler: {} };

// Minimal mocks for classic scripts that might need browser APIs
global.dayjs = function () { return { format(){ return ''; }, add(){ return this; }, subtract(){ return this; }, toDate(){ return new Date(); }, isValid(){ return true; }, diff(){ return 0; }, startOf(){ return this; }, isAfter(){ return false; }, isBefore(){ return false; }, hour(){ return 0; }, minute(){ return 0; } }; };
global.Sortable = {};
global.luxon = {};
global.ExcelJS = {};

// Load core classic scripts that lines-row-model depends on (state, utils, shifts)
['js/constants.js','js/state.js','js/utils.js','js/shifts.js'].forEach(function(f){
  try { new Function(fs.readFileSync(f,'utf8')); } catch(e){ /* ignore scripts that need DOM */ }
});

// Now load lines-row-model.js
const code = fs.readFileSync('js/lines-row-model.js','utf8');
const fn = new Function(code); fn.call(global.window);

// Verify required exports - MUST read from window.Scheduler since that's what the script writes to
var pass = true;
function check(desc, ok) { console.log(ok ? 'PASS' : 'FAIL', desc); if(!ok) pass = false; }

check('typeof Scheduler.lineToRowModel === "function"', typeof window.Scheduler.lineToRowModel === 'function');
check('typeof Scheduler.getLineRowModels === "function"', typeof window.Scheduler.getLineRowModels === 'function');

// Point to the updated Scheduler for the rest of the test
var S = window.Scheduler;

if (!pass) process.exit(1);

// Verify getLineRowModels() returns array of export-shaped rows when lines exist
S.state = {
  lines: [
    { id:'L1', lineCode:'L1', shiftId:'S1', shiftName:'AM', isStso:true, empClass:'STSO', sex:'M', function:'TSO', rdoDays:[0,1,2], rdoHard:false, paid:5.5 },
  ],
  schedule: { L1: ['WORK','WORK','WORK','RDO','RDO','RDO','RDO'] }
};
S.teamMetaForLine = function(id){ return { id, name:'01' }; };
S.getShift = function(id){ return { name:'AM', start:'06:00', end:'14:00' }; };

var rows = S.getLineRowModels();
check('rows count === 1', rows.length === 1);
if (rows.length === 1) {
  var expectedKeys = ['team','line','shift','start','end','position','emp','sex','function','rdos','paid','days','hours'];
  var keysOk = expectedKeys.every(function(k){ return k in rows[0]; });
  check('row has all export fields', keysOk);
  console.log('sample row:', JSON.stringify(rows[0]));
}

// Verify empty-safe
delete S.state;
var emptyRows = S.getLineRowModels();
check('empty-safe returns array', Array.isArray(emptyRows));
check('empty-safe length === 0', emptyRows.length === 0);

// Verify default resolvers are wired (no explicit options)
S.state = { lines: [{ id:'L2', lineCode:'L2', shiftId:'S2', isStso:false, empClass:'PT', sex:'F', function:'PAX', rdoDays:[], rdoHard:false, paid:4 }], schedule: { L2: ['WORK','WORK','WORK','WORK','WORK','RDO','RDO'] } };
S.teamMetaForLine = function(id){ return { id, name:'05' }; };
S.getShift = function(id){ return { name:'PM', start:'14:00', end:'22:00' }; };
var rows2 = S.getLineRowModels();
check('team resolved to 005 (padTeamName)', rows2[0].team === '005');
check('shift resolved PM', rows2[0].shift === 'PM');
check('PT emp', rows2[0].emp === 'PT');
check('position TSO', rows2[0].position === 'TSO');
check('days has workLabel shift 22:00-06:00 for day 0', rows2[0].days[0] === '22:00–06:00');
check('days has RDO for day 5', rows2[0].days[5] === 'RDO');

// Verify pure APIs unchanged: getRowModels still takes explicit args
var pureRows = S.getRowModels(S.state.lines, S.state.schedule, { dayNames:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] });
check('getRowModels pure API still works', pureRows.length === 1);

// Verify rotationDutyResolver is respected when provided
S.state = { lines: [{ id:'L3', lineCode:'L3', shiftId:'S3', isStso:false, empClass:'PT', sex:'M', function:'TSO', rdoDays:[], rdoHard:false, paid:5 }], schedule: { L3: ['WORK','WORK','WORK','WORK','WORK','WORK','RDO'] } };
S.teamMetaForLine = function(id){ return { id, name:'03' }; };
S.getShift = function(id){ return { name:'NIGHT', start:'22:00', end:'06:00' }; };
var rows3 = S.getLineRowModels({ rotationDutyResolver: function(lineId, day) { return 'DUTY-' + day; } });
check('rotationDutyResolver applied', rows3[0].days[0] === 'DUTY-0');
check('rotationDutyResolver applied day6 RDO', rows3[0].days[6] === 'RDO');

// Verify rotationDutyResolver left unset when not provided in options
var rows4 = S.getLineRowModels();
check('no rotationDutyResolver defaults to workLabel shift name', rows4[0].days[0] === '22:00–06:00');

// Verify options.dayNames is respected
S.state = { lines: [{ id:'L4', lineCode:'L4', shiftId:'S4', isStso:false, empClass:'PT', sex:'M', function:'TSO', rdoDays:[0], rdoHard:false, paid:5 }], schedule: { L4: ['WORK','RDO','RDO','RDO','RDO','RDO','RDO'] } };
S.teamMetaForLine = function(id){ return { id, name:'04' }; };
S.getShift = function(id){ return { name:'DAY', start:'08:00', end:'16:00' }; };
var dayNames = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
var rows5 = S.getLineRowModels({ dayNames: dayNames });
check('custom dayNames applied', rows5[0].rdos.indexOf('Dom') !== -1);
check('custom dayNames NOT default English', rows5[0].rdos.indexOf('Sun') === -1);

if (!pass) process.exit(1);
console.log('ALL CHECKS PASSED');