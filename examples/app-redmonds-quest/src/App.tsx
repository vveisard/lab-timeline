import { type Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
//
import { AnimateTransformExampleRoute } from "./routes/AnimateTransform.tsx";
import { RevealTextExampleRoute } from "./routes/RevealText.tsx";

const App: Component = () => {
  return (
    <>
      <Router>
        <Route
          path="/animate-transform"
          component={AnimateTransformExampleRoute}
        />
        <Route path="/reveal-text" component={RevealTextExampleRoute} />
      </Router>
      <nav
        style={{
          display: "flex",
          "flex-direction": "column",
        }}
      >
        <a href="/animate-transform">Animate Transform</a>
        <a href="/reveal-text">Reveal Text</a>
        <a href="/">Home</a>
      </nav>
    </>
  );
};

export default App;
