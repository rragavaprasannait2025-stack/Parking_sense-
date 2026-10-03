import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Brain, Send, Sparkles, Bot, User as UserIcon, RefreshCw,
  Zap, MapPin, DollarSign, Clock, Leaf, Shield, ArrowRight,
  CheckCircle, ThumbsUp, ThumbsDown
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { BookingModal } from '@/components/booking/BookingModal'
import { DEMO_FACILITIES, DEMO_RECOMMENDATION } from '@/services/demoData'
import { useUser } from '@/store/authStore'
import { formatCurrency } from '@/lib/utils'
import type { ParkingFacility, ParkingSlot } from '@/types'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  recommendation?: typeof DEMO_RECOMMENDATION
  facility?: ParkingFacility
  slots?: ParkingSlot[]
  quickReplies?: string[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: "Hello! I'm your ParkSense-X AI Parking Concierge. I can find the best slot based on your preferences, predict upcoming congestion, optimize for EV charging or carbon savings, or assist with your bookings. How can I help you today?",
    timestamp: 'Just now',
    quickReplies: [
      '⚡ Find greenest slot near Trade Centre',
      '💰 Cheapest parking available right now',
      '🔮 What is the 60-min occupancy forecast?',
      '🔌 I need an EV slot near the elevator',
    ],
  },
]

export default function AIAssistantPage() {
  const user = useUser()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<ParkingFacility>(DEMO_FACILITIES[0])
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim()) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    if (!queryText) setInput('')
    setIsTyping(true)

    // Simulate intelligent multi-objective agent response
    await new Promise(r => setTimeout(r, 1200))

    const q = textToSend.toLowerCase()
    let reply: Message

    if (q.includes('ev') || q.includes('electric') || q.includes('charg')) {
      const fac = DEMO_FACILITIES[0]
      const evSlot = fac.floors[0]?.zones[2]?.slots[0] || DEMO_RECOMMENDATION.slot
      reply = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `I've analyzed available charging stations across 3 facilities. **Chennai Trade Centre - Zone C (EV)** has high-speed Type-2 chargers active with 94% availability confidence.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        facility: fac,
        recommendation: {
          ...DEMO_RECOMMENDATION,
          slot: { ...evSlot, slotCode: 'C01', hasEvCharger: true, isCovered: true },
          suitabilityScore: 97,
          explanation: 'Optimal EV charging spot with dedicated 22kW fast charger, covered roof protection, and 45m distance to elevator.',
        },
        quickReplies: ['Book Slot C01 now', 'Show nearby alternative facilities', 'How much will charging cost?'],
      }
    } else if (q.includes('cheap') || q.includes('cost') || q.includes('price')) {
      const cheapest = [...DEMO_FACILITIES].sort((a, b) => a.pricePerHour - b.pricePerHour)[0]
      reply = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `**${cheapest.name}** offers the most economical rate at **₹${cheapest.pricePerHour}/hr** (${cheapest.availableSlots} slots available). Dynamic pricing is currently standard (no peak surge).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        facility: cheapest,
        quickReplies: ['Book cheapest spot', 'Compare with closest facility', 'Show hourly price trend'],
      }
    } else if (q.includes('forecast') || q.includes('occupan') || q.includes('predict') || q.includes('peak')) {
      reply = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Our **XGBoost & LSTM Demand Predictor** forecasts **Chennai Trade Centre** occupancy will rise from **72% → 91%** over the next 60 minutes due to evening rush hour. I recommend reserving now to secure a spot before surge pricing kicks in.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        facility: DEMO_FACILITIES[0],
        quickReplies: ['Reserve now to lock ₹60/hr', 'Check Phoenix Marketcity forecast', 'View digital twin live map'],
      }
    } else if (q.includes('green') || q.includes('carbon') || q.includes('eco')) {
      reply = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `By routing to **Slot B24 at Level 1**, your estimated cruising time inside the garage is cut by 68%, saving **~0.8 kg CO₂** compared to unguided search. Eco score for this route is **90/100**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendation: DEMO_RECOMMENDATION,
        facility: DEMO_FACILITIES[0],
        quickReplies: ['Book eco-optimized slot', 'View my carbon stats', 'Switch to Greenest mode'],
      }
    } else {
      reply = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your profile preference (**${user?.preferences?.optimizationMode ?? 'Balanced'}**), I have evaluated 240 active slots. **Slot ${DEMO_RECOMMENDATION.slot.slotCode}** at **${DEMO_FACILITIES[0].name}** offers the highest composite score (94/100).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendation: DEMO_RECOMMENDATION,
        facility: DEMO_FACILITIES[0],
        quickReplies: ['Confirm this booking', 'Try Closest preference', 'Check live occupancy'],
      }
    }

    setIsTyping(false)
    setMessages(prev => [...prev, reply])
  }

  const handleBookSlot = (facility: ParkingFacility, slot: ParkingSlot) => {
    setSelectedFacility(facility)
    setSelectedSlot(slot)
    setBookingOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Brain size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">AI Parking Assistant</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Powered by ParkSense-X Multi-Objective Orchestration Engine · Natural language parking assistance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={13} />}
            onClick={() => setMessages(INITIAL_MESSAGES)}
          >
            Reset Chat
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-[620px] flex flex-col p-0 overflow-hidden border-surface-800 shadow-2xl">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-800 border border-surface-700 text-brand-400'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white p-3.5 rounded-2xl rounded-tr-sm'
                    : 'bg-surface-900 border border-surface-800 text-surface-200 p-4 rounded-2xl rounded-tl-sm'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                {/* Optional Recommendation Card */}
                {msg.recommendation && (
                  <div className="bg-surface-950/80 border border-surface-700/80 rounded-xl p-3.5 space-y-3 text-surface-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="info" size="sm" className="mb-1">Top Recommendation</Badge>
                        <h4 className="text-lg font-black text-surface-50">
                          Slot {msg.recommendation.slot.slotCode}
                        </h4>
                        <p className="text-xs text-surface-400">
                          {msg.facility?.name ?? msg.recommendation.facilityName} · Level {msg.recommendation.slot.floor} · Zone {msg.recommendation.slot.zone}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-brand-400">
                          {msg.recommendation.suitabilityScore}
                        </span>
                        <span className="text-2xs text-surface-500 block">Suitability</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {msg.recommendation.factors.slice(0, 3).map(f => (
                        <div key={f.name}>
                          <div className="flex justify-between text-2xs mb-0.5 text-surface-400">
                            <span>{f.icon} {f.name}</span>
                            <span className="font-bold text-surface-200">{f.score}/100</span>
                          </div>
                          <ProgressBar value={f.score} size="xs" color="#6366f1" />
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-brand-900/30 border border-brand-800/40 rounded-lg text-2xs text-brand-300 leading-relaxed">
                      {msg.recommendation.explanation}
                    </div>

                    <Button
                      variant="primary"
                      size="xs"
                      fullWidth
                      rightIcon={<ArrowRight size={12} />}
                      onClick={() => handleBookSlot(msg.facility || DEMO_FACILITIES[0], msg.recommendation!.slot)}
                    >
                      Book Slot {msg.recommendation.slot.slotCode} (₹{msg.recommendation.slot.pricePerHour}/hr)
                    </Button>
                  </div>
                )}

                {/* Optional Facility Mini Card */}
                {!msg.recommendation && msg.facility && (
                  <div className="bg-surface-950/80 border border-surface-700/80 rounded-xl p-3 flex items-center justify-between gap-3 text-surface-100">
                    <div>
                      <h4 className="text-xs font-bold text-surface-100">{msg.facility.name}</h4>
                      <p className="text-2xs text-surface-400">{msg.facility.availableSlots} free · ₹{msg.facility.pricePerHour}/hr</p>
                    </div>
                    <Link to={`/driver/facility/${msg.facility.id}`}>
                      <Button variant="primary" size="xs">View Facility</Button>
                    </Link>
                  </div>
                )}

                <div className={`text-2xs ${msg.sender === 'user' ? 'text-brand-200' : 'text-surface-500'} flex items-center justify-between`}>
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-1 opacity-70">
                      <button className="hover:text-available transition-colors" title="Helpful"><ThumbsUp size={11} /></button>
                      <button className="hover:text-occupied transition-colors" title="Not helpful"><ThumbsDown size={11} /></button>
                    </div>
                  )}
                </div>

                {/* Quick Reply Chips */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-800/80">
                    {msg.quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(qr)}
                        className="text-2xs px-2.5 py-1 bg-surface-800/80 hover:bg-brand-900/50 hover:border-brand-600 border border-surface-700 rounded-full text-surface-300 transition-all cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-surface-800 border border-surface-700 text-brand-400 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-surface-900 border border-surface-800 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-surface-900 border-t border-surface-800">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about slots, pricing, EV charging, forecasts, or eco routing…"
              className="flex-1 bg-surface-950 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || isTyping}
              rightIcon={<Send size={15} />}
            >
              Send
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2 text-2xs text-surface-500 px-1">
            <span>⚡ Simulated multi-agent AI response</span>
            <span>Natural language parking orchestration</span>
          </div>
        </div>
      </Card>

      {/* Booking Modal Integration */}
      {bookingOpen && (
        <BookingModal
          facility={selectedFacility}
          preselectedSlot={selectedSlot}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  )
}
