export function $(id) {
  return document.getElementById(id);
}

export function setInputValue(id, value) {
  var el = $(id);
  if (el != null && value != null) el.value = value;
}
