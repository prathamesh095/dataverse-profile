"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Send,
	Eye,
	Copy,
	CheckCircle,
	Sparkles,
	CalendarIcon,
	Briefcase,
	Laptop,
	Users,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// --- CONSTANTS AND TYPES ---

const PROJECTS = {
	"data-analysis": "Data Analysis",
	dashboard: "Dashboard Development",
	"ml-model": "ML Model Development",
	consulting: "Data Science Consulting",
	training: "Training & Workshops",
	collaboration: "Collaboration",
} as const;

const BUDGETS = {
	discuss: "Let’s Discuss",
	"under-5k": "Under $5K",
	"5k-15k": "$5K–$15K",
	"15k-50k": "$15K–$50K",
	"50k-plus": "$50K+",
} as const;

const TIMELINES = {
	asap: "ASAP",
	flexible: "Flexible",
	"1-month": "1 Month",
	"3-months": "3 Months",
	"6-months": "6 Months",
} as const;

type ProjectKey = keyof typeof PROJECTS;
type BudgetKey = keyof typeof BUDGETS;
type TimelineKey = keyof typeof TIMELINES;
type TabKey = "freelance" | "fulltime" | "collaboration";

interface FormState {
	tab: TabKey;
	name: string;
	email: string;
	company: string;
	message: string;
	projectType?: ProjectKey;
	budget?: BudgetKey;
	timeline?: TimelineKey;
	newsletter?: boolean;
	role?: string;
	salary?: string;
	startDate?: Date;
}

// --- CHILD COMPONENTS (Memoized for Performance) ---

// Define a type for the update function for better clarity and type safety
type UpdateFunction = <K extends keyof FormState>(field: K, value: FormState[K]) => void;

interface FieldProps {
	form: FormState;
	update: UpdateFunction;
}

const FreelanceFields = React.memo(({ form, update }: FieldProps) => (
	<>
		<div className="space-y-2">
			<Label>Company (optional)</Label>
			<Input
				placeholder="Stark Industries"
				value={form.company}
				onChange={(e) => update("company", e.target.value)}
			/>
		</div>
		<div className="grid md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label>Project Type *</Label>
				<Select
					value={form.projectType}
					onValueChange={(v) => update("projectType", v as ProjectKey)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Choose" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(PROJECTS).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label>Timeline</Label>
				<Select
					value={form.timeline}
					onValueChange={(v) => update("timeline", v as TimelineKey)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Flexible" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(TIMELINES).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
		<div className="flex items-center gap-3">
			<Checkbox
				id="news"
				checked={!!form.newsletter} // Ensure boolean check
				onCheckedChange={(c) => update("newsletter", !!c)}
			/>
			<Label htmlFor="news" className="text-sm font-normal cursor-pointer">
				Send me monthly ML tips
			</Label>
		</div>
	</>
));
FreelanceFields.displayName = "FreelanceFields";

const FullTimeFields = React.memo(({ form, update }: FieldProps) => (
	<>
		<div className="space-y-2">
			<Label>Company *</Label>
			<Input
				placeholder="Stark Industries"
				value={form.company}
				onChange={(e) => update("company", e.target.value)}
				required
			/>
		</div>
		<div className="grid md:grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label>Role *</Label>
				<Input
					placeholder="Senior ML Engineer"
					value={form.role}
					onChange={(e) => update("role", e.target.value)}
					required
				/>
			</div>
			<div className="space-y-2">
				<Label>Salary Range</Label>
				<Input
					placeholder="₹18–25 LPA"
					value={form.salary}
					onChange={(e) => update("salary", e.target.value)}
				/>
			</div>
		</div>

		{/* Calendar */}
		<div className="space-y-2">
			<Label>Preferred Start Date (optional)</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							"w-full justify-start text-left font-normal h-12",
							!form.startDate && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{form.startDate ? format(form.startDate, "PPP") : "Anytime"}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={form.startDate}
						onSelect={(date) => update("startDate", date ?? undefined)}
						disabled={(date) => date < new Date()}
						initialFocus
						captionLayout="dropdown"
						className="rounded-md border shadow-lg"
					/>
				</PopoverContent>
			</Popover>
		</div>
	</>
));
FullTimeFields.displayName = "FullTimeFields";


// --- MAIN COMPONENT ---

export function ContactForm() {
	const [form, setForm] = useState<FormState>(() => ({ // Lazy initialization
		tab: "freelance",
		name: "",
		email: "",
		company: "",
		message: "",
		newsletter: false,
	}));
	const [preview, setPreview] = useState(false);

	// Use useCallback to ensure the update function reference is stable
	const update: UpdateFunction = useCallback((field, value) => {
		setForm((p) => ({ ...p, [field]: value }));
	}, []);

	// Use useMemo for validation and email building logic if the form state is large
	const validate = useCallback(() => {
		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return false;
		if (!/^\S+@\S+\.\S+$/.test(form.email)) return false;
		if (form.tab === "freelance" && !form.projectType) return false;
		// Note: The original logic required Company for Full-Time, which is kept.
		if (form.tab === "fulltime" && (!form.role || !form.company)) return false; 
		return true;
	}, [form.name, form.email, form.message, form.tab, form.projectType, form.role, form.company]);

	const buildEmail = useCallback(() => {
		const base = `Subject: ${
				form.tab === "collaboration"
					? "Collaboration"
					: form.tab === "fulltime"
					? "Full-Time Role"
					: "Freelance Project"
			} – ${form.name}

Hi Prathamesh!

${form.name} here${form.company && form.tab !== "fulltime" ? ` from ${form.company}` : form.company && form.tab === "fulltime" ? ` from ${form.company}`: ""}.
`; // Simplified the company check for the base greeting

		if (form.tab === "freelance") {
			return `${base}Project: ${
				form.projectType ? PROJECTS[form.projectType] : "—"
			}
Budget: ${form.budget ? BUDGETS[form.budget] : "—"}
Timeline: ${form.timeline ? TIMELINES[form.timeline] : "—"}
Newsletter: ${form.newsletter ? "Yes" : "No"}

${form.message}

Let’s crush it!
— ${form.name}`;
		}

		if (form.tab === "fulltime") {
			return `${base}Role: ${form.role || "—"}
Company: ${form.company || "—"}
Salary: ${form.salary || "Open to discuss"}
Start: ${form.startDate ? format(form.startDate, "PPP") : "Flexible"}

${form.message}

Excited to join the team!
— ${form.name}`;
		}

		return `${base}Idea: ${form.message}

Looking forward to brainstorming!
— ${form.name}`;
	}, [form]);

	const send = useCallback(() => {
		// Only encode subject and body separately
		const fullEmailText = buildEmail();
		const [subjectLine, ...bodyLines] = fullEmailText.split("\n");
		
		// Remove "Subject: " prefix before encoding the subject
		const subject = encodeURIComponent(subjectLine.replace("Subject: ", ""));
		const body = encodeURIComponent(bodyLines.join("\n"));

		window.location.href = `mailto:pawar.prathamesh@outlook.com?subject=${subject}&body=${body}`;
	}, [buildEmail]);

	const copyEmail = useCallback(() => {
		navigator.clipboard.writeText(buildEmail());
		toast.success("Email copied!");
	}, [buildEmail]);

	// Handle preview rendering
	if (preview) {
		return (
			<Card className="max-w-3xl mx-auto shadow-2xl">
				<CardHeader className="bg-primary text-primary-foreground">
					<CardTitle className="flex items-center gap-3 text-xl">
						<CheckCircle className="w-6 h-6" />
						Ready to Send
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					{/* Using a pre-wrap container for email content */}
					<div className="bg-muted/50 p-6 rounded-xl font-mono text-sm leading-relaxed border whitespace-pre-wrap">
						{buildEmail()}
					</div>
					<div className="flex flex-wrap gap-3 justify-end">
						<Button variant="outline" onClick={() => setPreview(false)}>
							Edit
						</Button>
						<Button variant="outline" onClick={copyEmail}>
							<Copy className="w-4 h-4 mr-2" /> Copy
						</Button>
						<Button onClick={send} size="lg">
							<Send className="w-5 h-5 mr-2" /> Open Mail
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="max-w-2xl mx-auto shadow-2xl border-0 overflow-hidden">
			<CardHeader className="text-center pb-4 bg-primary/5">
				<CardTitle className="text-3xl flex items-center justify-center gap-3">
					<Sparkles className="w-8 h-8 text-primary" />
					Let’s Connect
				</CardTitle>
				<p className="text-muted-foreground mt-2">
					One form. Three ways to team up.
				</p>
			</CardHeader>

			<CardContent className="pt-6">
				<Tabs
					value={form.tab}
					onValueChange={(v) => {
						const newTab = v as TabKey;
						update("tab", newTab);
						// Clear specific fields when switching tabs
						if (newTab !== "freelance") {
							update("projectType", undefined);
						}
						if (newTab !== "fulltime") {
							update("role", "");
							update("startDate", undefined);
							update("company", form.tab === 'fulltime' ? '' : form.company); // Clear company only if switching *from* fulltime
						} else {
							// Resetting projectType if going to fulltime
							update("projectType", undefined);
						}
					}}
				>
					<TabsList 
						// Using muted/primary colors for premium appearance
						className="grid w-full grid-cols-3 h-14 rounded-xl bg-muted/50 p-1"
						aria-label="Contact reason selection: Freelance, Full-Time, or Collaboration"
					>
						<TabsTrigger
							value="freelance"
							// Active state pulls theme's primary shadow
							className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground"
						>
							<Laptop className="w-4 h-4 mr-2" />
							Freelance
						</TabsTrigger>
						<TabsTrigger
							value="fulltime"
							// Active state pulls theme's primary shadow
							className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground"
						>
							<Briefcase className="w-4 h-4 mr-2" />
							Full-Time
						</TabsTrigger>
						<TabsTrigger
							value="collaboration"
							// Active state pulls theme's primary shadow
							className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground"
						>
							<Users className="w-4 h-4 mr-2" />
							Collab
						</TabsTrigger>
					</TabsList>

					<TabsContent value="freelance" className="mt-6 space-y-6">
						<FreelanceFields form={form} update={update} />
					</TabsContent>

					<TabsContent value="fulltime" className="mt-6 space-y-6">
						<FullTimeFields form={form} update={update} />
					</TabsContent>

					<TabsContent value="collaboration" className="mt-6 space-y-6">
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								Open-source? Research? Startup idea?
								<br />
								Drop your wild thought below.
							</p>
						</div>
					</TabsContent>
				</Tabs>

				{/* COMMON FIELDS */}
				<div className="space-y-6 mt-8 border-t pt-6">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name-input">Name *</Label>
							<Input
								id="name-input"
								placeholder="Tony Stark"
								value={form.name}
								onChange={(e) => update("name", e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email-input">Email *</Label>
							<Input
								id="email-input"
								type="email"
								placeholder="tony@stark.industries"
								value={form.email}
								onChange={(e) => update("email", e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="message-input">Message *</Label>
						<Textarea
							id="message-input"
							rows={5}
							placeholder={
								form.tab === "freelance"
									? "What’s the data challenge?"
									: form.tab === "fulltime"
									? "Why this role excites you?"
									: "Your idea in 3 lines…"
							}
							value={form.message}
							onChange={(e) => update("message", e.target.value)}
							required
						/>
					</div>

					<Button
						type="button"
						size="lg"
						className="w-full group"
						onClick={() => {
							// Ensure validation logic runs before previewing
							validate() ? setPreview(true) : toast.error("Please fill all required fields and check your email format.");
						}}
					>
						<Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
						Preview Magic Email
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}