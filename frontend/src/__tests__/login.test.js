import React from "react";
import {render, screen } from "@testing-library/react";
import LogIn from '../pages/login.js';
import { BrowserRouter as Router } from "react-router-dom";

describe("Login component", () => {
    it("should register component correctly", () => {
        render(<React.StrictMode><Router><LogIn /></Router></React.StrictMode>);
        const element = screen.getByTestId("login button");
        expect(element).toBeInTheDocument();
    });
});