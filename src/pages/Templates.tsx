import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { blink } from '../lib/blink'
import { Eye, Star, Crown, Palette, Code, Building2, Users, Briefcase, Zap } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  preview_image: string
  category: string
  is_premium: number
  template_config: string
}

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await blink.db.templates.list()
        setTemplates(templatesData || [])
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const categories = [
    { id: 'All', name: 'All Templates', icon: Palette },
    { id: 'Professional', name: 'Professional', icon: Briefcase },
    { id: 'Creative', name: 'Creative', icon: Star },
    { id: 'Technology', name: 'Technology', icon: Code },
    { id: 'Executive', name: 'Executive', icon: Building2 },
    { id: 'Corporate', name: 'Corporate', icon: Building2 },
    { id: 'Freelance', name: 'Freelance', icon: Users }
  ]

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    const categoryItem = categories.find(cat => cat.id === category)
    return categoryItem?.icon || Palette
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Portfolio Templates
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Choose from our curated collection of professionally designed templates. 
            Each template is crafted by expert designers and optimized for your industry.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-white/20 text-white text-sm px-3 py-1">
              <Star className="w-4 h-4 mr-1" />
              25+ Templates
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Instant Setup
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-3 py-1">
              <Palette className="w-4 h-4 mr-1" />
              Fully Customizable
            </Badge>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2 text-xs lg:text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value={selectedCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => {
                  const config = JSON.parse(template.template_config || '{}')
                  const Icon = getCategoryIcon(template.category)
                  
                  return (
                    <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary">
                      {/* Template Preview */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                        <div className="absolute inset-4 bg-white rounded-lg shadow-lg overflow-hidden">
                          {/* Mockup Browser Bar */}
                          <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2 border-b">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1 text-center text-xs text-gray-600">
                              portfolio.com
                            </div>
                          </div>
                          
                          {/* Template Preview Content */}
                          <div className="p-3 h-full bg-white">
                            <div 
                              className="w-full h-full rounded-lg shadow-sm"
                              style={{
                                background: `linear-gradient(135deg, ${config.colors?.primary || '#6366F1'} 0%, ${config.colors?.accent || '#F59E0B'} 100%)`
                              }}
                            >
                              <div className="flex items-center justify-center h-full">
                                <Icon className="w-8 h-8 text-white/80" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Premium Badge */}
                        {Number(template.is_premium) > 0 && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-accent text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Template
                          </Button>
                        </div>
                      </div>

                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Template Features */}
                          <div className="flex flex-wrap gap-2">
                            {config.sections?.slice(0, 3).map((section: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs capitalize">
                                {section.replace('_', ' ')}
                              </Badge>
                            ))}
                            {config.sections?.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{config.sections.length - 3} more
                              </Badge>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button className="flex-1">
                              {Number(template.is_premium) > 0 ? 'Upgrade to Use' : 'Use Template'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground">
                    Try selecting a different category or check back later for new templates.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 feature-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Create Your Portfolio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Select a template and start building your professional portfolio in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              View Premium Templates
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}