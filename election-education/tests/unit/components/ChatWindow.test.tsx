// tests/unit/components/ChatWindow.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWindow } from '@/components/assistant/ChatWindow';
import { generateChatResponse } from '@/lib/google/gemini';

jest.mock('@/lib/google/gemini');
const mockGenerateChatResponse = generateChatResponse as jest.MockedFunction<typeof generateChatResponse>;

const mockMessages = [
  { id: '1', role: 'user' as const, content: 'How do I register to vote?', timestamp: new Date() },
  { id: '2', role: 'assistant' as const, content: 'You can register using Form 6.', timestamp: new Date() },
];

describe('ChatWindow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state with suggested questions', () => {
    render(<ChatWindow messages={[]} onSendMessage={jest.fn()} isLoading={false} />);
    expect(screen.getByText(/How do I register as a voter/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
  });

  it('renders existing messages correctly', () => {
    render(<ChatWindow messages={mockMessages} onSendMessage={jest.fn()} isLoading={false} />);
    expect(screen.getByText('How do I register to vote?')).toBeInTheDocument();
    expect(screen.getByText('You can register using Form 6.')).toBeInTheDocument();
  });

  it('calls onSendMessage when Enter is pressed', async () => {
    const user = userEvent.setup();
    const onSendMessage = jest.fn();
    render(<ChatWindow messages={[]} onSendMessage={onSendMessage} isLoading={false} />);
    
    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'What is EVM?');
    await user.keyboard('{Enter}');
    
    expect(onSendMessage).toHaveBeenCalledWith('What is EVM?');
  });

  it('does NOT send on Shift+Enter (new line)', async () => {
    const user = userEvent.setup();
    const onSendMessage = jest.fn();
    render(<ChatWindow messages={[]} onSendMessage={onSendMessage} isLoading={false} />);
    
    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'Line 1');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    
    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('shows typing indicator when isLoading is true', () => {
    render(<ChatWindow messages={[]} onSendMessage={jest.fn()} isLoading={true} />);
    expect(screen.getByRole('status', { name: /typing/i })).toBeInTheDocument();
  });

  it('disables input while loading', () => {
    render(<ChatWindow messages={[]} onSendMessage={jest.fn()} isLoading={true} />);
    expect(screen.getByRole('textbox', { name: /message/i })).toBeDisabled();
  });

  it('announces new assistant messages to screen readers', async () => {
    const { rerender } = render(
      <ChatWindow messages={[]} onSendMessage={jest.fn()} isLoading={false} />
    );
    rerender(
      <ChatWindow
        messages={[{ id: '1', role: 'assistant', content: 'New response', timestamp: new Date() }]}
        onSendMessage={jest.fn()}
        isLoading={false}
      />
    );
    const liveRegion = screen.getByRole('log');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('clears input after message is sent', async () => {
    const user = userEvent.setup();
    const onSendMessage = jest.fn();
    render(<ChatWindow messages={[]} onSendMessage={onSendMessage} isLoading={false} />);
    
    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    expect(input).toHaveValue('');
  });

  it('does not send empty messages', async () => {
    const user = userEvent.setup();
    const onSendMessage = jest.fn();
    render(<ChatWindow messages={[]} onSendMessage={onSendMessage} isLoading={false} />);
    
    const input = screen.getByRole('textbox', { name: /message/i });
    await user.keyboard('{Enter}');
    
    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('is fully keyboard navigable', async () => {
    const user = userEvent.setup();
    render(<ChatWindow messages={mockMessages} onSendMessage={jest.fn()} isLoading={false} />);
    
    await user.tab();
    expect(document.activeElement).not.toBe(document.body);
  });
});
