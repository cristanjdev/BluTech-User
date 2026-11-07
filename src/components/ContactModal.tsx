import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Phone, Mail, Linkedin } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitCommission, commissionSchema } from "@/server/commissions";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  { value: "web", label: "Web Development" },
  { value: "app", label: "App Development" },
  { value: "uiux", label: "UI / UX Design" },
  { value: "backend", label: "Backend & APIs" },
  { value: "automation", label: "Automation & AI" },
  { value: "other", label: "Other" },
] as const;

type FormState = {
  name: string;
  email: string;
  projectType: (typeof PROJECT_TYPES)[number]["value"];
  budget: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  projectType: "web",
  budget: "",
  message: "",
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 10.99 10.125 11.854v-8.44H7.078v-3.414h3.047V9.47c0-3.022 1.793-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.966h-1.513c-1.49 0-1.956.928-1.956 1.88v2.26h3.328l-.532 3.414h-2.796v8.44C19.612 23.063 24 18.092 24 12.073z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.33v13.17a2.87 2.87 0 1 1-2.87-2.87c.22 0 .44.03.65.08V9c-.21-.03-.43-.05-.65-.05A6.2 6.2 0 1 0 15.82 15V8.36a8.16 8.16 0 0 0 4.78 1.54V6.69h-1.01z" />
    </svg>
  );
}

export function ContactModal({ open, onClose }: Props) {
  const submit = useServerFn(submitCommission);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
    setServerError(null);
  };

  const close = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = commissionSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setServerError(res.error ?? "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerError("Network error. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative flex h-full items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Start a project"
              className="relative w-full max-w-[95vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-w-xl md:max-w-3xl md:rounded-3xl lg:max-w-4xl"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {status === "success" ? (
                <div className="px-6 py-12 text-center sm:px-8 md:px-12 md:py-16 lg:px-16 lg:py-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-700 text-white md:h-16 md:w-16"
                  >
                    <Check className="h-7 w-7 md:h-8 md:w-8" />
                  </motion.div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:mt-6 md:text-2xl">
                    Got it — talk soon.
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:mt-3 md:text-base">
                    Your request landed. I'll get back to you within 1–2 business days.
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 md:mt-8"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-12">
                  {/* Left side - Header */}
                  <div className="flex flex-col border-b border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-700 dark:bg-slate-800/50 sm:px-6 md:col-span-4 md:border-b-0 md:border-r md:px-8 md:py-10 lg:col-span-5 lg:px-10 lg:py-12">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                      / Commission
                    </span>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl md:mt-4 lg:text-3xl">
                      Start a project
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:mt-3 md:text-base">
                      Tell me a little about what you're building.
                    </p>
                    <div className="mt-6 hidden flex-1 flex-col items-center justify-center md:flex">
                      <img
                        src="/blutech-logo.png"
                        alt="BluTech"
                        className="h-36 w-36 object-contain opacity-100 lg:h-44 lg:w-44"
                      />
                      <div className="mt-6 w-full max-w-xs text-center">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                          Or contact us in:
                        </p>
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <a
                            href="https://www.facebook.com/profile.php?id=61576743929523"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-500"
                          >
                            <FacebookIcon />
                            <span>Facebook</span>
                          </a>
                          <a
                            href="https://tiktok.com/@blutech18"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-500"
                          >
                            <TikTokIcon />
                            <span>TikTok</span>
                          </a>
                          <a
                            href="https://www.linkedin.com/in/cjjumawan/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-500"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </a>
                          <a
                            href="tel:+639000000000"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-500"
                          >
                            <Phone className="h-4 w-4" />
                            <span>+63 961 711 0582</span>
                          </a>
                        </div>
                        <a
                          href="mailto:blutech18@gmail.com"
                          className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-700 transition-colors hover:text-sky-500 dark:text-slate-200"
                        >
                          <Mail className="h-4 w-4" />
                          <span>blutech18@gmail.com</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Form */}
                  <div className="flex px-5 py-5 sm:px-6 md:col-span-8 md:items-center md:px-8 md:py-8 lg:col-span-7 lg:px-10 lg:py-10">
                    <form
                      onSubmit={onSubmit}
                      className="w-full space-y-3 sm:space-y-4 lg:space-y-5"
                      noValidate
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Name" error={errors.name}>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            maxLength={100}
                            className="input"
                            placeholder="Jane Doe"
                          />
                        </Field>
                        <Field label="Email" error={errors.email}>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            maxLength={255}
                            className="input"
                            placeholder="jane@company.com"
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Project type" error={errors.projectType}>
                          <select
                            value={form.projectType}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                projectType: e.target.value as FormState["projectType"],
                              })
                            }
                            className="input"
                          >
                            {PROJECT_TYPES.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Budget (optional)">
                          <input
                            type="text"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            maxLength={50}
                            className="input"
                            placeholder="$10k–$25k"
                          />
                        </Field>
                      </div>
                      <Field label="Project details" error={errors.message}>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={4}
                          maxLength={2000}
                          className="input resize-none md:min-h-[100px] lg:min-h-[120px]"
                          placeholder="What are you building? Any constraints, timelines, or links?"
                        />
                      </Field>

                      {serverError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                          {serverError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_rgba(29,78,216,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-10px_rgba(29,78,216,0.7)] disabled:opacity-70 md:py-3.5 md:text-base"
                      >
                        {status === "submitting" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          "Send request"
                        )}
                      </button>
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Your details are used only to reply about your project. See the{" "}
                        <Link
                          to="/privacy"
                          className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-white"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </div>
                </div>
              )}

              <style>{`
                .input {
                  width: 100%;
                  height: 40px;
                  border-radius: 0.625rem;
                  border: 1px solid rgb(226 232 240);
                  background: rgb(248 250 252);
                  padding: 0 0.75rem;
                  font-size: 0.875rem;
                  color: rgb(15 23 42);
                  transition: border-color 150ms, background 150ms, box-shadow 150ms;
                  outline: none;
                }
                textarea.input {
                  height: auto;
                  padding: 0.55rem 0.75rem;
                }
                .dark .input {
                  border-color: rgb(51 65 85);
                  background: rgb(30 41 59);
                  color: rgb(248 250 252);
                }
                .input:focus {
                  background: white;
                  border-color: rgb(56 189 248);
                  box-shadow: 0 0 0 3px rgb(186 230 253 / 0.4);
                }
                .dark .input:focus {
                  background: rgb(15 23 42);
                  border-color: rgb(56 189 248);
                  box-shadow: 0 0 0 3px rgb(56 189 248 / 0.2);
                }
                .input::placeholder { color: rgb(148 163 184); }
                .dark .input::placeholder { color: rgb(100 116 139); }
                @media (min-width: 640px) {
                  .input {
                    height: 42px;
                    padding: 0 0.85rem;
                  }
                  textarea.input {
                    height: auto;
                    padding: 0.6rem 0.85rem;
                  }
                }
                @media (min-width: 768px) {
                  .input {
                    height: 44px;
                    padding: 0 0.9rem;
                    font-size: 0.9rem;
                  }
                  textarea.input {
                    height: auto;
                    padding: 0.65rem 0.9rem;
                  }
                }
                @media (min-width: 1024px) {
                  .input {
                    height: 48px;
                    padding: 0 1rem;
                    font-size: 0.95rem;
                    border-radius: 0.75rem;
                  }
                  textarea.input {
                    height: auto;
                    padding: 0.7rem 1rem;
                  }
                }
              `}</style>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 md:text-xs">
          {label}
        </span>
        {error && (
          <span className="text-[10px] font-medium text-red-600 dark:text-red-400 md:text-xs">
            {error}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}
