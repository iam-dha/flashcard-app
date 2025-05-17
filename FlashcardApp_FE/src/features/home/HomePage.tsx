import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-blue-500 rounded-xl shadow-lg backdrop-blur-lg">
        <h1>Home page</h1>
        <Button variant="outline" className="bg-white text-blue-500 hover:bg-blue-100" onClick={ async () => {
          const response = await fetch("http://localhost:9090/api/v1/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          console.log(response);
        }}>
          </Button>
      </div>
    </>
  );
}
