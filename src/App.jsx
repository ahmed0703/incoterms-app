import { useMemo, useState } from "react";
import "./App.css";

const BRAND = {
  green: "#005239",
  slate: "#475569",
  border: "#CBD5E1",
  panel: "#F1F5F9",
  seller: "#1D4ED8",
  buyer: "#16A34A",
  risk: "#EA580C",
  text: "#0F172A",
};

const LANGS = { no: "Norsk", en: "English" };

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
    <button className={`brand-button ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Legend({ color, text }) {
  return (
    <div className="legend-item">
      <span className="legend-dot" style={{ background: color }} />
      <span>{text}</span>
    </div>
  );
}

function StageTimeline({ stages, activeStage, t }) {
  return (
    <div className="stage-wrapper">
      <h3>{t.stageTitle}</h3>

      <div className="stage-grid">
        {stages.map((stage, index) => {
          const isActive = index === activeStage;

          return (
            <div key={stage.key} className={`stage-card ${isActive ? "active" : ""}`}>
              <div className="stage-number">{index + 1}</div>
              <div className="stage-icon">{stage.icon}</div>
              <div className="stage-label">{stage.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Bar({ title, split, marker }) {
  return (
    <div className="bar-block">
      <strong>{title}</strong>

      <div className="bar-track">
        <div className="bar-fill">
          <div style={{ width: `${split}%`, background: BRAND.seller }} />
          <div style={{ width: `${100 - split}%`, background: BRAND.buyer }} />
        </div>

        {marker && (
          <>
            <div className="risk-line" style={{ left: `${split}%` }} />
            <div className="risk-triangle" style={{ left: `${split}%` }} />
          </>
        )}
      </div>
    </div>
  );
}

function Visual({ label, stageIndex, stages, t }) {
  const riskPct = stageToPercent(stageIndex);

  return (
    <section className="visual-card">
      <h2>{label}</h2>

      <div className="legend-row">
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
    <main className="app-shell">
      <div className="app-container">
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>

        <div className="top-controls">
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

        <section className="selector-card">
          <h3>{t.pickTerm}</h3>

          <div className="button-row">
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
            <div className="sub-section">
              <h3>{t.fcaVariantLabel}</h3>

              <div className="button-row">
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
            <div className="sub-section">
              <h3>{t.compareWith}</h3>

              <div className="button-row">
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
          <div className="compare-grid">
            <Visual label={`A: ${selectedCode}`} stageIndex={selectedStage} stages={stages} t={t} />
            <Visual label={`B: ${compareCode}`} stageIndex={compareStage} stages={stages} t={t} />
          </div>
        )}

        <section className="claims-card">
          <h2>{t.claimsSimTitle}</h2>

          <p className="risk-party">
            {t.liableRisk} <strong>{damageWho}</strong>
          </p>

          <p className="damage-point">
            {t.damagePosition}: {damageAt}%
          </p>

          <input
            type="range"
            min="0"
            max="100"
            value={damageAt}
            onChange={(e) => setDamageAt(Number(e.target.value))}
          />

          <p className="claims-hint">{t.claimsHint}</p>
        </section>
      </div>
    </main>
  );
}