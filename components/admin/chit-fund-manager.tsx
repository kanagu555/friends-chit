"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddParticipantDialog } from "./add-participant-dialog";
import { MonthlyAuctionDialog } from "./monthly-auction-dialog";
import { useChitFunds } from "@/hooks/use-chit-funds";
import { useMonthlyParticipants } from "@/hooks/use-monthly-participants";
import { useChitDraws } from "@/hooks/use-chit-draws";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  IndianRupee,
  Trophy,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Crown,
  Loader2,
} from "lucide-react";
import { CHIT_FUND_CONFIG, PAYOUT_STRUCTURE } from "@/lib/chit-fund-types";
import { getMonthName, getMonthYear } from "@/lib/month-utils";

export function ChitFundManager() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Get current chit fund data
  const { chitFunds, loading: chitLoading } = useChitFunds();
  const currentChit =
    chitFunds.find((chit) => chit.status === "active") || chitFunds[0];

  // State for managing which month to view/edit
  const [selectedMonth, setSelectedMonth] = useState(
    currentChit?.current_month || 1
  );

  // Update selected month when current chit changes
  useEffect(() => {
    if (currentChit?.current_month) {
      setSelectedMonth(currentChit.current_month);
    }
  }, [currentChit?.current_month]);

  // Get monthly participants for selected month's auction
  const {
    monthlyParticipants,
    hasWinnerThisMonth,
    loading: participantsLoading,
    addMultipleMonthlyParticipants,
    declareMonthlyWinner,
    removeMonthlyParticipant,
  } = useMonthlyParticipants(currentChit?.id, selectedMonth);

  // Get draws data
  const {
    draws,
    loading: drawsLoading,
    updateDrawWinner,
  } = useChitDraws(currentChit?.id, currentChit?.current_month || 1);

  const handleAddParticipants = async (memberIds: string[]) => {
    return await addMultipleMonthlyParticipants(memberIds);
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (
      confirm(
        "Are you sure you want to remove this participant from this month's auction?"
      )
    ) {
      const result = await removeMonthlyParticipant(participantId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Participant removed from this month's auction",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  const handleDeclareWinner = async (participantId: string) => {
    const participant = monthlyParticipants.find((p) => p.id === participantId);
    const participantName = participant?.member_name || "Unknown";

    if (
      confirm(
        `Are you sure you want to declare ${participantName} as the winner for ${getMonthName(
          selectedMonth,
          currentChit.start_date
        )}?`
      )
    ) {
      const result = await declareMonthlyWinner(participantId);
      if (result.success) {
        // Also update the draw
        await updateDrawWinner(selectedMonth, participantId, participantName);

        toast({
          title: "Success",
          description: `${participantName} declared as winner for ${getMonthName(
            selectedMonth,
            currentChit.start_date
          )}!`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      return result;
    }
    return { success: false, error: "Cancelled by user" };
  };

  if (chitLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading chit fund...</span>
      </div>
    );
  }

  const handleCreateChitFund = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");

      // Create the chit fund
      const { data: chitFund, error: chitError } = await supabase
        .from("chit_funds")
        .insert([
          {
            name: "1 Lakh Chit",
            total_amount: 100000,
            monthly_payment: 10000,
            duration_months: 10,
            start_date: "2025-10-10",
            status: "active",
            current_month: 1,
          },
        ])
        .select()
        .single();

      if (chitError) throw chitError;

      // Create the draws
      const draws = [
        {
          month_number: 1,
          draw_date: "2025-10-10",
          payout_amount: 95500,
          benefit_amount: -4500,
          status: "pending",
        },
        {
          month_number: 2,
          draw_date: "2025-11-10",
          payout_amount: 96500,
          benefit_amount: -3500,
          status: "pending",
        },
        {
          month_number: 3,
          draw_date: "2025-12-10",
          payout_amount: 97500,
          benefit_amount: -2500,
          status: "pending",
        },
        {
          month_number: 4,
          draw_date: "2026-01-10",
          payout_amount: 98500,
          benefit_amount: -1500,
          status: "pending",
        },
        {
          month_number: 5,
          draw_date: "2026-02-10",
          payout_amount: 99500,
          benefit_amount: -500,
          status: "pending",
        },
        {
          month_number: 6,
          draw_date: "2026-03-10",
          payout_amount: 100500,
          benefit_amount: 500,
          status: "pending",
        },
        {
          month_number: 7,
          draw_date: "2026-04-10",
          payout_amount: 101500,
          benefit_amount: 1500,
          status: "pending",
        },
        {
          month_number: 8,
          draw_date: "2026-05-10",
          payout_amount: 102500,
          benefit_amount: 2500,
          status: "pending",
        },
        {
          month_number: 9,
          draw_date: "2026-06-10",
          payout_amount: 103500,
          benefit_amount: 3500,
          status: "pending",
        },
        {
          month_number: 10,
          draw_date: "2026-07-10",
          payout_amount: 104500,
          benefit_amount: 4500,
          status: "pending",
        },
      ];

      for (const draw of draws) {
        await supabase.from("chit_draws").insert([
          {
            chit_fund_id: chitFund.id,
            ...draw,
          },
        ]);
      }

      toast({
        title: "Success",
        description: "Chit fund created successfully!",
      });

      // Refresh the data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create chit fund",
        variant: "destructive",
      });
    }
  };

  if (!currentChit) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Active Chit Fund</h3>
          <p className="text-gray-600 mb-4">
            Create your first chit fund to get started.
          </p>
          <Button onClick={handleCreateChitFund}>
            <IndianRupee className="h-4 w-4 mr-2" />
            Create 1 Lakh Chit Fund
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chit Fund Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            {currentChit.name} - Overview
          </CardTitle>
          <CardDescription>
            Started: {new Date(currentChit.start_date).toLocaleDateString()} |
            Duration: {currentChit.duration_months} months | Monthly: ₹
            {currentChit.monthly_payment.toLocaleString("en-IN")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {getMonthName(
                  currentChit.current_month || 1,
                  currentChit.start_date
                )}
              </div>
              <div className="text-sm text-blue-600">Current Month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {monthlyParticipants.length}
              </div>
              <div className="text-sm text-green-600">This Month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ₹{(monthlyParticipants.length * 10000).toLocaleString("en-IN")}
              </div>
              <div className="text-sm text-purple-600">Expected Collection</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {getMonthName(
                  hasWinnerThisMonth
                    ? (currentChit.current_month || 1) + 1
                    : currentChit.current_month || 1,
                  currentChit.start_date
                )}{" "}
                10
              </div>
              <div className="text-sm text-orange-600">
                {hasWinnerThisMonth ? "Next Draw" : "Current Draw"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="draws">Draws</TabsTrigger>
          {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Draws</CardTitle>
            </CardHeader>
            <CardContent>
              {drawsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading draws...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {draws.slice(0, 3).map((draw) => (
                    <div
                      key={draw.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {getMonthName(
                            draw.month_number,
                            currentChit.start_date
                          )}{" "}
                          Draw
                        </div>
                        <div className="text-sm text-gray-600">
                          {draw.status === "completed" && draw.winner_name
                            ? `Winner: ${draw.winner_name}`
                            : "Pending Draw"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(draw.draw_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{draw.payout_amount.toLocaleString("en-IN")}
                        </div>
                        <Badge
                          variant={
                            draw.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {draw.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          {/* Month Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Month to Manage</CardTitle>
              <CardDescription>
                Choose which month's participants you want to view or manage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  { length: currentChit.duration_months },
                  (_, i) => i + 1
                ).map((month) => (
                  <Button
                    key={month}
                    variant={selectedMonth === month ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMonth(month)}
                    className={
                      month === (currentChit.current_month || 1)
                        ? "ring-2 ring-blue-500"
                        : ""
                    }
                  >
                    {getMonthName(month, currentChit.start_date)}
                    {month === (currentChit.current_month || 1) && (
                      <span className="ml-1 text-xs">(Current)</span>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Participants for Selected Month */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {getMonthName(selectedMonth, currentChit.start_date)}{" "}
                  {!hasWinnerThisMonth
                    ? `Participants (${monthlyParticipants.length})`
                    : "Participants"}
                </span>
                {!hasWinnerThisMonth ? (
                  <AddParticipantDialog
                    onAddParticipants={handleAddParticipants}
                    existingParticipantIds={monthlyParticipants.map(
                      (p) => p.member_id
                    )}
                    chitFundId={currentChit?.id}
                    currentMonth={selectedMonth}
                  />
                ) : (
                  <Button disabled variant="outline">
                    <Crown className="h-4 w-4 mr-2" />
                    Winner Declared
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading participants...</span>
                </div>
              ) : hasWinnerThisMonth ? (
                <div className="text-center py-8 text-green-600">
                  <Crown className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Winner Already Selected
                  </h3>
                  <p>
                    The winner for{" "}
                    {getMonthName(
                      currentChit.current_month || 1,
                      currentChit.start_date
                    )}{" "}
                    has been declared.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Proceed to next month for new auction.
                  </p>
                </div>
              ) : monthlyParticipants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No participants for this month's auction yet.</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Add members to participate in{" "}
                    {getMonthName(
                      currentChit.current_month || 1,
                      currentChit.start_date
                    )}{" "}
                    auction.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Name</th>
                        <th className="text-left py-2 px-2">Amount</th>
                        <th className="text-left py-2 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyParticipants.map((participant) => (
                        <tr
                          key={participant.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-2 px-2 font-medium">
                            {participant.member_name || "Unknown"}
                          </td>
                          <td className="py-2 px-2">₹{"10,000"}</td>
                          <td className="py-2 px-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeclareWinner(participant.id)
                                }
                                className="text-yellow-600 hover:text-yellow-700"
                                title="Mark as Winner"
                              >
                                <Crown className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveParticipant(participant.id)
                                }
                                className="text-red-600 hover:text-red-700"
                                title="Remove from this month's auction"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draws" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Monthly Draws</span>
                {!hasWinnerThisMonth &&
                  monthlyParticipants.length > 0 &&
                  selectedMonth === (currentChit.current_month || 1) && (
                    <MonthlyAuctionDialog
                      participants={monthlyParticipants}
                      currentMonth={selectedMonth}
                      startDate={currentChit.start_date}
                      onDeclareWinner={handleDeclareWinner}
                    />
                  )}
                {hasWinnerThisMonth && (
                  <Button disabled variant="outline">
                    <Crown className="h-4 w-4 mr-2" />
                    Winner Declared
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {drawsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading draws...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {draws.map((draw) => (
                    <Card
                      key={draw.id}
                      className={
                        draw.status === "pending"
                          ? "border-orange-200"
                          : "border-green-200"
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {getMonthName(
                                  draw.month_number,
                                  currentChit.start_date
                                )}{" "}
                                Draw
                              </h3>
                              <Badge
                                variant={
                                  draw.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {draw.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              Date:{" "}
                              {new Date(draw.draw_date).toLocaleDateString()}
                            </div>
                            {draw.status === "completed" && draw.winner_name ? (
                              <div className="text-sm mb-2">
                                <span className="font-medium">Winner: </span>
                                <span className="text-green-600 font-medium">
                                  {draw.winner_name}
                                </span>
                              </div>
                            ) : draw.status === "pending" &&
                              (currentChit.current_month || 1) >
                                draw.month_number ? (
                              <div className="text-sm mb-2 text-gray-500">
                                <span className="font-medium">Winner: </span>
                                <span className="italic">
                                  Not yet determined
                                </span>
                              </div>
                            ) : null}

                            {draw.participants &&
                            draw.participants.length > 0 ? (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">
                                  Participants:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {draw.participants.join(", ")}
                                </span>
                              </div>
                            ) : draw.status === "pending" &&
                              (currentChit.current_month || 1) >
                                draw.month_number ? (
                              <div className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">
                                  Participants:{" "}
                                </span>
                                <span className="italic">To be determined</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold">
                              ₹{draw.payout_amount.toLocaleString("en-IN")}
                            </div>
                            <div
                              className={`text-sm ${
                                draw.benefit_amount < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              Benefit: {draw.benefit_amount > 0 ? "+" : ""}₹
                              {Math.abs(draw.benefit_amount)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
              <CardDescription>
                Track monthly payments from all participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Payment Management</h3>
                <p className="text-gray-600 mb-4">
                  Track and record monthly payments
                </p>
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
