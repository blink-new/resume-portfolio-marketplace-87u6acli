import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { blink } from '../lib/blink'
import { 
  Zap, 
  FileText, 
  Download, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  Star,
  BarChart3
} from 'lucide-react'

interface Resume {
  id: string
  file_name: string
  parsed_data: string | null
}

interface OptimizationResult {
  score: number
  improvements: string[]
  optimized_content: any
  keywords_added: string[]
  sections_enhanced: string[]
}

export function ResumeOptimizer() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadResumes = useCallback(async () => {
    if (!user) return
    try {
      const resumesData = await blink.db.resumes.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      setResumes(resumesData || [])
    } catch (error) {
      console.error('Failed to load resumes:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadResumes()
    }
  }, [user, loadResumes])

  const handleOptimize = async () => {
    if (!selectedResumeId || !jobDescription.trim()) return

    const resume = resumes.find(r => r.id === selectedResumeId)
    if (!resume || !resume.parsed_data) return

    setOptimizing(true)
    try {
      const parsedData = JSON.parse(resume.parsed_data)
      
      // Use AI to analyze and optimize the resume for the job
      const { object: analysis } = await blink.ai.generateObject({
        prompt: `
          Analyze this resume against the job description and provide optimization recommendations:
          
          RESUME DATA:
          ${JSON.stringify(parsedData, null, 2)}
          
          JOB DESCRIPTION:
          ${jobDescription}
          
          JOB TITLE: ${jobTitle}
          
          Please analyze the resume and provide specific recommendations for optimization.
        `,
        schema: {
          type: 'object',
          properties: {
            score: {
              type: 'number',
              description: 'Match score out of 100'
            },
            improvements: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific improvement suggestions'
            },
            keywords_missing: {
              type: 'array',
              items: { type: 'string' },
              description: 'Important keywords missing from resume'
            },
            keywords_to_add: {
              type: 'array',
              items: { type: 'string' },
              description: 'Keywords that should be added'
            },
            sections_to_enhance: {
              type: 'array',
              items: { type: 'string' },
              description: 'Resume sections that need enhancement'
            },
            optimized_summary: {
              type: 'string',
              description: 'Optimized professional summary'
            },
            skill_recommendations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Skills to highlight or add'
            },
            experience_enhancements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  position: { type: 'string' },
                  enhancement: { type: 'string' }
                }
              },
              description: 'Ways to enhance experience descriptions'
            }
          }
        }
      })

      // Generate optimized resume content
      const { object: optimizedContent } = await blink.ai.generateObject({
        prompt: `
          Based on the analysis, create an optimized version of the resume content:
          
          ORIGINAL RESUME:
          ${JSON.stringify(parsedData, null, 2)}
          
          OPTIMIZATION ANALYSIS:
          ${JSON.stringify(analysis, null, 2)}
          
          JOB DESCRIPTION:
          ${jobDescription}
          
          Create an optimized version that incorporates the recommendations.
        `,
        schema: {
          type: 'object',
          properties: {
            personal_info: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                location: { type: 'string' }
              }
            },
            summary: { type: 'string' },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  duration: { type: 'string' },
                  description: { type: 'string' },
                  achievements: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            },
            skills: {
              type: 'array',
              items: { type: 'string' }
            },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  degree: { type: 'string' },
                  institution: { type: 'string' },
                  year: { type: 'string' }
                }
              }
            }
          }
        }
      })

      const result: OptimizationResult = {
        score: analysis.score || 75,
        improvements: analysis.improvements || [],
        optimized_content: optimizedContent,
        keywords_added: analysis.keywords_to_add || [],
        sections_enhanced: analysis.sections_to_enhance || []
      }

      setOptimizationResult(result)

      // Save optimization to database
      const optimizationId = crypto.randomUUID()
      await blink.db.job_optimizations.create({
        id: optimizationId,
        user_id: user.id,
        resume_id: selectedResumeId,
        job_title: jobTitle,
        job_description: jobDescription,
        optimized_resume_url: '', // We'll generate this when downloading
        optimization_notes: JSON.stringify(result)
      })

    } catch (error) {
      console.error('Failed to optimize resume:', error)
      alert('Failed to optimize resume. Please try again.')
    } finally {
      setOptimizing(false)
    }
  }

  const handleDownloadOptimized = async () => {
    if (!optimizationResult) return

    try {
      // Generate a formatted resume document using AI
      const { text: resumeText } = await blink.ai.generateText({
        prompt: `
          Create a professionally formatted plain text resume based on this optimized content:
          
          ${JSON.stringify(optimizationResult.optimized_content, null, 2)}
          
          Format it as a clean, professional resume that can be easily copied and pasted.
          Use proper spacing and formatting for readability.
        `
      })

      // Create a downloadable file
      const blob = new Blob([resumeText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `optimized-resume-${jobTitle.replace(/\s+/g, '-').toLowerCase()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Failed to download optimized resume:', error)
      alert('Failed to download resume. Please try again.')
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
              You need to be signed in to optimize resumes
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
          <h1 className="text-3xl font-bold text-foreground">AI Resume Optimizer</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your resume for specific job descriptions using AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Optimization Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Provide the job details to optimize your resume accordingly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Resume</label>
                  <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a resume to optimize" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.file_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Job Description</label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    rows={12}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include requirements, responsibilities, and preferred qualifications
                  </p>
                </div>

                <Button 
                  onClick={handleOptimize}
                  disabled={!selectedResumeId || !jobDescription.trim() || !jobTitle.trim() || optimizing}
                  className="w-full"
                  size="lg"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing & Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Resume with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Optimization Results */}
            {optimizationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Optimization Results
                  </CardTitle>
                  <CardDescription>
                    AI analysis and recommendations for your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      <TabsTrigger value="improvements">Improvements</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis" className="space-y-6">
                      {/* Match Score */}
                      <div className="text-center p-6 bg-muted/50 rounded-lg">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                          <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                          <div 
                            className="absolute inset-2 bg-primary rounded-full flex items-center justify-center"
                            style={{
                              background: `conic-gradient(hsl(var(--primary)) ${optimizationResult.score * 3.6}deg, hsl(var(--muted)) 0deg)`
                            }}
                          >
                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-primary">
                                {optimizationResult.score}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Match Score</h3>
                        <p className="text-muted-foreground">
                          {optimizationResult.score >= 80 ? 'Excellent match!' :
                           optimizationResult.score >= 70 ? 'Good match with room for improvement' :
                           optimizationResult.score >= 60 ? 'Moderate match, optimization recommended' :
                           'Low match, significant optimization needed'}
                        </p>
                      </div>

                      {/* Keywords Added */}
                      {optimizationResult.keywords_added.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            Keywords Added ({optimizationResult.keywords_added.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {optimizationResult.keywords_added.map((keyword, index) => (
                              <Badge key={index} className="bg-green-100 text-green-800">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sections Enhanced */}
                      {optimizationResult.sections_enhanced.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Sections Enhanced
                          </h4>
                          <div className="space-y-2">
                            {optimizationResult.sections_enhanced.map((section, index) => (
                              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="capitalize">{section.replace('_', ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="improvements" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Optimization Recommendations
                        </h4>
                        <Badge variant="secondary">
                          {optimizationResult.improvements.length} suggestions
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {optimizationResult.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-primary">
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-sm">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Optimized Resume Preview</h4>
                        <Button onClick={handleDownloadOptimized} size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="border rounded-lg p-6 bg-white">
                        {/* Personal Info */}
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold mb-2">
                            {optimizationResult.optimized_content.personal_info?.name}
                          </h2>
                          <div className="text-muted-foreground space-y-1">
                            <p>{optimizationResult.optimized_content.personal_info?.email}</p>
                            <p>{optimizationResult.optimized_content.personal_info?.phone}</p>
                            <p>{optimizationResult.optimized_content.personal_info?.location}</p>
                          </div>
                        </div>

                        {/* Summary */}
                        {optimizationResult.optimized_content.summary && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                            <p className="text-sm leading-relaxed">
                              {optimizationResult.optimized_content.summary}
                            </p>
                          </div>
                        )}

                        {/* Skills */}
                        {optimizationResult.optimized_content.skills?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {optimizationResult.optimized_content.skills.map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {optimizationResult.optimized_content.experience?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Experience</h3>
                            <div className="space-y-4">
                              {optimizationResult.optimized_content.experience.map((exp: any, index: number) => (
                                <div key={index} className="border-l-2 border-primary/20 pl-4">
                                  <h4 className="font-semibold">{exp.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {exp.company} • {exp.duration}
                                  </p>
                                  <p className="text-sm leading-relaxed">{exp.description}</p>
                                  {exp.achievements && (
                                    <ul className="text-sm mt-2 space-y-1">
                                      {exp.achievements.map((achievement: string, i: number) => (
                                        <li key={i} className="flex items-start">
                                          <span className="mr-2">•</span>
                                          <span>{achievement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Complete job description</p>
                    <p className="text-xs text-muted-foreground">Include all requirements and qualifications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Use latest resume</p>
                    <p className="text-xs text-muted-foreground">Upload your most current resume version</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Review suggestions</p>
                    <p className="text-xs text-muted-foreground">Carefully review all AI recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            {resumes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Your Resumes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Resumes</span>
                    <Badge variant="secondary">{resumes.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ready for Optimization</span>
                    <Badge variant="secondary">
                      {resumes.filter(r => r.parsed_data).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/resume-upload')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Upload New Resume
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/portfolio-builder')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Create Portfolio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}