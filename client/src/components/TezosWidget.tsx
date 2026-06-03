/**
 * TezosWidget — embeds live tezos.systems widgets
 * 
 * Available widgets:
 * - baker-count: Active bakers count
 * - xtz-price: XTZ price + 24h change
 * - block-height: Live block ticker
 * - staking-ratio: Staking ratio gauge
 * - protocol: Current protocol name
 * - governance: Voting period info
 * - baker-card: Baker report (requires baker param)
 * - combo-strip: Multi-stat strip
 * 
 * Themes: abyss | matrix | void | ember | signal | nerv | clean | dark | bubblegum | moss | warzone
 */

interface TezosWidgetProps {
  widget: 'baker-count' | 'price' | 'xtz-price' | 'block-height' | 'staking-ratio' | 'protocol' | 'governance' | 'baker-card' | 'combo-strip' | 'combo';
  theme?: string;
  width?: number;
  height?: number;
  baker?: string; // for baker-card widget
  accent?: string; // hex colour without # e.g. '2c7df7'
  refresh?: number; // seconds
  style?: React.CSSProperties;
  className?: string;
}

export default function TezosWidget({
  widget,
  theme = 'abyss',
  width = 300,
  height = 120,
  baker,
  accent,
  refresh = 60,
  style,
  className,
}: TezosWidgetProps) {
  let src = `https://tezos.systems/widgets/${widget}.html?theme=${theme}`;
  if (accent) src += `&accent=${accent.replace('#', '')}`;
  if (baker) src += `&baker=${encodeURIComponent(baker)}`;
  if (refresh !== 60) src += `&refresh=${refresh}`;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, ...style }}
      className={className}
    >
      <iframe
        src={src}
        width={width}
        height={height}
        frameBorder={0}
        scrolling="no"
        title={`Tezos ${widget} widget`}
        style={{ display: 'block', border: 'none' }}
      />
      {/* Overlay to cover the tezos.systems watermark at the bottom of each widget */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '16px',
        background: '#0A0E1A', // matches the Abyss theme bg
        pointerEvents: 'none',
        borderRadius: '0 0 8px 8px',
      }} />
    </div>
  );
}
