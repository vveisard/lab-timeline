import { type Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { AdvancedRunTimeRoute } from "./routes/AdvancedRunTime.tsx";
import { BasicRunCountRoute } from "./routes/RunCount.tsx";

const App: Component = () => {
  return (
    <>
      <Router>
        <Route path="/run-time" component={AdvancedRunTimeRoute} />
        <Route path="/run-count" component={BasicRunCountRoute} />
      </Router>
      <nav
        style={{
          display: "flex",
          "flex-direction": "column",
        }}
      >
        <a href="/run-time">Run Time</a>
        <a href="/run-count">Run Count</a>
        <a href="/">Home</a>
      </nav>
    </>
  );
};

export default App;
