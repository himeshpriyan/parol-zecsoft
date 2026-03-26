import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI Payroll Assistant. Ask me about your salary, leave balance, or payroll summary.", isBot: true }
  ]);
  
  const { user, leaves, salaries, employees } = useAppContext();

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !user) return;

    // Add user message
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    // Mock AI NLP logic
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = "I'm still learning. Try asking about 'salary', 'leave balance', or 'payroll summary'.";

      if (lower.includes('salary') || lower.includes('pay')) {
        const mySal = salaries.filter(s => s.employeeId === user.id);
        if (mySal.length > 0) {
          reply = `Your latest net pay is ₹${mySal[mySal.length - 1].netPay.toLocaleString('en-IN')}.`;
        } else {
          reply = `Your base salary is ₹${user.salaryStructure.basic.toLocaleString('en-IN')} per month.`;
        }
      } 
      else if (lower.includes('leave') || lower.includes('balance') || lower.includes('holiday')) {
        const usedSick = leaves.filter(l => l.employeeId === user.id && l.type === 'Sick' && l.status === 'Approved').length;
        reply = `You have ${12 - usedSick} sick leaves remaining out of 12.`;
      }
      else if ((lower.includes('summary') || lower.includes('payroll cost')) && user.role !== 'Employee') {
        const cost = employees.reduce((acc, emp) => acc + emp.salaryStructure.basic + emp.salaryStructure.hra + emp.salaryStructure.da, 0);
        reply = `The total projected payroll cost for this month is ₹${cost.toLocaleString('en-IN')}.`;
      }
      else if (lower.includes('hi') || lower.includes('hello')) {
        reply = `Hello ${user.name.split(' ')[0]}! How can I assist you with payroll today?`;
      }

      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }, 600);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary animate-fade-in"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          zIndex: 100
        }}
        title="AI Chat Assistant"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="card animate-fade-in" style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '350px',
      height: '500px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      overflow: 'hidden',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--accent-primary)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Payroll AI Assistant</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: 'var(--bg-dark)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
            <div style={{
              maxWidth: '80%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              borderBottomLeftRadius: msg.isBot ? '0' : 'var(--radius-lg)',
              borderBottomRightRadius: msg.isBot ? 'var(--radius-lg)' : '0',
              backgroundColor: msg.isBot ? 'var(--bg-card)' : 'var(--accent-primary)',
              color: msg.isBot ? 'var(--text-primary)' : 'white',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              border: msg.isBot ? '1px solid var(--border-color)' : 'none'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            style={{
              backgroundColor: input.trim() ? 'var(--accent-primary)' : 'var(--bg-dark)',
              color: input.trim() ? 'white' : 'var(--text-muted)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              cursor: input.trim() ? 'pointer' : 'default'
            }}
          >
            <Send size={18} style={{ marginLeft: '-2px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
