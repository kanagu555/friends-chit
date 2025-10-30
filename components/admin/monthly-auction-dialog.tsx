"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Users, Crown, Loader2 } from "lucide-react"
import { getMonthName } from "@/lib/month-utils"

interface Participant {
  id: string
  member_name?: string
  status: 'active' | 'inactive' | 'winner'
}

interface MonthlyAuctionDialogProps {
  participants: Participant[]
  currentMonth: number
  startDate?: string
  onDeclareWinner: (participantId: string) => Promise<{ success: boolean; error?: string }>
}

export function MonthlyAuctionDialog({ participants, currentMonth, startDate = '2025-10-10', onDeclareWinner }: MonthlyAuctionDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Only show active participants who haven't won yet
  const eligibleParticipants = participants.filter(p => 
    p.status === 'active'
  )

  const handleDeclareWinner = async () => {
    if (!selectedWinnerId) {
      toast({
        title: "Error",
        description: "Please select a winner",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    const result = await onDeclareWinner(selectedWinnerId)
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Winner declared successfully!",
      })
      setOpen(false)
      setSelectedWinnerId("")
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
    
    setIsSubmitting(false)
  }

  const selectedParticipant = eligibleParticipants.find(p => p.id === selectedWinnerId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Trophy className="h-4 w-4 mr-2" />
          Conduct {getMonthName(currentMonth, startDate)} Auction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {getMonthName(currentMonth, startDate)} Auction
          </DialogTitle>
          <DialogDescription>
            Select the winner for {getMonthName(currentMonth, startDate)} chit fund auction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Users className="h-4 w-4" />
              <span className="font-medium">Eligible Participants: {eligibleParticipants.length}</span>
            </div>
          </div>

          <div>
            <Label>Select Winner</Label>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
              {eligibleParticipants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No eligible participants for this auction.</p>
                </div>
              ) : (
                eligibleParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWinnerId === participant.id
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedWinnerId(participant.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{participant.member_name || 'Unknown'}</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      {selectedWinnerId === participant.id && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedParticipant && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700">
                <Crown className="h-4 w-4" />
                <span className="font-medium">Selected Winner: {selectedParticipant.member_name || 'Unknown'}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeclareWinner} 
              disabled={!selectedWinnerId || isSubmitting || eligibleParticipants.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              Declare Winner
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}