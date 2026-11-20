// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import App from '../App';

const NAV = [
  ['Compensation Calc', 'offer'],
  ['Offer Justification', 'justification'],
  ['Candidate Sourcing', 'sourcing'],
  ['Interview Analyzer', 'interview'],
  ['Playbook Generator', 'playbook'],
  ['Comms Builder', 'comm'],
  ['System Settings', 'settings'],
  ['Dashboard', 'System Overview'],
];

describe('TT-Recruit runs without a backend', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the shell even when WebGL is unavailable', () => {
    render(<App />);
    expect(screen.getByText('TT-RECRUIT')).toBeTruthy();
    expect(screen.getByText('System Overview')).toBeTruthy();
  });

  it('opens every module from the sidebar without crashing', () => {
    const { container } = render(<App />);
    const nav = screen.getByRole('navigation');
    for (const [label, header] of NAV) {
      fireEvent.click(within(nav).getByText(label));
      expect(container.querySelector('header h2').textContent).toBe(header);
    }
  });

  it('keeps quick tasks in localStorage across reloads', () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText('QUICK TASK...');
    fireEvent.change(input, { target: { value: 'Prep debrief for panel' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Prep debrief for panel')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('tt_recruit_tasks'))).toHaveLength(1);

    unmount();
    render(<App />);
    expect(screen.getByText('Prep debrief for panel')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Mark task done'));
    expect(JSON.parse(localStorage.getItem('tt_recruit_tasks'))[0].completed).toBe(true);

    fireEvent.click(screen.getByLabelText('Delete task'));
    expect(screen.queryByText('Prep debrief for panel')).toBeNull();
    expect(JSON.parse(localStorage.getItem('tt_recruit_tasks'))).toHaveLength(0);
  });
});
