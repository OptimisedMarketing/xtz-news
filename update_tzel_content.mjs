import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/ubuntu/xtz-news/.env' });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const content = `
<p>A new privacy-focused rollup called TzEL has launched on the Tezos testnet, bringing post-quantum cryptography to private payments in what developers describe as the first working prototype of its kind. The launch, announced on 14 May 2026, addresses growing concerns about the vulnerability of current blockchain privacy solutions to future quantum computing attacks.</p>

<div class="key-facts">
  <h4>Key Facts</h4>
  <ul>
    <li>First working prototype of a post-quantum private payment system on a public blockchain</li>
    <li>Uses zk-STARK proofs (~300KB) — significantly larger than current privacy proofs</li>
    <li>Leverages Tezos' Data Availability Layer (DAL), integrated in 2024</li>
    <li>Supports encrypted payment memos, viewing keys, and detector keys</li>
    <li>Currently live on Tezos testnet</li>
  </ul>
</div>

<hr class="section-divider" />

<h2>The Quantum Threat to Blockchain Privacy</h2>

<p>The timing reflects a shift in how the blockchain industry views quantum threats. In recent months, concerns around the quantum threat facing blockchains have increasingly moved from academic curiosity into practical risk management. Privacy on blockchains today relies on elliptic curve cryptography that quantum computers will break.</p>

<p>Critically, while existing systems can keep a payment private today, the associated encrypted note payloads and memos are permanently recorded on-chain, presenting malicious actors with a real opportunity to harvest data now for decryption later.</p>

<h2>How TzEL Solves It</h2>

<p>TzEL neutralizes this threat by implementing quantum-resistant cryptography for both payments and the associated data. The system ensures users can continue to transact privately, with full control over who can view transaction data through features like encrypted payment memos, viewing keys, and detector keys.</p>

<div class="pull-quote">
  "Private transactions have a long memory: the data encrypted today may still be around when tomorrow's attacks arrive. With TzEL, we set out to build a shielded ledger for Tezos whose privacy stack is post-quantum end to end."
  <cite>— Arthur Breitman, Co-founder of Tezos</cite>
</div>

<h2>The Technical Challenge: Proof Size</h2>

<p>The development team faced significant technical hurdles in bringing the system to life. One particular technical challenge involved in building a post-quantum privacy system has been the size of the cryptographic proofs. The quantum-resistant zk-STARK proofs used by TzEL are around 300KB — much larger than currently used privacy proofs — which make post-quantum private systems economically and technically prohibitive for many blockchains.</p>

<h2>The Tezos DAL Advantage</h2>

<p>TzEL overcomes this obstacle by utilizing Tezos' built-in Data Availability Layer (DAL). Integrated into the Tezos protocol in 2024, the DAL significantly increases the amount of transaction data that can be published on-chain, making it possible to offer a full private transaction stack without congesting the network.</p>

<h2>Looking Ahead</h2>

<p>While still in development, and while Tezos itself is still only beginning to transition to post-quantum cryptography, TzEL demonstrates that private, post-quantum transactions are achievable today, and points toward a future where long-term transaction privacy is the baseline, not the exception.</p>

<p>More information about TzEL is available at <a href="http://tzel.tezos.com" rel="nofollow noopener noreferrer" target="_blank">tzel.tezos.com</a>.</p>
`;

const [result] = await conn.query(
  `UPDATE posts SET content = ? WHERE slug = 'introducing-tzel-private-post-quantum-payments-live-on-tezos-testnet'`,
  [content.trim()]
);

console.log(`Updated ${result.affectedRows} row(s)`);
await conn.end();
