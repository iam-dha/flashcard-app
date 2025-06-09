import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/services/useAuth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AlertCircle } from "lucide-react";

const schema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    reNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.reNewPassword, {
    message: "Passwords do not match",
    path: ["reNewPassword"],
  });

type ResetInputs = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { resetPassword, login } = useAuth();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uri = new URL(window.location.href);
  const emailFromUrl = uri.searchParams.get("email");

  const form = useForm<ResetInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      reNewPassword: "",
    },
  });

  const onSubmit = async (data: ResetInputs) => {
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(token!, data.newPassword, data.reNewPassword);
      setSuccess("Password reset successfully! Redirecting to home page...");
      setTimeout(async () => {
        await login({ email: emailFromUrl ?? "", password: data.newPassword });
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Form {...form}>
        <Card className="w-2xl max-w-md space-y-4 py-6">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password below. Make sure to remember it :D</CardDescription>
            {error && (
              <div className="bg-destructive/15 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input value={emailFromUrl ?? ""} disabled={true} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" {...field} className="bg-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {success && <div className="text-green-600">{success}</div>}
            </CardContent>
            <CardFooter className="mt-8">
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Form>
    </div>
  );
}
