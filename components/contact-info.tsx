"use client";

import React, { useState, useCallback, useRef } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
	Mail,
	Phone,
	MapPin,
	Clock,
	Linkedin,
	Github,
	Twitter,
	ExternalLink,
	MessageCircle,
	Video,
	Copy,
	Check,
	Sparkles,
	Calendar,
	Briefcase,
	Laptop,
	Globe,
} from "lucide-react";
import { LucideIcon } from "lucide-react"; // Import the type for Lucide icons

// --- DATA STRUCTURES (Moved outside for performance) ---

interface ContactItem {
	icon: LucideIcon;
	label: string;
	value: string;
	copy?: string;
}

const MAIN_CONTACTS: ContactItem[] = [
	{ icon: Mail, label: "Email", value: "pawar.prathamesh@outlook.com", copy: "pawar.prathamesh@outlook.com" },
	{ icon: Phone, label: "Phone", value: "+91 9021504844", copy: "+919021504844" },
	{ icon: MapPin, label: "Location", value: "Sangi, Maharashtra, India" },
	{ icon: Clock, label: "Response", value: "Within 24 hours" },
];

interface SocialLink {
	href: string;
	icon: LucideIcon;
	label: string;
	// Use theme-derived colors or background utilities
	colorClass: string; 
}

const SOCIAL_LINKS: SocialLink[] = [
	// Linkedin: Use secondary (Deep Violet) for subtle brand contrast
	{ href: "https://linkedin.com/in/prathamesh095", icon: Linkedin, label: "LinkedIn", colorClass: "hover:text-secondary dark:hover:text-secondary" },
	// GitHub: Use foreground/primary for neutral/highlight contrast
	{ href: "https://github.com/prathamesh095", icon: Github, label: "GitHub", colorClass: "hover:text-primary dark:hover:text-primary" },
	// X (Twitter): Use tertiary (Soft Pink Highlight)
	{ href: "https://twitter.com/prathamesh_ds", icon: Twitter, label: "X (Twitter)", colorClass: "hover:text-tertiary dark:hover:text-tertiary" },
];

interface FAQItem {
	icon: LucideIcon;
	q: string;
	a: string;
}

const QUICK_FAQ: FAQItem[] = [
	{
		icon: Briefcase,
		q: "Open to full-time roles?",
		a: "Yes! I’m actively exploring Data Scientist / Analyst positions at innovative teams.",
	},
	{
		icon: Laptop,
		q: "Available for freelance?",
		a: "Absolutely. From dashboards to full ML pipelines — 2–12 week gigs welcome.",
	},
	{
		icon: Globe,
		q: "Remote or on-site?",
		a: "Available for both remote and on-site engagements. Flexible to your team’s needs.",
	},
];


export function ContactInfo() {
	const [copied, setCopied] = useState<string | null>(null);
	// Ref to hold the timeout ID
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Use useCallback for performance optimization
	const copy = useCallback((text: string, label: string) => {
		// Clear any existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		navigator.clipboard.writeText(text);
		toast.success(`${label} copied!`);
		setCopied(label);
		
		// Set new timeout
		timeoutRef.current = setTimeout(() => {
			setCopied(null);
			timeoutRef.current = null;
		}, 1500);

	}, []); // Empty dependency array means this function is created once

	// Cleanup effect on unmount (essential for production readiness)
	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="space-y-8 max-w-2xl mx-auto">
			{/* Main Contact */}
			{/* Gradient background uses primary and secondary theme colors */}
			<Card className="overflow-hidden border-0 shadow-2xl bg-linear-to-br from-primary/5 via-background to-secondary/5">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-3 text-2xl">
						{/* Animated pulse uses primary color */}
						<div className="p-2.5 bg-primary/10 rounded-full animate-pulse">
							<MessageCircle className="w-6 h-6 text-primary" />
						</div>
						Let’s Build Something **Epic**
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-5">
					{MAIN_CONTACTS.map((item) => (
						<div key={item.label} className="flex items-center justify-between group">
							<div className="flex items-center gap-4">
								{/* Icon block uses primary color */}
								<div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-all">
									<item.icon className="w-5 h-5 text-primary" />
								</div>
								<div>
									<p className="font-semibold">{item.value}</p>
									<p className="text-sm text-muted-foreground">{item.label}</p>
								</div>
							</div>
							{item.copy && (
								<Button 
									size="icon" 
									variant="ghost" 
									className="rounded-full" 
									onClick={() => copy(item.copy!, item.label)}
									aria-label={`Copy ${item.label} to clipboard`}
								>
									{/* Success checkmark uses status-success theme color */}
									{copied === item.label ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
								</Button>
							)}
						</div>
					))}
				</CardContent>
			</Card>

			{/* Socials */}
			<Card className="border-0 shadow-xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{/* Sparkles use theme tertiary color (Soft Pink Highlight) */}
						<Sparkles className="w-5 h-5 text-tertiary animate-pulse" />
						Find Me Online
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3">
					{SOCIAL_LINKS.map((s) => (
						<Button 
							key={s.label} 
							variant="outline" 
							className="w-full justify-start group h-12" 
							asChild
						>
							<a 
								href={s.href} 
								target="_blank" 
								rel="noopener noreferrer"
								aria-label={`Visit ${s.label} profile`}
							>
								{/* Icon color is applied via dynamic colorClass which maps to theme colors */}
								<s.icon className={`w-5 h-5 mr-3 ${s.colorClass} transition-colors`} />
								<span className="font-medium">{s.label}</span>
								<ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" />
							</a>
						</Button>
					))}
				</CardContent>
			</Card>

			{/* Calendly */}
			{/* Background gradient uses secondary and primary theme colors */}
			<Card className="border-0 shadow-xl bg-linear-to-r from-secondary/10 to-primary/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Video className="w-6 h-6 text-primary" />
						Book a Call
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">
						15–30 min discovery call. No pitch. Just clarity on your data goals.
					</p>
					<Button size="lg" className="w-full group" asChild>
						<a 
							href="https://calendly.com/pawarprathamesh095/new-meeting-1" 
							target="_blank" 
							rel="noopener noreferrer"
							aria-label="Book a discovery call via Calendly"
						>
							<Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
							Grab a Slot
						</a>
					</Button>
					<div className="flex flex-wrap gap-2 justify-center">
						<Badge variant="secondary">IST • EST • GMT</Badge>
						<Badge variant="outline">Zero pressure</Badge>
					</div>
				</CardContent>
			</Card>

			{/* NEW FAQ – Q&A STYLE */}
			{/* Border uses primary theme color */}
			<Card className="border-dashed border-primary/20">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-primary" />
						Quick Q&A
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 text-sm">
					{QUICK_FAQ.map((faq, i) => (
						<div key={i} className="flex gap-4 group">
							{/* Icon block uses primary color */}
							<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
								<faq.icon className="w-5 h-5 text-primary" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-foreground">{faq.q}</p>
								<p className="text-muted-foreground mt-1">{faq.a}</p>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}