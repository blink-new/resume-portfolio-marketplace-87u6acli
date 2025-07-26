import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowRight, Upload, Palette, Globe, Zap, Users, Trophy } from 'lucide-react'

export function MarketplaceHome() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Resume into a
            <span className="block text-accent">Professional Portfolio</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Upload your resume and get a stunning portfolio website in seconds. 
            Choose from premium templates, customize your content, and get your own domain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold">
              Create Your Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              View Templates
            </Button>
          </div>
          
          {/* Demo Preview */}
          <div className="mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1 text-center text-sm text-gray-600">
                    john-doe.portfolios.com
                  </div>
                </div>
                <div className="p-8 text-left">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full"></div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">John Doe</h3>
                      <p className="text-gray-600">Senior Software Engineer</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Experience</h4>
                      <p className="text-sm text-gray-600">5+ Years</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Projects</h4>
                      <p className="text-sm text-gray-600">25+ Completed</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Skills</h4>
                      <p className="text-sm text-gray-600">React, Node.js</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your career presence online
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Upload Resume</CardTitle>
                <CardDescription>
                  Simply drag and drop your resume. Our AI will parse and extract your information automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Choose Template</CardTitle>
                <CardDescription>
                  Select from our collection of professionally designed templates. Customize colors, fonts, and layout.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Go Live</CardTitle>
                <CardDescription>
                  Get your portfolio website with a custom domain. Share it with employers and clients instantly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 feature-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose ResumePortfolio?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stand out from the competition with professional portfolio websites
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Advanced AI extracts your information and optimizes your resume for specific job descriptions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Trusted by 10K+</h3>
                <p className="text-muted-foreground">
                  Join thousands of professionals who have landed their dream jobs with our platform.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Professional Templates</h3>
                <p className="text-muted-foreground">
                  Choose from expertly designed templates created by professional designers.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Custom Domains</h3>
                <p className="text-muted-foreground">
                  Get your own professional domain or use our subdomain hosting for free.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Easy Customization</h3>
                <p className="text-muted-foreground">
                  Edit your portfolio content with our intuitive drag-and-drop editor.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Instant Results</h3>
                <p className="text-muted-foreground">
                  Go from resume upload to live portfolio website in under 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have created stunning portfolio websites
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-3 text-lg">
              <Link to="/templates">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}