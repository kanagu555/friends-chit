"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChitFunds } from "@/hooks/use-chit-funds";
import { useChitDraws } from "@/hooks/use-chit-draws";
import { useChitParticipants } from "@/hooks/use-chit-participants";
import { useAuth } from "@/hooks/use-auth";
import {
  Loader2,
  Trophy,
  Calendar,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Crown,
} from "lucide-react";
import { getMonthName } from "@/lib/month-utils";

export function DrawHistory() {
  const { user } = useAuth();
  const { chitFunds, loading: chitLoading } = useChitFunds();
  const currentChit =
    chitFunds.find((chit) => chit.status === "active") || chitFunds[0];

  const { draws, loading: drawsLoading } = useChitDraws(
    currentChit?.id,
    currentChit?.current_month || 1
  );

  const { participants, loading: participantsLoading } = useChitParticipants(
    currentChit?.id
  );

  // Find current user's participant record
  const currentUserParticipant = participants.find(
    (p) => p.member_email === user?.email
  );

  // Calculate member-specific data
  const memberDraws = draws.map((draw) => {
    const isWinner =
      draw.winner_name &&
      (draw.winner_name === currentUserParticipant?.member_name ||
        draw.winner_participant_id === currentUserParticipant?.id);

    return {
      ...draw,
      isWinner,
      participatedIn:
        draw.participants?.includes(
          currentUserParticipant?.member_name || ""
        ) || false,
    };
  });

  const totalWinnings = memberDraws
    .filter((d) => d.isWinner && d.status === "completed")
    .reduce((sum, d) => sum + d.payout_amount, 0);

  const wonDrawsCount = memberDraws.filter(
    (d) => d.isWinner && d.status === "completed"
  ).length;
  const participatedDrawsCount = memberDraws.filter(
    (d) => d.participatedIn
  ).length;

  if (chitLoading || drawsLoading || participantsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading draw history...</span>
      </div>
    );
  }

  if (!currentChit) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Chit Fund Found</h3>
          <p className="text-gray-600">
            You are not participating in any chit fund yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Total Winnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{totalWinnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {wonDrawsCount} draw(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participatedDrawsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {draws.length} draws
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Current Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentChit.current_month || 1}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getMonthName(
                currentChit.current_month || 1,
                currentChit.start_date
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Chit Fund
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(currentChit.total_amount / 100000).toFixed(0)}L
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentChit.name}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Draw Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Draw Results
          </CardTitle>
          <CardDescription>
            All draws from {currentChit.name} - Your participation and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {draws.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Draws Yet</h3>
              <p className="text-gray-600">
                Draws will appear here once they are conducted
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {memberDraws.map((draw) => (
                <div
                  key={draw.id}
                  className={`border rounded-lg p-4 ${
                    draw.isWinner
                      ? "border-green-200 bg-green-50"
                      : draw.participatedIn
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          Month {draw.month_number} -{" "}
                          {getMonthName(
                            draw.month_number,
                            currentChit.start_date
                          )}
                        </h3>
                        {draw.isWinner && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        <Badge
                          variant="default"
                          className={
                            draw.status === "completed"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }
                        >
                          {draw.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Draw Date:{" "}
                            {new Date(draw.draw_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          <span>
                            Winner:{" "}
                            <span className="font-bold text-black">
                              {draw.winner_name || "Not declared"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            Participants: {draw.participants?.length || 0}
                          </span>
                        </div>
                      </div>

                      {/* Participants List */}
                      {draw.participants && draw.participants.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-sm text-gray-700">
                              <span className="text-black font-bold">
                                All Participants
                              </span>{" "}
                              ({draw.participants.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {draw.participants.map((participant, index) => (
                              <Badge
                                key={index}
                                variant={
                                  participant ===
                                  currentUserParticipant?.member_name
                                    ? "default"
                                    : participant === draw.winner_name
                                    ? "secondary"
                                    : "outline"
                                }
                                className={`text-xs ${
                                  participant ===
                                  currentUserParticipant?.member_name
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : participant === draw.winner_name
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {participant ===
                                  currentUserParticipant?.member_name && "👤 "}
                                {participant === draw.winner_name && "🏆 "}
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {draw.participatedIn && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            You participated in this draw
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-lg font-bold">
                        ₹{draw.payout_amount.toLocaleString()}
                      </div>

                      <div
                        className={`flex items-center justify-end gap-1 text-sm ${
                          draw.benefit_amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {draw.benefit_amount >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                          {draw.benefit_amount >= 0 ? "+" : ""}₹
                          {draw.benefit_amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2">
                        {draw.isWinner && draw.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-800">
                            🎉 You Won!
                          </Badge>
                        ) : draw.participatedIn ? (
                          <Badge variant="outline">Participated</Badge>
                        ) : draw.status === "completed" ? (
                          <Badge variant="secondary">Not Participated</Badge>
                        ) : (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Participation Summary */}
      {currentUserParticipant && (
        <Card>
          <CardHeader>
            <CardTitle>Your Participation Summary</CardTitle>
            <CardDescription>
              Overview of your participation in {currentChit.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{currentUserParticipant.total_paid.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Total Paid</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ₹{totalWinnings.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Total Won</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div
                  className={`text-2xl font-bold ${
                    totalWinnings - currentUserParticipant.total_paid >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {totalWinnings - currentUserParticipant.total_paid >= 0
                    ? "+"
                    : ""}
                  ₹
                  {(
                    totalWinnings - currentUserParticipant.total_paid
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-purple-600">Net Position</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
