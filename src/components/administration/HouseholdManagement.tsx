
import { useState } from 'react'
import { useHousehold } from '@/hooks/useHousehold'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const HouseholdManagement = () => {
  const [householdName, setHouseholdName] = useState('')
  const [householdId, setHouseholdId] = useState('')
  const { household, createHousehold, joinHousehold } = useHousehold()

  const handleCreateHousehold = (e: React.FormEvent) => {
    e.preventDefault()
    if (!householdName.trim()) return
    createHousehold(householdName)
    setHouseholdName('')
  }

  const handleJoinHousehold = (e: React.FormEvent) => {
    e.preventDefault()
    if (!householdId.trim()) return
    joinHousehold(householdId)
    setHouseholdId('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Household Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {household ? (
          <div className="space-y-2">
            <h3 className="font-medium">Current Household</h3>
            <p>Name: {household.name}</p>
            <p className="text-sm text-muted-foreground">ID: {household.id}</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleCreateHousehold} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="householdName">Create New Household</Label>
                <Input
                  id="householdName"
                  placeholder="Enter household name"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!householdName.trim()}>
                Create Household
              </Button>
            </form>

            <Separator />

            <form onSubmit={handleJoinHousehold} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="householdId">Join Existing Household</Label>
                <Input
                  id="householdId"
                  placeholder="Enter household ID"
                  value={householdId}
                  onChange={(e) => setHouseholdId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!householdId.trim()}>
                Join Household
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
