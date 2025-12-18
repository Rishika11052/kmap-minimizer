import TruthTableInput from "../TruthTableInput";
import { useTruthTable } from "../context/TruthTableContext";

interface InputScreenProps {
  onCompute: () => void;
}

export default function InputScreen({ onCompute }: InputScreenProps) {
  const { truthTableValues, setTruthTableValues, isTableEmpty } = useTruthTable();

  const handleCompute = () => {
    if (isTableEmpty()) {
      alert("Please enter values in the truth table first!");
      return;
    }
    onCompute();
  };

  return (
    <>
      <TruthTableInput 
        onValuesChange={setTruthTableValues} 
        initialValues={truthTableValues}
      />
      <button className="compute-btn" onClick={handleCompute}>
        Compute
      </button>
    </>
  );
}
