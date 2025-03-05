import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function EmailPreferencesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // State for email preferences
  // In a real app, these would be fetched from the backend
  const [preferences, setPreferences] = useState({
    marketingEmails: false,
    monthlyReports: true,
    securityAlerts: true,
    budgetNotifications: true,
    expenseReminders: true
  });

  const handlePreferenceChange = (preference: string) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference as keyof typeof prev]
    }));
  };

  const savePreferences = async () => {
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Email preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to update email preferences");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Preferences</h1>
        <p className="text-muted-foreground">
          Manage what types of emails you receive from CoupleCents.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication Settings</CardTitle>
          <CardDescription>
            Control which emails you receive from CoupleCents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {/* Primary Email */}
            <div>
              <h3 className="text-sm font-medium mb-4">Your Primary Email</h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">
                    This is where we'll send all your notifications
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Change
                </Button>
              </div>
            </div>
            
            {/* Notification Types */}
            <div>
              <h3 className="text-sm font-medium mb-4">Email Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and offers
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={() => handlePreferenceChange('marketingEmails')}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive monthly financial summaries by email
                    </p>
                  </div>
                  <Switch
                    checked={preferences.monthlyReports}
                    onCheckedChange={() => handlePreferenceChange('monthlyReports')}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about important security updates
                    </p>
                  </div>
                  <Switch
                    checked={preferences.securityAlerts}
                    onCheckedChange={() => handlePreferenceChange('securityAlerts')}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Budget Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when approaching budget limits
                    </p>
                  </div>
                  <Switch
                    checked={preferences.budgetNotifications}
                    onCheckedChange={() => handlePreferenceChange('budgetNotifications')}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Expense Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming expenses and bills
                    </p>
                  </div>
                  <Switch
                    checked={preferences.expenseReminders}
                    onCheckedChange={() => handlePreferenceChange('expenseReminders')}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={savePreferences} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Frequency</CardTitle>
          <CardDescription>
            Control how often you receive emails from us
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label>Frequency</Label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="weekly"
            >
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
              <option value="monthly">Monthly Only</option>
              <option value="important">Important Updates Only</option>
            </select>
            <p className="text-sm text-muted-foreground">
              This affects the frequency of non-critical emails
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => toast.success("Frequency preference saved!")}>
            Update Frequency
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}