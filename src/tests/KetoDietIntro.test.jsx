import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import KetoDietIntro from "../components/KetoDietIntro";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("KetoDietIntro", () => {
  it("renders main heading and cards", () => {
    render(
      <MemoryRouter>
        <KetoDietIntro />
      </MemoryRouter>
    );

    // Check main heading
    const heading = screen.getByTestId("main-heading");
    expect(heading).toHaveTextContent(/Bienvenido a/i);
    expect(heading).toHaveTextContent(/StayKeto/i);

    // Check all three cards
    expect(screen.getByTestId("card-macros")).toBeInTheDocument();
    expect(screen.getByTestId("card-cetosis")).toBeInTheDocument();
    expect(screen.getByTestId("card-progreso")).toBeInTheDocument();
  });

  it("calls navigate when 'Comenzar' button is clicked", () => {
    render(
      <MemoryRouter>
        <KetoDietIntro />
      </MemoryRouter>
    );

    // Now get the button after render
    const startButton = screen.getByRole("button", { name: /Comenzar/i, hidden: false });
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);
    expect(mockNavigate).toHaveBeenCalledWith("/landing");
  });
});
