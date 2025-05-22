import { useEffect, useState } from "react";
import api from "../../api/client";

export default function QueryTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/admin/recent-queries", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setRows(res.data));
  }, []);

  return (
    <div className="bg-white shadow p-4 rounded mt-4">
      <h2 className="font-semibold mb-2">Recent Queries</h2>
      <table className="w-full text-sm">
        <thead>
          <tr><th>Time</th><th>User</th><th>Latency</th><th>Tokens</th></tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{new Date(r.timestamp).toLocaleString()}</td>
              <td>{r.user_id}</td>
              <td>{r.latency_ms}ms</td>
              <td>{r.tokens_input + r.tokens_output}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
