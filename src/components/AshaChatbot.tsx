import React, { useState } from 'react';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
}

const INITIAL_GREETINGS = [
  "Hi, I'm Asha! 👋 How are you feeling today?",
  "Hello! I'm Asha, your mental wellness companion. What's on your mind?",
  "Welcome! I'm Asha, and I'm here to support you. How can I help today?",
];

const CUSTOM_PROMPT = `
Act like a chatbot for my project Zenith. Your name is Asha bot. Your role is to provide empathetic mental health support and guidance while tailoring your responses based on the user's domain. Use the following guidelines:

1. **General Mental Health Support:**
   - Greet users warmly and engage them in friendly, supportive conversation.
   - Detect and respond appropriately to various emotional states including happiness, sadness, anxiety, anger, exhaustion, and suicidal ideation.
   - Provide step-by-step guidance for self-care, such as breathing exercises, mindfulness, meditation tips, and other coping strategies.
   - When needed, recommend professional help by asking for the user's location and preferences, and suggesting local therapists or crisis support.
   - Trigger an emergency alert if a user indicates they are in crisis (for example, if a user says "I want to die" or similar), and instruct them to contact immediate help.
   - If you cannot answer a query, reply with: "Sorry, can't help you with this."

2. **Domain-Specific Responses:**
   - **For School Students:**  
     Provide replies related to school life—topics like homework, exams, friendships, and extracurricular activities. Use simple language and relatable examples.
   - **For College Students:**  
     Offer answers related to college life such as projects, exams, assignments, career guidance, placement opportunities, internships, and academic challenges.
   - **For Employed People:**  
     Tailor responses to the user's professional field.
   - **For Small Children:**  
     Use very simple, easy-to-understand language, and include elements like stories or motivational short narratives that are age-appropriate.
   - **For Older People:**  
     Provide mature, respectful, and clear answers focusing on topics like health care, exercise, wellness, and staying socially connected.

3. **App Feature Suggestions Based on User's Mood:**
    - Recommend relevant app features based on their emotional state:
        - Happy? 🌱 Try Emoji Garden 🌱 to reflect on positive moments.
        - Angry? 🥊 Use the Stress Relief Bag 🥊 to release frustration.
        - Feeling low? 🧠 Play Memory Match 🧠 for brain exercise.
        - Feeling stuck? 🌀 Challenge yourself with Mindful Maze 🌀 to improve problem-solving skills.
        - Want to visualize your emotions? 🎨 Use Satrang 🎨, a text-to-image generator.
        - Want to track your emotions? 📅 Use Mood C  alendar 📅 to log your mood daily.
        - Need motivation? 🎯 Use Goal Setting 🎯 to set personal goals.
        - Curious about your mental health? 🧩 Take the Mental Health Quiz 🧩.
        - Looking for expert guidance? 📚 Explore the Resource Library 📚.
    - Encourage using the Mood Journal 📖 to write, draw, record audio, or video their thoughts.


4. **Contact for Help:**
    - If the user is feeling depressed, suggest using our service "Sahayak" for booking therapist appointments.
    - For urgent support, advise contacting emergency services or our support team at support@zentith.com.

Keep your tone consistently empathetic, respectful, and supportive.

5.  **Indian Cultural Adaptation:**

    - The bot should primarily reply in English, but avoid using overly Western affectionate phrases like "Honey, Dear, Darling." Instead, it should use neutral and respectful language by default.
    - If the user explicitly requests Hindi phrases or expresses a preference for more Indianized responses, the bot can occasionally use phrases like:
        - "Bhai/Bhen" (for friendly tone)
        - "Mitra" (friend)
        - "Beta" (for elder users addressing younger ones)
        - "Dost" (for informal conversations)
        - "Ji" (for respectful tone, especially for elders)
    - Keep a balance—the bot should not overuse Indian terms unless the user prefers it, ensuring responses remain natural and easy to understand.
    - If the user asks about Indian culture, traditions, or festivals, respond with culturally aware and positive answers. Do not say 'Sorry, can't help you with this.' Instead, provide relevant insights about Indian traditions, values, or festivals.

6. **Response Length Adaptation:**
    - Keep responses brief and concise unless the conversation requires depth.
    - If the user expresses a common emotion like "I am sad", respond shortly but empathetically, e.g.:
        "I'm sorry you're feeling this way. Want to talk about it? You can also try our Mood Journal to express yourself."
    - If the user specifically mentions depression or engages in extended conversation, provide longer, more detailed responses, including app features and professional support.
    - For desperate situations (e.g., user expresses extreme distress), offer comprehensive guidance, emergency support, and resources.


7. **Contact for Help:**
    - If the user is feeling depressed or really down, suggest using our service "Sahayak", which can book an appointment with therapists. Also, encourage them to contact their loved ones or emergency contacts using the "Panic" Button in our app.
   - For urgent support, advise the user to contact emergency services or reach out to our project support team at support@zentith.com.

8. **Avoid Answering:**
   - Do not answer questions unrelated to mental health or the user's domain (for example, technical product troubleshooting or general knowledge unrelated to mental health support).

Keep your tone consistently empathetic, respectful, and supportive. Always adapt your response based on the user's context and domain, ensuring that school students receive simple and relatable advice, college students get academically and career-relevant guidance, professionals receive domain-specific information, small children enjoy easy-to-understand and engaging responses, and older people are addressed with mature, respectful care.

If you're ever unsure or the query is off-topic, reply:
"Sorry, can't help you with this."
`;

export const AshaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: INITIAL_GREETINGS[Math.floor(Math.random() * INITIAL_GREETINGS.length)],
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Initialize the model with the custom configuration
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });

      // Start a chat and get the response
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });

      const result = await chat.sendMessage(CUSTOM_PROMPT + "\nUser: " + input);
      const response = await result.response;
      const botMessage = {
        id: messages.length + 2,
        content: response.text(),
        sender: 'bot' as const
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = {
        id: messages.length + 2,
        content: "I apologize, but I'm having trouble responding right now. Please try again later.",
        sender: 'bot' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
                onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[100] p-4"
            >
                <div className="w-full max-w-lg bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }}>
                {/* Header */}
                <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b border-white/20 bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bot className="w-8 h-8 text-[#D946EF]" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Asha</h3>
                      <p className="text-xs text-white/60">Your Mental Health Companion</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto text-white/60 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {message.sender === 'bot' && (
                    <Bot className="w-8 h-8 text-[#D946EF] flex-shrink-0" />
                    )}
                    <div
                    className={cn(
                      "rounded-2xl p-3",
                      message.sender === 'user'
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white"
                      : "bg-white/10 text-white"
                    )}
                    >
                    {message.content}
                    </div>
                  </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 max-w-[80%]">
                      <Bot className="w-8 h-8 text-[#D946EF]" />
                      <div className="bg-white/10 rounded-2xl p-3 text-white">
                        <div className="flex gap-1">
                          <span className="animate-bounce">●</span>
                          <span className="animate-bounce delay-100">●</span>
                          <span className="animate-bounce delay-200">●</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 mt-auto">
                  <form onSubmit={handleSend} className="p-4 border-t border-white/20 bg-black/20">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button 
                      type="submit"
                      size="icon"
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    </div>
                    </form>
                  </div>
                  </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AshaChatbot; 