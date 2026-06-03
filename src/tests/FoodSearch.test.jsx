import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FoodSearch from "../components/Food/FoodSearch";
import { vi } from "vitest";
import * as AuthContext from "../components/AuthContext";

vi.mock("../components/AuthContext", () => ({
  useAuth: vi.fn(),
}));

beforeEach(() => {
  AuthContext.useAuth.mockReturnValue({ user: { id: 1, name: "Test User" } });

  global.fetch = vi.fn((url) => {
    if (url.includes("/api/daily-food")) {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    if (url.includes("/food/searchByName")) {
      return Promise.resolve({
        ok: true,
        json: async () => [], 
      });
    }

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

    fireEvent.change(screen.getByPlaceholderText(/Ej: manzana/i), {
      target: { value: "ifiififi" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Buscar/i }));

    const errorMessage = await screen.findByText(
      (content) => content.includes("No se encontraron alimentos con ese término")
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
