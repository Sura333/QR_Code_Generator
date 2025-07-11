// src/App.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('QR Code Generator');
  });

  it('renders the input box', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter text or URL');
    expect(input).toBeInTheDocument();
  });

  it('shows QR code and buttons when text is entered', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter text or URL');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    //expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Share QR Code')).toBeInTheDocument();
    //expect(screen.getByText('Download').closest('button')).toBeInTheDocument();
    expect(screen.getByText('Download QR Code')).toBeInTheDocument();
    expect(screen.getByText(/Download/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download QR Code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
    //expect(screen.getByText('Share').closest('button')).toBeInTheDocument();
  });
});
