import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Check, 
  Crown, 
  Zap, 
  Globe, 
  Palette, 
  BarChart3, 
  Shield, 
  Headphones,
  X
} from 'lucide-react'

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out our platform',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      features: [
        '1 Portfolio Website',
        'Basic Templates (3)',
        'Subdomain Hosting',
        'Basic Resume Upload',
        'Community Support',
        'Blink Branding'
      ],
      limitations: [
        'No Custom Domain',
        'No Premium Templates',
        'No AI Optimization',
        'No Analytics',
        'Limited Customization'
      ],
      cta: 'Get Started Free',
      color: 'default'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Everything you need to stand out',
      monthlyPrice: 19,
      yearlyPrice: 15,
      popular: true,
      features: [
        '5 Portfolio Websites',
        'All Premium Templates',
        'Custom Domain Support',
        'AI Resume Optimization',
        'Advanced Customization',
        'Priority Support',
        'Remove Branding',
        'Basic Analytics',
        'Resume Download (PDF)',
        'Job-Specific Optimization'
      ],
      limitations: [],
      cta: 'Start Professional',
      color: 'primary'
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For agencies and power users',
      monthlyPrice: 49,
      yearlyPrice: 39,
      popular: false,
      features: [
        'Unlimited Portfolios',
        'All Templates + New Releases',
        'Multiple Custom Domains',
        'Advanced AI Features',
        'White-label Solution',
        'Dedicated Support',
        'Advanced Analytics',
        'API Access',
        'Team Collaboration',
        'Custom Integrations',
        'Priority Feature Requests'
      ],
      limitations: [],
      cta: 'Go Business',
      color: 'accent'
    }
  ]

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Portfolio Websites', free: '1', pro: '5', business: 'Unlimited' },
        { name: 'Template Access', free: 'Basic (3)', pro: 'All Premium', business: 'All + New Releases' },
        { name: 'Custom Domain', free: false, pro: true, business: true },
        { name: 'Subdomain Hosting', free: true, pro: true, business: true },
        { name: 'SSL Certificate', free: true, pro: true, business: true }
      ]
    },
    {
      category: 'AI Features',
      items: [
        { name: 'Resume Parsing', free: 'Basic', pro: 'Advanced', business: 'Advanced' },
        { name: 'Job Optimization', free: false, pro: true, business: true },
        { name: 'Content Suggestions', free: false, pro: true, business: true },
        { name: 'SEO Optimization', free: false, pro: true, business: true }
      ]
    },
    {
      category: 'Customization',
      items: [
        { name: 'Theme Customization', free: 'Limited', pro: 'Full', business: 'Full + Custom' },
        { name: 'Color Schemes', free: '3', pro: 'Unlimited', business: 'Unlimited' },
        { name: 'Font Options', free: '5', pro: '50+', business: '100+' },
        { name: 'Custom CSS', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Analytics & Insights',
      items: [
        { name: 'View Analytics', free: false, pro: 'Basic', business: 'Advanced' },
        { name: 'Visitor Tracking', free: false, pro: true, business: true },
        { name: 'Performance Reports', free: false, pro: false, business: true },
        { name: 'Export Data', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Support',
      items: [
        { name: 'Community Support', free: true, pro: true, business: true },
        { name: 'Email Support', free: false, pro: true, business: true },
        { name: 'Priority Support', free: false, pro: false, business: true },
        { name: 'Phone Support', free: false, pro: false, business: true }
      ]
    }
  ]

  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      )
    }
    return <span className="text-sm font-medium">{value}</span>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Choose the perfect plan for your portfolio needs. No hidden fees, cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/20 rounded-lg p-1 mb-8">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <Badge className="ml-2 bg-accent text-white text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden ${
                    plan.popular 
                      ? 'border-2 border-primary shadow-lg scale-105' 
                      : 'border-2 hover:border-primary/50'
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2">
                      <Badge className="bg-white text-primary">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className={plan.popular ? 'pt-12' : ''}>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="flex items-baseline mt-4">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground ml-2">
                        /{billingCycle === 'yearly' ? 'month' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Billed annually (${price * 12}/year)
                      </p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>

                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        What's Included:
                      </h4>
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}

                      {plan.limitations.length > 0 && (
                        <>
                          <h4 className="font-semibold flex items-center mt-6">
                            <X className="w-4 h-4 text-red-500 mr-2" />
                            Not Included:
                          </h4>
                          {plan.limitations.map((limitation, index) => (
                            <div key={index} className="flex items-start">
                              <X className="w-4 h-4 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-muted">
              <h3 className="text-xl font-semibold">Feature Comparison</h3>
              <p className="text-muted-foreground">Compare all features across plans</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Features</th>
                    <th className="text-center py-4 px-6 font-semibold">Free</th>
                    <th className="text-center py-4 px-6 font-semibold bg-primary/5">
                      Professional
                      <Badge className="ml-2 bg-primary text-white text-xs">Popular</Badge>
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-muted/50">
                        <td colSpan={4} className="py-3 px-6 font-semibold text-sm uppercase tracking-wide">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-gray-100">
                          <td className="py-4 px-6">{item.name}</td>
                          <td className="text-center py-4 px-6">
                            {renderFeatureValue(item.free)}
                          </td>
                          <td className="text-center py-4 px-6 bg-primary/5">
                            {renderFeatureValue(item.pro)}
                          </td>
                          <td className="text-center py-4 px-6">
                            {renderFeatureValue(item.business)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 feature-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate the billing accordingly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans. 
                  If you're not satisfied, contact us for a full refund.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, MasterCard, American Express) 
                  and PayPal. All payments are processed securely through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I use my own domain?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Professional and Business plans include custom domain support. 
                  We'll help you set up your domain and provide SSL certificates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Free plan lets you try the platform with basic features. 
                  For premium features, we offer a 14-day free trial on any paid plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you provide customer support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Free users get community support, Professional users get email support, 
                  and Business users get priority support with phone access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have created stunning portfolios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              <Headphones className="w-5 h-5 mr-2" />
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}