import React from "react";

/**
 * Global error boundary to prevent white screens.
 * Key it by route path (we do this in App.jsx) so it resets per page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // Useful while developing
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    const msg = String(this.state.error?.message || this.state.error);
    return (
      <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h1>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#fee",
            padding: 12,
            border: "1px solid #fbb",
          }}
        >
{msg}
        </pre>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              location.reload();
            }}
            style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 }}
          >
            Clear storage & reload
          </button>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }
}
