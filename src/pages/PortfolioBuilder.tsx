import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { blink } from '../lib/blink'
import { 
  Palette, 
  Eye, 
  Save, 
  Settings,
  Globe,
  Crown,
  Check,
  ArrowLeft,
  Loader2,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  is_premium: number
  template_config: string
}

interface Resume {
  id: string
  file_name: string
  parsed_data: string | null
}

interface Portfolio {
  id: string
  title: string
  subdomain: string
  template_id: string
  content_data: string
  is_published: number
}

export function PortfolioBuilder() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [portfolioData, setPortfolioData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  
  const [resumes, setResumes] = useState<Resume[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [parsedData, setParsedData] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      // Load user's resumes
      const resumesData = await blink.db.resumes.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      setResumes(resumesData || [])

      // Load templates
      const templatesData = await blink.db.templates.list()
      setTemplates(templatesData || [])

      // Pre-select resume if coming from upload
      if (location.state?.resumeId) {
        const resume = resumesData?.find(r => r.id === location.state.resumeId)
        if (resume) {
          setSelectedResume(resume)
          if (resume.parsed_data) {
            setParsedData(JSON.parse(resume.parsed_data))
          }
          setStep(2) // Skip to template selection
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }, [user, location.state])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  useEffect(() => {
    // Check if we came from resume upload with a specific resume
    if (location.state?.resumeId) {
      setSelectedResumeId(location.state.resumeId)
    }
  }, [location.state])

  const generateSubdomain = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 20) + '-' + Math.random().toString(36).substr(2, 4)
  }, [])

  const handleResumeSelect = async (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId)
    if (resume) {
      setSelectedResume(resume)
      setSelectedResumeId(resumeId)
      if (resume.parsed_data) {
        setParsedData(JSON.parse(resume.parsed_data))
      }
      setStep(2)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setSelectedTemplateId(templateId)
      
      // Initialize portfolio data with resume data
      if (parsedData) {
        setPortfolioData({
          title: `${parsedData.personal_info?.name || 'Professional'} Portfolio`,
          subdomain: generateSubdomain(parsedData.personal_info?.name || 'portfolio'),
          personal_info: parsedData.personal_info || {},
          summary: parsedData.summary || '',
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          skills: parsedData.skills || [],
          projects: parsedData.projects || [],
          certifications: parsedData.certifications || []
        })
      }
      setStep(3)
    }
  }



  const handleSavePortfolio = async () => {
    if (!selectedTemplate || !selectedResume || !user) return

    setSaving(true)
    try {
      const portfolioId = crypto.randomUUID()
      
      await blink.db.portfolios.create({
        id: portfolioId,
        user_id: user.id,
        title: portfolioData.title,
        subdomain: portfolioData.subdomain,
        template_id: selectedTemplateId,
        theme_config: selectedTemplate.template_config,
        content_data: JSON.stringify(portfolioData),
        is_published: 1
      })

      // Navigate to success page or portfolio view
      navigate('/admin', { 
        state: { 
          message: 'Portfolio created successfully!',
          portfolioId 
        } 
      })
    } catch (error) {
      console.error('Failed to save portfolio:', error)
      alert('Failed to save portfolio. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be signed in to create portfolios
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => blink.auth.login()}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create your professional portfolio website in three simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 1 ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-300'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 2 ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-300'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 3 ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-300'
            }`}>
              3
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-8 text-sm">
            <span className={step >= 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}>
              Select Resume
            </span>
            <span className={step >= 2 ? 'text-primary font-semibold' : 'text-muted-foreground'}>
              Choose Template
            </span>
            <span className={step >= 3 ? 'text-primary font-semibold' : 'text-muted-foreground'}>
              Customize Content
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Resume Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Select Resume
                </CardTitle>
                <CardDescription>
                  Choose which resume to use as the foundation for your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No resumes found</h3>
                    <p className="text-muted-foreground mb-4">
                      You need to upload a resume first before creating a portfolio
                    </p>
                    <Button onClick={() => navigate('/admin/resume-upload')}>
                      Upload Resume
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumes.map((resume) => {
                      const parsedResumeData = resume.parsed_data ? JSON.parse(resume.parsed_data) : null
                      
                      return (
                        <Card 
                          key={resume.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedResumeId === resume.id ? 'border-2 border-primary' : 'border hover:border-primary/50'
                          }`}
                          onClick={() => handleResumeSelect(resume.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{resume.file_name}</CardTitle>
                              {selectedResumeId === resume.id && (
                                <Badge className="bg-primary text-white">
                                  <Check className="w-3 h-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {parsedResumeData?.personal_info?.name && (
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                  <span>{parsedResumeData.personal_info.name}</span>
                                </div>
                                {parsedResumeData.personal_info.email && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <span>📧 {parsedResumeData.personal_info.email}</span>
                                  </div>
                                )}
                                {parsedResumeData.experience && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    <span>{parsedResumeData.experience.length} positions</span>
                                  </div>
                                )}
                                {parsedResumeData.skills && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Code className="w-4 h-4 mr-2" />
                                    <span>{parsedResumeData.skills.length} skills</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {!parsedResumeData && (
                              <p className="text-sm text-muted-foreground">
                                Resume not yet parsed. Please wait for processing to complete.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Template Selection */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Choose Template
                </CardTitle>
                <CardDescription>
                  Select a professional template that matches your style and industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => {
                    const config = JSON.parse(template.template_config || '{}')
                    
                    return (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplateId === template.id ? 'border-2 border-primary' : 'border hover:border-primary/50'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        {/* Template Preview */}
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden rounded-t-lg">
                          <div className="absolute inset-4 bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-gray-100 px-3 py-1 flex items-center space-x-1 border-b">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                            <div 
                              className="p-2 h-full"
                              style={{
                                background: `linear-gradient(135deg, ${config.colors?.primary || '#6366F1'} 0%, ${config.colors?.accent || '#F59E0B'} 100%)`
                              }}
                            >
                              <div className="bg-white/90 rounded p-2 h-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-8 h-8 bg-current rounded-full mx-auto mb-1 opacity-60"></div>
                                  <div className="space-y-1">
                                    <div className="h-1 bg-current rounded opacity-40"></div>
                                    <div className="h-1 bg-current rounded opacity-30 w-3/4 mx-auto"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {Number(template.is_premium) > 0 && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-accent text-white text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            </div>
                          )}

                          {selectedTemplateId === template.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Badge className="bg-primary text-white">
                                <Check className="w-3 h-3 mr-1" />
                                Selected
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {template.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: Show template preview
                              }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    disabled={!selectedTemplateId}
                  >
                    Continue to Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Content Customization */}
          {step === 3 && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Customize Your Portfolio
                  </CardTitle>
                  <CardDescription>
                    Edit your portfolio content and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Portfolio Title</label>
                            <Input
                              value={portfolioData.title || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                title: e.target.value
                              })}
                              placeholder="My Professional Portfolio"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                              value={portfolioData.personal_info?.name || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                personal_info: {
                                  ...portfolioData.personal_info,
                                  name: e.target.value
                                }
                              })}
                              placeholder="John Doe"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              type="email"
                              value={portfolioData.personal_info?.email || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                personal_info: {
                                  ...portfolioData.personal_info,
                                  email: e.target.value
                                }
                              })}
                              placeholder="john@example.com"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                              value={portfolioData.personal_info?.phone || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                personal_info: {
                                  ...portfolioData.personal_info,
                                  phone: e.target.value
                                }
                              })}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Location</label>
                            <Input
                              value={portfolioData.personal_info?.location || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                personal_info: {
                                  ...portfolioData.personal_info,
                                  location: e.target.value
                                }
                              })}
                              placeholder="San Francisco, CA"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Professional Summary</label>
                            <Textarea
                              value={portfolioData.summary || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                summary: e.target.value
                              })}
                              placeholder="Brief summary of your professional background..."
                              rows={6}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Work Experience</h3>
                        <Button size="sm" variant="outline">
                          Add Experience
                        </Button>
                      </div>
                      
                      {portfolioData.experience?.map((exp: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                value={exp.title || ''}
                                onChange={(e) => {
                                  const newExperience = [...(portfolioData.experience || [])]
                                  newExperience[index] = { ...exp, title: e.target.value }
                                  setPortfolioData({
                                    ...portfolioData,
                                    experience: newExperience
                                  })
                                }}
                                placeholder="Job Title"
                              />
                              <Input
                                value={exp.company || ''}
                                onChange={(e) => {
                                  const newExperience = [...(portfolioData.experience || [])]
                                  newExperience[index] = { ...exp, company: e.target.value }
                                  setPortfolioData({
                                    ...portfolioData,
                                    experience: newExperience
                                  })
                                }}
                                placeholder="Company Name"
                              />
                              <Input
                                value={exp.duration || ''}
                                onChange={(e) => {
                                  const newExperience = [...(portfolioData.experience || [])]
                                  newExperience[index] = { ...exp, duration: e.target.value }
                                  setPortfolioData({
                                    ...portfolioData,
                                    experience: newExperience
                                  })
                                }}
                                placeholder="Jan 2020 - Present"
                              />
                              <div className="md:col-span-2">
                                <Textarea
                                  value={exp.description || ''}
                                  onChange={(e) => {
                                    const newExperience = [...(portfolioData.experience || [])]
                                    newExperience[index] = { ...exp, description: e.target.value }
                                    setPortfolioData({
                                      ...portfolioData,
                                      experience: newExperience
                                    })
                                  }}
                                  placeholder="Describe your role and achievements..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Skills & Technologies</h3>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Skills (comma-separated)</label>
                        <Textarea
                          value={portfolioData.skills?.join(', ') || ''}
                          onChange={(e) => setPortfolioData({
                            ...portfolioData,
                            skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          })}
                          placeholder="React, Node.js, Python, AWS, etc."
                          rows={4}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {portfolioData.skills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Subdomain
                          </label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={portfolioData.subdomain || ''}
                              onChange={(e) => setPortfolioData({
                                ...portfolioData,
                                subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                              })}
                              placeholder="your-name"
                            />
                            <span className="text-sm text-muted-foreground">.portfolio.com</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your portfolio will be available at {portfolioData.subdomain || 'your-name'}.portfolio.com
                          </p>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">Template</h4>
                            <p className="text-sm text-muted-foreground">{selectedTemplate?.name}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                            Change Template
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back to Templates
                </Button>
                <Button 
                  onClick={handleSavePortfolio}
                  disabled={saving || !portfolioData.title || !portfolioData.subdomain}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Portfolio...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Portfolio
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}