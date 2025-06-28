import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

// --------------------------
// SCHEMAS & TYPES
// --------------------------

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const signupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Enter a valid email ending with @iitp.ac.in").regex(/@iitp\.ac\.in$/, "Must be an IITP email"),
  rollno: z.string().regex(/^[0-9]{2}[0-9]{2}[A-Z]{2}[0-9]{2}$/, "Enter a valid roll number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type SignupFormValues = z.infer<typeof signupFormSchema>;

// --------------------------
// MAIN COMPONENT
// --------------------------

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      rollno: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({ email: values.email, password: values.password });
  };

  const onSignupSubmit = (values: SignupFormValues) => {
    registerMutation.mutate(values);
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <i className="ri-shopping-cart-line text-primary text-3xl mr-2"></i>
              <h1 className="text-2xl font-bold text-primary">SWAP SHOP</h1>
            </div>
            <p className="text-gray-500 mt-2">
              Buy and sell items within your IIT Patna community
            </p>
          </div>

          <Tabs
            defaultValue="signin"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "signin" | "signup")}
          >
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.name@iitp.ac.in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <a
                      href="#"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.name@iitp.ac.in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="rollno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input placeholder="2301CS01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Only students with verified <strong>@iitp.ac.in</strong> emails can join.
            </p>
          </div>
        </div>
      </div>

      {/* Right-side hero */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-[#4285F4] to-blue-600">
        <div className="flex flex-col justify-center items-center h-full px-8 text-white">
          <h2 className="text-3xl font-bold mb-6">The Student Marketplace</h2>
          <div className="max-w-md space-y-4">
            <Feature
              icon="ri-exchange-dollar-line"
              title="Buy & Sell with Ease"
              description="Find great deals on textbooks, furniture, electronics, and more from fellow students."
            />
            <Feature
              icon="ri-shield-check-line"
              title="Campus Community"
              description="Trade safely with verified students from your college. No outside sellers."
            />
            <Feature
              icon="ri-chat-1-line"
              title="Direct Messaging"
              description="Communicate directly with buyers and sellers to arrange meetings on campus."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
          <i className={`${icon} text-xl`}></i>
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}
