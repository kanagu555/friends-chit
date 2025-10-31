"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function SchemeDetail() {
  // Payout structure from the chit fund types
  const payoutStructure = [
    { month: 1, payout: 95500, benefit: -4500, monthName: "October 2025" },
    { month: 2, payout: 96500, benefit: -3500, monthName: "November 2025" },
    { month: 3, payout: 97500, benefit: -2500, monthName: "December 2025" },
    { month: 4, payout: 98500, benefit: -1500, monthName: "January 2026" },
    { month: 5, payout: 99500, benefit: -500, monthName: "February 2026" },
    { month: 6, payout: 100500, benefit: 500, monthName: "March 2026" },
    { month: 7, payout: 101500, benefit: 1500, monthName: "April 2026" },
    { month: 8, payout: 102500, benefit: 2500, monthName: "May 2026" },
    { month: 9, payout: 103500, benefit: 3500, monthName: "June 2026" },
    { month: 10, payout: 104500, benefit: 4500, monthName: "July 2026" },
  ];

  const totalPayout = payoutStructure.reduce(
    (sum, item) => sum + item.payout,
    0
  );
  const totalBenefit = payoutStructure.reduce(
    (sum, item) => sum + item.benefit,
    0
  );
  const monthlyPayment = 10000;
  const totalAmount = 100000;

  return (
    <div className="space-y-6">
      {/* Payout Structure Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Payout Structure - 1 Lakh Chit
          </CardTitle>
          <CardDescription>
            Monthly payout amounts and benefit/loss structure for each draw
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Month
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Draw Date
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Payout Amount
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Benefit/Loss
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payoutStructure.map((item, index) => (
                  <tr
                    key={item.month}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-25" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Month {item.month}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.monthName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {item.monthName.split(" ")[0]} 10,{" "}
                      {item.monthName.split(" ")[1]}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-lg">
                        ₹{item.payout.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          item.benefit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.benefit >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {item.benefit >= 0 ? "+" : ""}₹
                          {item.benefit.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={item.benefit >= 0 ? "default" : "secondary"}
                        className={
                          item.benefit >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {item.benefit >= 0 ? "Profit" : "Loss"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalAmount.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Benefit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalBenefit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalBenefit >= 0 ? "+" : ""}₹{totalBenefit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total benefit/loss
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Break-even Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Month 6</div>
            <p className="text-xs text-muted-foreground mt-1">
              When benefits turn positive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
          <CardDescription>
            Key details about the chit fund scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">
                Early Months (1-5)
              </h4>
              <p className="text-sm text-gray-600">
                Winners in early months receive less than their total
                contribution, resulting in a loss. This is because they get the
                money early.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">
                Later Months (6-10)
              </h4>
              <p className="text-sm text-gray-600">
                Winners in later months receive more than their total
                contribution, resulting in a profit. This compensates for
                waiting longer.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">How it Works</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Each member contributes ₹10,000 monthly for 10 months</li>
              <li>
                • Every month, one member wins the draw and receives the payout
              </li>
              <li>
                • Payout amount varies by month - less in early months, more in
                later months
              </li>
              <li>• All members continue paying until the scheme completes</li>
              <li>
                • Each member wins exactly once during the 10-month period
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
