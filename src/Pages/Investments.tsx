import { useState, useMemo } from "react";
import { 
  EllipsisVertical, 
  RefreshCcw, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  CreditCard,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Sidebar from '@/components/Sidebar';

function Investments() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const accounts = [
    {
      title: "Banking",
      subcategories: [
        { title: "Available Balance", amount: "$12,500" },
        { title: "Pending Payments", amount: "$2,300" },
      ],
      color: "#3B82F6",
      icon: DollarSign,
    },
    {
      title: "Investments",
      subcategories: [
        { title: "Stocks", amount: "$45,000" },
        { title: "Mutual Funds", amount: "$30,000" },
      ],
      color: "#10B981",
      icon: TrendingUp,
    },
    {
      title: "Retirement",
      subcategories: [
        { title: "401(k)", amount: "$150,000" },
        { title: "IRA", amount: "$75,000" },
      ],
      color: "#8B5CF6",
      icon: PieChartIcon,
    },
    {
      title: "Real Estate",
      subcategories: [
        { title: "Home Value", amount: "$500,000" },
        { title: "Mortgage", amount: "$250,000" },
      ],
      color: "#F59E0B",
      icon: TrendingUp,
    },
    {
      title: "Assets",
      subcategories: [
        { title: "Car", amount: "$30,000" },
        { title: "Jewelry", amount: "$15,000" },
      ],
      color: "#EF4444",
      icon: DollarSign,
    },
  ];

  const billsData = [
    { title: "Phone", amount: "$50.00", amountLeft: "$18.00", progress: 64, date: "Apr 20", category: "Utilities" },
    { title: "Internet", amount: "$60.00", amountLeft: "$40.00", progress: 33, date: "Feb 1", category: "Utilities" },
    { title: "Electricity", amount: "$40.00", amountLeft: "$25.00", progress: 37.5, date: "Mar 12", category: "Utilities" },
    { title: "Water", amount: "$30.00", amountLeft: "$15.00", progress: 50, date: "Apr 7", category: "Utilities" },
    { title: "Gas", amount: "$37.00", amountLeft: "$22.00", progress: 40.5, date: "Feb 13", category: "Utilities" },
    { title: "Rent", amount: "$500.00", amountLeft: "$500.00", progress: 0, date: "Apr 18", category: "Housing" },
  ];

  const transactions = [
    { title: "Starbucks Coffee", category: "Food & Dining", amount: -15.0, date: "Today", time: "2:30 PM" },
    { title: "Salary Deposit", category: "Income", amount: 3200.0, date: "Yesterday", time: "9:00 AM" },
    { title: "Netflix Subscription", category: "Entertainment", amount: -12.99, date: "Feb 8", time: "6:15 PM" },
    { title: "Grocery Shopping", category: "Food & Dining", amount: -85.50, date: "Feb 7", time: "4:20 PM" },
    { title: "Freelance Payment", category: "Income", amount: 450.0, date: "Feb 6", time: "11:30 AM" },
    { title: "Gas Station", category: "Transportation", amount: -42.00, date: "Feb 5", time: "8:45 AM" },
  ];

  function parseAmount(amount: string) {
    return parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
  }

  const netWorth = accounts.reduce((total, account) => {
    return total + account.subcategories.reduce((sum, sub) => sum + parseAmount(sub.amount), 0);
  }, 0);

  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Financial Dashboard</h1>
              <p className="text-slate-600 mt-1">Monitor your financial health and investments</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Account</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto">
            <div className="p-6">
              {/* Net Worth Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Net Worth</h3>
                  <TrendingUp className="w-5 h-5 opacity-90" />
                </div>
                <div className="text-3xl font-bold mb-1">${netWorth.toLocaleString()}</div>
                <div className="flex items-center text-sm opacity-90">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+2.4% from last month</span>
                </div>
              </div>

              {/* Account Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Accounts</h3>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {accounts.map((account) => {
                  const totalAmount = account.subcategories.reduce(
                    (sum, sub) => sum + parseAmount(sub.amount), 0
                  );
                  const isOpen = openSections[account.title] || false;
                  const Icon = account.icon;

                  return (
                    <div key={account.title} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(account.title)}
                        className="flex items-center justify-between w-full p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: account.color + '20' }}
                          >
                            <Icon className="w-5 h-5" style={{ color: account.color }} />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-slate-900">{account.title}</p>
                            <p className="text-sm text-slate-500">{account.subcategories.length} accounts</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900">${totalAmount.toLocaleString()}</span>
                          {account.subcategories.length > 1 && (
                            isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && account.subcategories.length > 1 && (
                        <div className="bg-slate-50 border-t border-slate-200">
                          {account.subcategories.map((sub) => (
                            <div key={sub.title} className="flex items-center justify-between px-4 py-3 border-b border-slate-200 last:border-b-0">
                              <span className="text-sm text-slate-600 ml-6">{sub.title}</span>
                              <span className="text-sm font-medium text-slate-900">{sub.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">Monthly Income</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">${totalIncome.toLocaleString()}</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">Monthly Spending</h3>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">${totalSpent.toLocaleString()}</div>
                <div className="flex items-center text-sm text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>+5.2% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">Savings Rate</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PieChartIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-2">32%</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Target: 30%</span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">${totalSpent.toFixed(2)} spent this week</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount > 0 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{transaction.title}</p>
                          <p className="text-sm text-slate-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${ 
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">{transaction.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bills & Payments */}
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Upcoming Bills</h2>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Manage
                    </button>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">6 bills due this month</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {billsData.slice(0, 4).map((bill, index) => {
                      const amountLeftNum = parseAmount(bill.amountLeft);
                      const totalAmount = parseAmount(bill.amount);
                      const progressPercent = ((totalAmount - amountLeftNum) / totalAmount) * 100;

                      return (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{bill.title}</p>
                                <p className="text-sm text-slate-500">Due {bill.date}</p>
                              </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                              <EllipsisVertical className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">{bill.amountLeft} remaining</span>
                              <span className="text-slate-900 font-medium">of {bill.amount}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Investments;