import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Zap, 
  Palette, 
  Globe, 
  BarChart3, 
  Shield, 
  Headphones,
  Upload,
  FileText,
  Bot,
  Target,
  Sparkles,
  Users,
  Download,
  Settings,
  Crown,
  CheckCircle,
  ArrowRight,
  Star,
  Code,
  Smartphone,
  Lock,
  Rocket
} from 'lucide-react'

export function Features() {
  const coreFeatures = [
    {
      icon: Upload,
      title: 'Smart Resume Upload',
      description: 'Upload any resume format and our AI instantly parses and extracts all information with 95% accuracy.',
      features: ['PDF, DOC, DOCX support', 'Drag & drop interface', 'Instant processing', 'Error detection'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bot,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your resume and creates structured, professional portfolio content automatically.',
      features: ['Resume parsing', 'Content optimization', 'Skills extraction', 'Experience enhancement'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from 25+ professionally designed templates optimized for different industries and roles.',
      features: ['Industry-specific designs', 'Mobile responsive', 'ATS-friendly', 'Customizable themes'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Instant Website Hosting',
      description: 'Get your portfolio website live instantly with custom subdomain and optional custom domain support.',
      features: ['Subdomain hosting', 'Custom domains', 'SSL certificates', '99.9% uptime'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const advancedFeatures = [
    {
      icon: Target,
      title: 'Job-Specific Optimization',
      description: 'AI optimizes your resume for specific job descriptions, increasing your match score by up to 40%.',
      benefits: ['Higher ATS scores', 'Keyword optimization', 'Content suggestions', 'Match analysis']
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track portfolio views, visitor engagement, and performance metrics to optimize your job search.',
      benefits: ['View tracking', 'Visitor analytics', 'Performance reports', 'Export data']
    },
    {
      icon: Settings,
      title: 'Content Management',
      description: 'Easy-to-use editor lets you customize every aspect of your portfolio without coding knowledge.',
      benefits: ['Drag & drop editor', 'Real-time preview', 'Content versioning', 'Backup & restore']
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimization',
      description: 'All portfolios are fully responsive and optimized for mobile viewing and fast loading.',
      benefits: ['Mobile-first design', 'Fast loading', 'Touch-friendly', 'Cross-browser compatible']
    }
  ]

  const aiFeatures = [
    {
      title: 'Smart Content Generation',
      description: 'AI generates compelling professional summaries and job descriptions based on your experience.',
      icon: Sparkles,
      examples: ['Professional summaries', 'Achievement descriptions', 'Skill recommendations', 'Content suggestions']
    },
    {
      title: 'Resume Optimization',
      description: 'Analyze job descriptions and optimize your resume to match requirements perfectly.',
      icon: Target,
      examples: ['Keyword matching', 'ATS optimization', 'Content enhancement', 'Score improvements']
    },
    {
      title: 'Industry Intelligence',
      description: 'AI understands industry-specific requirements and tailors your portfolio accordingly.',
      icon: Bot,
      examples: ['Industry keywords', 'Role requirements', 'Skill prioritization', 'Format optimization']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Features for 
            <span className="block text-accent">Professional Success</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Everything you need to create stunning portfolio websites and optimize your resume 
            for maximum job search success, powered by cutting-edge AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform your resume into a professional portfolio website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base mt-4">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {feature.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 feature-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary text-white px-4 py-2">
              <Bot className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Artificial Intelligence Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge AI to optimize your resume and create compelling portfolio content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.examples.map((example, i) => (
                      <div key={i} className="flex items-center justify-center space-x-2">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools to give you a competitive edge in your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base mt-4">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security & Reliability */}
      <section className="py-20 feature-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Security & Reliability
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your data is protected with enterprise-grade security and infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Data Protection</h3>
              <p className="text-muted-foreground">
                Your resume data is encrypted at rest and in transit with AES-256 encryption.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Privacy First</h3>
              <p className="text-muted-foreground">
                We never share your personal information. Your data belongs to you, always.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">99.9% Uptime</h3>
              <p className="text-muted-foreground">
                Your portfolio is always accessible with our reliable cloud infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integrations & Export
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamlessly integrate with your existing workflow and export your data anytime
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export optimized resumes as PDF files
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Code className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">HTML Export</h3>
                <p className="text-sm text-muted-foreground">
                  Download portfolio as HTML for hosting anywhere
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Custom Domains</h3>
                <p className="text-sm text-muted-foreground">
                  Use your own domain for professional branding
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Analytics API</h3>
                <p className="text-sm text-muted-foreground">
                  Access your data programmatically via API
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of professionals who have created stunning portfolios and landed their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              <Headphones className="mr-2 h-5 w-5" />
              Talk to Sales
            </Button>
          </div>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}