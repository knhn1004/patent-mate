'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

interface Contribution {
	description: string;
}

interface Contributor {
	name: string;
	expertise: string;
	contribution: string;
}

export default function ContributorAnalysisPage() {
	const [contributions, setContributions] = useState<Contribution[]>([]);
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const storedAnalysis = localStorage.getItem('contributorAnalysis');
		if (storedAnalysis) {
			const parsedAnalysis = JSON.parse(storedAnalysis);
			setContributions(parsedAnalysis.contributions || []);
			setContributors(parsedAnalysis.contributors || []);
		}
	}, []);

	const handleContributionChange = (index: number, value: string) => {
		const updatedContributions = [...contributions];
		updatedContributions[index] = { description: value };
		setContributions(updatedContributions);
	};

	const addContribution = () => {
		setContributions([...contributions, { description: '' }]);
	};

	const removeContribution = (index: number) => {
		const updatedContributions = contributions.filter((_, i) => i !== index);
		setContributions(updatedContributions);
	};

	const handleInputChange = (
		index: number,
		field: keyof Contributor,
		value: string
	) => {
		const updatedContributors = [...contributors];
		updatedContributors[index] = {
			...updatedContributors[index],
			[field]: value,
		};
		setContributors(updatedContributors);
	};

	const addContributor = () => {
		setContributors([
			...contributors,
			{ name: '', expertise: '', contribution: '' },
		]);
	};

	const removeContributor = (index: number) => {
		const updatedContributors = contributors.filter((_, i) => i !== index);
		setContributors(updatedContributors);
	};

	const handleFinalizeInventionDisclosure = () => {
		const analysisData = {
			contributions,
			contributors,
		};
		localStorage.setItem('contributorAnalysis', JSON.stringify(analysisData));
		toast({
			title: 'Success',
			description: 'Contributors and contributions have been saved.',
		});
		router.push('/final-report');
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Contributor Analysis</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex justify-between items-center">
							Contributions
							<Button onClick={addContribution} size="sm">
								<PlusIcon className="w-4 h-4 mr-2" /> Add Contribution
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
							{contributions.map((contribution, index) => (
								<div key={index} className="space-y-2 relative">
									<h3 className="text-lg font-semibold pr-8">
										Contribution {index + 1}
									</h3>
									<Textarea
										placeholder="Description"
										value={contribution.description}
										onChange={e =>
											handleContributionChange(index, e.target.value)
										}
										rows={3}
									/>
									<Button
										variant="destructive"
										size="sm"
										className="absolute top-0 right-0"
										onClick={() => removeContribution(index)}
									>
										<TrashIcon className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex justify-between items-center">
							Contributors
							<Button onClick={addContributor} size="sm">
								<PlusIcon className="w-4 h-4 mr-2" /> Add Contributor
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
							{contributors.map((contributor, index) => (
								<div key={index} className="space-y-2 relative">
									<h3 className="text-lg font-semibold pr-8">
										Contributor {index + 1}
									</h3>
									<Input
										placeholder="Name"
										value={contributor.name}
										onChange={e =>
											handleInputChange(index, 'name', e.target.value)
										}
									/>
									<Input
										placeholder="Expertise"
										value={contributor.expertise}
										onChange={e =>
											handleInputChange(index, 'expertise', e.target.value)
										}
									/>
									<Textarea
										placeholder="Contribution"
										value={contributor.contribution}
										onChange={e =>
											handleInputChange(index, 'contribution', e.target.value)
										}
										rows={3}
									/>
									<Button
										variant="destructive"
										size="sm"
										className="absolute top-0 right-0"
										onClick={() => removeContributor(index)}
									>
										<TrashIcon className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="flex justify-end space-x-4">
				<Button onClick={handleFinalizeInventionDisclosure}>
					Finalize Invention Disclosure
				</Button>
				<Button onClick={() => router.push('/final-report')}>
					View Final Report
				</Button>
			</div>
			<Toaster />
		</div>
	);
}
