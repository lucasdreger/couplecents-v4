
import { useState } from 'react'
import { useHousehold } from '@/hooks/useHousehold'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export const HouseholdManagement = () => {
  const [householdName, setHouseholdName] = useState('')
  const [householdId, setHouseholdId] = useState('')
  const { household, createHousehold, joinHousehold, leaveHousehold } = useHousehold()
  const { toast } = useToast()

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

  const handleLeaveHousehold = () => {
    if (window.confirm('Are you sure you want to leave this household?')) {
      leaveHousehold()
    }
  }

  const copyHouseholdId = () => {
    if (household?.id) {
      navigator.clipboard.writeText(household.id)
      toast({
        description: "Household ID copied to clipboard"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Household Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {household ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="space-y-2">
                <p><strong>Current Household:</strong> {household.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground break-all">
                    <strong>ID:</strong> {household.id}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyHouseholdId}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            <Button variant="destructive" onClick={handleLeaveHousehold}>
              Leave Household
            </Button>
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
