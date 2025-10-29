"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ChitCalculator() {
  const [chitAmount, setChitAmount] = useState(5000)
  const [numberOfMembers, setNumberOfMembers] = useState(12)
  const [interestRate, setInterestRate] = useState(5)

  const totalPool = chitAmount * numberOfMembers
  const monthlyContribution = chitAmount
  const benefitPerDraw = totalPool / numberOfMembers
  const interestEarned = (benefitPerDraw * interestRate) / 100

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Chit Fund Calculator</CardTitle>
          <CardDescription>Calculate your chit fund benefits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chit-amount">Chit Amount (₹)</Label>
              <Input
                id="chit-amount"
                type="number"
                value={chitAmount}
                onChange={(e) => setChitAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="members">Number of Members</Label>
              <Input
                id="members"
                type="number"
                value={numberOfMembers}
                onChange={(e) => setNumberOfMembers(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interest Rate (%)</Label>
              <Input
                id="interest"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalPool.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{monthlyContribution.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Benefit Per Draw</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{benefitPerDraw.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Interest Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{interestEarned.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Button className="w-full">Save Calculation</Button>
        </CardContent>
      </Card>
    </div>
  )
}
