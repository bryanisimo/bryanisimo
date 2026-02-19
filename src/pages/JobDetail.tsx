import { useParams, Link } from 'react-router-dom';
import { experiences } from '../data/experience';
import { ArrowLeft } from 'lucide-react';

const JobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const experience = experiences.find(e => e.id === id);

    if (!experience) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Experience not found</h1>
                <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <main className="container-custom py-24">
            <Link
                to="/"
                className="inline-flex items-center gap-2 mb-12 text-sm font-medium hover:gap-3 transition-all"
            >
                <ArrowLeft size={16} />
                Back to Works
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                        {experience.company}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        {experience.role}
                    </h1>
                    <div className="h-px bg-black w-full mb-8" />
                    <div className="flex flex-wrap gap-12 text-sm">
                        <div>
                            <p className="text-gray-500 mb-1">Date</p>
                            <p className="font-medium">{experience.period}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Location</p>
                            <p className="font-medium">{experience.location}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-12 pt-4">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 italic">Summary</h3>
                        <p className="text-lg leading-relaxed text-gray-700">
                            {experience.summary}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-6 italic">Highlights</h3>
                        <ul className="space-y-6">
                            {experience.highlights.map((highlight, index) => (
                                <li key={index} className="flex gap-4">
                                    <span className="shrink-0 w-6 h-6 border border-black rounded-full flex items-center justify-center text-xs">
                                        {index + 1}
                                    </span>
                                    <p className="text-lg text-gray-800">{highlight}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-24 h-[60vh] bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Project Visual Content Placeholder</span>
            </div>
        </main>
    );
};

export default JobDetail;
