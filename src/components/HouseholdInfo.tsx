import React from 'react'
import { useHousehold } from '@/hooks/useHousehold'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

export const HouseholdInfo: React.FC = () => {
  const { user } = useAuth()
  const { 
    household, 
    householdMembers, 
    isLoadingHousehold, 
    isLoadingMembers,
    createHousehold, 
    joinHousehold, 
    leaveHousehold 
  } = useHousehold()
  
  const [householdName, setHouseholdName] = useState('')
  const [householdId, setHouseholdId] = useState('')

  if (isLoadingHousehold) {
    return <Skeleton className="h-48 w-full" />
  }

  if (!household) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Household</CardTitle>
          <CardDescription>Create or join a household to manage expenses together</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Create New Household</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Household Name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
              />
              <Button 
                onClick={() => createHousehold(householdName)}
                disabled={!householdName}
              >
                Create
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Join Existing Household</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Household ID"
                value={householdId}
                onChange={(e) => setHouseholdId(e.target.value)}
              />
              <Button 
                onClick={() => joinHousehold(householdId)}
                disabled={!householdId}
              >
                Join
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Household: {household.name}</CardTitle>
        <CardDescription>Household ID: {household.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-medium mb-2">Members</h3>
          {isLoadingMembers ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <ul className="space-y-1">
              {householdMembers?.map((member) => (
                <li key={member.user_id} className="text-sm">
                  {member.email} {member.user_id === user?.id && "(you)"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          onClick={() => leaveHousehold()}
        >
          Leave Household
        </Button>
      </CardFooter>
    </Card>
  )
}
