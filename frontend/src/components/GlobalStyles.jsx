import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    min-width: 320px;
    min-height: 100vh;
    background-color: #effeff;
    color: #060520;
  }

  h1 {
    font-size: 48px;
    line-height: 1.1;
    font-weight: 700;
    margin-bottom: 8px;
  }

  h2 {
    font-size: 34px;
    line-height: 1.2;
    font-weight: 600;
    margin-bottom: 6px;
  }

  h3 {
    font-size: 28px;
    line-height: 1.3;
    font-weight: 500;
    margin-bottom: 5px;
  }

  p {
    font-size: 18px;
    line-height: 1.6;
    font-weight: 400;
    margin-bottom: 24px;
  }

  a {
    font-family: inherit;
    font-size: 18px;
    font-weight: 500;
    color: #646cff;
    text-decoration: none;
  }

  a:hover {
    color: #535bf2;
  }

  button {
    font-family: inherit;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 20px;
    background-color: #1a1a1a;
    color: white;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: border-color 0.25s, opacity 0.2s;
  }

  button:hover {
    opacity: 0.8;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

export default GlobalStyles;
