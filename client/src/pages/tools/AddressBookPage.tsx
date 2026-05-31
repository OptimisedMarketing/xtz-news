import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, Plus, Trash2, Edit2, Check, X, Copy, ExternalLink, BookOpen } from "lucide-react";
import { useAddressBook } from "@/hooks/useAddressBook";
import { toast } from "sonner";
import { useSEO, buildToolSchema } from "@/hooks/useSEO";

export default function AddressBookPage() {
  useSEO({
    title: "Tezos Address Book — Save & Label Wallets | XTZ.News",
    description: "Save and label your frequently-used Tezos addresses. Stored locally in your browser — no account needed. One-click access to wallet tools.",
    keywords: "Tezos address book, save Tezos addresses, XTZ wallet labels, Tezos wallet manager",
    canonical: "https://xtz.news/tools/address-book",
    jsonLd: buildToolSchema({ name: "Tezos Address Book", description: "Save and label your frequently-used Tezos addresses. Stored locally in your browser — no account needed. One-click access to wallet tools.", url: "https://xtz.news/tools/address-book" }),
  });

  const { entries, addEntry, removeEntry, updateLabel, hasEntry } = useAddressBook();
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [addError, setAddError] = useState("");

  const handleAdd = () => {
    const addr = newAddress.trim();
    if (!addr) { setAddError("Please enter an address."); return; }
    if (!addr.startsWith("tz") && !addr.startsWith("KT")) { setAddError("Must be a valid Tezos address (tz1/tz2/tz3/KT1)."); return; }
    addEntry(addr, newLabel);
    setNewAddress("");
    setNewLabel("");
    setAddError("");
    toast.success(`${newLabel || addr.slice(0, 12) + "…"} saved to address book!`);
  };

  const handleEdit = (address: string, currentLabel: string) => {
    setEditingAddress(address);
    setEditLabel(currentLabel);
  };

  const handleSaveEdit = (address: string) => {
    if (editLabel.trim()) {
      updateLabel(address, editLabel);
      toast.success("Label updated!");
    }
    setEditingAddress(null);
  };

  const handleRemove = (address: string, label: string) => {
    removeEntry(address);
    toast.success(`${label} removed from address book.`);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied!");
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/tools" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Tools</Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Address Book</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📒</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Address Book</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Save and label your frequently-used Tezos addresses — stored locally in your browser</p>
            </div>
          </div>

          {/* Add new address */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "10px", padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.875rem" }}>Add Address</div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input value={newAddress} onChange={(e) => { setNewAddress(e.target.value); setAddError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="tz1… or KT1… address"
                style={{ flex: "2 1 260px", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.07)", border: `1px solid ${addError ? "rgba(239,68,68,0.5)" : "rgba(44,125,247,0.25)"}`, borderRadius: "6px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "monospace", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = addError ? "rgba(239,68,68,0.5)" : "rgba(44,125,247,0.25)")} />
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Label (e.g. My Wallet, Trading)"
                style={{ flex: "1 1 180px", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              <button onClick={handleAdd}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.6rem 1.25rem", background: "#2c7df7", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                <Plus size={14} /> Save Address
              </button>
            </div>
            {addError && <div style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: "0.4rem" }}>{addError}</div>}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📒</div>
            <p style={{ fontSize: "0.9rem" }}>No saved addresses yet. Add your first address above.</p>
            <p style={{ fontSize: "0.78rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.2)" }}>Addresses are saved in your browser's local storage — no account needed.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                <strong style={{ color: "#fff" }}>{entries.length}</strong> saved address{entries.length !== 1 ? "es" : ""}
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>Stored locally in your browser</div>
            </div>

            {entries.map((entry) => (
              <div key={entry.address} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1.25rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", flexWrap: "wrap" }}>
                {/* Label / edit */}
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  {editingAddress === entry.address ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(entry.address); if (e.key === "Escape") setEditingAddress(null); }}
                        autoFocus
                        style={{ padding: "0.3rem 0.6rem", background: "rgba(255,255,255,0.08)", border: "1px solid #2c7df7", borderRadius: "4px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", width: "160px" }} />
                      <button onClick={() => handleSaveEdit(entry.address)} style={{ background: "none", border: "none", cursor: "pointer", color: "#22c55e", display: "flex" }}><Check size={14} /></button>
                      <button onClick={() => setEditingAddress(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><X size={14} /></button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{entry.label}</span>
                      <button onClick={() => handleEdit(entry.address, entry.label)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", display: "flex", padding: "1px" }}>
                        <Edit2 size={11} />
                      </button>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem" }}>
                    <code style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{entry.address}</code>
                    <button onClick={() => copy(entry.address)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", display: "flex", padding: "1px" }}>
                      <Copy size={10} />
                    </button>
                  </div>
                </div>

                {/* Quick action buttons */}
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap" }}>
                  <Link href={`/tools/wallet?address=${entry.address}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "5px", color: "#2c7df7", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700 }}>
                    🔍 Inspect
                  </Link>
                  <Link href={`/tools/nft-gallery?address=${entry.address}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "5px", color: "#8b5cf6", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700 }}>
                    🖼️ NFTs
                  </Link>
                  <Link href={`/tools/rewards?address=${entry.address}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "5px", color: "#22c55e", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700 }}>
                    💰 Rewards
                  </Link>
                  <Link href={`/explorer/address/${entry.address}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700 }}>
                    Explorer
                  </Link>
                  <button onClick={() => handleRemove(entry.address, entry.label)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.75rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "5px", color: "rgba(239,68,68,0.6)", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.15)"; (e.currentTarget as HTMLElement).style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.6)"; }}>
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
