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
  widget: 'baker-count' | 'xtz-price' | 'block-height' | 'staking-ratio' | 'protocol' | 'governance' | 'baker-card' | 'combo-strip';
  theme?: string;
  width?: number;
  height?: number;
  baker?: string; // for baker-card widget
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
  refresh = 60,
  style,
  className,
}: TezosWidgetProps) {
  let src = `https://tezos.systems/widgets/${widget}.html?theme=${theme}`;
  if (baker) src += `&baker=${encodeURIComponent(baker)}`;
  if (refresh !== 60) src += `&refresh=${refresh}`;

  return (
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder={0}
      scrolling="no"
      title={`Tezos ${widget} widget`}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'block',
        border: 'none',
        ...style,
      }}
      className={className}
    />
  );
}
