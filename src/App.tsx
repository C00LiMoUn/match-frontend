
import './App.css'
import AnalysisForm from "./components/AnalysisForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Soccer Commentary Analyzer</h1>
        <AnalysisForm />
      </div>
    </div>
  );
}

export default App;