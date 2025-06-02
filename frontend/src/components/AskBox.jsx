import { useEffect } from "react";
import "../styles/AskBox.css"; //  make sure this is imported
import ShinyText from "../../lib/ShinyText/ShinyText"
export default function AskBox({ query, setQuery, onSubmit }) {
  useEffect(() => {
    const textarea = document.querySelector(".query-box");
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [query]);

  return (
    <div className="ask-box">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question..."
        className="query-box"
        rows={1} // optional, start with one line
      />
      <button className="neutral-button" onClick={onSubmit}>
      <ShinyText text="Ask" disabled={false} speed={3} className='custom-class' />
      </button>
    </div>
  );
}
