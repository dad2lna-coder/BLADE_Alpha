/** Rotation Builder — checkpoint rotation sheet. Does not read or write scheduler.state. */
import { attachRotation, bindRotation } from "./actions/bind.js";

export function initRotationBuilder(scheduler) {
  const host = scheduler || (typeof window !== "undefined" ? window.Scheduler : null);
  attachRotation(host);
  bindRotation(host);
}
