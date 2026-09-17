/** Application state — classic script */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  S.state = {
    open: "03:30",
    close: "23:00",
    useDynamicHours: false,
    dayHours: null,
    startDate: null,
    weekCount: 1,
    ftM: 10,
    ftF: 10,
    ptM: 4,
    ptF: 4,
    ltsoM: 1,
    ltsoF: 1,
    stsoM: 2,
    stsoF: 2,
    certDfoMax: 0,
    certPaxMax: 0,
    certBagMax: 0,
    certDfoEnabled: true,
    certBagEnabled: true,
    functionRotation: {},
    functionCoverage: {
      mode: "none",
      poolStsoDfoM: 0,
      poolStsoDfoF: 0,
      poolLtsoDfoM: 0,
      poolLtsoDfoF: 0,
      poolTsoDfoM: 0,
      poolTsoDfoF: 0,
      poolStsoBagM: 0,
      poolStsoBagF: 0,
      poolLtsoBagM: 0,
      poolLtsoBagF: 0,
      poolTsoBagM: 0,
      poolTsoBagF: 0,
      poolStsoDfo: 0,
      poolLtsoDfo: 0,
      poolTsoDfo: 0,
      poolBag: 0,
      amPmSplit: true,
      phaseThresholdMin: 15,
      bias: "none",
      requirements: { STSO: {}, LTSO: {}, TSO: {} },
      requirementShiftIds: []
    },
    shifts: S.defaultShifts(),
    lines: [],
    schedule: {},
    extraPositions: [],
    issues: [],
    mode: "—"
  };
  S.shiftSeq = 6;
})(window.Scheduler);
