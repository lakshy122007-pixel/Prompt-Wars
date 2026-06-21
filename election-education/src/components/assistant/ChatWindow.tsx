import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

const STARTER_QUESTIONS = [
  'How do I register as a voter?',
  'What documents are needed for Form 6?',
  'How can I find my polling station?',
  'What is an EVM and VVPAT?'
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-card border border-border rounded-2xl overflow-hidden shadow-md">
      <div
        role="log"
        aria-live="polite"
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">AI Election Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask any questions about voter registration, polling booths, rules, or the voting process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {STARTER_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  disabled={isLoading}
                  className="p-3 border border-border hover:border-primary text-xs font-semibold rounded-xl text-left hover:bg-muted transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted text-foreground rounded-tl-none border border-border'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div
              role="status"
              aria-label="Typing"
              className="bg-muted text-muted-foreground p-3.5 rounded-2xl rounded-tl-none border border-border text-sm flex items-center space-x-1"
            >
              <span className="animate-bounce font-extrabold">.</span>
              <span className="animate-bounce font-extrabold" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce font-extrabold" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type a message..."
            aria-label="Message"
            className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring resize-none outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-all focus-ring"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
