/** Rotation Builder — checkpoint rotation sheet. The only scheduler read is the #bLines click. */
import { attachRotation, bindRotation } from "./actions/bind.js";

export function initRotationBuilder(scheduler) {
  const host = scheduler || (typeof window !== "undefined" ? window.Scheduler : null);
  attachRotation(host);
  bindRotation(host);
}
