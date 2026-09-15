window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  function defaultBands() {
    return [
      { start: "03:30", end: "04:00", stso: 1, ltso: 1, tso: 2 },
      { start: "04:00", end: "20:30", stso: 1, ltso: 1, tso: 6 },
      { start: "20:30", end: "23:00", stso: 1, ltso: 1, tso: 3 }
    ];
  }
})(window.Scheduler);
