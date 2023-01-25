import React from "react";
import {render, screen } from "@testing-library/react";
import Header from '../pages/home.js';
import { BrowserRouter as Router } from "react-router-dom";

describe("Header component", () => {
    it("should register component correctly", () => {
        render(<React.StrictMode><Router><Header /></Router></React.StrictMode>);
        const element = screen.getByTestId("nav button");
        expect(element).toBeInTheDocument();
    });
});