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
      position: 'relative',
    }}>
      {/* Fade-out gradient on right to indicate scrollability */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        background: 'linear-gradient(to right, transparent, #020d1e)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          paddingLeft: '1.25rem',
          paddingRight: '5rem', // extra right padding so last widget is fully visible
          paddingBottom: '2px',
          width: 'max-content',
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
          <XtzPriceStripWidget width={240} height={140} />

          {/* Block Height */}
          <TezosWidget widget="block-height" theme="abyss" accent="2c7df7" width={240} height={140} />

          {/* Baker Count */}
          <TezosWidget widget="baker-count" theme="abyss" accent="2c7df7" width={240} height={140} />

          {/* Staking Ratio */}
          <TezosWidget widget="staking-ratio" theme="abyss" accent="2c7df7" width={240} height={140} />

          {/* Protocol */}
          <TezosWidget widget="protocol" theme="abyss" accent="2c7df7" width={240} height={140} />

          {/* Governance */}
          <TezosWidget widget="governance" theme="abyss" accent="2c7df7" width={240} height={140} />
        </div>
      </div>

      {/* Attribution */}
      <div style={{ textAlign: 'right', padding: '0.3rem 1.25rem 0', position: 'relative', zIndex: 3 }}>
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
