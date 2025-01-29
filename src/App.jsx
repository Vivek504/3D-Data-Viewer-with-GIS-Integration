import LayoutIndex from "./components/Layout/LayoutIndex"
import './App.css'
import { AppContextProvider } from "./contexts/AppContext"

function App() {
  return (
    <AppContextProvider>
      <LayoutIndex />
    </AppContextProvider>
  )
}

export default App
