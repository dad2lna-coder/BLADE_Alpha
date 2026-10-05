import test from 'node:test';
import assert from 'node:assert/strict';

import { bridgeScheduler } from '../modules/setup-panel/actions/bridge.js';
import { initLineHelpers } from '../modules/shared/lines/helpers.js';
import { initFunctionCoverage } from '../modules/function-coverage/index.js';
import { attachHourly } from '../modules/coverage/utils/hourly.js';

function createMockScheduler() {
  const S = {
    $: (id) => null,
    state: {
      startDate: '2025-01-05',
      weekCount: 1,
      open: '03:30',
      close: '23:00',
      ftM: 4, ftF: 4,
      ptM: 0, ptF: 0,
      ptHoursPerDay: 4,
      stsoM: 2, stsoF: 2,
      ltsoM: 1, ltsoF: 1,
      esti: 0, msti: 0,
      extraPositions: [],
      shifts: [
        { id: 'S1', name: '0330', start: '03:30', end: '12:00', paid: 8, stsoForce: 1, ltsoForce: 1, force: 2 },
        { id: 'S2', name: '1200', start: '12:00', end: '20:30', paid: 8, stsoForce: 1, ltsoForce: 0, force: 2 }
      ],
      lines: [],
      schedule: {},
      functionRotation: {},
      issues: []
    },
    timeToMin: (t) => {
      const p = String(t || '00:00').split(':');
      return (+p[0] || 0) * 60 + (+p[1] || 0);
    },
    shiftLabel: (s) => (s.start || '') + '–' + (s.end || ''),
    rdoCountForShift: () => 2,
    targetWorkDays: () => 5,
    consecutiveRdos: (count, seed) => [seed % 7, (seed + 1) % 7],
    getShift: (id) => S.state.shifts.find(s => s.id === id),
    lineRoleKey: (l) => l.isStso || l.empClass === 'STSO' ? 'STSO' : (l.isLtso || l.empClass === 'LTSO' ? 'LTSO' : 'TSO'),
    lineStartMin: (l) => {
      const sh = S.getShift(l.shiftId);
      return sh ? S.timeToMin(sh.start) : 0;
    },
    isAmSide: (startMin) => startMin < 720,
    computeShiftAnchors: () => ({ amStart: 210, pmStart: 720 }),
    updateStatus: () => {}
  };

  bridgeScheduler(S);
  initLineHelpers(S);
  initFunctionCoverage(S);

  return S;
}

test('Base generate vs STSO-only generate leaves other classes untouched', () => {
  const S = createMockScheduler();
  S.generate();

  const initialLines = S.state.lines.map(l => ({ ...l }));
  const initialSchedule = { ...S.state.schedule };
  const initialRotation = { ...S.state.functionRotation };

  const nonStsoBefore = initialLines.filter(l => !S.belongsToClass(l, 'STSO'));
  assert.ok(nonStsoBefore.length > 0, 'Should have non-STSO lines');

  // Single-class generate for STSO
  S.generateClass('STSO');

  const linesAfter = S.state.lines;

  // Check every non-STSO line remained identical
  nonStsoBefore.forEach(orig => {
    const after = linesAfter.find(l => l.id === orig.id);
    assert.ok(after, `Line ${orig.id} should still exist`);
    assert.equal(after.shiftId, orig.shiftId, `Line ${orig.id} shiftId unchanged`);
    assert.equal(after.sex, orig.sex, `Line ${orig.id} sex unchanged`);
    assert.equal(after.function, orig.function, `Line ${orig.id} function unchanged`);
    assert.deepEqual(S.state.schedule[after.id], initialSchedule[orig.id], `Line ${orig.id} schedule unchanged`);
    assert.deepEqual(S.state.functionRotation[after.id], initialRotation[orig.id], `Line ${orig.id} rotation unchanged`);
  });
});

test('Stepper under headcount produces shortfall lines marked "-" excluded from counts', () => {
  const S = createMockScheduler();
  S.generate();

  // STSO headcount is M:2, F:2. Provide targets for M:1, F:2 (1 M shortfall)
  const targets = {
    S1: { M: 1, F: 1 },
    S2: { M: 0, F: 1 }
  };

  S.generateClass('STSO', targets);

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  assert.equal(stsoLines.length, 4, 'Total STSO lines should match headcount of 4');

  const shortfallLines = stsoLines.filter(l => l.isShortfall || l.function === '-');
  assert.equal(shortfallLines.length, 1, 'Exactly 1 shortfall line generated');

  const sf = shortfallLines[0];
  assert.equal(sf.function, '-', 'Shortfall line function is "-"');

  const rot = S.state.functionRotation[sf.id];
  assert.ok(rot, 'Shortfall line rotation exists');
  const sched = S.state.schedule[sf.id];
  for (let d = 0; d < 7; d++) {
    if (sched[d] === 'WORK') {
      assert.equal(rot[d], '-', `Work day ${d} duty must be "-" for shortfall line`);
    }
  }
});

test('RDO Parity check detects pattern imbalance and proposes approve-first swap without changing shift/sex', () => {
  const S = createMockScheduler();
  S.generate();

  // Create explicit imbalance on S1 for STSO:
  const stsoS1 = S.state.lines.filter(l => S.belongsToClass(l, 'STSO') && l.shiftId === 'S1');
  if (stsoS1.length >= 2) {
    stsoS1[0].sex = 'F';
    stsoS1[0].rdoDays = [0, 6]; // Sat-Sun
    stsoS1[1].sex = 'M';
    stsoS1[1].rdoDays = [1, 2]; // Mon-Tue
  }

  const res = S.checkParity('STSO', []);
  assert.ok(res.summary.includes('STSO'), 'Parity check returned summary');

  if (res.proposals.length > 0) {
    const prop = res.proposals[0];
    assert.equal(prop.lineA.shiftId, prop.lineB.shiftId, 'Swap is on same shift');
    assert.notEqual(prop.lineA.sex, prop.lineB.sex, 'Swap is between different sexes');

    const lineAId = prop.lineA.id;
    const lineBId = prop.lineB.id;

    // Approve parity swap
    S.approveParitySwaps([{
      lineAId: lineAId,
      lineBId: lineBId,
      rdoA_after: prop.rdoA_after,
      rdoB_after: prop.rdoB_after
    }]);

    const updatedA = S.state.lines.find(l => l.id === lineAId);
    assert.deepEqual(updatedA.rdoDays, prop.rdoA_after, 'Line A RDOs updated');
    assert.equal(updatedA.shiftId, prop.lineA.shiftId, 'Line A shiftId unchanged');
    assert.equal(updatedA.sex, prop.lineA.sex, 'Line A sex unchanged');
  }
});

test('DFO cert balance proposes same-sex cert move when cert counts differ without changing shiftId', () => {
  const S = createMockScheduler();
  S.generate();

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  if (stsoLines.length >= 4) {
    stsoLines[0].shiftId = 'S1'; stsoLines[0].shiftName = '0330';
    stsoLines[1].shiftId = 'S1'; stsoLines[1].shiftName = '0330';
    stsoLines[2].shiftId = 'S2'; stsoLines[2].shiftName = '1200';
    stsoLines[3].shiftId = 'S2'; stsoLines[3].shiftName = '1200';

    stsoLines[0].certPool = 'B'; stsoLines[0].function = 'DFO';
    stsoLines[1].certPool = 'B'; stsoLines[1].function = 'DFO';
    stsoLines[2].certPool = 'A'; stsoLines[2].function = 'PAX';
    stsoLines[3].certPool = 'A'; stsoLines[3].function = 'PAX';

    const res = S.proposeDfoCertBalance('STSO');
    assert.equal(res.mode, 'cert_move', 'Detects cert count mismatch across shifts');
    assert.ok(res.proposals.length > 0, 'Generates cert move proposals');

    const prop = res.proposals[0];
    assert.equal(prop.donorLine.sex, prop.receiverLine.sex, 'Cert move is between same sex');
    assert.notEqual(prop.donorShift.id, prop.receiverShift.id, 'Cert move is across shifts');

    const donorShiftBefore = prop.donorLine.shiftId;
    const receiverShiftBefore = prop.receiverLine.shiftId;

    // Approve cert move
    S.approveDfoCertBalance(res, [prop]);

    assert.equal(prop.donorLine.shiftId, donorShiftBefore, 'Donor line shiftId completely unchanged');
    assert.equal(prop.receiverLine.shiftId, receiverShiftBefore, 'Receiver line shiftId completely unchanged');
    assert.equal(prop.receiverLine.certPool, 'B', 'Receiver line gained DFO cert B');
  }
});

test('DFO cert balance tries all receiver shifts for same-sex match in 3-shift setup', () => {
  const S = createMockScheduler();
  S.state.shifts.push({ id: 'S3', name: '1500', start: '15:00', end: '23:30', paid: 8, stsoForce: 1, ltsoForce: 0, force: 2 });
  S.generate();

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  if (stsoLines.length >= 4) {
    // S1 has 2 certs (1 Female, 1 Male) -> donor shift
    stsoLines[0].shiftId = 'S1'; stsoLines[0].sex = 'F'; stsoLines[0].certPool = 'B'; stsoLines[0].function = 'DFO';
    stsoLines[3].shiftId = 'S1'; stsoLines[3].sex = 'M'; stsoLines[3].certPool = 'B'; stsoLines[3].function = 'DFO';
    // S2: 1 Male line without DFO cert (first short shift - only Male)
    stsoLines[1].shiftId = 'S2'; stsoLines[1].sex = 'M'; stsoLines[1].certPool = 'A'; stsoLines[1].function = 'PAX';
    // S3: 1 Female line without DFO cert (second short shift)
    stsoLines[2].shiftId = 'S3'; stsoLines[2].sex = 'F'; stsoLines[2].certPool = 'A'; stsoLines[2].function = 'PAX';

    const res = S.proposeDfoCertBalance('STSO');
    assert.equal(res.mode, 'cert_move', 'Mode is cert_move');
    const femaleProps = res.proposals.filter(p => p.donorLine.id === stsoLines[0].id);
    assert.ok(femaleProps.length > 0, 'Found proposal for female donor');
    const prop = femaleProps[0];
    assert.equal(prop.receiverLine.id, stsoLines[2].id, 'Female donor on S1 paired with female receiver on S3');
    assert.equal(prop.receiverShift.id, 'S3', 'Receiver shift is S3');
    assert.equal(prop.donorLine.sex, prop.receiverLine.sex, 'Same sex pair F <-> F');
  }
});

test('DFO cert balance refuses cross-sex proposal and skips move if no same-sex receiver exists', () => {
  const S = createMockScheduler();
  S.generate();

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  if (stsoLines.length >= 2) {
    // S1 has 1 Female line with DFO cert
    stsoLines[0].shiftId = 'S1'; stsoLines[0].sex = 'F'; stsoLines[0].certPool = 'B'; stsoLines[0].function = 'DFO';
    // S2 has ONLY Male lines without DFO cert
    stsoLines[1].shiftId = 'S2'; stsoLines[1].sex = 'M'; stsoLines[1].certPool = 'A'; stsoLines[1].function = 'PAX';
    for (let i = 2; i < stsoLines.length; i++) {
      stsoLines[i].shiftId = 'S1'; stsoLines[i].sex = 'M'; stsoLines[i].certPool = 'A'; stsoLines[i].function = 'PAX';
    }

    const res = S.proposeDfoCertBalance('STSO');
    // Since S2 has no Female line, same-sex move cannot be proposed
    const crossSexProps = res.proposals.filter(p => p.donorLine.sex !== p.receiverLine.sex);
    assert.equal(crossSexProps.length, 0, 'No cross-sex move proposals created');

    // Test approveDfoCertBalance explicitly refusing a cross-sex proposal
    const fakeCrossSexProp = {
      donorLine: stsoLines[0], // Female
      receiverLine: stsoLines[1], // Male
      sex: 'F',
      donorShift: S.getShift('S1'),
      receiverShift: S.getShift('S2')
    };

    const approved = S.approveDfoCertBalance({ mode: 'cert_move', proposals: [fakeCrossSexProp] }, [fakeCrossSexProp]);
    assert.equal(approved, false, 'approveDfoCertBalance refused cross-sex proposal');
    assert.equal(stsoLines[0].shiftId, 'S1', 'Donor shiftId unchanged');
    assert.equal(stsoLines[1].shiftId, 'S2', 'Receiver shiftId unchanged');
    assert.equal(stsoLines[1].certPool, 'A', 'Receiver certPool unchanged');
  }
});

test('DFO cert balance proposes baggage reshuffle when cert counts match', () => {
  const S = createMockScheduler();
  S.generate();

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  const s1Lines = stsoLines.filter(l => l.shiftId === 'S1');
  const s2Lines = stsoLines.filter(l => l.shiftId === 'S2');

  // Equalize cert counts: 1 on S1, 1 on S2
  if (s1Lines.length > 0) { s1Lines[0].certPool = 'B'; s1Lines[0].function = 'DFO'; }
  if (s2Lines.length > 0) { s2Lines[0].certPool = 'B'; s2Lines[0].function = 'DFO'; }

  const res = S.proposeDfoCertBalance('STSO');
  assert.equal(res.mode, 'baggage_reshuffle', 'Mode is baggage_reshuffle when cert counts match');
  assert.equal(res.certsMatch, true, 'certsMatch is true');

  const ok = S.approveDfoCertBalance(res, []);
  assert.equal(ok, true, 'Baggage reshuffle approved successfully');
});

test('TSO target generation spends PT and FT separately and creates PT lines', () => {
  const S = createMockScheduler();
  S.state.ftM = 2; S.state.ftF = 2;
  S.state.ptM = 2; S.state.ptF = 2;

  const targets = {
    S1: { M: 3, F: 3 },
    S2: { M: 1, F: 1 }
  };

  S.generateClass('TSO', targets);

  const tsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'TSO'));
  assert.equal(tsoLines.length, 8, 'Total TSO lines generated = 8');

  const ptLines = tsoLines.filter(l => l.empClass === 'PT');
  const ftLines = tsoLines.filter(l => l.empClass === 'FT');

  assert.equal(ptLines.length, 4, 'Exactly 4 PT lines generated (2 M PT, 2 F PT)');
  assert.equal(ftLines.length, 4, 'Exactly 4 FT lines generated (2 M FT, 2 F FT)');

  ptLines.forEach(l => {
    assert.notEqual(l.empClass, 'FT', 'PT line is never marked as FT');
    assert.equal(l.paid, 4, 'PT line paid hours per day is 4');
  });
});

test('Fix 1: Locked STSO line counts toward class headcount and is preserved without duplication', () => {
  const S = createMockScheduler();
  S.state.shifts.forEach(s => { s.stsoForce = 0; });
  S.generate();

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  assert.equal(stsoLines.length, 4, 'Initial STSO lines = 4');

  const lockedLine = stsoLines[0];
  lockedLine.locked = true;
  S.isLineScheduleLocked = (l) => l.id === lockedLine.id || l.locked === true;

  // Re-generate STSO class
  S.generateClass('STSO');

  const stsoAfter = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  assert.equal(stsoAfter.length, 4, 'Total STSO lines still = 4');

  const lockedAfter = stsoAfter.filter(l => l.id === lockedLine.id);
  assert.equal(lockedAfter.length, 1, 'Locked line is present exactly once');
  assert.equal(lockedAfter[0].shiftId, lockedLine.shiftId, 'Locked line shiftId preserved');
});

test('Fix 2: ESTI / MSTI generates exact count of training lines with function TRAINING', () => {
  const S = createMockScheduler();
  S.state.esti = 2;
  S.state.msti = 1;

  S.generateClass('ESTI');

  const estiLines = S.state.lines.filter(l => S.belongsToClass(l, 'ESTI'));
  assert.equal(estiLines.length, 2, 'Generated 2 ESTI training lines');
  estiLines.forEach(l => {
    assert.equal(l.isTraining, true, 'isTraining is true');
    assert.equal(l.function, 'TRAINING', 'function is TRAINING');
  });
});

test('Fix 3: EXTRA_* position line generation preserves opsFte from extraPositions', () => {
  const S = createMockScheduler();
  S.state.extraPositions = [
    { id: 'extra-1', name: 'OPS_ADDON', m: 1, f: 0, opsFte: true, bands: [{ start: '04:00', end: '12:00', min: 1 }] }
  ];

  S.generateClass('EXTRA_extra-1');

  const extraLines = S.state.lines.filter(l => S.belongsToClass(l, 'EXTRA_extra-1'));
  assert.equal(extraLines.length, 1, 'Generated 1 extra line');
  assert.equal(extraLines[0].opsFte, true, 'opsFte is preserved as true');
});

test('Class-generated TSO/STSO/LTSO lines count in Coverage (opsFte is unset)', () => {
  const S = createMockScheduler();
  attachHourly(S);

  const targets = {
    S1: { M: 3, F: 3 },
    S2: { M: 1, F: 1 }
  };

  S.generateClass('TSO', targets);

  const tsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'TSO'));
  assert.equal(tsoLines.length, 8, 'Generated 8 TSO lines');

  const targetedLines = tsoLines.filter(l => !l.isShortfall);
  assert.equal(targetedLines.length, 8, 'All 8 lines are targeted non-shortfall lines');

  tsoLines.forEach(l => {
    assert.equal(l.opsFte, undefined, 'opsFte is undefined (unset) for generated TSO lines');
    assert.equal(S.lineMatchesCoverageFilter(l, 0), true, 'TSO line matches coverage filter on work day');
  });

  const { matrix } = S.computeHourlyByDow();
  const dayTotal = matrix[0][0].t;
  assert.ok(dayTotal > 0, `Coverage matrix includes generated TSO lines (got ${dayTotal})`);
});

test('Generate TSO Only runs DFO/BAG assign matching function coverage pools', () => {
  const S = createMockScheduler();
  S.state.functionCoverage = {
    poolTsoDfoM: 1,
    poolTsoDfoF: 1,
    poolTsoBagM: 1,
    poolTsoBagF: 1
  };

  S.generateClass('TSO');

  const tsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'TSO'));
  assert.equal(tsoLines.length, 4, 'Generated 4 TSO lines');

  const dfoLines = tsoLines.filter(l => l.function === 'DFO' || (l.functionEligible && l.functionEligible.dfo));
  const bagLines = tsoLines.filter(l => l.function === 'BAG' || (l.functionEligible && l.functionEligible.bag));

  assert.equal(dfoLines.length, 2, 'Assigned 2 DFO pool lines (1 M, 1 F)');
  assert.equal(bagLines.length, 2, 'Assigned 2 BAG pool lines (1 M, 1 F)');
});

test('Fix 4: Shortfall line (duty "-") is excluded from DFO cert pool assignment', () => {
  const S = createMockScheduler();
  S.generate();

  // Targets below headcount to create shortfall line
  const targets = { S1: { M: 1, F: 1 }, S2: { M: 0, F: 1 } }; // 1 M shortfall
  S.generateClass('STSO', targets);

  const shortfallLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO') && (l.isShortfall || l.function === '-'));
  assert.ok(shortfallLines.length > 0, 'Shortfall line present');

  shortfallLines.forEach(l => {
    assert.notEqual(l.certPool, 'B', 'Shortfall line never receives certPool B');
    assert.equal(l.function, '-', 'Shortfall duty is "-"');
  });
});

test('Fix 5: DFO cert balance proposal ensures two donor lines do not share one receiver line', () => {
  const S = createMockScheduler();
  S.generate();

  S.state.lines = [];

  // Create 4 female lines on S1 with DFO certs (donors) and 4 female lines on S2 without certs (receivers)
  for (let i = 0; i < 4; i++) {
    S.state.lines.push({
      id: 10000 + i,
      lineCode: 'STSO ' + String(10000 + i),
      shiftId: 'S1',
      empClass: 'STSO', position: 'STSO', isStso: true, sex: 'F',
      certPool: 'B', function: 'DFO', rdoDays: [0, 6]
    });
  }
  for (let j = 0; j < 4; j++) {
    S.state.lines.push({
      id: 20000 + j,
      lineCode: 'STSO ' + String(20000 + j),
      shiftId: 'S2',
      empClass: 'STSO', position: 'STSO', isStso: true, sex: 'F',
      certPool: 'A', function: 'PAX', rdoDays: [0, 6]
    });
  }

  const res = S.proposeDfoCertBalance('STSO');
  assert.equal(res.mode, 'cert_move', 'Mode is cert_move');
  assert.equal(res.proposals.length, 2, 'Exactly 2 proposals generated');

  const receiverIds = res.proposals.map(p => p.receiverLine.id);
  const uniqueReceivers = new Set(receiverIds);
  assert.equal(receiverIds.length, 2, '2 receiver IDs generated');
  assert.equal(uniqueReceivers.size, 2, 'No two donors share the same receiver line');
});

test('Fix 6: Approving RDO parity swap rebuilds functionRotation so duty days follow new RDOs', () => {
  const S = createMockScheduler();
  S.generate();

  let stsoS1 = S.state.lines.filter(l => S.belongsToClass(l, 'STSO') && l.shiftId === 'S1');
  while (stsoS1.length < 2) {
    const id = 10000 + S.state.lines.length;
    const l = {
      id: id,
      lineCode: 'STSO ' + String(id).padStart(3, '0'),
      shiftId: 'S1',
      empClass: 'STSO',
      position: 'STSO',
      isStso: true,
      sex: stsoS1.length === 0 ? 'F' : 'M',
      function: 'PAX',
      rdoDays: [0, 6]
    };
    S.state.lines.push(l);
    stsoS1.push(l);
  }

  const lA = stsoS1[0];
  const lB = stsoS1[1];

  lA.sex = 'F';
  lB.sex = 'M';
  lA.rdoDays = [0, 6]; // Sat-Sun off
  lB.rdoDays = [1, 2]; // Mon-Tue off

  S.state.schedule[lA.id] = S.buildScheduleForLine(lA, 7);
  S.state.schedule[lB.id] = S.buildScheduleForLine(lB, 7);

  // Swap RDOs
  const newRdoA = [1, 2];
  const newRdoB = [0, 6];

  const ok = S.approveParitySwaps([{
    lineAId: lA.id,
    lineBId: lB.id,
    rdoA_after: newRdoA,
    rdoB_after: newRdoB
  }]);

  assert.equal(ok, true, 'Parity swap approved');

  const rotA = S.state.functionRotation[lA.id];
  assert.ok(rotA, 'Rotation A updated');
  assert.equal(rotA[1], 'OFF', 'Day 1 is OFF after RDO swap');
  assert.equal(rotA[2], 'OFF', 'Day 2 is OFF after RDO swap');
  assert.notEqual(rotA[0], 'OFF', 'Day 0 is WORK duty after RDO swap');
});

test('Modal-5 Test 1: Stepping locked male STSO seat onto another shift does not exceed entered male headcount', () => {
  const S = createMockScheduler();
  S.state.stsoM = 2; S.state.stsoF = 2;
  S.generate();

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  let s1Male = stsoLines.find(l => l.shiftId === 'S1' && l.sex === 'M');
  if (!s1Male) {
    const s1Line = stsoLines.find(l => l.shiftId === 'S1') || stsoLines[0];
    s1Line.shiftId = 'S1';
    s1Line.sex = 'M';
    s1Male = s1Line;
  }

  s1Male.locked = true;
  S.isLineScheduleLocked = (l) => l.id === s1Male.id || l.locked === true;

  // Step male target onto S2: S1: { M: 0, F: 1 }, S2: { M: 2, F: 1 }
  const targets = {
    S1: { M: 0, F: 1 },
    S2: { M: 2, F: 1 }
  };

  S.generateClass('STSO', targets);

  const stsoAfter = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  const malesAfter = stsoAfter.filter(l => l.sex === 'M');
  assert.equal(malesAfter.length, 2, 'Male STSO count strictly equals entered headcount of 2');

  const lockedCopies = stsoAfter.filter(l => l.id === s1Male.id);
  assert.equal(lockedCopies.length, 1, 'Locked line is present exactly once');
});

test('Modal-5 Test 2: ESTI total 2 from fresh grid generates 2 TRAINING lines', () => {
  const S = createMockScheduler();
  S.state.esti = 2;

  // Fresh grid targets initialization directly via initPerShiftTargetsForClass
  const targets = S.initPerShiftTargetsForClass('ESTI');
  assert.ok(targets, 'initPerShiftTargetsForClass returned targets');

  // Verify fresh grid initialized non-zero targets for ESTI summing to 2
  const sumTargets = Object.values(targets).reduce((acc, t) => acc + (+t.M || 0) + (+t.F || 0), 0);
  assert.equal(sumTargets, 2, 'Fresh grid initialized targets sum to ESTI total 2');

  S.generateClass('ESTI', targets);

  const estiLines = S.state.lines.filter(l => S.belongsToClass(l, 'ESTI'));
  assert.equal(estiLines.length, 2, 'Generated exactly 2 ESTI lines');
  estiLines.forEach(l => {
    assert.equal(l.function, 'TRAINING', 'Function is TRAINING, not shortfall "-"');
    assert.equal(l.isTraining, true, 'isTraining is true');
  });
});

test('Modal-5 Test 3: Locked STSO id 10001 plus new lines results in all unique IDs', () => {
  const S = createMockScheduler();
  S.state.stsoM = 2; S.state.stsoF = 1; // Total 3 lines

  const lockedLine = {
    id: 10001,
    lineCode: 'STSO 002',
    shiftId: 'S1',
    empClass: 'STSO',
    position: 'STSO',
    isStso: true,
    sex: 'M',
    function: 'PAX',
    rdoDays: [0, 6],
    locked: true
  };

  S.state.lines = [lockedLine];
  S.isLineScheduleLocked = (l) => l.id === 10001 || l.locked === true;

  S.generateClass('STSO');

  const stsoLines = S.state.lines.filter(l => S.belongsToClass(l, 'STSO'));
  assert.equal(stsoLines.length, 3, 'Total STSO lines = 3');

  const ids = stsoLines.map(l => l.id);
  const uniqueIds = new Set(ids);
  assert.equal(ids.length, uniqueIds.size, 'All STSO line IDs are unique (no duplicates of 10001)');
});

test('Half-3 Test 1: On a shift with 2 men on Friday–Saturday and 2 women on Sunday–Monday, swap one man with one woman so each pattern ends 1 and 1', () => {
  const S = createMockScheduler();
  S.state.shifts = [
    { id: 'S1', name: '0330', start: '03:30', end: '12:00', paid: 8 },
    { id: 'S2', name: '1200', start: '12:00', end: '20:30', paid: 8 }
  ];

  // S1 has 2 M on Fri-Sat [5, 6] and 2 F on Sun-Mon [0, 1]
  // S2 has 2 M on Mon-Tue [1, 2] and 2 F on Mon-Tue [1, 2]
  S.state.lines = [
    { id: 101, shiftId: 'S1', empClass: 'LTSO', isLtso: true, sex: 'M', rdoDays: [5, 6] },
    { id: 102, shiftId: 'S1', empClass: 'LTSO', isLtso: true, sex: 'M', rdoDays: [5, 6] },
    { id: 103, shiftId: 'S1', empClass: 'LTSO', isLtso: true, sex: 'F', rdoDays: [0, 1] },
    { id: 104, shiftId: 'S1', empClass: 'LTSO', isLtso: true, sex: 'F', rdoDays: [0, 1] },

    { id: 201, shiftId: 'S2', empClass: 'LTSO', isLtso: true, sex: 'M', rdoDays: [1, 2] },
    { id: 202, shiftId: 'S2', empClass: 'LTSO', isLtso: true, sex: 'M', rdoDays: [1, 2] },
    { id: 203, shiftId: 'S2', empClass: 'LTSO', isLtso: true, sex: 'F', rdoDays: [1, 2] },
    { id: 204, shiftId: 'S2', empClass: 'LTSO', isLtso: true, sex: 'F', rdoDays: [1, 2] }
  ];

  const res = S.checkParity('LTSO', []);
  assert.ok(res.proposals.length > 0, 'Proposals generated');

  // Find proposal for S1
  const propS1 = res.proposals.find(p => p.shiftId === 'S1');
  assert.ok(propS1, 'Found proposal for S1');

  // Assert line IDs and sexes from before the swap
  const lineA_before = S.state.lines.find(l => l.id === propS1.lineA.id);
  const lineB_before = S.state.lines.find(l => l.id === propS1.lineB.id);

  assert.ok(lineA_before, 'Line A exists before swap');
  assert.ok(lineB_before, 'Line B exists before swap');
  assert.equal(lineA_before.sex, 'F', 'Line A is Female before swap');
  assert.equal(lineB_before.sex, 'M', 'Line B is Male before swap');
  assert.deepEqual(lineA_before.rdoDays, [0, 1], 'Line A is Sun-Mon before swap');
  assert.deepEqual(lineB_before.rdoDays, [5, 6], 'Line B is Fri-Sat before swap');

  // Assert that RDOs exchange patterns: Line A (Female) gets Fri-Sat [5, 6], Line B (Male) gets Sun-Mon [0, 1]
  assert.deepEqual(propS1.rdoA_after, [5, 6], 'Female line A gains Fri-Sat [5, 6]');
  assert.deepEqual(propS1.rdoB_after, [0, 1], 'Male line B gains Sun-Mon [0, 1] (FAILS if written onto Fri-Sat [5, 6])');

  // Approve all proposals
  const pairs = res.proposals.map(p => ({
    lineAId: p.lineA.id,
    lineBId: p.lineB.id,
    rdoA_after: p.rdoA_after,
    rdoB_after: p.rdoB_after
  }));
  S.approveParitySwaps(pairs);

  // Verify S1 now has 1 man and 1 woman on Friday–Saturday and 1 man and 1 woman on Sunday–Monday
  const s1Lines = S.state.lines.filter(l => l.shiftId === 'S1');
  const s1_friSat_M = s1Lines.filter(l => l.sex === 'M' && l.rdoDays.includes(5) && l.rdoDays.includes(6)).length;
  const s1_friSat_F = s1Lines.filter(l => l.sex === 'F' && l.rdoDays.includes(5) && l.rdoDays.includes(6)).length;
  const s1_sunMon_M = s1Lines.filter(l => l.sex === 'M' && l.rdoDays.includes(0) && l.rdoDays.includes(1)).length;
  const s1_sunMon_F = s1Lines.filter(l => l.sex === 'F' && l.rdoDays.includes(0) && l.rdoDays.includes(1)).length;

  assert.equal(s1_friSat_M, 1, 'S1 has 1 man on Fri-Sat');
  assert.equal(s1_friSat_F, 1, 'S1 has 1 woman on Fri-Sat');
  assert.equal(s1_sunMon_M, 1, 'S1 has 1 man on Sun-Mon');
  assert.equal(s1_sunMon_F, 1, 'S1 has 1 woman on Sun-Mon');

  // Verify S2 reaches that same pair size for each pattern (1 man and 1 woman on Fri-Sat, 1 man and 1 woman on Sun-Mon)
  const s2Lines = S.state.lines.filter(l => l.shiftId === 'S2');
  const s2_friSat_M = s2Lines.filter(l => l.sex === 'M' && l.rdoDays.includes(5) && l.rdoDays.includes(6)).length;
  const s2_friSat_F = s2Lines.filter(l => l.sex === 'F' && l.rdoDays.includes(5) && l.rdoDays.includes(6)).length;
  const s2_sunMon_M = s2Lines.filter(l => l.sex === 'M' && l.rdoDays.includes(0) && l.rdoDays.includes(1)).length;
  const s2_sunMon_F = s2Lines.filter(l => l.sex === 'F' && l.rdoDays.includes(0) && l.rdoDays.includes(1)).length;

  assert.equal(s2_friSat_M, 1, 'S2 reaches 1 man on Fri-Sat');
  assert.equal(s2_friSat_F, 1, 'S2 reaches 1 woman on Fri-Sat');
  assert.equal(s2_sunMon_M, 1, 'S2 reaches 1 man on Sun-Mon');
  assert.equal(s2_sunMon_F, 1, 'S2 reaches 1 woman on Sun-Mon');
});

test('Half-2 Test 2: Sunday-Monday at 1 and 1 on S1 proposes 1 and 1 on S2', () => {
  const S = createMockScheduler();
  S.state.shifts = [
    { id: 'S1', name: '0330', start: '03:30', end: '12:00', paid: 8 },
    { id: 'S2', name: '1200', start: '12:00', end: '20:30', paid: 8 }
  ];

  // S1 has 1 M & 1 F on Sun-Mon [0, 1]
  // S2 has 1 M & 1 F on Mon-Tue [1, 2]
  S.state.lines = [
    { id: 1, shiftId: 'S1', empClass: 'TSO', sex: 'M', rdoDays: [0, 1] },
    { id: 2, shiftId: 'S1', empClass: 'TSO', sex: 'F', rdoDays: [0, 1] },

    { id: 3, shiftId: 'S2', empClass: 'TSO', sex: 'M', rdoDays: [1, 2] },
    { id: 4, shiftId: 'S2', empClass: 'TSO', sex: 'F', rdoDays: [1, 2] }
  ];

  const res = S.checkParity('TSO', []);
  assert.ok(res.proposals.length > 0, 'Proposals generated for S2');

  const s2Prop = res.proposals.find(p => p.shiftId === 'S2');
  assert.ok(s2Prop, 'Found proposal for S2');

  // Approve swap
  S.approveParitySwaps([{
    lineAId: s2Prop.lineA.id,
    lineBId: s2Prop.lineB.id,
    rdoA_after: s2Prop.rdoA_after,
    rdoB_after: s2Prop.rdoB_after
  }]);

  const s2Lines = S.state.lines.filter(l => l.shiftId === 'S2');
  const s2M_sunMon = s2Lines.filter(l => l.sex === 'M' && l.rdoDays.includes(0) && l.rdoDays.includes(1)).length;
  const s2F_sunMon = s2Lines.filter(l => l.sex === 'F' && l.rdoDays.includes(0) && l.rdoDays.includes(1)).length;
  assert.equal(s2M_sunMon, 1, 'S2 has 1 M on Sun-Mon');
  assert.equal(s2F_sunMon, 1, 'S2 has 1 F on Sun-Mon');
});

test('Half-2 Test 3: Midweek-only pattern is not proposed', () => {
  const S = createMockScheduler();
  S.state.shifts = [
    { id: 'S1', name: '0330', start: '03:30', end: '12:00', paid: 8 },
    { id: 'S2', name: '1200', start: '12:00', end: '20:30', paid: 8 }
  ];

  // Only midweek patterns exist on all lines
  S.state.lines = [
    { id: 1, shiftId: 'S1', empClass: 'LTSO', sex: 'M', rdoDays: [1, 2] },
    { id: 2, shiftId: 'S1', empClass: 'LTSO', sex: 'M', rdoDays: [1, 2] },
    { id: 3, shiftId: 'S1', empClass: 'LTSO', sex: 'F', rdoDays: [3, 4] },

    { id: 4, shiftId: 'S2', empClass: 'LTSO', sex: 'M', rdoDays: [2, 3] },
    { id: 5, shiftId: 'S2', empClass: 'LTSO', sex: 'F', rdoDays: [3, 4] }
  ];

  const res = S.checkParity('LTSO', []);
  assert.equal(res.proposals.length, 0, 'No proposals created for midweek-only patterns');
});

test('Half-2 Test 4: One sex holding every weekend RDO on a shift does not report "Patterns are balanced."', () => {
  const S = createMockScheduler();
  S.state.shifts = [
    { id: 'S1', name: '0330', start: '03:30', end: '12:00', paid: 8 }
  ];

  // S1 has 2 M on Sat-Sun [0, 6] and 0 F on Sat-Sun [0, 6], no donor F available
  S.state.lines = [
    { id: 1, shiftId: 'S1', empClass: 'TSO', sex: 'M', rdoDays: [0, 6] },
    { id: 2, shiftId: 'S1', empClass: 'TSO', sex: 'M', rdoDays: [0, 6] }
  ];

  const res = S.checkParity('TSO', []);
  assert.notEqual(res.summary, 'Class TSO: Patterns are balanced.', 'Summary does not report Patterns are balanced.');
  assert.ok(res.shortfalls.length > 0 || res.disparities.length > 0, 'Disparity or shortfall reported');
});
