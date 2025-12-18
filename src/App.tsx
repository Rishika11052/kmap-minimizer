import { TruthTableProvider, useTruthTable } from "./context/TruthTableContext";
import { useAppNavigation } from "./hooks/useAppNavigation";
import InputScreen from "./screens/InputScreen";
import OptionsScreen from "./screens/OptionsScreen";
import ResultScreen from "./screens/ResultScreen";
import KMapScreen from "./screens/KMapScreen";
import VerilogScreen from "./screens/VerilogScreen";
import "./css/App.css";

function AppContent() {
  const { resetTruthTable } = useTruthTable();
  const {
    screen,
    selectedOption,
    navigateToOptions,
    navigateToResult,
    navigateToKMap,
    navigateToVerilog,
    navigateToInput,
    resetToInput,
    selectOption,
  } = useAppNavigation();

  // Handle SOP/POS selection
  const handleOptionSelect = (option: "SOP" | "POS") => {
    selectOption(option);
    navigateToResult();
  };

  // Handle full reset
  const handleResetToInput = () => {
    resetTruthTable();
    resetToInput();
  };

  // Router-like screen rendering
  const renderScreen = () => {
    switch (screen) {
      case "input":
        return <InputScreen onCompute={navigateToOptions} />;
      
      case "options":
        return (
          <OptionsScreen
            onSelectSOP={() => handleOptionSelect("SOP")}
            onSelectPOS={() => handleOptionSelect("POS")}
            onSelectKMap={navigateToKMap}
            onSelectVerilog={navigateToVerilog}
            onBackToInput={navigateToInput}
            onReset={handleResetToInput}
          />
        );
      
      case "result":
        return selectedOption !== "" ? (
          <ResultScreen
            selectedOption={selectedOption}
            onBackToOptions={navigateToOptions}
            onBackToInput={navigateToInput}
          />
        ) : null;
      
      case "KMAP":
        return (
          <KMapScreen
            highlightMode="SOP"
            onBackToOptions={navigateToOptions}
            onBackToInput={navigateToInput}
          />
        );
      
      case "verilog":
        return <VerilogScreen onBackToOptions={navigateToOptions} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>KMAP Minimizer</h1>
      <div className="frosted-wrapper">
        {renderScreen()}
      </div>
    </div>
  );
}

function App() {
  return (
    <TruthTableProvider>
      <AppContent />
    </TruthTableProvider>
  );
}

export default App;
