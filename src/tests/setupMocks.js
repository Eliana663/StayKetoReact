import { vi } from 'vitest';

export const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); 
  return {
    ...actual,
    useNavigate: () => mockNavigate, 
  };
});