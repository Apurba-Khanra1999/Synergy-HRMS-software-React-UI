import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'HRMS React Admin Panel - AI Powered',
  description: "Synergy HR, a modern, data-driven Human Resources Management dashboard built with Next.js, React, and ShadCN UI. This application provides a full suite of tools to manage the entire employee lifecycle, from hiring to offboarding, enhanced with AI-powered features for smarter decision-making.",
  keywords: 'HRMS software, human resource management system, best HRMS tools, HR software India, employee management software, payroll and HR software, HR automation system, cloud based HRMS, HR software with payroll, attendance management system, performance appraisal software, leave management system, talent management software, employee self service portal, onboarding software, remote workforce management, HR analytics software, AI HR software, employee engagement platform, HR software for small business, compliance tracking software, recruitment management system, end-to-end HR software, employee lifecycle management, HRMS with mobile app, HR software SaaS, HR workflow automation, integrated HR solution, workforce management platform, modern HR system, HR dashboard software, customizable HRMS, best HR software 2025, HR tech solutions, HR digital transformation, employee retention tools, HRMS with AI integration, HR software with RPA, HR software for startups, HR policy management software, time tracking and payroll software, HR software for enterprises, HR SaaS solutions, HR chatbot software, HR performance tracking, HR software with analytics, HR document management system',

  metadataBase: new URL('https://hrms-reactdashboard-ui.vercel.app'),

  openGraph: {
    title: 'HRMS React Admin Panel - AI Powered',
    description: "Synergy HR, a modern, data-driven Human Resources Management dashboard built with Next.js, React, and ShadCN UI. This application provides a full suite of tools to manage the entire employee lifecycle, from hiring to offboarding, enhanced with AI-powered features for smarter decision-making.",
    url: 'https://hrms-reactdashboard-ui.vercel.app/', // Replace with your site URL
    siteName: 'AI powered TaskFlow Studio',
    images: [
      {
        url: 'https://dev.inktagon.com/fileupload/hrms-synergy-react-ui/hrms-react-ui.png', // Ensure this image exists in your /public folder
        width: 1200,
        height: 630,
        alt: 'HRMS React Admin Panel Preview',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },

  

  authors: [
    { name: 'Apurba Khanra', url: 'https://www.linkedin.com/in/apurbakhanra' },
  ],

  creator: 'Apurba Khanra',

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={cn("font-body antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
