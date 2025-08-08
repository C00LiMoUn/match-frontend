

import { Toaster } from 'sonner';
import './App.css';
import AnalysisForm from "./components/AnalysisForm";
import { Layout } from "@/components/layout"

function App() {
  return (<>
    <Layout>
      <AnalysisForm />
    </Layout>
    <Toaster /></>
  )
}

export default App