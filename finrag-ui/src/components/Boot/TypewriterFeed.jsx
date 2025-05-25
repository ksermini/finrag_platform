import TypewriterText from "../../lib/reactbits/TypewriterText";

const TypewriterFeed = () => {
    const feedLines = [
      "• Initializing metadata index...",
      "• Loading vector memory...",
      "• Applying group-specific SOPs...",
      "• Accessing FinRAG admin protocols...",
    ];
  
    return (
      <div className="text-xs text-gray-300 font-mono space-y-1 px-4 mt-2">
        {feedLines.map((line, idx) => (
          <TypewriterText key={idx} text={line} speed={20} />
        ))}
      </div>
    );
  };
  
  export default TypewriterFeed;
  