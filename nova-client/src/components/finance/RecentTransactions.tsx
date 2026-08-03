"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { TransactionItem } from "./TransactionItem";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  status: "completed" | "pending" | "refund";
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  onSort?: (sort: string) => void;
}

export function RecentTransactions({
  transactions,
  onSearch,
  onFilter,
  onSort,
}: RecentTransactionsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterOpen, setFilterOpen] = React.useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <PremiumCard className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <span className="text-sm text-slate-500">({transactions.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-colors"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-colors">
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search transactions..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Filter Dropdown */}
      {filterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <button className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm">
            All
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-700/50 text-slate-400 text-sm hover:bg-slate-700">
            Income
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-700/50 text-slate-400 text-sm hover:bg-slate-700">
            Expenses
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-700/50 text-slate-400 text-sm hover:bg-slate-700">
            Pending
          </button>
        </motion.div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TransactionItem
              merchant={transaction.merchant}
              category={transaction.category}
              date={transaction.date}
              amount={transaction.amount}
              type={transaction.type}
              status={transaction.status}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {transactions.length > 5 && (
        <div className="pt-4 border-t border-slate-700/50">
          <PrimaryButton variant="glass" className="w-full">
            Load More Transactions
          </PrimaryButton>
        </div>
      )}
    </PremiumCard>
  );
}
