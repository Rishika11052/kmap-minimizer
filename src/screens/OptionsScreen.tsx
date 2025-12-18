interface OptionsScreenProps {
  onSelectSOP: () => void;
  onSelectPOS: () => void;
  onSelectKMap: () => void;
  onSelectVerilog: () => void;
  onBackToInput: () => void;
  onReset?: () => void;
}

export default function OptionsScreen({
  onSelectSOP,
  onSelectPOS,
  onSelectKMap,
  onSelectVerilog,
  onBackToInput,
  onReset,
}: OptionsScreenProps) {
  return (
    <div className="options-screen-container">
      <div className="options-grid">
        <div className="option-box" onClick={onSelectSOP}>
          <h2>SOP</h2>
        </div>
        <div className="option-box" onClick={onSelectPOS}>
          <h2>POS</h2>
        </div>
        <div className="option-box" onClick={onSelectVerilog}>
          <h2>Verilog</h2>
        </div>
        <div className="option-box" onClick={onSelectKMap}>
          <h2>K-map</h2>
        </div>
      </div>

      <div className="back-button-container">
        <button className="back-btn" onClick={onBackToInput}>
          Back to Truth Table
        </button>
        {onReset && (
          <button className="back-btn" onClick={onReset} style={{ marginLeft: "10px" }}>
            Clear & Start New
          </button>
        )}
      </div>
    </div>
  );
}
