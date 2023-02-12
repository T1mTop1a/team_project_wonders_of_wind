import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

import Header from '../pages/home.js';

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

describe("Header component", () => {
    it("Renders home button", () => {
        act(() => {
          render(<MemoryRouter><Header /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='home button']")
            ).toBeInTheDocument();
    });

    it("Renders nav bar", () => {
      act(() => {
        render(<MemoryRouter><Header /></MemoryRouter>, container);
      });
      expect(
          container.querySelector("[data-testid='nav bar']")
          ).toBeInTheDocument();
  });
});
