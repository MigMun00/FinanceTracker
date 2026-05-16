import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";
import {
  getExpensesByCategory,
  getCashflow,
  getMonthlyReport,
} from "../services/reports";
import { getTransactions } from "../services/transaction";
import { getCategories } from "../services/category";

const PIE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#818cf8",
  "#60a5fa",
  "#34d399",
  "#f472b6",
  "#fb923c",
  "#facc15",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonthLabel(year, month) {
  return `${MONTHS[month - 1]} ${year}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-lg"
      style={{
        background: "var(--elevated)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      <p className="font-medium">{name}</p>
      <p style={{ color: "var(--muted)" }}>{formatCurrency(value)}</p>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-lg space-y-1"
      style={{
        background: "var(--elevated)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [cashflow, setCashflow] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    Promise.all([
      getExpensesByCategory(),
      getCashflow(),
      getMonthlyReport(year, month),
      getTransactions(),
      getCategories(),
    ]).then(([byCategory, cashflowData, monthly, transactions, cats]) => {
      setExpensesByCategory(byCategory);
      setCashflow(
        cashflowData.map((d) => ({
          ...d,
          label: formatMonthLabel(d.year, d.month),
        })),
      );
      setMonthlyReport(monthly);
      setRecentTransactions(transactions.slice(0, 5));
      setCategories(Object.fromEntries(cats.map((c) => [c.id, c.name])));
    });
  }, []);

  return (
    <div className="max-w-300 mx-auto px-6 py-8 space-y-6">
      {/* Top row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top-left: Expenses by category pie */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className="text-base font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Expenses by Category
          </h2>
          {expensesByCategory.length === 0 ? (
            <p
              className="text-sm text-center py-12"
              style={{ color: "var(--muted)" }}
            >
              No expense data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {expensesByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top-right: Cashflow by month */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className="text-base font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Cashflow
          </h2>
          {cashflow.length === 0 ? (
            <p
              className="text-sm text-center py-12"
              style={{ color: "var(--muted)" }}
            >
              No cashflow data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart
                data={cashflow}
                margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="bars"
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="line"
                  orientation="right"
                  tick={{ fill: "#60a5fa", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />
                <Bar
                  yAxisId="bars"
                  dataKey="income"
                  name="Income"
                  fill="#22c55e"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  yAxisId="bars"
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Line
                  yAxisId="line"
                  type="monotone"
                  dataKey="cashflow"
                  name="Cashflow"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ fill: "#60a5fa", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bottom-left: Monthly totals */}
        <div
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--text)" }}
          >
            This Month's Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div
              className="rounded-lg p-5 flex flex-col gap-2 justify-center"
              style={{
                background: "var(--elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Income
              </p>
              <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>
                {monthlyReport ? formatCurrency(monthlyReport.income) : "—"}
              </p>
            </div>
            <div
              className="rounded-lg p-5 flex flex-col gap-2 justify-center"
              style={{
                background: "var(--elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Expenses
              </p>
              <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>
                {monthlyReport ? formatCurrency(monthlyReport.expense) : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom-right: Last 5 transactions */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className="text-base font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <p
              className="text-sm text-center py-8"
              style={{ color: "var(--muted)" }}
            >
              No transactions yet
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Date", "Category", "Description", "Amount"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2 font-medium"
                      style={{ color: "var(--muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      className="py-2 pr-3 whitespace-nowrap"
                      style={{ color: "var(--muted)" }}
                    >
                      {tx.date}
                    </td>
                    <td className="py-2 pr-3" style={{ color: "var(--text)" }}>
                      {categories[tx.category_id] || "—"}
                    </td>
                    <td
                      className="py-2 pr-3 truncate max-w-32"
                      style={{ color: "var(--muted)" }}
                      title={tx.description}
                    >
                      {tx.description || "—"}
                    </td>
                    <td
                      className="py-2 font-medium whitespace-nowrap text-right"
                      style={{
                        color: tx.type === "income" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
