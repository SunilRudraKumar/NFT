
import './App.css'
import { Web3Provider } from "./Web3Provider";
import Header from './components/ui/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MintPage from './components/ui/pages/Mint';
import ViewPage from './components/ui/pages/View';
import HomePage from './components/ui/pages/Home';



function App() {
 

  return (
 
        
    <Web3Provider>
      <Router>
              <Header />
              <Routes>
                <Route path="/mint" element={<MintPage />} />
                <Route path="/view" element={<ViewPage />} />
                <Route path="/" element={<HomePage />}/>
         
            </Routes>
      
           
        </Router>
      </Web3Provider>
     

  )
}

export default App
