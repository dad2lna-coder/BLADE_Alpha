import test from 'node:test';
import assert from 'node:assert/strict';

import { attachHourly } from '../modules/coverage/utils/hourly.js';
import { attachDeviation } from '../modules/reports/deviation.js';
import { bindDutyApi, getRotationDuty } from '../modules/function-coverage/lib/duty.js';

function createTestScheduler() {
  const S = {
    state: {
      startDate: '2025-01-05',
      weekCount: 1,
      open: '03:30',
      close: '23:00',
      shifts: [
        { id: 'S1', name: '0330', start: '03:30', end: '12:00', paid: 8 }
      ],
      lines: [
        { id: 1, lineCode: 'TSO 001', shiftId: 'S1', empClass: 'FT', position: 'TSO', sex: 'M', function: 'PAX' },
        { id: 2, lineCode: 'TSO 002', shiftId: 'S1', empClass: 'FT', position: 'TSO', sex: 'F', function: 'PAX' }
      ],
      schedule: {
        1: ['WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'RDO', 'RDO'],
        2: ['WORK', 'WORK', 'WORK', 'WORK', 'WORK', 'RDO', 'RDO']
      },
      functionRotation: {}
    },
    timeToMin: (t) => {
      const p = String(t || '00:00').split(':');
      return (+p[0] || 0) * 60 + (+p[1] || 0);
    },
    getShift: (id) => S.state.shifts.find(s => s.id === id),
    lineRoleKey: (l) => l.empClass || 'TSO',
    getRotationDuty: (id, day) => getRotationDuty(id, day)
  };

  bindDutyApi(S);
  attachHourly(S);
  attachDeviation(S);

  return S;
}

test('Line duty "-" drops line from Coverage All/DFO/BAG/PAX views', () => {
  const S = createTestScheduler();
  const line1 = S.state.lines[0];

  // Baseline: line 1 matches coverage filter on day 0
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), true, 'Baseline: Line 1 included');

  // Set line.function = "-"
  line1.function = '-';

  // Coverage filter should now return false for line 1 for all views
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), false, 'Line 1 with duty "-" excluded from Coverage');

  S.coverageView = { stso: false, ltso: false, tso: true, funcView: 'dfo' };
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), false, 'Excluded from DFO view');

  S.coverageView = { stso: false, ltso: false, tso: true, funcView: 'bag' };
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), false, 'Excluded from BAG view');

  S.coverageView = { stso: false, ltso: false, tso: true, funcView: 'pax' };
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), false, 'Excluded from PAX view');

  // Reset function back to PAX restores coverage
  line1.function = 'PAX';
  S.coverageView = { stso: false, ltso: false, tso: true, funcView: 'all' };
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), true, 'Setting duty back to PAX restores Coverage');
});

test('Per-day duty "-" drops line from Coverage for that day only', () => {
  const S = createTestScheduler();
  const line1 = S.state.lines[0];

  // Set rotation duty for day 0 to "-"
  S.state.functionRotation[1] = ['-', 'PAX', 'PAX', 'PAX', 'PAX', null, null];

  assert.equal(S.lineMatchesCoverageFilter(line1, 0), false, 'Excluded on Day 0 with "-" duty');
  assert.equal(S.lineMatchesCoverageFilter(line1, 1), true, 'Included on Day 1 with "PAX" duty');
});

test('Line duty "-" drops line from Reports deviation modes', () => {
  const S = createTestScheduler();
  const line1 = S.state.lines[0];

  // Baseline deviation report total
  let res = S.computeRoleMatrixByDow({ mode: 'total' });
  const baseT = res.matrix[0][0].TSO.M;
  assert.equal(baseT, 1, 'Baseline report total includes 1 male TSO');

  // Set line 1 duty to "-"
  line1.function = '-';

  res = S.computeRoleMatrixByDow({ mode: 'total' });
  assert.equal(res.matrix[0][0].TSO.M, 0, 'Report total excludes line 1 with "-" duty');

  res = S.computeRoleMatrixByDow({ mode: 'passenger' });
  assert.equal(res.matrix[0][0].TSO.M, 0, 'Report passenger excludes line 1 with "-" duty');

  res = S.computeRoleMatrixByDow({ mode: 'baggage' });
  assert.equal(res.matrix[0][0].TSO.M, 0, 'Report baggage excludes line 1 with "-" duty');

  // Restoring duty to PAX restores report count
  line1.function = 'PAX';
  res = S.computeRoleMatrixByDow({ mode: 'total' });
  assert.equal(res.matrix[0][0].TSO.M, 1, 'Restoring duty to PAX restores report count');
});

test('Blank duty continues to default toward PAX', () => {
  const S = createTestScheduler();
  const line1 = S.state.lines[0];

  line1.function = '';
  assert.equal(S.lineMatchesCoverageFilter(line1, 0), true, 'Blank duty defaults to included (PAX)');

  const res = S.computeRoleMatrixByDow({ mode: 'total' });
  assert.equal(res.matrix[0][0].TSO.M, 1, 'Blank duty included in total report');
});
