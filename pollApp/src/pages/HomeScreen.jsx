import { use, useState } from 'react';
import { useEffect } from 'react';
import { PollCard } from '../components/PollCard.jsx';
import { useNavigate } from 'react-router-dom';



export function HomeScreen({ username }) {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleCardClick = (poll) => {
        navigate('/vote', { state: { poll, username: username } });
    }

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch('http://localhost:8080/polls');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPolls(data);
                console.log("Data first ", data);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchPolls();
    }, [])

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl text-gray-700">Loading polls...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-xl text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Welcome to your Dashboard, {username}!
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {polls.length > 0 ? (
                    polls.map((poll) => (
                        <PollCard
                            key={poll.id}
                            poll={poll}
                            onClick={() => handleCardClick(poll)}
                        />
                    ))
                ) : (
                    <h2 className="text-xl text-gray-600 text-center col-span-full">No polls found.</h2>
                )}
            </div>
        </div>
    )
}