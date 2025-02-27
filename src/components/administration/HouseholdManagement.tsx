import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react'

export const HouseholdManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Notice</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The household management system has been deprecated. 
            The application now uses a simplified data model where all data is shared across the system.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
