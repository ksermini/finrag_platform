export default function AskBox({ query, setQuery, onSubmit }) {
    return (
      <div className="ask-box">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a financial question..."
          className="query-box"
        />
        <button className="neutral-button" onClick={onSubmit}>
          Ask
        </button>
      </div>
    );
  }
  