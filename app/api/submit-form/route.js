import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MAX_APPLICATIONS } from "@/constants";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    const deadlineEnv = process.env.APPLICATION_DEADLINE;
    if (deadlineEnv) {
      const deadline = new Date(deadlineEnv);
      if (isNaN(deadline.getTime())) {
        console.warn("Invalid APPLICATION_DEADLINE environment variable:", deadlineEnv);
      } else if (new Date() > deadline) {
        return new Response(
          JSON.stringify({
            message: "The submission deadline has passed",
          }),
          { status: 403 }
        );
      }
    }


    const db = await connect();
    const data = await req.json();

    const { Department, Questions } = data;

    // Only these fields may come from the client. Previously the handler
    // spread `...formFields` — every remaining key in the request body —
    // straight into the document, so an applicant could POST
    // {"shortlisted": true} and shortlist themselves, or write arbitrary
    // junk into the collection. Email/createdAt were already assigned after
    // the spread, but `shortlisted` was not.
    const ALLOWED_FIELDS = [
      "Name",
      "RegistrationNumber",
      "Gender",
      "Phone",
      "Year of Study",
    ];
    const MAX_FIELD_LENGTH = 200;

    const formFields = {};
    for (const key of ALLOWED_FIELDS) {
      const value = data[key];
      if (value === undefined || value === null) continue;
      if (typeof value !== "string") {
        return new Response(
          JSON.stringify({ message: `${key} must be a string` }),
          { status: 400 }
        );
      }
      if (value.length > MAX_FIELD_LENGTH) {
        return new Response(
          JSON.stringify({
            message: `${key} cannot exceed ${MAX_FIELD_LENGTH} characters`,
          }),
          { status: 400 }
        );
      }
      formFields[key] = value;
    }

    if (!Department || typeof Department !== "string" || !Department.trim()) {
      return new Response(
        JSON.stringify({ message: "Department must be a non-empty string" }),
        { status: 400 }
      );
    }

    if (Questions !== undefined && Questions !== null) {
      let entries = [];
      if (Array.isArray(Questions)) {
        entries = Questions.map((q, idx) => [idx, q]);
      } else if (typeof Questions === "object") {
        entries = Object.entries(Questions);
      } else {
        return new Response(
          JSON.stringify({ message: "Questions must be an object or array" }),
          { status: 400 }
        );
      }

      if (entries.length > 40) {
        return new Response(
          JSON.stringify({ message: "Questions cannot exceed 40 items" }),
          { status: 400 }
        );
      }

      for (const [key, answer] of entries) {
        if (typeof answer !== "string") {
          return new Response(
            JSON.stringify({ message: "Each question answer must be a string" }),
            { status: 400 }
          );
        }
        if (answer.length > 5000) {
          return new Response(
            JSON.stringify({ message: "Question answers cannot exceed 5000 characters" }),
            { status: 400 }
          );
        }
      }
    }

    const regNoRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    if (formFields.RegistrationNumber && !regNoRegex.test(formFields.RegistrationNumber)) {
      return new Response(
        JSON.stringify({
          message: "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)",
        }),
        { status: 400 }
      );
    }

    const collection = db.collection("formData");

    const transactionResult = await db.runTransaction(async (transaction) => {
      const query = collection.where("Email", "==", userEmail);
      const existingSubmissions = await transaction.get(query);

      const alreadySubmittedDept = existingSubmissions.docs.some(
        (doc) => doc.data()?.Department === Department
      );

      if (alreadySubmittedDept) {
        return {
          errorResponse: new Response(
            JSON.stringify({
              message: `You have already submitted an application for ${Department}`,
            }),
            { status: 400 }
          ),
        };
      }

      if (existingSubmissions.size >= MAX_APPLICATIONS) {
        return {
          errorResponse: new Response(
            JSON.stringify({
              message: `Remember that you can only submit up to ${MAX_APPLICATIONS} unique applications`,
            }),
            { status: 400 }
          ),
        };
      }

      const newDocRef = collection.doc();
      transaction.set(newDocRef, {
        ...formFields,
        Department,
        Questions,
        Email: userEmail,
        // Always server-assigned, never taken from the request body.
        shortlisted: false,
        createdAt: new Date(),
      });

      return { success: true };
    });

    if (transactionResult.errorResponse) {
      return transactionResult.errorResponse;
    }

    return new Response(
      JSON.stringify({
        message: "Form submitted successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(JSON.stringify({ message: "Error submitting form" }), {
      status: 500,
    });
  }
}
