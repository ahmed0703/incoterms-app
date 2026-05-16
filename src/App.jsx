import { useMemo, useState } from "react";

const BRAND = {
  green: "#005239",
  slate: "#475569",
  border: "#CBD5E1",
  panel: "#F1F5F9",
  seller: "#1D4ED8",
  buyer: "#16A34A",
  sellerLight: "#93C5FD",
  buyerLight: "#86EFAC",
  risk: "#EA580C",
  text: "#0F172A",
};

const LANGS = {
  no: "Norsk",
  en: "English",
};

const UI = {
  no: {
    title: "Incoterms® 2020 – W.R. Berkley Insurance Nordic",
    subtitle: "Les hver term som: Kostnad øverst vs Risiko nederst.",
    tabAll: "Alle Incoterms (11)",
    tabSea: "Kun sjø / innlands vannvei",
    compareOn: "Sammenligning: På",
    compareOff: "Sammenligning: Av",
    pickTerm: "Velg Incoterm",
    compareWith: "Sammenlign med",
    cost: "Kostnad",
    risk: "Risiko",
    seller: "Selger",
    buyer: "Kjøper",
    legendSeller: "Selger",
    legendBuyer: "Kjøper",
    legendRisk: "Risikoovergang",
    claimsSimTitle: "Claims-simulator: «Skade skjer her»",
    liableRisk: "Ansvarlig risiko:",
    claimsHint: "Flytt slideren og se om skaden faller før eller etter risikoovergangen.",
    fcaVariantLabel: "FCA-variant",
    fcaSellerPremises: "Selgers lokaler (lastet)",
    fcaOtherPlace: "Annet sted (ikke avlastet)",
    stageTitle: "Transportløp",
    damagePosition: "Skadepunkt",
    selectedTerm: "Valgt term",
    comparedTerm: "Sammenlignet term",
  },
  en: {
    title: "Incoterms® 2020 – W.R. Berkley Insurance Nordic",
    subtitle: "Read each term as: Cost on top vs Risk below.",
    tabAll: "All Incoterms (11)",
    tabSea: "Sea / inland waterways only",
    compareOn: "Compare: On",
    compareOff: "Compare: Off",
    pickTerm: "Select Incoterm",
    compareWith: "Compare with",
    cost: "Cost",
    risk: "Risk",
    seller: "Seller",
    buyer: "Buyer",
    legendSeller: "Seller",
    legendBuyer: "Buyer",
    legendRisk: "Risk transfer",
    claimsSimTitle: "Claims simulator: “Damage happens here”",
    liableRisk: "Risk party:",
    claimsHint: "Move the slider and see whether damage falls before or after the risk transfer point.",
    fcaVariantLabel: "FCA variant",
    fcaSellerPremises: "Seller’s premises (loaded)",
    fcaOtherPlace: "Other place (not unloaded)",
    stageTitle: "Transport journey",
    damagePosition: "Damage point",
    selectedTerm: "Selected term",
    comparedTerm: "Compared term",
  },
};

const STAGES = {
  no: [
    { key: "factory", label: "Selgers sted", icon: "🏭" },
    { key: "pre", label: "Henting / fortransport", icon: "🚚" },
    { key: "export", label: "Avgangsterminal / havn", icon: "⚓" },
    { key: "main", label: "Hovedtransport", icon: "🚢" },
    { key: "import", label: "Ankomstterminal", icon: "📍" },
    { key: "on", label: "Videre transport", icon: "🚚" },
    { key: "delivered", label: "Levert", icon: "📦" },
    { key: "unloaded", label: "Losset", icon: "✅" },
  ],
  en: [
    { key: "factory", label: "Seller’s place", icon: "🏭" },
    { key: "pre", label: "Pickup / pre-carriage", icon: "🚚" },
    { key: "export", label: "Departure terminal / port", icon: "⚓" },
    { key: "main", label: "Main carriage", icon: "🚢" },
    { key: "import", label: "Arrival terminal", icon: "📍" },
    { key: "on", label: "On-carriage", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "📦" },
    { key: "unloaded", label: "Unloaded", icon: "✅" },
  ],
};

const DP = {
  AT_DISPOSAL_FACTORY: 0,
  FCA_SELLER_PREMISES_LOADED: 1,
  FCA_OTHER_PLACE_NOT_UNLOADED: 2,
  ALONGSIDE_SHIP: 2,
  ON_BOARD_SHIP: 3,
  FIRST_CARRIER: 1,
  PLACE_READY_FOR_UNLOADING: 6,
  PLACE_UNLOADED: 7,
  PLACE_NOT_UNLOADED: 6,
};

const TERMS_ALL_MODES = [
  { code: "EXW", dpStage: DP.AT_DISPOSAL_FACTORY },
  { code: "FCA", dpStage: DP.FCA_SELLER_PREMISES_LOADED },
  { code: "CPT", dpStage: DP.FIRST_CARRIER },
  { code: "CIP", dpStage: DP.FIRST_CARRIER },
  { code: "DAP", dpStage: DP.PLACE_READY_FOR_UNLOADING },
  { code: "DPU", dpStage: DP.PLACE_UNLOADED },
  { code: "DDP", dpStage: DP.PLACE_NOT_UNLOADED },
];

const TERMS_SEA = [
  { code: "FAS", dpStage: DP.ALONGSIDE_SHIP },
  { code: "FOB", dpStage: DP.ON_BOARD_SHIP },
  { code: "CFR", dpStage: DP.ON_BOARD_SHIP },
  { code: "CIF", dpStage: DP.ON_BOARD_SHIP },
];

const ALL_11 = [...TERMS_ALL_MODES, ...TERMS_SEA];

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

function stageToPercent(stageIndex) {
  return clamp((stageIndex / 7) * 100);
}

function Button({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${active ? BRAND.green : BRAND.border}`,
        background: active ? BRAND.green : "white",
        color: active ? "white" : BRAND.text,
        cursor: "pointer",
        fontWeight: 700,
        boxShadow: active ? "0 4px 12px rgba(0,82,57,0.18)" : "none",
        maxWidth: "100%",
        fontSize: "clamp(13px, 3.5vw, 15px)",
        wordBreak: "break-word",
      }}
    >
      {children}
    </button>
  );
}

function Legend({ color, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
      <span style={{ width: 14, height: 14, borderRadius: 99, background: color }} />
      <span>{text}</span>
    </div>
  );
}

function StageTimeline({ stages, activeStage, t }) {
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ color: BRAND.text, marginBottom: 16 }}>{t.stageTitle}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 12,
        }}
      >
        {stages.map((stage, index) => {
          const isActive = index === activeStage;

          return (
            <div
              key={stage.key}
              style={{
                border: `2px solid ${isActive ? BRAND.risk : BRAND.border}`,
                background: isActive ? "#FFF7ED" : "white",
                borderRadius: 16,
                padding: 12,
                minHeight: 105,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 99,
                  background: isActive ? BRAND.risk : BRAND.panel,
                  color: isActive ? "white" : BRAND.text,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                {index + 1}
              </div>

              <div style={{ fontSize: 24 }}>{stage.icon}</div>

              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.text }}>
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Bar({ title, split, marker }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <strong style={{ color: BRAND.text, fontSize: 16 }}>{title}</strong>

      <div style={{ position: "relative", height: 40, borderRadius: 99, overflow: "visible", marginTop: 10 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 99,
            overflow: "hidden",
            display: "flex",
            border: `1px solid ${BRAND.border}`,
          }}
        >
          <div style={{ width: `${split}%`, background: BRAND.seller }} />
          <div style={{ width: `${100 - split}%`, background: BRAND.buyer }} />
        </div>

        {marker && (
          <>
            <div
              style={{
                position: "absolute",
                left: `${split}%`,
                top: -9,
                transform: "translateX(-50%)",
                width: 7,
                height: 56,
                background: BRAND.risk,
                borderRadius: 99,
                zIndex: 5,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${split}%`,
                top: -21,
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "11px solid transparent",
                borderRight: "11px solid transparent",
                borderTop: `14px solid ${BRAND.risk}`,
                zIndex: 6,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Visual({ label, stageIndex, stages, t }) {
  const riskPct = stageToPercent(stageIndex);

  return (
    <section
      style={{
        border: `1px solid ${BRAND.border}`,
        borderRadius: 20,
        padding: "clamp(16px, 3vw, 24px)",
        background: "white",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
      }}
    >
      <h2
        style={{
          color: BRAND.text,
          marginTop: 0,
          textAlign: "center",
          fontSize: "clamp(22px, 4vw, 30px)",
          lineHeight: 1.2,
        }}
      >
        {label}
      </h2>

      <div
        style={{
          display: "flex",
          gap: 18,
          marginBottom: 26,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Legend color={BRAND.seller} text={t.legendSeller} />
        <Legend color={BRAND.buyer} text={t.legendBuyer} />
        <Legend color={BRAND.risk} text={t.legendRisk} />
      </div>

      <Bar title={t.cost} split={riskPct} />
      <Bar title={t.risk} split={riskPct} marker />

      <StageTimeline stages={stages} activeStage={stageIndex} t={t} />
    </section>
  );
}

export default function App() {
  const [lang, setLang] = useState("no");
  const [tab, setTab] = useState("all");
  const [selectedCode, setSelectedCode] = useState("EXW");
  const [compare, setCompare] = useState(false);
  const [compareCode, setCompareCode] = useState("CIF");
  const [damageAt, setDamageAt] = useState(50);
  const [fcaVariant, setFcaVariant] = useState("sellerPremises");

  const t = UI[lang];
  const stages = STAGES[lang];

  const terms = useMemo(() => (tab === "all" ? ALL_11 : TERMS_SEA), [tab]);

  const selectedBase = useMemo(
    () => terms.find((x) => x.code === selectedCode) || terms[0],
    [terms, selectedCode]
  );

  const compareBase = useMemo(
    () => terms.find((x) => x.code === compareCode) || terms[0],
    [terms, compareCode]
  );

  function resolveFcaStage(term) {
    if (term.code !== "FCA") return term.dpStage;

    return fcaVariant === "sellerPremises"
      ? DP.FCA_SELLER_PREMISES_LOADED
      : DP.FCA_OTHER_PLACE_NOT_UNLOADED;
  }

  const selectedStage = resolveFcaStage(selectedBase);
  const compareStage = resolveFcaStage(compareBase);
  const riskPct = stageToPercent(selectedStage);
  const damageWho = damageAt <= riskPct ? t.seller : t.buyer;

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        background: BRAND.panel,
        minHeight: "100vh",
        padding: "16px",
        color: BRAND.text,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: BRAND.green,
            fontSize: "clamp(20px, 4vw, 30px)",
            textAlign: "center",
            marginBottom: 10,
            fontWeight: 800,
            lineHeight: 1.2,
            padding: "0 10px",
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2.5vw, 18px)",
            color: "#334155",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {t.subtitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 22,
          }}
        >
          {Object.keys(LANGS).map((key) => (
            <Button key={key} active={lang === key} onClick={() => setLang(key)}>
              {LANGS[key]}
            </Button>
          ))}

          <Button
            active={tab === "all"}
            onClick={() => {
              setTab("all");
              setSelectedCode("EXW");
              setCompareCode("CIF");
            }}
          >
            {t.tabAll}
          </Button>

          <Button
            active={tab === "sea"}
            onClick={() => {
              setTab("sea");
              setSelectedCode("FAS");
              setCompareCode("CIF");
            }}
          >
            {t.tabSea}
          </Button>

          <Button active={compare} onClick={() => setCompare((v) => !v)}>
            {compare ? t.compareOn : t.compareOff}
          </Button>
        </div>

        <section
          style={{
            background: "white",
            padding: "clamp(16px, 3vw, 22px)",
            borderRadius: 18,
            marginBottom: 22,
            border: `1px solid ${BRAND.border}`,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <h3 style={{ marginTop: 0, color: BRAND.text }}>{t.pickTerm}</h3>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {terms.map((term) => (
              <Button
                key={term.code}
                active={selectedCode === term.code}
                onClick={() => setSelectedCode(term.code)}
              >
                {term.code}
              </Button>
            ))}
          </div>

          {selectedCode === "FCA" && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: BRAND.text }}>{t.fcaVariantLabel}</h3>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <Button
                  active={fcaVariant === "sellerPremises"}
                  onClick={() => setFcaVariant("sellerPremises")}
                >
                  {t.fcaSellerPremises}
                </Button>

                <Button
                  active={fcaVariant === "otherPlace"}
                  onClick={() => setFcaVariant("otherPlace")}
                >
                  {t.fcaOtherPlace}
                </Button>
              </div>
            </div>
          )}

          {compare && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ color: BRAND.text }}>{t.compareWith}</h3>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {terms.map((term) => (
                  <Button
                    key={term.code}
                    active={compareCode === term.code}
                    onClick={() => setCompareCode(term.code)}
                  >
                    {term.code}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </section>

        {!compare ? (
          <Visual label={`${t.selectedTerm}: ${selectedCode}`} stageIndex={selectedStage} stages={stages} t={t} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 22,
            }}
          >
            <Visual label={`A: ${selectedCode}`} stageIndex={selectedStage} stages={stages} t={t} />
            <Visual label={`B: ${compareCode}`} stageIndex={compareStage} stages={stages} t={t} />
          </div>
        )}

        <section
          style={{
            background: "white",
            padding: "clamp(16px, 3vw, 24px)",
            borderRadius: 20,
            marginTop: 22,
            border: `1px solid ${BRAND.border}`,
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: BRAND.text,
              fontSize: "clamp(22px, 4vw, 28px)",
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {t.claimsSimTitle}
          </h2>

          <p style={{ fontSize: "clamp(16px, 2.5vw, 18px)", color: BRAND.text }}>
            {t.liableRisk} <strong>{damageWho}</strong>
          </p>

          <p style={{ color: BRAND.slate, fontWeight: 700 }}>
            {t.damagePosition}: {damageAt}%
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={damageAt}
            onChange={(e) => setDamageAt(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: BRAND.risk,
            }}
          />

          <p style={{ color: "#334155", fontWeight: 600 }}>{t.claimsHint}</p>
        </section>
      </div>
    </main>
  );
}