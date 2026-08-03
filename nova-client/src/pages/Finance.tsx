"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { AppShell } from "../components/layout/AppShell";
import { FinanceOverview } from "@/components/finance/FinanceOverview";
import { ExpenseAnalytics } from "@/components/finance/ExpenseAnalytics";
import { RecentTransactions } from "@/components/finance/RecentTransactions";
import { UpcomingBills } from "@/components/finance/UpcomingBills";
import { SubscriptionCard } from "@/components/finance/SubscriptionCard";
import { FinanceInsights } from "@/components/finance/FinanceInsights";
import { SavingsGoals } from "@/components/finance/SavingsGoals";
import { CashFlowTimeline } from "@/components/finance/CashFlowTimeline";
import { FinanceQuickActions } from "@/components/finance/FinanceQuickActions";
import { FinanceSidebar } from "@/components/finance/FinanceSidebar";
import { AddExpenseModal } from "@/components/finance/AddExpenseModal";
import { ConnectBankModal } from "@/components/finance/ConnectBankModal";
import { ToastContainer, Toast, type ToastProps } from "@/components/shared/Toast";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Link, Wallet, ArrowUpRight } from "lucide-react";

export default function FinancePage() {
  const [route, setRoute] = React.useState("finance");
  const [showAddExpenseModal, setShowAddExpenseModal] = React.useState(false);
  const [showConnectBankModal, setShowConnectBankModal] = React.useState(false);
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = Date.now().toString();
    setToasts([...toasts, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter((t) => t.id !== id));
  };
  const [transactions, setTransactions] = React.useState([
    {
      id: "1",
      merchant: "Starbucks",
      category: "Food",
      date: "Today",
      amount: 350,
      type: "debit" as const,
      status: "completed" as const,
    },
    {
      id: "2",
      merchant: "Amazon",
      category: "Shopping",
      date: "Today",
      amount: 2499,
      type: "debit" as const,
      status: "completed" as const,
    },
    {
      id: "3",
      merchant: "Uber",
      category: "Travel",
      date: "Yesterday",
      amount: 180,
      type: "debit" as const,
      status: "completed" as const,
    },
    {
      id: "4",
      merchant: "Netflix",
      category: "Entertainment",
      date: "Yesterday",
      amount: 649,
      type: "debit" as const,
      status: "completed" as const,
    },
    {
      id: "5",
      merchant: "Salary",
      category: "Income",
      date: "Jan 15",
      amount: 85000,
      type: "credit" as const,
      status: "completed" as const,
    },
    {
      id: "6",
      merchant: "Electricity Bill",
      category: "Bills",
      date: "Jan 14",
      amount: 1200,
      type: "debit" as const,
      status: "pending" as const,
    },
  ]);
  const [upcomingBills, setUpcomingBills] = React.useState([
    {
      id: "1",
      name: "Netflix",
      amount: 649,
      dueDate: "Jan 30",
      daysRemaining: 2,
    },
    {
      id: "2",
      name: "Electricity",
      amount: 1200,
      dueDate: "Feb 1",
      daysRemaining: 4,
    },
    {
      id: "3",
      name: "Internet",
      amount: 999,
      dueDate: "Feb 5",
      daysRemaining: 8,
    },
    {
      id: "4",
      name: "Rent",
      amount: 15000,
      dueDate: "Feb 1",
      daysRemaining: 4,
    },
  ]);
  const [subscriptions, setSubscriptions] = React.useState([
    {
      id: "1",
      name: "Spotify",
      monthlyCost: 119,
      renewalDate: "Feb 15",
      color: "bg-green-500/20",
    },
    {
      id: "2",
      name: "Netflix",
      monthlyCost: 649,
      renewalDate: "Jan 30",
      color: "bg-red-500/20",
    },
    {
      id: "3",
      name: "Google One",
      monthlyCost: 130,
      renewalDate: "Feb 10",
      color: "bg-blue-500/20",
    },
    {
      id: "4",
      name: "Adobe",
      monthlyCost: 1680,
      renewalDate: "Feb 20",
      color: "bg-orange-500/20",
    },
  ]);
  const [financeData, setFinanceData] = React.useState({
    currentBalance: 124580,
    incomeThisMonth: 85000,
    expensesThisMonth: 42350,
    savings: 18700,
    monthlyBudget: 60000,
    netCashFlow: 42650,
    remainingBudget: 17650,
    dailySpendingTarget: 2000,
    savingsGoal: 50000,
    savingsProgress: 37,
  });
  const [todaySpending, setTodaySpending] = React.useState(2849);

  // Dummy data
  const expenseCategories = [
    {
      id: "food",
      name: "Food",
      icon: <span className="text-lg">🍔</span>,
      amount: 8500,
      percentage: 20,
      trend: "down" as const,
      color: "bg-amber-500/10 text-amber-400",
    },
    {
      id: "shopping",
      name: "Shopping",
      icon: <span className="text-lg">🛍️</span>,
      amount: 12000,
      percentage: 28,
      trend: "up" as const,
      color: "bg-rose-500/10 text-rose-400",
    },
    {
      id: "travel",
      name: "Travel",
      icon: <span className="text-lg">✈️</span>,
      amount: 5000,
      percentage: 12,
      trend: "down" as const,
      color: "bg-cyan-500/10 text-cyan-400",
    },
    {
      id: "bills",
      name: "Bills",
      icon: <span className="text-lg">💡</span>,
      amount: 8000,
      percentage: 19,
      trend: "up" as const,
      color: "bg-purple-500/10 text-purple-400",
    },
    {
      id: "health",
      name: "Health",
      icon: <span className="text-lg">💊</span>,
      amount: 3000,
      percentage: 7,
      trend: "down" as const,
      color: "bg-emerald-500/10 text-emerald-400",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <span className="text-lg">🎬</span>,
      amount: 5850,
      percentage: 14,
      trend: "up" as const,
      color: "bg-indigo-500/10 text-indigo-400",
    },
  ];




  const financeInsights = [
    {
      id: "1",
      type: "savings" as const,
      icon: <span className="text-lg">💰</span>,
      content: "You spent 18% less on dining this week. Great job!",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      id: "2",
      type: "savings" as const,
      icon: <span className="text-lg">📈</span>,
      content: "You can save ₹3,500 this month by reducing shopping expenses.",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      id: "3",
      type: "alert" as const,
      icon: <span className="text-lg">⚡</span>,
      content: "Your electricity bill is due tomorrow.",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "4",
      type: "spending" as const,
      icon: <span className="text-lg">🛒</span>,
      content: "Shopping spending increased this weekend. Consider reviewing your budget.",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
  ];

  const savingsGoals = [
    {
      id: "1",
      name: "Vacation",
      targetAmount: 100000,
      currentAmount: 45000,
      expectedCompletion: "June 2026",
      color: "bg-cyan-500/20",
    },
    {
      id: "2",
      name: "Emergency Fund",
      targetAmount: 200000,
      currentAmount: 75000,
      expectedCompletion: "December 2026",
      color: "bg-emerald-500/20",
    },
    {
      id: "3",
      name: "Laptop",
      targetAmount: 80000,
      currentAmount: 32000,
      expectedCompletion: "April 2026",
      color: "bg-purple-500/20",
    },
  ];

  const cashFlowEvents = [
    {
      id: "1",
      type: "income" as const,
      title: "Salary Credit",
      amount: 85000,
      date: "Feb 1",
    },
    {
      id: "2",
      type: "bill" as const,
      title: "Rent Payment",
      amount: 15000,
      date: "Feb 1",
    },
    {
      id: "3",
      type: "expense" as const,
      title: "Grocery Shopping",
      amount: 3000,
      date: "Feb 3",
    },
    {
      id: "4",
      type: "investment" as const,
      title: "SIP Investment",
      amount: 10000,
      date: "Feb 5",
    },
    {
      id: "5",
      type: "bill" as const,
      title: "Internet Bill",
      amount: 999,
      date: "Feb 5",
    },
  ];

  const handlePayBill = (billId: string) => {
    const bill = upcomingBills.find((b) => b.id === billId);
    if (bill) {
      setUpcomingBills(upcomingBills.filter((b) => b.id !== billId));
      setFinanceData({
        ...financeData,
        currentBalance: financeData.currentBalance - bill.amount,
        expensesThisMonth: financeData.expensesThisMonth + bill.amount,
        remainingBudget: financeData.remainingBudget - bill.amount,
      });
      setTransactions([
        {
          id: Date.now().toString(),
          merchant: bill.name,
          category: "Bills",
          date: "Today",
          amount: bill.amount,
          type: "debit",
          status: "completed",
        },
        ...transactions,
      ]);
      addToast({
        variant: "success",
        title: "Bill Paid",
        description: `₹${bill.amount} paid to ${bill.name}`,
      });
    }
  };

  const handleSetReminder = (subscriptionId: string) => {
    const sub = subscriptions.find((s) => s.id === subscriptionId);
    if (sub) {
      addToast({
        variant: "success",
        title: "Reminder Set",
        description: `Reminder set for ${sub.name} renewal on ${sub.renewalDate}`,
      });
    }
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    const sub = subscriptions.find((s) => s.id === subscriptionId);
    if (sub) {
      setSubscriptions(subscriptions.filter((s) => s.id !== subscriptionId));
      addToast({
        variant: "success",
        title: "Subscription Cancelled",
        description: `${sub.name} subscription cancelled successfully`,
      });
    }
  };

  const handleOptimizeBudget = () => {
    addToast({
      variant: "info",
      title: "Budget Optimization",
      description: "1. Reduce dining expenses by 15%\n2. Cancel unused subscriptions\n3. Switch to annual plans for savings",
      duration: 8000,
    });
  };

  const handleAnalyzeSpending = () => {
    addToast({
      variant: "info",
      title: "Spending Analysis",
      description: "Shopping: 28% (highest) • Food: 20% • Bills: 19%\nFocus on reducing shopping expenses.",
      duration: 8000,
    });
  };

  const handleViewSuggestions = () => {
    addToast({
      variant: "info",
      title: "AI Suggestions",
      description: "1. Set up automatic savings transfer\n2. Review unused subscriptions\n3. Consider investing surplus funds\n4. Track daily spending",
      duration: 8000,
    });
  };

  const handleConnectBank = () => {
    setShowConnectBankModal(true);
  };

  const handleBankConnected = (bankName: string) => {
    addToast({
      variant: "success",
      title: "Bank Connected",
      description: `${bankName} has been successfully linked to your account`,
    });
  };

  const handleAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const handleExpenseAdded = (expense: { merchant: string; amount: number; category: string; date: string; note?: string }) => {
    setFinanceData({
      ...financeData,
      currentBalance: financeData.currentBalance - expense.amount,
      expensesThisMonth: financeData.expensesThisMonth + expense.amount,
      remainingBudget: financeData.remainingBudget - expense.amount,
    });
    setTransactions([
      {
        id: Date.now().toString(),
        merchant: expense.merchant,
        category: expense.category,
        date: "Today",
        amount: expense.amount,
        type: "debit",
        status: "completed",
      },
      ...transactions,
    ]);
    setTodaySpending(todaySpending + expense.amount);
    addToast({
      variant: "success",
      title: "Expense Added",
      description: `₹${expense.amount} added to ${expense.category}`,
    });
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "add-expense":
        setShowAddExpenseModal(true);
        break;
      case "add-income":
        const incomeAmount = prompt("Enter income amount:");
        if (incomeAmount) {
          const amount = parseFloat(incomeAmount);
          setFinanceData({
            ...financeData,
            currentBalance: financeData.currentBalance + amount,
            incomeThisMonth: financeData.incomeThisMonth + amount,
            netCashFlow: financeData.netCashFlow + amount,
          });
          setTransactions([
            {
              id: Date.now().toString(),
              merchant: "Income",
              category: "Income",
              date: "Today",
              amount,
              type: "credit",
              status: "completed",
            },
            ...transactions,
          ]);
          addToast({
            variant: "success",
            title: "Income Added",
            description: `₹${amount} added to your account`,
          });
        }
        break;
      case "create-budget":
        const budgetAmount = prompt("Enter monthly budget amount:");
        if (budgetAmount) {
          setFinanceData({
            ...financeData,
            monthlyBudget: parseFloat(budgetAmount),
            remainingBudget: parseFloat(budgetAmount) - financeData.expensesThisMonth,
          });
          addToast({
            variant: "success",
            title: "Budget Updated",
            description: `Monthly budget set to ₹${budgetAmount}`,
          });
        }
        break;
      case "transfer":
        addToast({
          variant: "warning",
          title: "Coming Soon",
          description: "Transfer feature will be available soon",
        });
        break;
      case "export":
        addToast({
          variant: "success",
          title: "Report Exported",
          description: "Your financial report has been exported successfully",
        });
        break;
      case "ai-analysis":
        addToast({
          variant: "info",
          title: "AI Analysis",
          description: "Financial health score: 78/100. You're doing great!",
        });
        break;
    }
  };

  const handleTransactionSearch = (query: string) => {
    // Filter transactions based on search query
    console.log("Searching transactions:", query);
  };

  const handleTransactionFilter = (filter: string) => {
    console.log("Filtering transactions:", filter);
  };

  const handleTransactionSort = (sort: string) => {
    console.log("Sorting transactions:", sort);
  };

  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <AppShell
      pageTitle="Finance"
      activeRoute={route}
      onNavigate={setRoute}
      userName="Alex Rivera"
      userEmail="alex@nova.app"
      onQuickAdd={() => {}}
      notifications={[]}
    >
      <PageContainer>
        {/* Header */}
        <PageSection>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Finance</h1>
              <p className="text-slate-400">January 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <SecondaryButton icon={<Link className="h-4 w-4" />} onClick={handleConnectBank}>
                Connect Bank
              </SecondaryButton>
              <PrimaryButton icon={<Wallet className="h-4 w-4" />} onClick={handleAddExpense}>
                Add Expense
              </PrimaryButton>
            </div>
          </div>

          {/* Today's Spending Summary */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Today's Spending</p>
                <p className="text-2xl font-bold text-white mt-1">₹{todaySpending.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">12% less than yesterday</span>
              </div>
            </div>
          </div>
        </PageSection>

        <ContentGrid columns={3} gap="lg">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <FinanceOverview {...financeData} />

            <ExpenseAnalytics categories={expenseCategories} totalExpenses={totalExpenses} />

            <RecentTransactions 
              transactions={transactions} 
              onSearch={handleTransactionSearch}
              onFilter={handleTransactionFilter}
              onSort={handleTransactionSort}
            />

            <ContentGrid columns={2} gap="lg">
              <UpcomingBills bills={upcomingBills} onPayBill={handlePayBill} />
              <SubscriptionCard
                subscriptions={subscriptions}
                onSetReminder={handleSetReminder}
                onCancel={handleCancelSubscription}
              />
            </ContentGrid>

            <SavingsGoals goals={savingsGoals} />

            <CashFlowTimeline events={cashFlowEvents} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <FinanceInsights
              insights={financeInsights}
              onOptimizeBudget={handleOptimizeBudget}
              onAnalyzeSpending={handleAnalyzeSpending}
              onViewSuggestions={handleViewSuggestions}
            />

            <FinanceSidebar
              financialHealthScore={78}
              budgetStatus="On Track"
              upcomingPayments={3}
              latestAITip="Consider setting up automatic transfers to your savings account for better financial discipline."
              monthlyGoalProgress={65}
            />

            <FinanceQuickActions actions={[
              {
                id: "add-expense",
                label: "Add Expense",
                icon: <span className="text-lg">➕</span>,
                color: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
                onClick: () => handleQuickAction("add-expense"),
              },
              {
                id: "add-income",
                label: "Add Income",
                icon: <span className="text-lg">➖</span>,
                color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
                onClick: () => handleQuickAction("add-income"),
              },
              {
                id: "create-budget",
                label: "Create Budget",
                icon: <span className="text-lg">💰</span>,
                color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
                onClick: () => handleQuickAction("create-budget"),
              },
              {
                id: "transfer",
                label: "Transfer Money",
                icon: <span className="text-lg">💸</span>,
                color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
                onClick: () => handleQuickAction("transfer"),
              },
              {
                id: "export",
                label: "Export Report",
                icon: <span className="text-lg">📊</span>,
                color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
                onClick: () => handleQuickAction("export"),
              },
              {
                id: "ai-analysis",
                label: "AI Analysis",
                icon: <span className="text-lg">✨</span>,
                color: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
                onClick: () => handleQuickAction("ai-analysis"),
              },
            ]} />
          </div>
        </ContentGrid>
      </PageContainer>

      {/* Modals */}
      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onAddExpense={handleExpenseAdded}
      />
      <ConnectBankModal
        isOpen={showConnectBankModal}
        onClose={() => setShowConnectBankModal(false)}
        onConnect={handleBankConnected}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppShell>
  );
}
