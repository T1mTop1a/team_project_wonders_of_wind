import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

import LogIn from '../pages/login.js';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Login component", () => {
    it("Renders a login button", () => {
        act(() => {
          render(<MemoryRouter><LogIn /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='login button']")
            ).toBeInTheDocument();
    });
    
    it("Renders a email input", () => {
      act(() => {
        render(<MemoryRouter><LogIn /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='email input']")
          ).toBeInTheDocument();
    });

    it("Renders a password input", () => {
      act(() => {
        render(<MemoryRouter><LogIn /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='password input']")
          ).toBeInTheDocument();
    });

    it("Renders a sign up link", () => {
      act(() => {
        render(<MemoryRouter><LogIn /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='signup link']")
          ).toBeInTheDocument();
    });
});