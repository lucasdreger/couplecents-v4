import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Create schema for password change
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    
    try {
      // In a real app, call the updatePassword function from auth context
      // await updatePassword(data.currentPassword, data.newPassword);
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password updated successfully!");
      form.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please check your current password and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch(field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Create a strong password that you don't use on other sites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Enter your current password" 
                          type={showCurrentPassword ? "text" : "password"} 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Enter your new password" 
                          type={showNewPassword ? "text" : "password"} 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showNewPassword ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Confirm your new password" 
                          type={showConfirmPassword ? "text" : "password"} 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-sm">
                <p className="text-muted-foreground">Your password must include:</p>
                <ul className="list-disc pl-5 text-muted-foreground mt-2">
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Recovery</CardTitle>
          <CardDescription>
            Options for recovering your account if you forget your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="font-medium">Recovery Email</p>
                <p className="text-sm text-muted-foreground">
                  Your primary email will be used for password recovery
                </p>
              </div>
              <Button variant="outline" disabled>Configure</Button>
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="font-medium">Recovery Phone</p>
                <p className="text-sm text-muted-foreground">
                  Add a phone number for SMS verification during recovery
                </p>
              </div>
              <Button variant="outline" disabled>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}