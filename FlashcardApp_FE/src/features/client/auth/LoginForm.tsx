import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CircleCheck, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/services/useAuth";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, authLoading, error, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (authData: LoginFormInputs) => {
    try {
      await login(authData);
      navigate("/");
    } catch (error: any) {
      console.log("Login error catched in form:", error);
    }
  };

  const onForgotPassword = () => {
    if (!form.getValues("email")) {
      form.setError("email", { type: "manual", message: "Please enter your email address to receive a password reset link" });
      return;
    }
    setIsForgotPassword(true);
  };

  const handleForgotPassword = async () => {
    await forgotPassword(form.getValues("email"));
    setForgotPasswordSuccess("An email has been sent to you. Please check your inbox.");
    console.log("Password reset email sent to ", form.getValues("email"));
  };

  return (
    <Form {...form}>
      <Card className="bg-background/90 min-w-lg space-y-4 border-0 py-4 shadow-2xl backdrop-blur-sm">
        <CardHeader className="">
          {!isForgotPassword && (
            <>
              <CardTitle className="from-primary dark:from-foreground bg-gradient-to-r to-blue-600 bg-clip-text text-3xl font-bold text-transparent dark:to-blue-200">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">Sign in to your account to continue</CardDescription>
            </>
          )}
          {isForgotPassword && (
            <>
              <CardTitle className="from-primary bg-gradient-to-r to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                Reset Password
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">We'll send you a reset link to your email address</CardDescription>
            </>
          )}

          {/* Success Message */}
          {forgotPasswordSuccess && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <CircleCheck className="h-5 w-5 flex-shrink-0" />
              <p>{forgotPasswordSuccess}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        autoComplete="email"
                        className="border-border/50 focus:border-primary/50 hover:border-primary/30 h-12 rounded-xl border-2 pl-10 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            {!isForgotPassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="text-primary hover:text-primary/80 h-auto p-0 text-sm transition-colors"
                        onClick={onForgotPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          autoComplete="current-password"
                          className="border-border/50 focus:border-primary/50 hover:border-primary/30 h-12 rounded-xl border-2 pr-12 pl-10 transition-all duration-200"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Eye className="text-muted-foreground h-4 w-4" /> : <EyeOff className="text-muted-foreground h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Forgot Password Actions */}
            {isForgotPassword && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-primary/20 h-12 flex-1 rounded-xl border-2 transition-all duration-200"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Back to Login
                </Button>
                <Button
                  type="button"
                  className="from-primary hover:from-primary/90 h-12 flex-1 rounded-xl bg-gradient-to-r to-blue-600 shadow-lg transition-all duration-200 hover:to-blue-600/90 hover:shadow-xl"
                  onClick={handleForgotPassword}
                >
                  Send Reset Link
                </Button>
              </div>
            )}
          </CardContent>

          {/* Footer */}
          {!isForgotPassword && (
            <CardFooter className="mt-6 flex flex-col space-y-4">
              <Button
                type="submit"
                className="from-primary hover:from-primary/90 h-10 w-full rounded-xl bg-gradient-to-r to-blue-600 shadow-lg transition-all duration-200 hover:to-blue-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted-foreground text-sm">Don't have an account? </span>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium transition-colors"
                  onClick={() => navigate("/auth/register")}
                >
                  Create one here
                </Button>
              </div>
            </CardFooter>
          )}
        </form>
      </Card>
    </Form>
  );
}
