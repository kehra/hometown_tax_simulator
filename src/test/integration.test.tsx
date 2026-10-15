import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders simple mode with 30-second easy input by default', () => {
    render(<App />);
    expect(screen.getByText('ふるさと納税シミュレータ')).toBeDefined();
    expect(screen.getByText('かんたん30秒入力')).toBeDefined();
    expect(screen.getByText('シミュレーション結果')).toBeDefined();
  });

  it('switches to detailed mode and displays full 4 sections', () => {
    render(<App />);
    const detailedTab = screen.getByText('詳細モード');
    fireEvent.click(detailedTab);

    expect(screen.getByText('1. 事業の収入と経費')).toBeDefined();
    expect(screen.getByText('2. 社会保険・共済・年金')).toBeDefined();
    expect(screen.getByText('3. ご家族・扶養の状況')).toBeDefined();
    expect(screen.getByText('4. その他の控除 ＆ その他所得')).toBeDefined();
  });
});
