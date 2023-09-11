import './App.css'
import React from 'react'
import KanbanBoard from './assets/components/KanbanBoard'
import FormFirebase from './assets/components/FormFirebase'
import { AuthProvider } from './context/AuthContext'

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
