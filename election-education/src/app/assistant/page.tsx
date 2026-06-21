/**
 * @module AI Assistant Page
 * @description Chat interface for the AI Election Assistant powered by Gemini.
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Loader2,
  MessageSquare,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
}

const suggestedQuestions = [
  'How do I register as a voter for the first time?',
  'What is NOTA and how does it work?',
  'Explain the EVM and VVPAT process',
  'What are the powers of the Election Commission?',
  'Who is eligible to vote in India?',
  'What happens on polling day?',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateId = () => Math.random().toString(36).substring(7);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      try {
        const { getIdToken } = await import('@/lib/firebase/auth');
        const token = await getIdToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch {
        // Ignore auth retrieval errors
      }

      const loadStart = Date.now();

      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        }),
      });

      // Ensure loading indicator visible for at least 500ms
      const elapsed = Date.now() - loadStart;
      if (elapsed < 500) {
        await new Promise((r) => setTimeout(r, 500 - elapsed));
      }

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const responseText = typeof data.data === 'object' && data.data ? data.data.content : data.data;

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseText || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Ensure loading indicator visible for at least 500ms even on error
      await new Promise((r) => setTimeout(r, 400));
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please check your connection and try again. If the issue persists, the AI service may be temporarily unavailable.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const setFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, feedback } : m
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-india-green flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">ElectionBot</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Powered by Gemini 2.0 Flash
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        <div className="mx-auto max-w-3xl space-y-6">
          <div aria-live="polite" aria-atomic="false" className="sr-only" data-testid="messages-live-region">
            {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant'
              ? messages[messages.length - 1].content
              : ''}
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron/20 via-white/10 to-india-green/20 flex items-center justify-center mx-auto mb-6 border border-border">
                <Sparkles className="w-10 h-10 text-saffron" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ask me anything about Indian elections!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                I can help with voter registration, polling process, constitutional provisions, election laws, and more.
              </p>

              {/* Suggested questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto" data-testid="suggested-questions">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    data-testid="suggested-question"
                    className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mb-1" />
                    <span className="text-foreground">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                data-testid={msg.role === 'assistant' ? 'assistant-message' : undefined}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    msg.role === 'user'
                      ? 'bg-primary'
                      : 'bg-gradient-to-br from-saffron to-india-green'
                  )}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div className="max-w-[80%] group">
                  <div
                    className={cn(
                      msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>

                  {/* Actions for bot messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                        aria-label="Copy message"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFeedback(msg.id, 'positive')}
                        className={cn(
                          'p-1 rounded hover:bg-muted',
                          msg.feedback === 'positive' ? 'text-green-500' : 'text-muted-foreground'
                        )}
                        aria-label="Thumbs up"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFeedback(msg.id, 'negative')}
                        className={cn(
                          'p-1 rounded hover:bg-muted',
                          msg.feedback === 'negative' ? 'text-red-500' : 'text-muted-foreground'
                        )}
                        aria-label="Thumbs down"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3" data-testid="typing-indicator">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-india-green flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble-bot flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-xl px-4 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2 bg-muted rounded-2xl border border-border p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about elections, voting, or your rights..."
              data-testid="chat-input"
              className="flex-1 bg-transparent border-0 outline-none resize-none text-sm px-3 py-2 max-h-32 scrollbar-thin placeholder:text-muted-foreground"
              rows={1}
              aria-label="Type your message"
            />
            <Button
              type="submit"
              size="icon"
              variant="primary"
              disabled={!input.trim() || isLoading}
              className="shrink-0 rounded-xl"
              aria-label="Send message"
              data-testid="send-button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            ElectionBot provides educational information only. Verify important details with official ECI sources.
          </p>
        </form>
      </div>
    </div>
  );
}
