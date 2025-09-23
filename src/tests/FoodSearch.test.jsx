import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FoodSearch from "../components/Food/FoodSearch";
import { vi } from "vitest";
import * as AuthContext from "../components/AuthContext";

// Mock useUser
vi.mock("../components/AuthContext", () => ({
  useUser: vi.fn(),
}));

beforeEach(() => {
  // Mock the logged-in user
  AuthContext.useUser.mockReturnValue({ user: { id: 1, name: "Test User" } });

  // Mock all fetch calls used by the component
  global.fetch = vi.fn((url) => {
    if (url.includes("/api/daily-food")) {
      // For fetchTodaySelectedItems
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    if (url.includes("/food/searchByName")) {
      // For search
      return Promise.resolve({
        ok: true,
        json: async () => [], // <-- empty array triggers error
      });
    }

    // default fallback
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("FoodSearch - Invalid input", () => {
  it("shows an error when no foods are found", async () => {
    render(<FoodSearch />);

    // Type an invalid food name
    fireEvent.change(screen.getByPlaceholderText(/Ej: manzana/i), {
      target: { value: "ifiififi" },
    });

    // Click the search button
    fireEvent.click(screen.getByRole("button", { name: /Buscar/i }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(
      (content) => content.includes("No se encontraron alimentos con ese término")
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
