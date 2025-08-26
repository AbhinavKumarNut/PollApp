import { useLocation } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

export function VoteScreen() {
    const location = useLocation();
    const { poll, username } = location.state;
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [initialUserVote, setInitialUserVote] = useState(null);
    const [voteData, setVoteData] = useState(null);
    useEffect(() => {
        const checkVoteStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/vote/status?pollId=${poll.id}&userId=${username}`);
                const data = await response.json();

                if (data.hasVoted) {
                    setHasVoted(true);
                    setSelectedOption(data.userVote);
                    setInitialUserVote(data.userVote);
                }
            } catch (error) {
                console.error("Error fetching vote status:", error);
            }
        };

        checkVoteStatus();
    }, [poll.id, username]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    poll_id: poll.id,
                    username: username,
                    option: selectedOption
                })
            })
            if (response.ok) {
                alert("Vote submitted successfully!");
                navigate('/home');
            }
            else {
                const errorData = await response.json();
                console.error("Voting failed: ", errorData.message);
            }
        }
        catch (error) {
            console.error("Error during voting: ", error);
        }
        console.log("Selected option: ", JSON.stringify({
            poll_id: poll.id,
            username: username,
            option: selectedOption
        }));
    }

    const handleChange = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/deletevote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    poll_id: poll.id,
                    username: username,
                    option: initialUserVote
                })
            })
            if (response.ok) {
                alert("Vote cleared successfully!");
                setInitialUserVote(null)
                setHasVoted(null)
                setVoteData(null)
                navigate('/vote', { state: { poll, username: username } });
            }
            else {
                const errorData = await response.json();
                console.error("Clear failed: ", errorData.message);
            }
        }
        catch (error) {
            console.error("Error during voting: ", error);
        }
        console.log("Selected option: ", JSON.stringify({
            poll_id: poll.id,
            username: username,
            option: selectedOption
        }));
    }

    const displayVotes = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:8080/showvotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    poll_id: poll.id,
                    username: username,
                    option: initialUserVote
                })
            })
            if (response.ok) {
                const data = await response.json();
                setVoteData(data);
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch votes:", errorData.message);
            }
        } catch (error) {
            console.error("Error during fetching votes:", error);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Voting Screen</h1>
                <h2 className="text-xl text-gray-600 mb-4 text-center">Welcome, {username}</h2>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{poll.Title}</h2>
                <h4 className="text-sm text-gray-500 mb-4">Poll created by {poll.CreatedBy}</h4>
                <div className="space-y-4">
                    {
                        poll.Options.map((option, index) => (
                            <div key={index} className="flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 
                                hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                                <label className="flex items-center w-full cursor-pointer">
                                    <input
                                        type="radio"
                                        name="poll-option"
                                        value={option}
                                        onChange={() => setSelectedOption(option)}
                                        checked={selectedOption === option}
                                        className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-lg font-medium text-gray-700">{option}</span>
                                </label>
                            </div>
                        ))
                    }
                </div>
                <div className="mt-6 flex flex-col items-center gap-4">
                    {hasVoted ? (
                        <>
                            <p className="text-lg text-gray-700 font-medium">You have already voted for: <span className="font-semibold text-blue-600">{initialUserVote}</span></p>
                            <button onClick={(e) => handleChange(e)} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                                Clear Vote
                            </button>
                        </>
                    ) : (
                        <button onClick={(e) => handleSubmit(e)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                            Submit Vote
                        </button>
                    )}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button onClick={(e) => displayVotes(e)} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                        Show All Votes
                    </button>
                    {voteData && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Votes:</h3>
                            <div className="space-y-4">
                                {poll.Options.map((option, index) => {
                                    const count = voteData[option] ? voteData[option].length : 0;
                                    return (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-md font-medium text-gray-700 mb-2">
                                                {option} <span className="text-gray-500 text-sm">({count} votes)</span>
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                {voteData[option] && voteData[option].length > 0 ? (
                                                    voteData[option].map((voter, userIndex) => (
                                                        <li key={userIndex} className="text-sm">{voter}</li>
                                                    ))
                                                ) : (
                                                    <li className="text-sm italic text-gray-500">No votes yet.</li>
                                                )}
                                            </ul>
                                        </div>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}