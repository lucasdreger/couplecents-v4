import React, { useState } from 'react';
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
import { CreditCard, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cardFormSchema = z.object({
  cardName: z.string().min(1, "Card holder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
});

type CardFormValues = z.infer<typeof cardFormSchema>;

export default function PaymentMethodsPage() {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "visa",
      name: "John Doe",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "24", 
      isDefault: true
    },
    {
      id: "2",
      type: "mastercard",
      name: "John Doe",
      last4: "5555",
      expiryMonth: "03",
      expiryYear: "25",
      isDefault: false
    }
  ]);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    },
  });

  const onSubmit = async (data: CardFormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract expiry month and year
      const [month, year] = data.expiryDate.split('/');
      
      // Add new payment method to state
      const newCard = {
        id: Date.now().toString(),
        type: getCardType(data.cardNumber),
        name: data.cardName,
        last4: data.cardNumber.slice(-4),
        expiryMonth: month,
        expiryYear: year,
        isDefault: paymentMethods.length === 0 // Make default if first card
      };
      
      setPaymentMethods([...paymentMethods, newCard]);
      setIsAddingCard(false);
      form.reset();
      toast.success("Payment method added successfully!");
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method");
    }
  };
  
  const deleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== id));
    toast.success("Payment method removed successfully!");
  };
  
  const setDefaultCard = (id: string) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
    toast.success("Default payment method updated!");
  };

  // Determine card type from number (simplified version)
  const getCardType = (number: string) => {
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    if (number.startsWith('6')) return 'discover';
    return 'unknown';
  };

  // Get card logo based on type
  const getCardLogo = (type: string) => {
    switch (type) {
      case 'visa':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png";
      case 'mastercard':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png";
      case 'amex':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png";
      case 'discover':
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Discover_Card_logo.svg/1200px-Discover_Card_logo.svg.png";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
        <p className="text-muted-foreground">
          Manage your payment methods and billing details.
        </p>
      </div>
      
      <Tabs defaultValue="cards" className="w-full">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="bank" disabled>Bank Accounts</TabsTrigger>
        </TabsList>
        <TabsContent value="cards" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Cards</h2>
            <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card to your account.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1234 5678 9012 3456" 
                              {...field} 
                              maxLength={16}
                              onChange={(e) => {
                                // Allow only digits
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM/YY" 
                                maxLength={5}
                                {...field} 
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, '');
                                  
                                  // Format as MM/YY
                                  if (value.length > 2) {
                                    value = value.slice(0, 2) + '/' + value.slice(2);
                                  }
                                  
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123" 
                                maxLength={4}
                                {...field} 
                                onChange={(e) => {
                                  // Allow only digits
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => {
                          setIsAddingCard(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Card</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {paymentMethods.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You don't have any payment methods yet.</p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => setIsAddingCard(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map(card => (
                <Card key={card.id} className={card.isDefault ? "border-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-16 relative">
                          <img 
                            src={getCardLogo(card.type)} 
                            alt={card.type} 
                            className="h-full w-auto object-contain"
                          />
                        </div>
                        
                        <div>
                          <p className="font-medium">
                            {card.type.charAt(0).toUpperCase() + card.type.slice(1)} •••• {card.last4}
                            {card.isDefault && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {card.name} • Expires {card.expiryMonth}/{card.expiryYear}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!card.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDefaultCard(card.id)}
                          >
                            Make Default
                          </Button>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remove Payment Method</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to remove this card? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteCard(card.id)}
                              >
                                Remove Card
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>
            The billing address associated with your payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" placeholder="123 Main St" />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" placeholder="Apt 4B" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="San Francisco" />
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" placeholder="CA" />
              </div>
              <div>
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" placeholder="94103" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <select 
                  id="country"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast.success("Billing address updated!")}>
            Save Address
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}