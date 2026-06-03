import TezosWidget from './TezosWidget';
import XtzPriceStripWidget from './XtzPriceStripWidget';

/**
 * TezosWidgetsStrip — a horizontal strip of live tezos.systems widgets
 * Used on the home page below the hero section
 */
export default function TezosWidgetsStrip() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #020d1e 0%, #05152e 50%, #020d1e 100%)',
      borderTop: '1px solid rgba(44,125,247,0.15)',
      borderBottom: '1px solid rgba(44,125,247,0.15)',
      padding: '1rem 0',
      overflow: 'hidden',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2px',
        }}>
          {/* Label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexShrink: 0,
            marginRight: '0.25rem',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
              Live Network
            </span>
          </div>

          {/* XTZ Price (USD) — custom widget using our own price data */}
          <XtzPriceStripWidget width={220} height={120} />

          {/* Block Height */}
          <TezosWidget widget="block-height" theme="abyss" accent="2c7df7" width={220} height={120} />

          {/* Baker Count */}
          <TezosWidget widget="baker-count" theme="abyss" accent="2c7df7" width={220} height={120} />

          {/* Staking Ratio */}
          <TezosWidget widget="staking-ratio" theme="abyss" accent="2c7df7" width={220} height={120} />

          {/* Protocol */}
          <TezosWidget widget="protocol" theme="abyss" accent="2c7df7" width={220} height={120} />

          {/* Governance */}
          <TezosWidget widget="governance" theme="abyss" accent="2c7df7" width={220} height={120} />
        </div>
      </div>
      {/* Attribution */}
      <div style={{ textAlign: 'right', padding: '0.3rem 1.25rem 0', maxWidth: '1400px', margin: '0 auto' }}>
        <a
          href="https://tezos.systems"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.15s' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(44,125,247,0.6)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}
        >
          ⬡ Powered by tezos.systems
        </a>
      </div>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
