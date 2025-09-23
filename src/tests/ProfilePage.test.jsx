// src/tests/ProfilePage.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ProfilePage from "../components/ProfilePage";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { content: "Sample quote" } }),
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

// Mock ProfilePhotoWithEdit
vi.mock("../components/ProfilePhotoWithEdit", () => ({
  default: () => <div data-testid="profile-photo" />,
}));

// Mock useUser with state
const mockSetUser = vi.fn();

vi.mock("../components/AuthContext", () => {
  const React = require("react");
  return {
    useUser: () => {
      const [user, setUser] = React.useState({
        id: 1,
        name: "Eliana",
        lastName: "Torres",
        birthDate: "01/01/1990",
        age: 35,
        gender: "female",
        email: "eli@example.com",
        currentWeight: 58,
        targetWeight: 54,
        height: 163,
        activityLevel: "Moderado",
        goal: "Perder Peso",
        pregnant: false,
        profilePhoto: "",
      });
      return {
        user,
        setUser: (...args) => {
          mockSetUser(...args); // track calls to setUser
          setUser(...args); // update local state
        },
      };
    },
  };
});

// Mock alert to avoid JSDOM errors
beforeAll(() => {
  vi.stubGlobal("alert", vi.fn());
});

describe("ProfilePage - User Interaction", () => {
  it("should allow editing user name, email and current weight", async () => {
    // Render the ProfilePage component
    render(<ProfilePage />);

    // Open the edit modal
    fireEvent.click(screen.getByTestId("edit-profile-btn"));

    // Change the name
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "María" } });

    // Change the email
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "maria@example.com" } });

    // Change the current weight
    fireEvent.change(screen.getByLabelText(/Peso actual/i), { target: { value: 58 } });

    // Click the save button
    fireEvent.click(screen.getByText(/Guardar cambios/i));

    // Wait for axios.put and setUser to be called with updated data
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:8081/api/users/1`,
        expect.objectContaining({
          name: "María",
          email: "maria@example.com",
          currentWeight: 58,
        })
      );
      expect(mockSetUser).toHaveBeenCalled();
    });
  });
});
