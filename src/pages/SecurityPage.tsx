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
import { Shield, ShieldAlert, ShieldCheck, CalendarClock, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // State for security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: true,
    deviceManagement: true,
  });

  const handleSettingChange = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Security settings updated successfully!");
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  // List of recently used devices (would be fetched from backend in a real app)
  const recentDevices = [
    {
      name: "MacBook Pro",
      location: "San Francisco, USA",
      lastActive: "Just now",
      browser: "Chrome 98.0",
      isCurrentDevice: true,
      os: "macOS"
    },
    {
      name: "iPhone 13",
      location: "San Francisco, USA",
      lastActive: "2 hours ago",
      browser: "Safari Mobile",
      isCurrentDevice: false,
      os: "iOS 16"
    },
    {
      name: "Windows PC",
      location: "Seattle, USA",
      lastActive: "2 days ago",
      browser: "Firefox 97.0",
      isCurrentDevice: false,
      os: "Windows 11"
    }
  ];

  // Recent security events (would be fetched from backend in a real app)
  const securityEvents = [
    {
      event: "Password changed",
      date: "March 10, 2023",
      location: "San Francisco, USA"
    },
    {
      event: "New login detected",
      date: "March 5, 2023",
      location: "San Francisco, USA"
    },
    {
      event: "Two-factor authentication disabled",
      date: "February 28, 2023",
      location: "San Francisco, USA"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and protection settings.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Protection</CardTitle>
              <CardDescription>
                Set up additional security measures to protect your account.
              </CardDescription>
            </div>
            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Two-factor authentication */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account by requiring a verification code in addition to your password.
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={() => handleSettingChange('twoFactorAuth')}
            />
          </div>
          
          {/* Login alerts */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Login Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when someone logs into your account from a new device or location.
              </p>
            </div>
            <Switch
              checked={securitySettings.loginAlerts}
              onCheckedChange={() => handleSettingChange('loginAlerts')}
            />
          </div>
          
          {/* Session timeout */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after 2 hours of inactivity for better security.
              </p>
            </div>
            <Switch
              checked={securitySettings.sessionTimeout}
              onCheckedChange={() => handleSettingChange('sessionTimeout')}
            />
          </div>
          
          {/* Device management */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Device Management</Label>
              <p className="text-sm text-muted-foreground">
                Track and manage devices that are logged into your account.
              </p>
            </div>
            <Switch
              checked={securitySettings.deviceManagement}
              onCheckedChange={() => handleSettingChange('deviceManagement')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Recent Devices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Devices</CardTitle>
              <CardDescription>
                Devices that have logged into your account recently.
              </CardDescription>
            </div>
            <CalendarClock className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {recentDevices.map((device, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{device.name}</p>
                    {device.isCurrentDevice && (
                      <Badge variant="outline" className="text-xs bg-primary/10">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{device.browser} on {device.os}</p>
                  <p className="text-xs text-muted-foreground">{device.location} • {device.lastActive}</p>
                </div>
                
                {!device.isCurrentDevice && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Device</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove this device? This will sign out any active sessions on this device.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => toast.info("This feature is not yet implemented")}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => toast.success("Device removed successfully")}>
                          Remove Device
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => toast.info("This feature will let you view all devices")}>
            View All Devices
          </Button>
        </CardFooter>
      </Card>
      
      {/* Security Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Security Activity</CardTitle>
              <CardDescription>
                Review recent security-related actions on your account.
              </CardDescription>
            </div>
            <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-medium">{event.event}</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                
                <Button variant="ghost" size="sm" onClick={() => toast.info("Event details will be shown here")}>
                  Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Account Termination */}
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Actions that can permanently affect your account.
              </CardDescription>
            </div>
            <Shield className="h-8 w-8 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive/30 p-4">
              <div className="space-y-0.5">
                <p className="font-medium">Sign Out From All Devices</p>
                <p className="text-sm text-muted-foreground">
                  This will log you out from all devices except the current one.
                </p>
              </div>
              <Button variant="outline" onClick={() => toast.info("This feature is not yet implemented")}>
                Sign Out All
              </Button>
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive/30 p-4">
              <div className="space-y-0.5">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => toast.info("Account deletion cancelled")}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => {
                      toast.success("Account deletion initiated");
                      setTimeout(() => signOut && signOut(), 2000);
                    }}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}