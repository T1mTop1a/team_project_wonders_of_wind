import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
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
    it("Renders", () => {
        act(() => {
          render(<MemoryRouter><LogIn /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='login button']")
            ).toBeInTheDocument();
});
});