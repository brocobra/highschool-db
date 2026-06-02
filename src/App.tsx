import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SchoolList from './pages/SchoolList'
import SchoolDetail from './pages/SchoolDetail'
import Calculator from './pages/Calculator'
import ExamSystem from './pages/ExamSystem'
import ExamFlow from './pages/ExamFlow'
import BudgetPage from './pages/BudgetPage'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saitama" element={<SchoolList />} />
          <Route path="/saitama/highschool/:id" element={<SchoolDetail />} />
          <Route path="/saitama/calculator" element={<Calculator />} />
          <Route path="/saitama/exam-system" element={<ExamSystem />} />
          <Route path="/saitama/exam-flow" element={<ExamFlow />} />
          <Route path="/saitama/budget" element={<BudgetPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
