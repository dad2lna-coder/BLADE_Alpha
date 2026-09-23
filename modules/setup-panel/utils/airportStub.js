/** Airfield modal/boot deleted. Tiny stub so Capacity/IO do not explode. Rebuild later. */
function emptyConfig(S) {
  return {
    startTime: (S.state && S.state.open) || "03:30",
    endTime: (S.state && S.state.close) || "23:00",
    volumePerHour: { STD: 150, PRE: 240, MIX: 195 },
    terminals: []
  };
}

export function attachAirportStub(S) {
  if (!S) return;
  if (!S.state.airportConfig) S.state.airportConfig = emptyConfig(S);
  S.getAirportConfig = function () {
    return S.state.airportConfig || emptyConfig(S);
  };
  S.initAirportConfig = function () {};
  S.openAirfieldConfirm = function () { return false; };
  S.confirmAirfieldConfig = function () { return Promise.resolve(); };
  S.markAirfieldDirty = function () {};
  S.importAirfieldFile = function () {
    if (S.updateStatus) S.updateStatus("Airfield import removed — rebuild that module.");
  };
  var btn = document.getElementById("btn-airport-config");
  if (btn && !btn._setupStub) {
    btn._setupStub = true;
    btn.addEventListener("click", function () {
      if (S.updateStatus) S.updateStatus("Airfield config removed. Rebuild as its own module.");
    });
  }
}
