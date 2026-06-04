import { logger } from "./logger";

export function audit(action: string, details: Record<string, unknown>) {
  logger.info({ audit: true, action, ...details }, "audit event");
}
