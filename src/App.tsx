import './App.css'
import React from 'react'
import KanbanBoard from './components/KanbanBoard'
import FormFirebase from './components/FormFirebase'
import { AuthProvider } from './context/AuthContext.d.tsx'

function App() {
  const [showKanban, setShowKanban] = React.useState(false)
 
  return(
    <AuthProvider>
      {showKanban && <KanbanBoard />}
      {!showKanban &&(<FormFirebase setShowKanban={setShowKanban}/>)}
    </AuthProvider>
  );
}

export default App
