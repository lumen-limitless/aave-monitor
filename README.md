# Aave Health Factor Monitor

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Next.js application that monitors your Aave V3 position's health factor and sends email notifications when it drops below a configured threshold.

## Features

- 📊 Real-time health factor monitoring
- 📧 Email notifications via Resend
- ⏰ Automated checks using cron jobs
- 🎨 Clean, responsive dashboard UI
- ⚡ Built with Next.js 15, TypeScript, and Tailwind CSS
- 🔗 Web3 integration using viem

## How It Works

1. The application connects to Ethereum mainnet via an RPC provider
2. Periodically queries the Aave V3 Pool contract for your account data
3. Checks if your health factor is below the configured threshold
4. Sends email alerts when your position is at risk
5. Includes a 1-hour cooldown between notifications to prevent spam

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.15.4
- An Ethereum RPC provider (Infura, Alchemy, etc.)
- A Resend API key for sending emails
- An Ethereum address with an active Aave V3 position

## Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:

```env
# Application
NEXT_PUBLIC_APP_URL=localhost:3000
NEXT_PUBLIC_APP_NAME=Aave Monitor

# Ethereum RPC URL (required)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Aave V3 Pool contract address on Ethereum mainnet
AAVE_V3_POOL_ADDRESS=0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2

# Your Ethereum address to monitor (required)
MONITORED_ADDRESS=0x1234567890123456789012345678901234567890

# Health factor threshold for notifications (default: 1.5)
HEALTH_FACTOR_THRESHOLD=1.5

# Resend API key (required)
RESEND_API_KEY=re_your_api_key_here

# Email to receive notifications (required)
NOTIFICATION_EMAIL=your-email@example.com

# Cron schedule (default: every 5 minutes)
CRON_SCHEDULE=*/5 * * * *
```

3. **Run the development server:**

```bash
pnpm dev
```

4. **Open the dashboard:**

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Starting the Monitor

1. Open the dashboard in your browser
2. Verify your configuration is displayed correctly
3. Click "Start Monitor" to begin tracking
4. The monitor will check your health factor according to the cron schedule

### Understanding Health Factor

- **Health Factor > 1.5**: Safe - Your position is healthy
- **Health Factor 1.1-1.5**: Warning - Monitor closely
- **Health Factor < 1.1**: Danger - Risk of liquidation
- **Health Factor < 1.0**: Your position can be liquidated!

### Managing Your Position

If you receive a low health factor alert:

1. **Add more collateral** - Deposit additional assets
2. **Repay debt** - Pay back some of your borrowed assets
3. **Close positions** - Reduce exposure if needed

Visit [app.aave.com](https://app.aave.com/) to manage your position.

## API Endpoints

### GET /api/health-factor

Get current health factor and account data.

### POST /api/monitor/start

Start the monitoring service.

### POST /api/monitor/stop

Stop the monitoring service.

### GET /api/monitor/status

Get current monitor status.

### POST /api/monitor/check

Force an immediate health factor check.

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Format code
pnpm format

# Run tests
pnpm test
```

### Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── health-factor/    # Health factor endpoint
│   │   └── monitor/          # Monitor control endpoints
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard page
├── components/               # React components
│   ├── config-info.tsx       # Configuration display
│   ├── health-factor-card.tsx # Health factor card
│   └── monitor-controls.tsx  # Monitor controls
├── lib/                      # Utilities and services
│   ├── aave.ts               # Aave protocol integration
│   ├── email.ts              # Email notification service
│   ├── monitor.ts            # Monitoring service with cron
│   └── utils.ts              # Utility functions
└── types/                    # TypeScript type definitions
```

## Important Notes

- **Mainnet Only**: This application monitors Aave V3 on Ethereum mainnet by default
- **Notification Cooldown**: Emails have a 1-hour cooldown to prevent spam
- **Health Factor Threshold**: A threshold of 1.5 is recommended for safety
- **RPC Limits**: Be aware of your RPC provider's rate limits
- **Email Limits**: Resend has sending limits on free tier

## Security

- Never commit your `.env.local` file
- Keep your API keys secure
- Use environment-specific configurations
- Monitor your RPC provider usage

## Troubleshooting

### Monitor won't start

- Check all environment variables are set correctly
- Verify your RPC URL is accessible
- Ensure the monitored address is valid

### Not receiving emails

- Verify Resend API key is correct
- Check notification email is valid
- Verify email isn't in spam folder
- Check Resend dashboard for delivery status

### Health factor shows 0

- The address may not have an active Aave position
- Verify you're monitoring the correct address
- Check RPC connection is working

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
