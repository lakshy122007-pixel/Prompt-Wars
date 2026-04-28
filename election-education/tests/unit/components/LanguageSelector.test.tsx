// tests/unit/components/LanguageSelector.test.tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSelector } from '@/components/translate/LanguageSelector';

describe('LanguageSelector', () => {
  it('renders current language', () => {
    render(<LanguageSelector currentLanguage="en" onLanguageChange={jest.fn()} />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all 23 supported languages', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(23);
  });

  it('calls onLanguageChange with selected language code', async () => {
    const user = userEvent.setup();
    const onLanguageChange = jest.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={onLanguageChange} />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    await user.click(screen.getByText('हिन्दी'));
    expect(onLanguageChange).toHaveBeenCalledWith('hi');
  });

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    await user.click(screen.getByText('தமிழ்'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={jest.fn()} />);
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
