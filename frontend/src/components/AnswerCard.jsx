export default function AnswerCard({ answer }) {
    return (
      <div className="fade-in answer-card">
        <h3 className="answer-title">Answer</h3>
        <p className="answer-text">{answer}</p>
      </div>
    );
  }
  