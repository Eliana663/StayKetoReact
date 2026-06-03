import { vi } from 'vitest';

// Mock function for useNavigate
export const mockNavigate = vi.fn();

// Partial mock of react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); 
  return {
    ...actual,                      l
    useNavigate: () => mockNavigate, 
  };
});
