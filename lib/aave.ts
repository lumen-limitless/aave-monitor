import { createPublicClient, formatUnits, http } from "viem";
import { mainnet } from "viem/chains";

// Aave V3 Pool ABI - only the functions we need
const AAVE_POOL_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserAccountData",
    outputs: [
      { internalType: "uint256", name: "totalCollateralBase", type: "uint256" },
      { internalType: "uint256", name: "totalDebtBase", type: "uint256" },
      {
        internalType: "uint256",
        name: "availableBorrowsBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      { internalType: "uint256", name: "ltv", type: "uint256" },
      { internalType: "uint256", name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface AaveAccountData {
  totalCollateralBase: string;
  totalDebtBase: string;
  availableBorrowsBase: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
  healthFactorNumeric: number;
}

/**
 * Get Aave account data for a given address
 */
export async function getAaveAccountData(
  userAddress: string
): Promise<AaveAccountData> {
  const rpcUrl = process.env.ETHEREUM_RPC_URL;
  const poolAddress = process.env.AAVE_V3_POOL_ADDRESS as `0x${string}`;

  if (!rpcUrl) {
    throw new Error("ETHEREUM_RPC_URL is not set");
  }

  if (!poolAddress) {
    throw new Error("AAVE_V3_POOL_ADDRESS is not set");
  }

  // Create a public client for reading from the blockchain
  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  // Call the getUserAccountData function
  const data = await client.readContract({
    address: poolAddress,
    abi: AAVE_POOL_ABI,
    functionName: "getUserAccountData",
    args: [userAddress as `0x${string}`],
  });

  // data is a tuple: [totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor]
  const [
    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
  ] = data;

  // Health factor is returned with 18 decimals
  const healthFactorFormatted = formatUnits(healthFactor, 18);
  const healthFactorNumeric = Number.parseFloat(healthFactorFormatted);

  return {
    totalCollateralBase: formatUnits(totalCollateralBase, 8), // Base currency has 8 decimals
    totalDebtBase: formatUnits(totalDebtBase, 8),
    availableBorrowsBase: formatUnits(availableBorrowsBase, 8),
    currentLiquidationThreshold: currentLiquidationThreshold.toString(),
    ltv: ltv.toString(),
    healthFactor: healthFactorFormatted,
    healthFactorNumeric,
  };
}

/**
 * Check if health factor is below threshold
 */
export function isHealthFactorBelowThreshold(
  healthFactor: number,
  threshold: number
): boolean {
  return healthFactor < threshold && healthFactor > 0;
}

/**
 * Get health factor status and color for UI
 */
export function getHealthFactorStatus(healthFactor: number): {
  status: "safe" | "warning" | "danger" | "none";
  color: string;
  message: string;
} {
  if (healthFactor === 0) {
    return {
      status: "none",
      color: "gray",
      message: "No active position",
    };
  }

  if (healthFactor < 1.1) {
    return {
      status: "danger",
      color: "red",
      message: "Critical - Risk of liquidation",
    };
  }

  if (healthFactor < 1.5) {
    return {
      status: "warning",
      color: "yellow",
      message: "Warning - Health factor is low",
    };
  }

  return {
    status: "safe",
    color: "green",
    message: "Safe - Health factor is healthy",
  };
}
