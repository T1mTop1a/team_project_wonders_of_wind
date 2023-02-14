import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

import SignUp from '../pages/signup.js';

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

describe("Sign up component", () => {
    it("Renders input box", () => {
      act(() => {
        render(<MemoryRouter><SignUp /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='input box']")
          ).toBeInTheDocument();
    });

    it("Renders name input", () => {
      act(() => {
        render(<MemoryRouter><SignUp /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='name input']")
          ).toBeInTheDocument();
    });

    it("Renders email input", () => {
      act(() => {
        render(<MemoryRouter><SignUp /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='email input']")
          ).toBeInTheDocument();
    });

    it("Renders password input", () => {
      act(() => {
        render(<MemoryRouter><SignUp /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='password input']")
          ).toBeInTheDocument();
    });

    it("Renders sign up button", () => {
      act(() => {
        render(<MemoryRouter><SignUp /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='signup button']")
          ).toBeInTheDocument();
    });

    it("Renders log in link", () => {
      act(() => {
        render(<MemoryRouter><SignUp /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='login link']")
          ).toBeInTheDocument();
    });
});