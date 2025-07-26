import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { blink } from '../lib/blink'
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Eye,
  Trash2,
  Loader2,
  Palette
} from 'lucide-react'

interface ResumeFile {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_size: number
  parsed_data: string | null
  created_at: string
  is_active: number
}

export function ResumeUpload() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [resumes, setResumes] = useState<ResumeFile[]>([])
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set())

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
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadResumes()
    }
  }, [user, loadResumes])

  const handleFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })

    if (validFiles.length !== files.length) {
      alert('Please upload only PDF or Word documents under 10MB')
      return
    }

    setUploadingFiles(validFiles)

    for (const file of validFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        // Upload file to storage
        const { publicUrl } = await blink.storage.upload(
          file,
          `resumes/${user.id}/${file.name}`,
          {
            upsert: true,
            onProgress: (percent) => {
              setUploadProgress(prev => ({ ...prev, [file.name]: percent }))
            }
          }
        )

        // Start processing the resume
        setProcessingFiles(prev => new Set(prev).add(file.name))
        
        // Parse resume content using AI
        const extractedText = await blink.data.extractFromUrl(publicUrl)
        
        // Generate structured data from the resume text
        const { object: parsedData } = await blink.ai.generateObject({
          prompt: `Parse this resume text and extract structured information: ${extractedText.slice(0, 4000)}`,
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
                    description: { type: 'string' }
                  }
                }
              },
              skills: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        })

        // Save to database
        const resumeId = crypto.randomUUID()
        await blink.db.resumes.create({
          id: resumeId,
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          parsed_data: JSON.stringify(parsedData),
          is_active: 1
        })

        setProcessingFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(file.name)
          return newSet
        })

        // Reload resumes
        await loadResumes()

      } catch (error) {
        console.error('Failed to upload resume:', error)
        setProcessingFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(file.name)
          return newSet
        })
      }
    }

    setUploadingFiles([])
    setUploadProgress({})
  }, [user, loadResumes])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [handleFiles])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const deleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await blink.db.resumes.delete(resumeId)
        await loadResumes()
      } catch (error) {
        console.error('Failed to delete resume:', error)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
              You need to be signed in to upload resumes
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
          <h1 className="text-3xl font-bold text-foreground">Resume Upload</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume and let our AI parse it to create your professional portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload New Resume
                </CardTitle>
                <CardDescription>
                  Drag and drop your resume or click to browse. Supports PDF, DOC, and DOCX files up to 10MB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse your files
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: PDF, DOC, DOCX (Max 10MB each)
                  </p>
                </div>

                {/* Upload Progress */}
                {uploadingFiles.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold">Uploading Files:</h4>
                    {uploadingFiles.map((file) => (
                      <div key={file.name} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{file.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[file.name] || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        {processingFiles.has(file.name) ? (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Processing...
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {Math.round(uploadProgress[file.name] || 0)}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Resumes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <File className="w-5 h-5 mr-2" />
                  Your Resumes ({resumes.length})
                </CardTitle>
                <CardDescription>
                  Manage your uploaded resumes and view parsing results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No resumes uploaded yet</h3>
                    <p className="text-muted-foreground">
                      Upload your first resume to get started with creating your portfolio
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume) => {
                      const parsedData = resume.parsed_data ? JSON.parse(resume.parsed_data) : null
                      const isActive = Number(resume.is_active) > 0
                      
                      return (
                        <div key={resume.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{resume.file_name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{formatFileSize(resume.file_size)}</span>
                                <span>•</span>
                                <span>Uploaded {formatDate(resume.created_at)}</span>
                                {parsedData?.personal_info?.name && (
                                  <>
                                    <span>•</span>
                                    <span>{parsedData.personal_info.name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {isActive && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            {parsedData && (
                              <Badge variant="outline" className="text-xs">
                                Parsed
                              </Badge>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(resume.file_url)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('/admin/portfolio-builder', { 
                                state: { resumeId: resume.id } 
                              })}
                            >
                              Create Portfolio
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteResume(resume.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Upload Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Use latest version</p>
                    <p className="text-xs text-muted-foreground">Upload your most recent resume for best results</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Standard format</p>
                    <p className="text-xs text-muted-foreground">Use clear headings and bullet points</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Complete information</p>
                    <p className="text-xs text-muted-foreground">Include contact details and experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Resumes Uploaded</span>
                  <Badge variant="secondary">{resumes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Resumes</span>
                  <Badge variant="secondary">
                    {resumes.filter(r => Number(r.is_active) > 0).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Parsed Successfully</span>
                  <Badge variant="secondary">
                    {resumes.filter(r => r.parsed_data).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {resumes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚀 Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/admin/portfolio-builder')}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Create Portfolio
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/admin/resume-optimizer')}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Optimize Resume
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/templates')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}