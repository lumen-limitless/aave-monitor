import cron, { type ScheduledTask } from "node-cron";

import { getAaveAccountData, isHealthFactorBelowThreshold } from "./aave";
import { sendHealthFactorAlert } from "./email";

interface MonitorState {
  isRunning: boolean;
  lastCheck: Date | null;
  lastNotification: Date | null;
  currentHealthFactor: number | null;
  error: string | null;
  checkCount: number;
}

// Global state for the monitor
const monitorState: MonitorState = {
  isRunning: false,
  lastCheck: null,
  lastNotification: null,
  currentHealthFactor: null,
  error: null,
  checkCount: 0,
};

// Cooldown period between notifications (1 hour)
const NOTIFICATION_COOLDOWN_MS = 60 * 60 * 1000;

let cronJob: ScheduledTask | null = null;

/**
 * Check health factor and send notification if needed
 */
async function checkHealthFactor(): Promise<void> {
  const monitoredAddress = process.env.MONITORED_ADDRESS;
  const thresholdStr = process.env.HEALTH_FACTOR_THRESHOLD;

  if (!monitoredAddress) {
    monitorState.error = "MONITORED_ADDRESS is not set";
    console.error(monitorState.error);
    return;
  }

  if (!thresholdStr) {
    monitorState.error = "HEALTH_FACTOR_THRESHOLD is not set";
    console.error(monitorState.error);
    return;
  }

  const threshold = Number.parseFloat(thresholdStr);

  try {
    console.log(`[${new Date().toISOString()}] Checking health factor...`);

    const accountData = await getAaveAccountData(monitoredAddress);
    const { healthFactorNumeric } = accountData;

    monitorState.lastCheck = new Date();
    monitorState.currentHealthFactor = healthFactorNumeric;
    monitorState.error = null;
    monitorState.checkCount++;

    console.log(
      `Health factor: ${healthFactorNumeric.toFixed(4)} | Threshold: ${threshold}`
    );

    // Check if health factor is below threshold
    if (isHealthFactorBelowThreshold(healthFactorNumeric, threshold)) {
      // Check cooldown period to avoid spamming
      const now = Date.now();
      const lastNotificationTime =
        monitorState.lastNotification?.getTime() || 0;
      const timeSinceLastNotification = now - lastNotificationTime;

      if (timeSinceLastNotification >= NOTIFICATION_COOLDOWN_MS) {
        console.log(
          `⚠️  Health factor ${healthFactorNumeric.toFixed(4)} is below threshold ${threshold}. Sending notification...`
        );

        const result = await sendHealthFactorAlert({
          address: monitoredAddress,
          healthFactor: accountData.healthFactor,
          threshold: threshold.toString(),
          totalCollateral: Number.parseFloat(
            accountData.totalCollateralBase
          ).toFixed(2),
          totalDebt: Number.parseFloat(accountData.totalDebtBase).toFixed(2),
        });

        if (result.success) {
          monitorState.lastNotification = new Date();
          console.log("✅ Notification sent successfully");
        } else {
          console.error(`❌ Failed to send notification: ${result.error}`);
        }
      } else {
        const minutesRemaining = Math.ceil(
          (NOTIFICATION_COOLDOWN_MS - timeSinceLastNotification) / 1000 / 60
        );
        console.log(
          `⏱️  Notification cooldown active. Next notification available in ${minutesRemaining} minutes.`
        );
      }
    } else {
      console.log(
        `✅ Health factor is healthy (${healthFactorNumeric.toFixed(4)})`
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    monitorState.error = errorMessage;
    console.error(`❌ Error checking health factor: ${errorMessage}`);
  }
}

/**
 * Start the monitoring service
 */
export function startMonitor(): {
  success: boolean;
  message: string;
  schedule?: string;
} {
  if (monitorState.isRunning) {
    return {
      success: false,
      message: "Monitor is already running",
    };
  }

  const cronSchedule = process.env.CRON_SCHEDULE || "*/5 * * * *";

  // Validate cron schedule
  if (!cron.validate(cronSchedule)) {
    return {
      success: false,
      message: `Invalid cron schedule: ${cronSchedule}`,
    };
  }

  // Run an initial check
  checkHealthFactor();

  // Schedule periodic checks
  cronJob = cron.schedule(cronSchedule, checkHealthFactor);

  monitorState.isRunning = true;

  console.log(`🚀 Aave Monitor started with schedule: ${cronSchedule}`);

  return {
    success: true,
    message: "Monitor started successfully",
    schedule: cronSchedule,
  };
}

/**
 * Stop the monitoring service
 */
export function stopMonitor(): { success: boolean; message: string } {
  if (!monitorState.isRunning) {
    return {
      success: false,
      message: "Monitor is not running",
    };
  }

  if (cronJob) {
    cronJob.stop();
    cronJob = null;
  }

  monitorState.isRunning = false;

  console.log("🛑 Aave Monitor stopped");

  return {
    success: true,
    message: "Monitor stopped successfully",
  };
}

/**
 * Get current monitor state
 */
export function getMonitorState(): MonitorState {
  return { ...monitorState };
}

/**
 * Force an immediate health factor check
 */
export async function forceCheck(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await checkHealthFactor();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
