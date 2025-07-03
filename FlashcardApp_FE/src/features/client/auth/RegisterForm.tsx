import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Mail, Lock, User, MapPin, Phone, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/services/useAuth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string().min(1, "Token is required"),
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type VerifyOtpFormInputs = z.infer<typeof otpSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterEmailForm() {
  const { register, authLoading, error, requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm<Pick<RegisterFormInputs, "email">>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<VerifyOtpFormInputs>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const registerForm = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      fullName: "",
      address: "",
      phone: "",
    },
  });

  const handleEmailSubmit = async (data: Pick<RegisterFormInputs, "email">) => {
    try {
      await requestOtp(data.email);
      setOtpSent(true);
      setEmail(data.email);
      registerForm.setValue("email", data.email); // keep email in form state
    } catch (error: any) {
      emailForm.setError("email", { message: error.message || "Failed to send OTP" });
    }
  };

  const handleOtpSubmit = async (data: VerifyOtpFormInputs) => {
    console.log("OTP submit called", data);
    setOtpLoading(true);
    try {
      const result = await verifyOtp(email, data.otp);
      setOtpVerified(true);
      setToken(result.token); // store the token for later use
      registerForm.setValue("token", result.token); // keep token in form state
    } catch (error: any) {
      otpForm.setError("otp", { message: error.message || "Invalid OTP" });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormInputs) => {
    try {
      await register({
        email,
        password: data.password,
        token,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
      });
      navigate("/auth/login");
    } catch (error: any) {
      // Error is handled by context
    }
  };

  // Step titles and descriptions
  const getStepInfo = () => {
    if (!otpSent) {
      return {
        title: "Create Account",
        description: "Enter your email to get started",
      };
    } else if (otpSent && !otpVerified) {
      return {
        title: "Verify Email",
        description: `We've sent a 6-digit code to ${email}`,
      };
    } else {
      return {
        title: "Complete Profile",
        description: "Fill in your details to finish registration",
      };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Form {...registerForm}>
      <Card className="min-w-lg space-y-4 border-0 bg-white/80 py-4 shadow-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="from-primary bg-gradient-to-r to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
            {stepInfo.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">{stepInfo.description}</CardDescription>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </CardHeader>

        {/* Step 1: Email Input */}
        {!otpSent && (
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          type="email"
                          placeholder="Enter your email address"
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
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-6">
              <Button
                type="submit"
                className="from-primary hover:from-primary/90 h-12 w-full rounded-xl bg-gradient-to-r to-blue-600 shadow-lg transition-all duration-200 hover:to-blue-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending verification...
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted-foreground text-sm">Already have an account? </span>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium transition-colors"
                  onClick={() => navigate("/auth/login")}
                >
                  Sign in here
                </Button>
              </div>
            </CardFooter>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {otpSent && !otpVerified && (
          <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP {...field} maxLength={6} className="gap-2">
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot
                              index={0}
                              className="border-border/50 focus:border-primary/50 h-12 w-12 rounded-lg border-2 text-lg font-semibold transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={1}
                              className="border-border/50 focus:border-primary/50 h-12 w-12 rounded-lg border-2 text-lg font-semibold transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={2}
                              className="border-border/50 focus:border-primary/50 h-12 w-12 rounded-lg border-2 text-lg font-semibold transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={3}
                              className="border-border/50 focus:border-primary/50 h-12 w-12 rounded-lg border-2 text-lg font-semibold transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={4}
                              className="border-border/50 focus:border-primary/50 h-12 w-12 rounded-lg border-2 text-lg font-semibold transition-all duration-200"
                            />
                            <InputOTPSlot
                              index={5}
                              className="border-border/50 focus:border-primary/50 h-12 w-12 rounded-lg border-2 text-lg font-semibold transition-all duration-200"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="text-muted-foreground text-center text-sm mt-2">
                      Didn't receive the code?
                      <Button
                        type="button"
                        variant="link"
                        className="text-primary hover:text-primary/80 ml-1 h-auto p-0 text-sm font-medium transition-colors"
                        onClick={() => handleEmailSubmit({ email })}
                      >
                        Resend
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-6">
              <Button
                type="submit"
                className="from-primary hover:from-primary/90 h-12 w-full rounded-xl bg-gradient-to-r to-blue-600 shadow-lg transition-all duration-200 hover:to-blue-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={otpLoading}
              >
                {otpLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="hover:bg-primary/20 h-12 w-full rounded-xl border-2 transition-all duration-200"
                onClick={() => setOtpSent(false)}
              >
                Back to Email
              </Button>
            </CardFooter>
          </form>
        )}

        {/* Step 3: Complete Registration */}
        {otpSent && otpVerified && (
          <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
            <CardContent className="space-y-6">
              {/* Password Field */}
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          {...field}
                          autoComplete="new-password"
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

              {/* Full Name Field */}
              <FormField
                control={registerForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          {...field}
                          autoComplete="name"
                          className="border-border/50 focus:border-primary/50 hover:border-primary/30 h-12 rounded-xl border-2 pl-10 transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Field */}
              <FormField
                control={registerForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          type="text"
                          placeholder="Enter your address"
                          {...field}
                          autoComplete="street-address"
                          className="border-border/50 focus:border-primary/50 hover:border-primary/30 h-12 rounded-xl border-2 pl-10 transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={registerForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                          autoComplete="tel"
                          className="border-border/50 focus:border-primary/50 hover:border-primary/30 h-12 rounded-xl border-2 pl-10 transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-6">
              <Button
                type="submit"
                className="from-primary hover:from-primary/90 h-12 w-full rounded-xl bg-gradient-to-r to-blue-600 shadow-lg transition-all duration-200 hover:to-blue-600/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={authLoading}
              >
                {authLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted-foreground text-sm">Already have an account? </span>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium transition-colors"
                  onClick={() => navigate("/auth/login")}
                >
                  Sign in here
                </Button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </Form>
  );
}
