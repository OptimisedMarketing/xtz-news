import React from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, FlaskConical, ShieldCheck } from "lucide-react";

export default function PostQuantumHomepageFeature() {
  return (
    <section aria-labelledby="post-quantum-home-title" className="post-quantum-home-feature">
      <div className="container">
        <div className="post-quantum-home-feature__shell">
          <div className="post-quantum-home-feature__mark" aria-hidden="true"><ShieldCheck size={27} /></div>
          <div className="post-quantum-home-feature__content">
            <p><FlaskConical size={14} aria-hidden="true" /> Post-quantum research</p>
            <h2 id="post-quantum-home-title">Understand <code>tz5</code> before you encounter it.</h2>
            <p className="post-quantum-home-feature__lede">A calm, plain-English guide to Tezos’ testnet-stage post-quantum account research—what the prefix means, what has not changed, and how to recognise trusted future testing information.</p>
            <div className="post-quantum-home-feature__actions">
              <Link href="/guides/tz5-wallet" className="post-quantum-home-feature__primary">Read the tz5 wallet guide <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/post-quantum" className="post-quantum-home-feature__secondary"><BookOpenCheck size={16} aria-hidden="true" /> Explore the resource hub</Link>
            </div>
          </div>
          <aside aria-label="Current tz5 status" className="post-quantum-home-feature__status">
            <span>Current status</span>
            <strong>Testnet-stage research</strong>
            <p>Not an ordinary Mainnet wallet migration.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
