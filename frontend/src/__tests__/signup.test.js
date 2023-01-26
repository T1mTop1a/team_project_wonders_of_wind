import React from "react";
import {render, screen } from "@testing-library/react";
import SignUp from '../pages/signup.js';
import { BrowserRouter as Router } from "react-router-dom";

describe("Signup component", () => {
    it("should register component correctly", () => {
        render(<React.StrictMode><Router><SignUp /></Router></React.StrictMode>);
        const element = screen.getByTestId("signup button");
        expect(element).toBeInTheDocument();
    });
});