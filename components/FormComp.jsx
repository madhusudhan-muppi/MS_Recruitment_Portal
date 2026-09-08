"use client";
import React, { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { QuestionnaireData, ORG_NAME } from "@/constants";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSubmissions } from "@/components/SubmissionsProvider";

const GENERAL_QUESTION_NAME = `Why do you want to join ${ORG_NAME}?`;
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const normaliseQuestion = (question) =>
  typeof question === "string"
    ? { name: question, type: "generic", placeholder: "2-3 sentences" }
    : question;

const normalizeDeptName = (str) =>
  str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "";

// Single source of truth for "which questions belong to this department" —
// used by both the schema builder and the submit handler so they can never disagree.
const questionsForDepartment = (department) =>
  (
    QuestionnaireData.find(
      (item) => normalizeDeptName(item.department) === normalizeDeptName(department)
    )?.questions ?? []
  ).map(normaliseQuestion);

const FormComp = ({ dept1, dept2 }) => {
  // Use Better Auth's useSession hook directly
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isSignedIn = !!user;
  const isLoaded = !isPending;

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { submittedDepartments: contextSubmitted, markDepartmentsSubmitted } = useSubmissions();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [isDraftReady, setIsDraftReady] = useState(false);

  const departmentObjects = useMemo(() => [dept1, dept2].filter(Boolean), [dept1, dept2]);
  const departmentNames = useMemo(
    () =>
      departmentObjects.map((department) =>
        typeof department === "string" ? department : department.name
      ),
    [departmentObjects]
  );
  const draftKey = user?.email && departmentNames.length
    ? `recruitment-draft:${user.email}:${[...departmentNames].sort().join("|")}`
    : null;

  const questionData = useMemo(
    () => [...new Set(departmentNames.flatMap((department) =>
      questionsForDepartment(department).map((question) => question.name)
    ))],
    [departmentNames]
  );

  const schemaObj = {
    Name: z.string().min(1, "Name is required"),
    RegistrationNumber: z
      .string()
      .min(1, "Registration number is required")
      .regex(
        /^\d{2}[A-Z]{3}\d{4}$/,
        "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)"
      ),
    Gender: z.string().optional(),
    Email: z.string(),
    Phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    "Year of Study": z.string().optional(),
  };

  questionData.forEach((qd) => {
    schemaObj[qd] = z.string().optional();
  });

  const formSchema = z.object(schemaObj);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      RegistrationNumber: "",
      Gender: "",
      Email: "",
      Phone: "",
      "Year of Study": "",
    },
  });

  useEffect(() => {
    if (!isLoaded || !user || !draftKey) return;

    const email = user.email;
    let isActive = true;
    setIsDraftReady(false);

    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      form.reset({ ...form.getValues(), ...savedDraft.values, Email: email });
    } catch {
      form.setValue("Email", email);
    }

    async function initialiseForm() {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      let remoteSubmitted = contextSubmitted || [];

      if (!remoteSubmitted.length) {
        const cacheKey = `submitted_depts_${email}`;
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

        if (cached) {
          try {
            remoteSubmitted = JSON.parse(cached);
          } catch {}
        } else {
          try {
            const response = await fetch(`/api/check-applications?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            if (result?.submittedDepartments) {
              remoteSubmitted = result.submittedDepartments;
              if (typeof window !== "undefined") {
                sessionStorage.setItem(cacheKey, JSON.stringify(remoteSubmitted));
              }
            }
          } catch (err) {
            console.error("Failed to check applications:", err);
          }
        }
      }

      if (!isActive) return;
      const completed = [...new Set([...(savedDraft.submittedDepartments || []), ...remoteSubmitted])];
      setSubmittedDepartments(completed);
      if (departmentNames.length > 0 && departmentNames.every((dept) => completed.includes(dept))) {
        setErrorMessage(`You have already submitted an application for ${departmentNames.join(" and ")}.`);
      }
      localStorage.setItem(draftKey, JSON.stringify({ values: form.getValues(), submittedDepartments: completed }));
      setIsDraftReady(true);
    }

    initialiseForm().catch(() => {
      if (isActive) setIsDraftReady(true);
    });

    return () => { isActive = false; };
  }, [contextSubmitted, departmentNames, draftKey, form, isLoaded, user]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!isDraftReady || !draftKey) return;
    localStorage.setItem(draftKey, JSON.stringify({ values: watchedValues, submittedDepartments }));
  }, [draftKey, isDraftReady, submittedDepartments, watchedValues]);

  // Check if user is authenticated
  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="surface max-w-sm p-8 text-center">
          <p className="text-xl font-semibold text-foreground">Sign In Required</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to access the application form.
          </p>
          <Button onClick={() => router.push("/auth/signin")} className="btn-primary mt-6 w-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const pendingDepartments = departmentNames.filter((department) => !submittedDepartments.includes(department));

    if (!pendingDepartments.length) {
      toast.success("Your applications have already been submitted.");
      setIsSubmitting(false);
      router.push("/departments");
      return;
    }

    const basicDetails = {
      Name: values.Name,
      RegistrationNumber: values.RegistrationNumber,
      Gender: values.Gender,
      Email: values.Email,
      Phone: values.Phone,
      "Year of Study": values["Year of Study"],
    };

    const submitDepartment = async (department) => {
      const questions = questionsForDepartment(department);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicDetails,
          Department: department,
          Questions: questions.reduce((answers, question) => ({ ...answers, [question.name]: values[question.name] || "" }), {}),
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Could not submit ${department}.`);
      }
      return { department, success: true };
    };

    try {
      const results = await Promise.allSettled(pendingDepartments.map(submitDepartment));
      const successful = results
        .filter((result) => result.status === "fulfilled" && result.value.success)
        .map((result) => result.value.department);
      const failed = results.flatMap((result, index) =>
        result.status === "rejected" ? [pendingDepartments[index]] : []
      );
      const completed = [...new Set([...submittedDepartments, ...successful])];

      setSubmittedDepartments(completed);
      markDepartmentsSubmitted(completed);
      if (typeof window !== "undefined" && values?.Email) {
        sessionStorage.setItem(`submitted_depts_${values.Email}`, JSON.stringify(completed));
      }
      successful.forEach((department) => toast.success(`Application submitted for ${department}.`));

      if (failed.length) {
        // Keep the draft around so the applicant can retry the departments that failed.
        if (draftKey) localStorage.setItem(draftKey, JSON.stringify({ values, submittedDepartments: completed }));
        setErrorMessage(`Submitted ${successful.length ? successful.join(", ") : "no applications"}. Please retry ${failed.join(", ")}.`);
      } else {
        // Everything succeeded — the draft would otherwise sit in localStorage readable by
        // the next person on a shared machine.
        if (draftKey) localStorage.removeItem(draftKey);
        router.push("/departments");
      }
    } catch {
      setErrorMessage("Your applications could not be submitted. Your saved answers will be kept for retrying.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container-page py-10">
      {errorMessage && !isSubmitting && (
        <div className="surface mb-6 flex items-start gap-3 border-destructive/40 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            <button
              type="button"
              onClick={() => router.push("/departments")}
              className="btn-ghost mt-2 h-8 px-3 text-xs"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-foreground">Application Form</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        {departmentObjects.map((department, index) => {
          const name = typeof department === "string" ? department : department.name;
          const tone = typeof department === "string" ? undefined : department.tone;
          return (
            <span
              key={name || index}
              className="badge"
              style={tone ? { backgroundColor: `${tone}22`, color: tone, borderColor: `${tone}55` } : undefined}
            >
              {name}
            </span>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-8">
          <section className="surface p-6">
            <h2 className="text-lg font-semibold text-foreground">About You</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="field" placeholder="Jane Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="RegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="field"
                        placeholder="e.g. 25BCE5612"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Gender</FormLabel>
                    <FormControl>
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger className="field">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDER_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Year of Study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Year of Study</FormLabel>
                    <FormControl>
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger className="field">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEAR_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="field" readOnly type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">Phone (WhatsApp)</FormLabel>
                    <FormControl>
                      <Input {...field} className="field" placeholder="+919876543210" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name={GENERAL_QUESTION_NAME}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">{GENERAL_QUESTION_NAME}</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="field h-auto" rows={4} placeholder="2-3 Sentences" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {departmentObjects[0] && renderDepartmentQuestions(departmentObjects[0], form)}
          {departmentObjects[1] && renderDepartmentQuestions(departmentObjects[1], form)}

          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-3 text-base">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </Form>
    </main>
  );
};

const renderDepartmentQuestions = (department, form) => {
  const name = typeof department === "string" ? department : department.name;
  const tone = typeof department === "string" ? undefined : department.tone;

  const questions = questionsForDepartment(name).filter(
    (question) => question.name !== GENERAL_QUESTION_NAME
  );

  if (!questions.length) return null;

  return (
    <section key={name} className="surface overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: tone || "hsl(var(--primary))" }} />
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">{name} Questions</h2>

        <div className="mt-4 space-y-4">
          {questions.map((question) => {
            const isCompact = question.type === "short-text";

            return (
              <FormField
                key={question.name}
                control={form.control}
                name={question.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label">{question.name}</FormLabel>
                    <FormControl>
                      {isCompact ? (
                        <Input {...field} className="field" placeholder={question.placeholder || "Answer..."} />
                      ) : (
                        <Textarea
                          {...field}
                          className="field h-auto"
                          rows={4}
                          placeholder={question.placeholder || "2-3 sentences"}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FormComp;
