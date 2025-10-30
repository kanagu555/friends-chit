import { useState, useEffect } from "react";

export interface ChitDraw {
  id: string;
  chit_fund_id: string;
  month_number: number;
  draw_date: string;
  winner_participant_id?: string;
  winner_name?: string;
  payout_amount: number;
  benefit_amount: number;
  status: "pending" | "completed";
  participants?: string[]; // List of participant names for this month
  created_at: string;
  updated_at: string;
}

export function useChitDraws(chitFundId?: string, currentMonth?: number) {
  const [draws, setDraws] = useState<ChitDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all draws for the chit fund
  const fetchDraws = async () => {
    if (!chitFundId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { supabase } = await import("@/lib/supabase");

      // Fetch draws without winner join (to avoid foreign key issues)
      const { data: drawsData, error: drawsError } = await supabase
        .from("chit_draws")
        .select("*")
        .eq("chit_fund_id", chitFundId)
        .order("month_number", { ascending: true });

      if (drawsError) throw drawsError;

      // For each draw, fetch the participants who were in that month's auction
      const drawsWithParticipants = await Promise.all(
        (drawsData || []).map(async (draw) => {
          // Fetch participants for this specific month from monthly_participants table
          let participantNames: string[] = [];
          let winnerName: string | null = null;

          // Fetch participants for this specific month from monthly_participants table
          const { data: participantsData } = await supabase
            .from("monthly_participants")
            .select(
              `
              members:member_id (
                name
              )
            `
            )
            .eq("chit_fund_id", chitFundId)
            .eq("month_number", draw.month_number)
            .eq("status", "active");

          participantNames =
            participantsData
              ?.map((p) => (p.members as any)?.name)
              .filter((name): name is string => Boolean(name)) || [];

          // Handle winner display for completed draws
          if (draw.status === "completed") {
            // Use winner_name from draw if available
            if (draw.winner_name) {
              winnerName = draw.winner_name;
            } else if (draw.winner_participant_id) {
              // Get winner name from monthly_participants table
              const { data: winnerData } = await supabase
                .from("monthly_participants")
                .select(
                  `
                  members:member_id (
                    name
                  )
                `
                )
                .eq("id", draw.winner_participant_id)
                .single();

              winnerName = (winnerData?.members as any)?.name || null;
            }
          }

          return {
            ...draw,
            winner_name: winnerName,
            participants: participantNames,
          };
        })
      );

      setDraws(drawsWithParticipants);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Update draw with winner
  const updateDrawWinner = async (
    monthNumber: number,
    winnerId: string,
    winnerName: string
  ) => {
    try {
      const { supabase } = await import("@/lib/supabase");

      const { error } = await supabase
        .from("chit_draws")
        .update({
          winner_participant_id: winnerId,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("chit_fund_id", chitFundId)
        .eq("month_number", monthNumber);

      if (error) throw error;

      // Update local state
      setDraws((prev) =>
        prev.map((draw) =>
          draw.month_number === monthNumber
            ? {
                ...draw,
                winner_participant_id: winnerId,
                winner_name: winnerName,
                status: "completed" as const,
              }
            : draw
        )
      );

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update draw";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchDraws();
  }, [chitFundId, currentMonth]);

  return {
    draws,
    loading,
    error,
    updateDrawWinner,
    refetch: fetchDraws,
  };
}
