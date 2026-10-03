import { useState } from 'react'
import { Mail, MessageSquare, MapPin, Send, CheckCircle, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PublicFooter } from './PublicFooter'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    toast.success('Thank you! Your inquiry has been sent to the ParkSense-X research team.')
  }

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 flex flex-col pt-16">
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 w-full">
        <div className="text-center space-y-3">
          <Badge variant="available" size="md">Get In Touch</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-surface-50">
            Contact &amp; Academic Inquiries
          </h1>
          <p className="text-surface-400 text-sm max-w-lg mx-auto">
            Have questions about the ParkSense-X digital twin algorithms, paper citations, or demonstration setup?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <Card className="p-5 space-y-2 bg-surface-900 border-surface-800">
              <div className="w-9 h-9 rounded-xl bg-brand-900/50 border border-brand-800 flex items-center justify-center text-brand-400 mb-1">
                <Mail size={18} />
              </div>
              <h3 className="font-bold text-surface-100 text-sm">Research Team Email</h3>
              <p className="text-xs text-surface-400">contact@parksensex.demo</p>
              <p className="text-2xs text-surface-500">Inquiries answered within 24 hours</p>
            </Card>

            <Card className="p-5 space-y-2 bg-surface-900 border-surface-800">
              <div className="w-9 h-9 rounded-xl bg-available/10 border border-available/30 flex items-center justify-center text-available mb-1">
                <MapPin size={18} />
              </div>
              <h3 className="font-bold text-surface-100 text-sm">Demo Facilities Tested</h3>
              <p className="text-xs text-surface-400">Chennai Metro Area, India</p>
              <p className="text-2xs text-surface-500">Trade Centre · Phoenix Marketcity · Express Ave</p>
            </Card>

            <Card className="p-5 space-y-2 bg-surface-900 border-surface-800">
              <div className="w-9 h-9 rounded-xl bg-reserved/10 border border-reserved/30 flex items-center justify-center text-reserved mb-1">
                <Sparkles size={18} />
              </div>
              <h3 className="font-bold text-surface-100 text-sm">Academic Project</h3>
              <p className="text-xs text-surface-400">Final-Year B.Tech / B.E. IT</p>
              <p className="text-2xs text-surface-500">Autonomous AI Parking Framework</p>
            </Card>
          </div>

          {/* Form */}
          <Card className="lg:col-span-2 p-6 bg-surface-900 border-surface-800">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-full bg-available/20 border border-available mx-auto flex items-center justify-center text-available">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-xl font-bold text-surface-50">Message Received!</h3>
                <p className="text-xs text-surface-400 max-w-sm mx-auto">
                  Thank you for reaching out. We will review your inquiry and get back to you promptly.
                </p>
                <Button variant="ghost" size="sm" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Krishnan"
                    required
                  />
                  <Input
                    label="Your Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Digital Twin Simulation Demonstration"
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Message / Inquiry</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us your questions about the project or integration requirements…"
                    className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" rightIcon={<Send size={14} />}>
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
