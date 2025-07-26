import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { MarketplaceHome } from './pages/MarketplaceHome'
import { Features } from './pages/Features'
import { Templates } from './pages/Templates'
import { Pricing } from './pages/Pricing'
import { Dashboard } from './pages/Dashboard'
import { ResumeUpload } from './pages/ResumeUpload'
import { PortfolioBuilder } from './pages/PortfolioBuilder'
import { ResumeOptimizer } from './pages/ResumeOptimizer'

// Placeholder components for remaining pages
function ContentEditor() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Content Editor</h1>
        <p className="text-xl text-center text-muted-foreground">
          Coming soon - Advanced content editing capabilities
        </p>
      </div>
    </div>
  )
}

function DomainSettings() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Domain Settings</h1>
        <p className="text-xl text-center text-muted-foreground">
          Coming soon - Custom domain management
        </p>
      </div>
    </div>
  )
}

function Analytics() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Analytics</h1>
        <p className="text-xl text-center text-muted-foreground">
          Coming soon - Portfolio performance analytics
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          {/* Marketplace Routes */}
          <Route path="/" element={<MarketplaceHome />} />
          <Route path="/features" element={<Features />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/resume-upload" element={<ResumeUpload />} />
          <Route path="/admin/portfolio-builder" element={<PortfolioBuilder />} />
          <Route path="/admin/resume-optimizer" element={<ResumeOptimizer />} />
          <Route path="/admin/content-editor" element={<ContentEditor />} />
          <Route path="/admin/domain-settings" element={<DomainSettings />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App