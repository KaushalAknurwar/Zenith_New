import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TherapistListing from './TherapistListing';
import BookingHistory from './BookingHistory';
import EmergencyBooking from './EmergencyBooking';

export interface Therapist {
	id: string;
	name: string;
	specialization: string[];
	availability: string[];
	rating: number;
	experience: number;
	price: number;
	image: string;
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

const Sahayak: React.FC = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('therapists');

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F3C] px-4 py-6 sm:p-6 text-white"
		>
			<Button
				onClick={() => navigate('/dashboard')}
				className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Dashboard
			</Button>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="max-w-6xl mx-auto space-y-8"
			>
				<motion.div
					className="text-center mb-12 animate-fade-in relative"
					variants={item}
				>
					<div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 blur-3xl -z-10" />
					<motion.h1
						className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent mb-4"
						variants={item}
					>
						Sahayak - Mental Health Support
						<motion.span
							animate={{
								rotate: [0, 10, -10, 0],
								scale: [1, 1.2, 1]
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "reverse"
							}}
							className="inline-block ml-2"
						>
							<HeartHandshake className="w-8 h-8 text-[#D946EF]" />
						</motion.span>
					</motion.h1>
					<motion.p
						className="text-lg sm:text-xl text-gray-300 mb-6"
						variants={item}
					>
						Connect with mental health professionals and get the support you need
					</motion.p>
				</motion.div>

				<motion.div variants={item}>
					<Tabs defaultValue="therapists" className="w-full">
						<TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-lg border border-white/10">
							<TabsTrigger 
								value="therapists" 
								className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
							>
								Find Therapist
							</TabsTrigger>
							<TabsTrigger 
								value="bookings" 
								className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
							>
								My Bookings
							</TabsTrigger>
							<TabsTrigger 
								value="emergency" 
								className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
							>
								Emergency Support
							</TabsTrigger>
						</TabsList>

						<TabsContent value="therapists">
							<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
								<TherapistListing />
							</Card>
						</TabsContent>

						<TabsContent value="bookings">
							<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
								<BookingHistory />
							</Card>
						</TabsContent>

						<TabsContent value="emergency">
							<Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-4">
								<EmergencyBooking />
							</Card>
						</TabsContent>
					</Tabs>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default Sahayak;