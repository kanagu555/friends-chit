"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMembers } from "@/hooks/use-members";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, Loader2 } from "lucide-react";

interface AddParticipantDialogProps {
  onAddParticipants: (
    memberIds: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  existingParticipantIds: string[];
  buttonText?: string;
  chitFundId?: string;
  currentMonth?: number;
}

export function AddParticipantDialog({
  onAddParticipants,
  existingParticipantIds,
  buttonText = "Add Participants",
  chitFundId,
  currentMonth,
}: AddParticipantDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousWinners, setPreviousWinners] = useState<string[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(false);

  const { members, loading } = useMembers();
  const { toast } = useToast();

  // Fetch previous winners when dialog opens
  const fetchPreviousWinners = async () => {
    if (!chitFundId || !currentMonth) return;

    try {
      setLoadingWinners(true);
      const { supabase } = await import("@/lib/supabase");

      // Get all winners from previous months
      const { data: winners, error } = await supabase
        .from("monthly_participants")
        .select("member_id")
        .eq("chit_fund_id", chitFundId)
        .eq("status", "winner")
        .lt("month_number", currentMonth);

      if (error) throw error;

      const winnerMemberIds = winners?.map((w) => w.member_id) || [];
      setPreviousWinners(winnerMemberIds);
    } catch (error) {
      console.error("Error fetching previous winners:", error);
    } finally {
      setLoadingWinners(false);
    }
  };

  // Filter members into categories
  const availableMembers = members.filter(
    (member) =>
      !existingParticipantIds.includes(member.id) &&
      !previousWinners.includes(member.id)
  );

  const previousWinnerMembers = members.filter((member) =>
    previousWinners.includes(member.id)
  );

  // Fetch previous winners when dialog opens
  useEffect(() => {
    if (open) {
      fetchPreviousWinners();
    }
  }, [open, chitFundId, currentMonth]);

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMemberIds((prev) => [...prev, memberId]);
    } else {
      setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const handleSubmit = async () => {
    if (selectedMemberIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one member",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await onAddParticipants(selectedMemberIds);

    if (result.success) {
      toast({
        title: "Success",
        description: `${selectedMemberIds.length} participant(s) added successfully`,
      });
      setOpen(false);
      setSelectedMemberIds([]);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Chit Fund Participants</DialogTitle>
          <DialogDescription>
            Select members to participate in this month's auction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Select Members ({selectedMemberIds.length} selected)</Label>
            <div className="mt-2 space-y-2 max-h-80 overflow-y-auto border rounded-lg p-2">
              {loading || loadingWinners ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading members...</span>
                </div>
              ) : availableMembers.length === 0 &&
                previousWinnerMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {members.length === 0 ? (
                    <>
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No members found. Add members first.</p>
                    </>
                  ) : (
                    <>
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>All members are already participants.</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* Available Members */}
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <Checkbox
                        id={member.id}
                        checked={selectedMemberIds.includes(member.id)}
                        onCheckedChange={(checked) =>
                          handleMemberToggle(member.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={member.id}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {member.name}
                      </label>
                    </div>
                  ))}

                  {/* Previous Winners (Greyed Out) */}
                  {previousWinnerMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-3 p-2 rounded opacity-50 bg-gray-100"
                      title="This member has already won in a previous month"
                    >
                      <Checkbox
                        id={`disabled-${member.id}`}
                        checked={false}
                        disabled={true}
                        className="cursor-not-allowed"
                      />
                      <label
                        htmlFor={`disabled-${member.id}`}
                        className="flex-1 cursor-not-allowed font-medium text-gray-500"
                      >
                        <span className="line-through">{member.name}</span>{" "}
                        <span className="text-xs text-red-500">
                          (Previous Winner)
                        </span>
                      </label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                selectedMemberIds.length === 0 ||
                isSubmitting ||
                availableMembers.length === 0
              }
              className="cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add {selectedMemberIds.length} Participant
              {selectedMemberIds.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
