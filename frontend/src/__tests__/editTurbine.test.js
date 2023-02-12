import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

import EditTurbine from '../pages/EditTurbine.js';

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

describe("Edit Turbine component", () => {
    it("Renders a submit button", () => {
        act(() => {
          render(<MemoryRouter><EditTurbine /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='submit button']")
            ).toBeInTheDocument();
    });
    
    it("Renders a turbine name input", () => {
        act(() => {
          render(<MemoryRouter><EditTurbine /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='turbine name']")
            ).toBeInTheDocument();
    });

    it("Renders a turbine longitude input", () => {
        act(() => {
          render(<MemoryRouter><EditTurbine /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='turbine longitude']")
            ).toBeInTheDocument();
    });

    it("Renders a turbine latitude input", () => {
        act(() => {
          render(<MemoryRouter><EditTurbine /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='turbine latitude']")
            ).toBeInTheDocument();
    });

    it("Renders a turbine height input", () => {
        act(() => {
          render(<MemoryRouter><EditTurbine /></MemoryRouter>, container);
        });
        expect(
            container.querySelector("[data-testid='turbine height']")
            ).toBeInTheDocument();
    });
});