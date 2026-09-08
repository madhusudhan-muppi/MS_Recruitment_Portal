import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-screen items-center justify-center">
      <div className="surface max-w-sm p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">Department Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorry, the department you&rsquo;re looking for doesn&rsquo;t exist or has been removed.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/departments" className="btn-primary">
            Browse All Departments
          </Link>
          <Link href="/" className="btn-ghost">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
