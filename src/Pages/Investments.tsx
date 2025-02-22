import React from "react";
import Sidebar from "@/components/Sidebar";
import { EllipsisVertical, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

const Investments = () => {
  const sections = [
    {
      title: "Banking",
      subcategories: [
        { title: "Available Balance", amount: "$12,500" },
        { title: "Pending Payments", amount: "$2,300" },
      ],
    },
    {
      title: "Investments",
      subcategories: [
        { title: "Stocks", amount: "$45,000" },
        { title: "Mutual Funds", amount: "$30,000" },
      ],
    },
    {
      title: "Retirement",
      subcategories: [
        { title: "401(k)", amount: "$150,000" },
        { title: "IRA", amount: "$75,000" },
      ],
    },
    {
      title: "Real Estate",
      subcategories: [
        { title: "Home Value", amount: "$500,000" },
        { title: "Mortgage Balance", amount: "$250,000" },
      ],
    },
    {
      title: "Assets",
      subcategories: [
        { title: "Car", amount: "$30,000" },
        { title: "Jewelry", amount: "$15,000" },
      ],
    },
  ];

  const netWorth = sections.reduce((total, section) => {
    return (
      total +
      section.subcategories.reduce(
        (sum, sub) => sum + parseAmount(sub.amount),
        0
      )
    );
  }, 0);

  function parseAmount(amount: string) {
    return parseFloat(amount.replace(/[^0-9.-]+/g, ""));
  }

  return (
    <div className="flex h-screen bg-blue-200">
      <Sidebar />
      <div className="flex gap-4 p-8 w-full">
        <div className="w-[20%] bg-white h-[100%] rounded-3xl p-4">
          <div className="flex items-center justify-between w-full mb-4">
            <h1 className="text-2xl font-normal">Accounts</h1>
            <div className="flex items-center gap-4">
              <img src="add-circle.svg" alt="Add" className="h-6 w-6 ml-2" />
              <h3 className="text-blue-500 font-bold">Add</h3>
              <EllipsisVertical className="h-6 w-6 ml-2" />
            </div>
          </div>

          <div className="flex mb-4 justify-between rounded-md shadow-[0px_2px_rgba(0,0,0,0.1)] py-2 px-1">
            <h1 className="font-bold">Net Worth</h1>
            <span className="font-bold">${netWorth.toLocaleString()}</span>
          </div>

          <Accordion type="single" collapsible>
            {sections.map((section, index) => {
              const subcategories = section.subcategories;
              const totalAmount =
                subcategories.length > 1
                  ? subcategories.reduce(
                      (sum, sub) => sum + parseAmount(sub.amount),
                      0
                    )
                  : parseAmount(subcategories[0].amount);
              return (
                <AccordionItem
                  key={section.title}
                  value={section.title}
                  className={index !== sections.length - 1 ? "mb-4" : ""}
                >
                  <AccordionTrigger className="flex items-center justify-between w-full">
                    <span className="flex items-center font-medium gap-1">
                      {subcategories.length > 1 && (
                        <ChevronDown className="h-5 w-5" />
                      )}
                      {section.title}
                    </span>
                    <span className="font-medium">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </AccordionTrigger>
                  {subcategories.length > 1 && (
                    <AccordionContent>
                      <Accordion type="single" collapsible>
                        {subcategories.map((sub) => (
                          <AccordionItem
                            key={sub.title}
                            value={sub.title}
                            className={
                              index !== subcategories.length - 1 ? "mb-2" : ""
                            }
                          >
                            <AccordionTrigger className=" mt-2 flex items-center justify-between w-full">
                              <span className="flex items-center gap-2 text-sm ">
                                {sub.title}
                                {subcategories.length > 2 && (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </span>
                              <span className="text-sm ">{sub.amount}</span>
                            </AccordionTrigger>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="w-[80%] bg-transparent flex flex-col flex-1 gap-4 rounded-2xl ">

        <div className="min-h-[100vh] bg-white flex-1 rounded-xl md:min-h-min">
            <h1 className="text-2xl font-bold p-4">Investments</h1>
        </div>

          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-white" />
            <div className="aspect-video rounded-xl bg-white" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Investments;
