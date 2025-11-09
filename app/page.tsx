import { ConfigInfo } from "@/components/config-info";
import { HealthFactorCard } from "@/components/health-factor-card";
import { MonitorControls } from "@/components/monitor-controls";

export const metadata = {
  title: "Aave Health Factor Monitor",
  description:
    "Monitor your Aave health factor and receive email notifications when it drops below your threshold",
};

export default function Page(_props: PageProps<"/">) {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Aave Health Factor Monitor</h1>
        <p className="text-gray-600">
          Track your Aave position and receive alerts when your health factor
          drops below the configured threshold
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <HealthFactorCard />
          <ConfigInfo />
        </div>

        <div>
          <MonitorControls />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-3 font-semibold text-xl">Getting Started</h2>
        <ol className="list-inside list-decimal space-y-2 text-gray-700 text-sm">
          <li>
            Copy{" "}
            <code className="rounded bg-white px-1 py-0.5">.env.example</code>{" "}
            to <code className="rounded bg-white px-1 py-0.5">.env.local</code>{" "}
            and configure your settings
          </li>
          <li>
            Add your Ethereum RPC URL (Infura, Alchemy, etc.) and Resend API key
          </li>
          <li>Set your Ethereum address to monitor and notification email</li>
          <li>
            Click &quot;Start Monitor&quot; to begin tracking your health factor
          </li>
          <li>
            You&apos;ll receive email alerts when your health factor drops below
            the threshold
          </li>
        </ol>

        <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-blue-900 text-sm">
          <p className="font-medium">💡 Important Notes:</p>
          <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
            <li>This monitors Aave V3 on Ethereum mainnet by default</li>
            <li>
              Health factor below 1.0 means your position can be liquidated
            </li>
            <li>Notifications have a 1-hour cooldown to prevent spam</li>
            <li>The monitor runs as a background service using cron jobs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
