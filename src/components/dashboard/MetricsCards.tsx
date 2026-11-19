import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '../../stores/dashboardStore'
import { CardSkeleton } from '../common/LoadingSkeleton'
import { HIGH_RISK_TYPES } from '../../utils/riskLevel'
import { Tooltip } from '../common/Tooltip'

// Etherscan-style outline icons (light gray/white)
const IconBTC = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.688 11.7181C7.97067 12.2968 8.78133 7.70146 5.49867 7.12212M4.688 11.7181L0.75 11.0235M4.688 11.7181L4.45733 13.0315M2.87267 6.65946L5.49933 7.12212C8.782 7.70146 9.59267 3.10546 6.30933 2.52679L2.37 1.83212M6.30867 2.52679L6.54067 1.21346M1.83 12.5681L3.914 0.750122" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

)
const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_78_9390)">
      <path d="M14.4866 12L9.15329 2.66665C9.037 2.46146 8.86836 2.29078 8.66457 2.17203C8.46078 2.05329 8.22915 1.99072 7.99329 1.99072C7.75743 1.99072 7.52579 2.05329 7.322 2.17203C7.11822 2.29078 6.94958 2.46146 6.83329 2.66665L1.49995 12C1.38241 12.2036 1.32077 12.4346 1.32129 12.6697C1.32181 12.9047 1.38447 13.1355 1.50292 13.3385C1.62136 13.5416 1.79138 13.7097 1.99575 13.8259C2.20011 13.942 2.43156 14.0021 2.66662 14H13.3333C13.5672 13.9997 13.797 13.938 13.9995 13.8208C14.202 13.7037 14.3701 13.5354 14.487 13.3327C14.6038 13.1301 14.6653 12.9002 14.6653 12.6663C14.6652 12.4324 14.6036 12.2026 14.4866 12Z" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 6V8.66667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 11.3333H8.00667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_78_9390">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>

)
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_78_9973)">
      <path d="M1.33301 14C1.33295 12.9736 1.6291 11.9689 2.1859 11.1066C2.74271 10.2443 3.53652 9.56099 4.47207 9.13869C5.40762 8.71638 6.44517 8.57301 7.46018 8.7258C8.4752 8.87858 9.42456 9.32101 10.1943 10" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.66634 8.66667C8.50729 8.66667 9.99967 7.17428 9.99967 5.33333C9.99967 3.49238 8.50729 2 6.66634 2C4.82539 2 3.33301 3.49238 3.33301 5.33333C3.33301 7.17428 4.82539 8.66667 6.66634 8.66667Z" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12.667 10.6667V14.6667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14.667 12.6667H10.667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </svg>
)
const IconExposedAddresses = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_78_9390)">
      <path d="M14.4866 12L9.15329 2.66665C9.037 2.46146 8.86836 2.29078 8.66457 2.17203C8.46078 2.05329 8.22915 1.99072 7.99329 1.99072C7.75743 1.99072 7.52579 2.05329 7.322 2.17203C7.11822 2.29078 6.94958 2.46146 6.83329 2.66665L1.49995 12C1.38241 12.2036 1.32077 12.4346 1.32129 12.6697C1.32181 12.9047 1.38447 13.1355 1.50292 13.3385C1.62136 13.5416 1.79138 13.7097 1.99575 13.8259C2.20011 13.942 2.43156 14.0021 2.66662 14H13.3333C13.5672 13.9997 13.797 13.938 13.9995 13.8208C14.202 13.7037 14.3701 13.5354 14.487 13.3327C14.6038 13.1301 14.6653 12.9002 14.6653 12.6663C14.6652 12.4324 14.6036 12.2026 14.4866 12Z" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 6V8.66667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 11.3333H8.00667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_78_9390">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
const IconExposedBalance = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_78_9390)">
      <path d="M14.4866 12L9.15329 2.66665C9.037 2.46146 8.86836 2.29078 8.66457 2.17203C8.46078 2.05329 8.22915 1.99072 7.99329 1.99072C7.75743 1.99072 7.52579 2.05329 7.322 2.17203C7.11822 2.29078 6.94958 2.46146 6.83329 2.66665L1.49995 12C1.38241 12.2036 1.32077 12.4346 1.32129 12.6697C1.32181 12.9047 1.38447 13.1355 1.50292 13.3385C1.62136 13.5416 1.79138 13.7097 1.99575 13.8259C2.20011 13.942 2.43156 14.0021 2.66662 14H13.3333C13.5672 13.9997 13.797 13.938 13.9995 13.8208C14.202 13.7037 14.3701 13.5354 14.487 13.3327C14.6038 13.1301 14.6653 12.9002 14.6653 12.6663C14.6652 12.4324 14.6036 12.2026 14.4866 12Z" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 6V8.66667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 11.3333H8.00667" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_78_9390">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
const IconCube = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 5.33335C13.9998 5.09953 13.938 4.86989 13.821 4.66746C13.704 4.46503 13.5358 4.29692 13.3333 4.18002L8.66667 1.51335C8.46397 1.39633 8.23405 1.33472 8 1.33472C7.76595 1.33472 7.53603 1.39633 7.33333 1.51335L2.66667 4.18002C2.46418 4.29692 2.29599 4.46503 2.17897 4.66746C2.06196 4.86989 2.00024 5.09953 2 5.33335V10.6667C2.00024 10.9005 2.06196 11.1301 2.17897 11.3326C2.29599 11.535 2.46418 11.7031 2.66667 11.82L7.33333 14.4867C7.53603 14.6037 7.76595 14.6653 8 14.6653C8.23405 14.6653 8.46397 14.6037 8.66667 14.4867L13.3333 11.82C13.5358 11.7031 13.704 11.535 13.821 11.3326C13.938 11.1301 13.9998 10.9005 14 10.6667V5.33335Z" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M2.2002 4.66669L8.0002 8.00002L13.8002 4.66669" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 14.6667V8" stroke="#3C4654" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)

const IconInfo = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7.33333V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5H8.00667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const MetricRow = ({
  icon: Icon,
  label,
  value,
  subValue,
  valueRed,
  hideBorderOnLarge,
  hideDividerOnLarge,
  hideBorderOnMobile,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: React.ReactNode
  value: React.ReactNode
  subValue?: React.ReactNode
  valueRed?: boolean
  hideBorderOnLarge?: boolean
  hideDividerOnLarge?: boolean
  hideBorderOnMobile?: boolean
}) => (
  <div className="flex flex-1">
    <div className={`flex-1 py-4 px-4 min-h-[100px] border-b border-gray-200 dark:border-zinc-700 ${hideBorderOnLarge ? 'md:border-b-0' : ''} ${hideBorderOnMobile ? 'max-md:border-b-0' : ''}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-5 h-5 mt-0.5 shrink-0 text-gray-400 dark:text-gray-400" />
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
            {label}
          </p>
        </div>
        <div className="flex flex-col justify-end min-h-[53px]">
          {subValue && (
            <p className="mt-0.5 text-xs font-medium text-gray-400 dark:text-gray-400 break-words">
              {subValue}
            </p>
          )}
          <p
            className={`mt-1 text-[22px] font-medium leading-tight break-all ${
              valueRed ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
    <div className={`border-l border-gray-200 dark:border-zinc-700 my-2 hidden md:block ${hideDividerOnLarge ? 'md:hidden' : ''}`}></div>
  </div>
)

export const MetricsCards = () => {
  const { t } = useTranslation()
  const { metrics, supplyStats, bitcoinPrice, isLoadingMetrics } = useDashboardStore()

  const scriptTypeBalances = supplyStats.script_type_balances || {}
  const totalSupply = supplyStats.total_supply_sat || 0

  const fallbackExposedBalance = (() => {
    const riskyTypes = new Set([
      ...HIGH_RISK_TYPES.map(type => type.toLowerCase()),
      'unknown',
      'nonstandard'
    ])
    return Object.entries(scriptTypeBalances).reduce((sum, [type, balance]) => {
      if (riskyTypes.has(type.toLowerCase())) {
        return sum + (balance || 0)
      }
      return sum
    }, 0)
  })()

  const exposedBalance = metrics.exposedBalanceSat ?? fallbackExposedBalance

  const formatBTC = (satoshi: number) => {
    if (satoshi === 0) return '0'
    const btc = satoshi / 100_000_000
    if (btc >= 1_000_000) return `${(btc / 1_000_000).toFixed(2)}M`
    if (btc >= 1_000) return `${(btc / 1_000).toFixed(2)}K`
    return btc.toFixed(8)
  }

  const formatUSD = (satoshi: number) => {
    if (satoshi === 0 || bitcoinPrice === 0) return '$0'
    const btc = satoshi / 100_000_000
    const usd = btc * bitcoinPrice
    if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`
    if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`
    if (usd >= 1_000) return `$${(usd / 1_000).toFixed(2)}K`
    return `$${usd.toFixed(2)}`
  }

  const totalAddressesIndexed = metrics.addressesIndexed || metrics.addressCount || 0
  const exposedAddresses = metrics.exposedAddressCount ?? 0
  const exposurePercentage = totalAddressesIndexed > 0 ? (exposedAddresses / totalAddressesIndexed) * 100 : 0
  const exposedBalancePercentage = totalSupply > 0 ? (exposedBalance / totalSupply) * 100 : 0
  const lastBlockHeight = metrics.currentBitcoinHeight ?? metrics.latestBlock?.height ?? 0

  if (isLoadingMetrics && Object.keys(metrics).length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6">
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div
      id="ContentPlaceHolder1_mainboxes"
      className="card rounded-xl border border-[#E9ECF0] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_4px_14.2px_0_#3C465424] overflow-hidden px-4"
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <MetricRow
            icon={IconBTC}
            label="BTC PRICE"
            value={bitcoinPrice > 0 ? `$${bitcoinPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          />
          <MetricRow
            icon={IconGlobe}
            label={t('metrics.totalSupply')}
            value={`${formatBTC(totalSupply)} BTC`}
            subValue={bitcoinPrice > 0 ? formatUSD(totalSupply) : undefined}
            hideBorderOnLarge
          />
        </div>
        <div className="flex-1">
          <MetricRow
            icon={IconUsers}
            label={t('metrics.addressesIndexed')}
            value={totalAddressesIndexed.toLocaleString()}
          />
          <MetricRow
            icon={IconExposedAddresses}
            label={
              <span className="inline-flex items-center gap-1">
                {t('metrics.exposedAddresses')}
                <Tooltip content="Addresses that are considered exposed due to risky script types or address reuse.">
                  <button
                    type="button"
                    className="inline-flex h-4 w-4 items-center justify-center text-gray-400 dark:border-zinc-600 dark:text-gray-500"
                  >
                    <IconInfo className="h-3 w-3" />
                  </button>
                </Tooltip>
              </span>
            }
            value={exposedAddresses.toLocaleString()}
            subValue={totalAddressesIndexed > 0 ? `${exposurePercentage.toFixed(2)}% ${t('metrics.ofTotal')}` : undefined}
            hideBorderOnLarge
          />
        </div>
        <div className="flex-1">
          <MetricRow
            icon={IconExposedBalance}
            label={
              <span className="inline-flex items-center gap-1">
                {t('metrics.exposedBalance')}
                <Tooltip content="Portion of total BTC supply held in exposed addresses, shown as a percentage and USD value.">
                  <button
                    type="button"
                    className="inline-flex h-4 w-4 items-center justify-center text-gray-400 dark:border-zinc-600 dark:text-gray-500"
                  >
                    <IconInfo className="h-3 w-3" />
                  </button>
                </Tooltip>
              </span>
            }
            value={`${formatBTC(exposedBalance)} BTC`}
            subValue={totalSupply > 0 ? `${exposedBalancePercentage.toFixed(2)}% ${t('metrics.ofTotal')} · ${formatUSD(exposedBalance)}` : formatUSD(exposedBalance)}
            hideDividerOnLarge
          />
          <MetricRow
            icon={IconCube}
            label="LAST BLOCK"
            value={lastBlockHeight > 0 ? lastBlockHeight.toLocaleString() : '—'}
            hideBorderOnLarge
            hideBorderOnMobile
            hideDividerOnLarge
          />
        </div>
      </div>
    </div>
  )
}
