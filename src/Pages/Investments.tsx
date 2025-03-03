import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { EllipsisVertical, RefreshCcw } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import arrow from "../../src/assets/arrow-head.svg";
import { Pie, PieChart, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

const Investments = () => {
  const [openSections, setOpenSections] = useState<openSections>({});

  interface AccountType {
    title: string;
    subcategories: Subcategory[];
    color?: string;
  }

  interface Subcategory {
    title: string;
    amount: string;
  }

  interface openSections {
    [key: string]: boolean;
  }

  const toggleSection = (title: string) => {
    setOpenSections((prev: openSections) => ({
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
      color: "#FFC107",
    },
    {
      title: "Investments",
      subcategories: [
        { title: "Stocks", amount: "$45,000" },
        { title: "Mutual Funds", amount: "$30,000" },
      ],
      color: "hsl(var(--chart-1))",
    },
    {
      title: "Retirement",
      subcategories: [
        { title: "401(k)", amount: "$150,000" },
        { title: "IRA", amount: "$75,000" },
      ],
      color: "hsl(var(--chart-2))",
    },
    {
      title: "Real Estate",
      subcategories: [
        { title: "Home Value", amount: "$500,000" },
        { title: "Mortgage", amount: "$250,000" },
      ],
      color: "hsl(var(--chart-3))",
    },
    {
      title: "Assets",
      subcategories: [
        { title: "Car", amount: "$30,000" },
        { title: "Jewelry", amount: "$15,000" },
      ],
      color: "hsl(var(--chart-4))",
    },
  ];

  const data = [
    {
      title: "Phone",
      amount: "$50.00",
      amountLeft: "$18.00",
      progress: 70,
      date: "Apr 20",
    },
    {
      title: "Internet",
      amount: "$60.00",
      amountLeft: "$40.00",
      progress: 20,
      date: "Feb 1",
    },
    {
      title: "Electricity",
      amount: "$40.00",
      amountLeft: "$25.00",
      progress: 60,
      date: "Mar 12",
    },
    {
      title: "Water",
      amount: "$30.00",
      amountLeft: "$15.00",
      progress: 30,
      date: "Apr 7",
    },
    {
      title: "Gas",
      amount: "$37.00",
      amountLeft: "$22.00",
      progress: 70,
      date: "Feb 13",
    },
    {
      title: "Rent",
      amount: "$500.00",
      amountLeft: "$500.00",
      progress: 0,
      date: "Apr 18",
    },
  ];;

  const transactions = [
    {
      title: "Fancy Bar Out",
      category: "Uncategorized",
      amount: 15.0,
      date: "Feb 5",
    },
    {
      title: "Grocery Shopping",
      category: "Food",
      amount: -45.5,
      date: "Feb 6",
    },
    {
      title: "Freelance Work",
      category: "Income",
      amount: 200.0,
      date: "Feb 7",
    },
    {
      title: "Netflix Subscription",
      category: "Entertainment",
      amount: -12.99,
      date: "Feb 8",
    },
    {
      title: "Fancy Bar Out",
      category: "Uncategorized",
      amount: 15.0,
      date: "Feb 5",
    },
    {
      title: "Grocery Shopping",
      category: "Food",
      amount: -45.5,
      date: "Feb 6",
    },
  ];

  function parseAmount(amount: string): number {
    return parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
  }

  const netWorth = accounts.reduce((total, account) => {
    return (
      total +
      account.subcategories.reduce(
        (sum, sub) => sum + parseAmount(sub.amount),
        0
      )
    );
  }, 0);

  const chartData = accounts.map((account, index) => ({
    name: account.title,
    value: account.subcategories.reduce(
      (sum, sub) => sum + parseAmount(sub.amount),
      0
    ),
    fill: account.color,
  }));

  const totalAmount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex flex-col lg:flex-row gap-4 p-4 lg:p-8 w-full">
        <div className="w-full lg:w-[20%] border-2 border-x-gray-300 h-auto lg:h-[95%] bg-white rounded-3xl p-4">
          <div className="flex items-center justify-between w-full mb-4">
            <h1 className="text-2xl font-normal">Accounts</h1>
            <img src="add-circle.svg" alt="Add" className="h-6 w-6 ml-2" />
            <p className="font-semibold">Add</p>
            <EllipsisVertical className="h-6 w-6 ml-2" />
          </div>

          <div className="flex mb-4 justify-between rounded-md shadow-sm py-2 px-1">
            <h1 className="font-bold">Net Worth</h1>
            <p className="font-bold">${netWorth.toLocaleString()}</p>
          </div>

          {accounts.map((account) => {
            const totalAmount = account.subcategories.reduce(
              (sum, sub) => sum + parseAmount(sub.amount),
              0
            );
            const isOpen = openSections[account.title] || false;

            return (
              <div key={account.title}>
                <Collapsible open={isOpen}>
                  <CollapsibleTrigger
                    onClick={() => toggleSection(account.title)}
                    className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 rounded-lg px-1 py-2"
                  >
                    <p className="flex items-center text-[14px] gap-2">
                      {account.subcategories.length > 1 && (
                        <img
                          src={arrow}
                          className={`transform transition-transform h-4 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      )}
                      {account.title}
                    </p>
                    <p className="font-semibold text-[14px]">
                      ${totalAmount.toLocaleString()}
                    </p>
                  </CollapsibleTrigger>
                  {account.subcategories.length > 1 && (
                    <CollapsibleContent className="flex flex-col gap-1">
                      {account.subcategories.map((sub) => (
                        <div
                          key={sub.title}
                          className="flex items-center justify-between w-full px-2 py-1"
                        >
                          <p className="text-gray-600 text-[14px] ml-6">
                            {sub.title}
                          </p>
                          <p className="text-gray-600 text-[12px]">
                            {sub.amount}
                          </p>
                        </div>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-[80%] bg-transparent flex flex-col flex-1 gap-4 rounded-2xl">
          <div className="flex flex-col lg:flex-row border-2 border-x-gray-300 bg-white rounded-2xl">
            <Card className="flex rounded-2xl border-none shadow-none flex-col w-full lg:w-[50%]">
              <CardHeader className="items-start pb-0">
                <CardTitle className="text-start text-xl font-normal">
                  Spending Plan
                </CardTitle>
                <CardDescription className="text-start">
                  January - June 2024
                </CardDescription>
              </CardHeader>
              <CardContent className="flex pb-0 items-start">
                {/* <ChartContainer
                  config={accounts}
                  className="items-start w-full h-full rounded-2xl"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={30}
                      strokeWidth={6}
                    ></Pie>
                    <Legend
                      verticalAlign="middle"
                      layout="vertical"
                      align="left"
                      height={26}
                    />
                  </PieChart>
                </ChartContainer> */}
                <text textAnchor="middle" dominantBaseline="middle">
                  <p className="fill-foreground text-xl font-bold">
                    ${totalAmount.toLocaleString()}
                  </p>
                  <p className="text-gray-500">Available</p>
                  <p className="text-[12px]">($1257.854)</p>
                </text>
              </CardContent>
            </Card>

            <div className="p-6 w-full lg:w-[50%] bg-white rounded-2xl relative">
              <div className="flex w-full items-center justify-between mb-4 relative">
                <h1 className="text-xl font-normal">Planned Spending</h1>
              </div>

              <Carousel className="w-full">
                <div className="flex absolute right-0 -mt-8 mr-14 gap-2">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
                <CarouselContent>
                  {data.map((item, index) => (
                    <CarouselItem key={index} className="basis-1/2">
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex flex-col  p-2">
                            <div className="flex text-[12px] mb-2 items-center gap-2">
                              <p>{item.title}</p>
                              <RefreshCcw className="h-4" />
                            </div>
                            <p className="pl-4 text-[14px]">
                              {item.amountLeft} left
                            </p>
                            <Progress
                              value={item.progress}
                              className=" w-[95%] self-end [&>*]:bg-blue-500 h-8 rounded-xl "
                            ></Progress>
                            <p className="text-end text-gray-600 text-[12px]">
                              out of {item.amount}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
            <div className="h-[300px] overflow-hidden rounded-2xl border-2 border-x-gray-300 bg-white">
              <div className="flex flex-col rounded-t-2xl w-full py-2 px-4 bg-slate-100">
                <h1 className="text-lg font-normal">$679.89 Spent</h1>
                <p className="text-gray-500 font-semibold text-[12px]">
                  from Friday - Today
                </p>
              </div>

              <div className="w-full max-h-full overflow-y-auto">
                {transactions.map((item, index) => (
                  <div key={index} className="w-full border-b py-2 px-4">
                    <div className="flex justify-between">
                      <p className="">{item.title}</p>
                      <p
                        className={`text-[14px] ${
                          item.amount >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        ${item.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400 text-[14px]">
                        {item.category}
                      </p>
                      <p className="text-gray-400 text-[14px]">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[300px] overflow-hidden rounded-2xl border-2 border-x-gray-300 bg-white">
              <div className="p-4 w-full bg-white rounded-2xl relative">
                <div className="flex w-full items-center justify-between mb-2 relative">
                  <h1 className="text-lg font-normal">Bills & Payments</h1>
                </div>

                <Carousel className="w-full h-full flex flex-col">
                  <div className="flex absolute right-0 -mt-6 mr-14 gap-2">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
                  {Array.from({ length: Math.ceil(data.length / 4) }).map(
                    (_, pageIndex) => (
                      <CarouselContent
                        key={pageIndex}
                        className="grid grid-cols-2 grid-rows-2 gap-2 h-full"
                      >
                        {data
                          .slice(pageIndex * 4, pageIndex * 4 + 4)
                          .map((item, index) => (
                            <CarouselItem key={index} className="w-full flex">
                              <div className="p-1 w-full h-full">
                                <Card className="h-full">
                                  <CardContent className="flex flex-col p-2 h-full w">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex p-0 gap-4 items-center">
                                        <div
                                          style={{
                                            backgroundColor: getRandomColor(),
                                          }}
                                          className="flex p-0 h-6 w-6 rounded-lg justify-center items-center text-white text-[14px]"
                                        >
                                          {item.title.charAt(0)}
                                        </div>
                                        <p className="text-[14px] text-gray-600">
                                          {item.date}
                                        </p>
                                      </div>
                                      <EllipsisVertical className="h-4" />
                                    </div>
                                    <p className="text-xl font-normal">
                                      {item.title}
                                    </p>
                                    <p
                                      className={`text-[14px] font-normal ${
                                        parseAmount(item.amountLeft) >= 0
                                          ? "text-green-700"
                                          : "text-red-700"
                                      }`}
                                    >
                                      {item.amountLeft} left
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                    )
                  )}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
